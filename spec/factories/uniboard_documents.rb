Factory.define :uniboard_document do |uniboard_document|
  uniboard_document.uuid UUID.generate
  uniboard_document.bucket 'myuniboard_test'
#  uniboard_document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  uniboard_document.attribute_name "value"
#  uniboard_document.association_name {|a| a.association(:association_factory)}
end
