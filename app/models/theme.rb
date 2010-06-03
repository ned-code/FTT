class Theme < ActiveRecord::Base
  
  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix + "theme/:uuid/:basename.:extension"
  has_attached_file :attachment,
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"

  validates_attachment_presence :attachment
  validates_attachment_size :attachment, :less_than => 50.megabytes
  validates_attachment_content_type :attachment, :content_type => ['application/zip']

  has_uuid

  attr_accessible :uuid, :attachment, :title, :thumbnail_url, :style_url, :version, :author, :is_default
  
  # ================
  # = Associations =
  # ================
  
  has_many :documents
  has_many :layouts, :dependent => :delete_all

  # ===============
  # = Validations =
  # ===============

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

  def attachment_root_url
    @attachement_root_url ||= File.dirname(attachment.url)+"/"
  end

  def attachment_root_path
    @attachement_root_path ||= File.dirname(attachment.path)+"/"
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
        self.elements_url = attachment_root_url + config_dom.root.attribute('elements').to_s
        self.thumbnail_url = attachment_root_url + config_dom.root.attribute('thumbnail').to_s
        self.style_url = attachment_root_url + "css/parsed_theme_style.css"
        self.save!

        config_dom.root.elements['layouts'].each_child do |layout|
          if layout.class == REXML::Element
            layout_object = Layout.new
            layout_object.title = layout.elements['title'].text
            layout_object.kind = layout.elements['kind'].text
            layout_object.thumbnail_url = attachment_root_url + layout.attribute('thumbnail').to_s
            layout_object.template_url = attachment_root_url + layout.attribute('src').to_s
            layout_object.theme = self
            layout_object.save!
          end
        end

        if ancestor_theme.present?
          ancestor_theme.updated_theme_id = self.id
          ancestor_theme.save!
        end

        # begin
          extract_files_from_zip_file
          create_parsed_style
          for layout_saved in self.layouts
            layout_saved.create_model_page!
          end
        # rescue Exception => e
        #   self.errors.add(:attachment, "Error: #{e}")
        #   raise ActiveRecord::Rollback
        # end
        saved = true
      end
    else
      self.errors.add(:attachment, "Error: version of this file is equal or under the actual version")
    end
    saved
  end


  def create_parsed_style
    files_path = Array.new
    parsed = ""

    config_dom.root.elements['styles'].each_child do |style|
      if style.class == REXML::Element
        files_path << File.join(attachment_root_path, style.attribute('src').to_s)
      end
    end

    for file_path in files_path
      if S3_CONFIG[:storage] == 's3'
        file_readed = @s3.get_object(self.file.s3_bucket, file_path)
      else
        file_readed = IO.read(file_path).strip
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

    if S3_CONFIG[:storage] == 's3'
      @s3 ||= RightAws::S3Interface.new(file.s3_access_key_id, file.s3_secret_access_key)
      @s3.put(file.s3_bucket, self.file.store_dir + "css/parsed_theme_style.css", parsed, 'x-amz-acl' => 'public-read')
    else
      File.open(File.join(Rails.root, 'public', self.style_url), 'wb') {|f| f.write(parsed) }      
    end
  end
  
  protected
  
  def validate
    validates_uniqueness_of_default_theme
  end
  
  private

  def attachment_queued_for_write
    attachment.queued_for_write[:original]
  end

  def config_dom
    @config_file_dom ||= Zip::ZipFile.open(attachment_queued_for_write.path) do |file|
      entry = file.find_entry("config.xml")
      entry.present? ? REXML::Document.new(entry.get_input_stream) : nil
    end
  end

  def extract_files_from_zip_file
    Zip::ZipFile.foreach(attachment.path) do |zip_file|
      if (!zip_file.directory?)
        filePath = File.join(self.attachment_root_path, zip_file.name)

        if (is_valid_theme_file(filePath))
          if S3_CONFIG[:storage] == 's3'
            @s3 ||= RightAws::S3Interface.new(file.s3_access_key_id, file.s3_secret_access_key)
            @s3.put(file.s3_bucket, filePath, zip_file.get_input_stream.read, 'x-amz-acl' => 'public-read')
          else
            FileUtils.mkdir_p(File.dirname(filePath))
            if(!File.directory?(filePath))
              File.open(filePath, 'wb') do |f|
                f << zip_file.get_input_stream.read
              end
            end
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
#  id               :integer(4)      not null, primary key
#  uuid             :string(255)
#  name             :string(255)
#  thumbnail_url    :string(255)
#  style_url        :string(255)
#  file             :string(255)
#  version          :string(255)
#  updated_theme_id :integer(4)
#

