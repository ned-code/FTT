Factory.define :uniboard_document do |uniboard_document|
  uniboard_document.file { fixture_file('00000000-0000-0000-0000-0000000valid.ubz') }
#  uniboard_document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  uniboard_document.attribute_name "value"
#  uniboard_document.association_name {|a| a.association(:association_factory)}
end

Factory.define :empty_uniboard_document, :parent => :uniboard_document do |uniboard_document|
  uniboard_document.file
#  uniboard_document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  uniboard_document.attribute_name "value"
#  uniboard_document.association_name {|a| a.association(:association_factory)}
end