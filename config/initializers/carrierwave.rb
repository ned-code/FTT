module CarrierWave

  class << self
    def yml_storage(media_type = nil)
      ((media_type && yml[media_type] && yml[media_type]['storage']) || yml[:storage]).try(:to_sym)
    end

    def yml_s3_bucket(media_type = nil)
      (media_type && yml[media_type] && yml[media_type]['s3_bucket']) || yml[:s3_bucket]
    end

    def yml_s3_access_key_id
      yml[:s3_access_key_id]
    end

    def yml_s3_secret_access_key
      yml[:s3_secret_access_key]
    end
  end

private

  def self.yml
    config_path = File.join(Rails.root, 'config', 'carrierwave.yml')
    @default_storage ||= YAML::load_file(config_path)[Rails.env]
    @default_storage.to_options
  rescue
    raise StandardError, "CarrierWave config file '#{config_path}' doesn't exist or have right information about Rails '#{Rails.env}' environement."
  end

end

CarrierWave.configure do |config|
  config.s3_access_key_id = CarrierWave.yml_s3_access_key_id
  config.s3_secret_access_key = CarrierWave.yml_s3_secret_access_key
  config.s3_bucket = CarrierWave.yml_s3_bucket
  config.storage = CarrierWave.yml_storage
end

# monkey patch to redefine url method
require Rails.root + 'lib/carrierwave_patch.rb'
