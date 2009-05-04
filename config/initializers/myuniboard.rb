
UniboardDocument.s3_config = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]
