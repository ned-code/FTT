Paperclip.interpolates :uuid do |attachment, style|
  attachment.instance.uuid
end

Paperclip.interpolates :cw_style do |attachment, style|
  if style.present? && style.to_s != 'original'
    style.to_s + '_'
  end
end

Paperclip.interpolates :model_name do |attachment, style|
  attachment
end

Paperclip.interpolates :version do |attachment, style|
  attachment.instance.version
end

S3_CONFIG = YAML::load(File.read(Rails.root.to_s+'/config/s3.yml'))[Rails.env].symbolize_keys