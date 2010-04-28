class Theme < ActiveRecord::Base
  mount_uploader :file, ThemeUploader, :validate_integrity => true

  has_uuid

  attr_accessible :uuid, :file, :name, :thumbnail_url, :style_url
  
  # ================
  # = Associations =
  # ================
  
  has_many :documents
  has_many :layouts, :dependent => :delete_all

  # ===============
  # = Validations =
  # ===============

  validates_presence_of :file
  validates_presence_of :name
  validates_presence_of :thumbnail_url
  validates_presence_of :style_url

  # =========
  # = Scope =
  # =========

  named_scope :last_version, :conditions => ['updated_theme_id IS ?', nil]



  # =============
  # = Callbacks =
  # =============

  # ====================
  # = Instance Methods =
  # ====================

  def to_param
    uuid
  end

  def ancestor
    Theme.first :conditions => ['updated_theme_id = ?', self.id], :limit => 1
  end

  def set_attribute_from_config_file_and_save(ancestor_theme=nil)
    # TODO if version.nil? || config_dom.root.attribute("version").to_s > version
    saved = false

    self.transaction do
      self.assign_uuid
      self.version = config_dom.root.attribute('version').to_s
      self.name = config_dom.root.elements['name'].text

      path = self.get_mapped_path # set path after set version to get the version in path
      self.thumbnail_url = path + config_dom.root.attribute('thumbnail').to_s
      self.style_url = path + config_dom.root.elements['style'].attribute('src').to_s
      self.save!

      config_dom.root.elements['layouts'].each_child do |layout|
        if layout.class == REXML::Element
          layout_object = Layout.new
          layout_object.name = layout.elements['name'].text
          layout_object.thumbnail_url = path + layout.attribute('thumbnail').to_s
          layout_object.theme = self
          layout_object.save!
          layout_object.create_model_page!
        end
      end

      if ancestor_theme.present?
        ancestor_theme.updated_theme_id = self.id
        ancestor_theme.save!
      end

      begin
        extract_files_from_zip_file(file.current_path, file.store_dir)
      rescue
        raise ActiveRecord::Rollback
      end
      saved = true
    end

    saved
  end


  def get_mapped_path
    if file.s3_bucket == nil
      file.store_url
    else
      path = Pathname.new(file.store_path)
      "http://#{CarrierWave.yml_s3_bucket(:assets).to_s}/#{path.dirname}"
    end
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
              File.open(local_path, 'wb') do |file|
                file << zip_file.get_input_stream.read
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

end
