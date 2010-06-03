class Theme < ActiveRecord::Base
  mount_uploader :file, ThemeUploader, :validate_integrity => true

  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :file, :title, :thumbnail_url, :style_url, :version, :author, :is_default
  
  # ================
  # = Associations =
  # ================
  
  has_many :documents
  has_many :layouts, :dependent => :delete_all

  # ===============
  # = Validations =
  # ===============

  validates_presence_of :file
  validates_presence_of :title
  validates_presence_of :thumbnail_url
  validates_presence_of :style_url

  # =========
  # = Scope =
  # =========

  named_scope :last_version, :conditions => ['updated_theme_id IS ?', nil]

  # =============
  # = Callbacks =
  # =============
    
  # =================
  # = Class Methods =
  # =================
  
  def self.default
    Theme.find(:first, :conditions => { :is_default => true })
  end
  
  # ====================
  # = Instance Methods =
  # ====================

  def to_param
    uuid
  end

  def ancestor
    Theme.first :conditions => ['updated_theme_id = ?', self.id], :limit => 1
  end

  def destroy_with_all_ancestors
    if self.ancestor
      self.ancestor.destroy_with_all_ancestors
    end
    self.destroy
  end

  def set_attributes_from_config_file_and_save(ancestor_theme=nil)
    return false if validates_uniqueness_of_default_theme == false
    saved = false
    if ancestor_theme.blank? || config_dom.root.attribute("version").to_s > ancestor_theme.version
      self.transaction do
        self.assign_uuid
        self.version = config_dom.root.attribute('version').to_s
        self.author = config_dom.root.elements['author'].text
        self.title = config_dom.root.elements['title'].text
        path = file.store_url
        self.elements_url = path + config_dom.root.attribute('elements').to_s
        self.thumbnail_url = path + config_dom.root.attribute('thumbnail').to_s
        self.style_url = path + "css/parsed_theme_style.css"
        file_current_path = self.file.current_path if file.s3_bucket != nil
        self.save!

        config_dom.root.elements['layouts'].each_child do |layout|
          if layout.class == REXML::Element
            layout_object = Layout.new
            layout_object.title = layout.elements['title'].text
            layout_object.kind = layout.elements['kind'].text
            layout_object.thumbnail_url = path + layout.attribute('thumbnail').to_s
            layout_object.template_url = path + layout.attribute('src').to_s
            layout_object.theme = self
            layout_object.save!
          end
        end

        if ancestor_theme.present?
          ancestor_theme.updated_theme_id = self.id
          ancestor_theme.save!
        end

        begin
          extract_files_from_zip_file(file.s3_bucket != nil ? file_current_path : self.file.current_path, file.store_dir)
          create_parsed_style
          for layout_saved in self.layouts
            layout_saved.create_model_page!
          end
        rescue Exception => e
          self.errors.add(:file, "Error: #{e}")
          raise ActiveRecord::Rollback
        end
        saved = true
      end
    else
      self.errors.add(:file, "Error: version of this file is equal or under the actual version")
    end
    saved
  end


  def create_parsed_style
    files_path = Array.new
    parsed = ""

    config_dom.root.elements['styles'].each_child do |style|
      if style.class == REXML::Element
        if self.file.s3_bucket == nil
          files_path << File.join(Rails.root, 'public', self.file.store_dir, style.attribute('src').to_s)
        else
          files_path << File.join(self.file.store_dir, style.attribute('src').to_s)
        end

      end
    end

    for file_path in files_path
      if self.file.s3_bucket == nil
        file_readed = IO.read(file_path).strip
      else
        file_readed = @s3.get_object(self.file.s3_bucket, file_path)
      end
      file_readed.gsub!(/\/\*[^\/]*\//, '') # remove comments
      file_readed.split(/\}/).each do |set|
        set.strip!
        parts = set.split(/\{/)
        if parts.size > 1
          (0..((parts.size)-2)).each do |i|
            if ['@font-face'].include? parts[i].strip
              parsed += parts[i].strip.chomp
            else
              paths = parts[i].split(/,/)
              (0..((paths.size)-1)).each do |k|
                paths[k].strip!
                paths[k].chomp!
                parsed += ".theme_#{self.id} " + paths[k]
                parsed += ", "  if k < (paths.size-1)
              end
            end
          end
          parsed += " { "+parts.last.strip+" }\r\n"
        end
      end
    end

    if self.file.s3_bucket == nil
      File.open(File.join(Rails.root, 'public', self.style_url), 'wb') {|f| f.write(parsed) }
    else
      @s3 ||= RightAws::S3Interface.new(file.s3_access_key_id, file.s3_secret_access_key)
      @s3.put(file.s3_bucket, self.file.store_dir + "css/parsed_theme_style.css", parsed, 'x-amz-acl' => 'public-read')
    end
  end
  protected
  
  def validate
    validates_uniqueness_of_default_theme
  end
  
  private

  def config_dom
    @config_file_dom ||= Zip::ZipFile.open(file.current_path) do |file|
      entry = file.find_entry("config.xml")
      entry.present? ? REXML::Document.new(entry.get_input_stream) : nil
    end
  end

  def extract_files_from_zip_file(file_path, destination_path)
    Zip::ZipFile.foreach(file_path) do |zip_file|
      if (!zip_file.directory?)
        filePath = File.join(destination_path, zip_file.name)

        if (is_valid_theme_file(filePath))
          # Check storage mode
          if file.s3_bucket == nil
            local_path = File.join(Rails.root, 'public', filePath)
            FileUtils.mkdir_p(File.dirname(local_path))
            if(!File.directory?(local_path))
              File.open(local_path, 'wb') do |f|
                f << zip_file.get_input_stream.read
              end
            end
          else
            @s3 ||= RightAws::S3Interface.new(file.s3_access_key_id, file.s3_secret_access_key)
            @s3.put(file.s3_bucket, filePath, zip_file.get_input_stream.read, 'x-amz-acl' => 'public-read')
          end
        end
      end
    end
    
  end

  def is_valid_theme_file(file_name)
    !(file_name.include?("__MACOSX") ||
      file_name.include?(".svn") ||
      file_name.include?(".DS_Store"))
  end
  
  def validates_uniqueness_of_default_theme
    theme = Theme.default
    if is_default == true && !theme.nil? && !theme.updated_theme_id.nil?
      errors.add(:is_default, 'Default theme already set')
      return false
    else
     return true
    end
  end
end


# == Schema Information
#
# Table name: themes
#
#  uuid             :string(255)     primary key
#  title            :string(255)
#  thumbnail_url    :string(255)
#  style_url        :string(255)
#  file             :string(255)
#  version          :string(255)
#  updated_theme_id :integer(4)
#  author           :string(255)
#  elements_url     :string(255)
#  is_default       :boolean(1)      default(FALSE)
#

