# Attributes
#- uuid: string
#- path: string
#- type: string
#- version: integer
#- page_element_id: integer
#
class UbMedia < ActiveRecord::Base

  belongs_to :page_element, :class_name => 'UbPageElement', :foreign_key => 'page_element_id'
  has_many :conversions, :class_name => 'UbConversion', :foreign_key => 'media_id'

  def get_resource(p_type, p_params)

    # Return current media if media has the correct type and params
    if (p_type == self.type && (p_params.nil? || p_params.empty?))
      return self
    # Return the existing conversion if it exists
    else
      resource = self.conversions.find(:first, :conditions => { :type => p_type, :parameters => p_params })
      return resource unless resource.nil?
    end
    # Convert if needed
    tmp_dir = File.join(Dir::tmpdir, "#{rand Time.now.to_i}_#{self.uuid}")
    options = YAML.load(p_params)
    options[:destination_path] = tmp_dir
    converted_file = ConversionService::convert_media(self, p_type, options)
    raise "Conversion of media #{self.uuid} to type #{p_type} failed." if converted_file.nil?
    destination_file_path = self.path.match(/.*\//) + "/" + converted_file
    Storage::storage(self.storage_config).put(converted_file, destination_file_path )
    resource = conversions.build(:type => p_type, :path => destination_file_path, :parameters => p_params)
    save!
    return resource
  end
  
  def public_url

  end

  def private_url

  end
end
