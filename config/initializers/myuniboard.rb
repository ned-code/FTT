UUID_FORMAT_REGEX = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/

UniboardDocument.s3_config = YAML::load_file(File.join(RAILS_ROOT, 'config', 's3.yml'))[RAILS_ENV]