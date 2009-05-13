RightAws::RightAWSParser.xml_lib = 'libxml'

UniboardDocument.config do |config|
  config.storage = :s3
  config.storage_config = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV] if File.exists?(File.join(RAILS_ROOT, 'config', 's3.yml'))
end
