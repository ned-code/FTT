#RightAws::RightAWSParser.xml_lib = 'libxml'

UniboardDocument.config do |config|
  config.storage = :s3
  config.javascript_location = "http://st-ub.mnemis.com/javascripts/" if RAILS_ENV == "staging"
end
