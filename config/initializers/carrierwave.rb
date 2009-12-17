CarrierWave.configure do |config|
  case Rails.env
  when 'development', 'test'
    config.storage = :file
  else
    config.s3_access_key_id = 'AKIAJSQQ2RDIXG2UOZ5Q'
    config.s3_secret_access_key = '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'
    config.s3_bucket = "uniboard-#{Rails.env}"
    config.storage = :right_s3
  end
end