# Attributes
#- uuid: string
#- path: string
#- media_type: string
#- version: integer
#- page_element_id: integer
#- storage_config: string
#
class UbMedia < ActiveRecord::Base

  belongs_to :page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  has_many :conversions, :class_name => 'UbConversion', :foreign_key => 'media_id'

  before_validation :set_storage_config
  before_save :save_data_on_storage
  
  def data
    storage.get(path)
  end

  def data=(data)
    @tempfile = data
  end

  def get_resource(p_type, p_params)

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
    Storage::storage(self.storage_config).put(destination_file_path, File.open(File.join(options[:destination_path], converted_file)) )
    resource = conversions.build(:media_type => p_type, :path => destination_file_path, :parameters => p_params)
    save!
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
    storage.put(path, @tempfile) if @tempfile
  end

  def storage
    Storage::storage(storage_config)
  end
end
