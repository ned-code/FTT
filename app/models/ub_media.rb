require 'conversion'

class UbMediaMissingError < StandardError; end
# Attributes
#- uuid: string
#- path: string
#- media_type: string
#- version: integer
#- page_element_id: integer
#- storage_config: string
#
class UbMedia < ActiveRecord::Base

  UB_THUMBNAIL_DESKTOP_TYPE = 'application/vnd.mnemis-uniboard-thumbnail'
  UB_PAGE_TYPE = 'application/vnd.mnemis-uniboard-page'
  UB_DRAWING_TYPE = 'application/vnd.mnemis-uniboard-drawing'
  UB_DOCUMENT_TYPE = 'application/vnd.mnemis-uniboard-document'

  belongs_to :page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  has_many :conversions, :dependent => :destroy, :autosave => true, :class_name => 'UbConversion', :foreign_key => 'media_id'

  before_validation :set_storage_config
  before_save :save_data_on_storage
  before_destroy :delete_data_on_storage

  validates_presence_of :path

  def data
    storage.get(path)
  end

  def data=(data)
    @tempfile = data
    UbConversion.destroy_all(["media_id = ? AND media_type != ?", id, UbMedia::UB_THUMBNAIL_DESKTOP_TYPE])
  end

  def get_resource(p_type, p_params = nil)

    if (p_params.is_a?(Hash))
      p_params = p_params.to_yaml
    end
    # Return current media if media has the correct type and params
    if (p_type == self.media_type && (p_params.nil? || p_params.empty?))
      return self
    # Return the existing conversion if it exists
    else
      resource = self.conversions.find(:first, :conditions => { :media_type => p_type, :parameters => p_params })
      return resource unless resource.nil?
    end
    # Convert if needed
    tmp_dir = File.join(Dir::tmpdir, "#{rand Time.now.to_i}_#{self.uuid}")
    FileUtils.mkdir_p(tmp_dir)
    if (p_params.nil?)
      options = {}
    else
      options = YAML.load(p_params)
    end
    options[:destination_path] = tmp_dir
    converted_file = ConversionService::convert_media(self, p_type, options)
    raise "Conversion of media #{self.uuid} to type #{p_type} failed." if converted_file.nil?
    destination_file_path = self.path.match(/.*\//)[0] + converted_file
    
    resource = conversions.create(
      :media_type => p_type,
      :path => destination_file_path,
      :data => File.open(File.join(options[:destination_path], converted_file),'rb'),
      :parameters => p_params
    )

    RAILS_DEFAULT_LOGGER.debug "remove tmp conversion #{File.join(tmp_dir, converted_file)}"
    FileUtils.remove_file(File.join(tmp_dir, converted_file))
    FileUtils.remove_dir(tmp_dir)
    return resource
  end
  
  def public_url
    Storage::storage(self.storage_config).public_url(self.path)
  end

  def private_url
    Storage::storage(self.storage_config).private_url(self.path)
  end

  private

  def set_storage_config
    self.storage_config = storage.identity_string
  end

  def save_data_on_storage
    if @tempfile
      if (path.end_with?('.wgt'))
        save_widget
      else
        storage.put(path, @tempfile)
        if (@tempfile.is_a?(IO) && !@tempfile.closed?)
          @tempfile.close
        end
      end
      @tempfile = nil
    end
  end

  def save_widget

    tmp_file = @tempfile
    #  @tempfile is often a Hash that contains the storage and path where the file is. In this case get file locally
    if (@tempfile.is_a? Hash)
      data_path = @tempfile[:path]
      data_identity_string = @tempfile[:identity_string] || @tempfile[:storage_config]
      storage = Storage::storage(data_identity_string)
      tmp_file = storage.get(data_path)
    end
    Zip::ZipFile.foreach(tmp_file.path) do |an_entry|
      temp_file = Tempfile.new("zip_entry")
      temp_file.binmode
      temp_file << an_entry.get_input_stream.read
      storage.put(File.join(path, an_entry.name), temp_file)
    end
    tmp_file.close unless tmp_file.closed?
  end
  
  def delete_data_on_storage
     storage.delete(path)
  end

  def storage
    Storage::storage(storage_config)
  end
end
