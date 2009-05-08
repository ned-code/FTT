UniboardDocument.config do |config|
  config[:storage] = :s3
  config[:s3] = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV] if File.exists?(File.join(RAILS_ROOT, 'config', 's3.yml'))
end