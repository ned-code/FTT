Factory.define :ub_document do |ub_document|
  ub_document.payload { mock_uploaded_ubz('00000000-0000-0000-0000-0000000valid.ubz') }
#  ub_document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  ub_document.attribute_name "value"
#  ub_document.association_name {|a| a.association(:association_factory)}
end

Factory.define :empty_ub_document, :parent => :ub_document do |ub_document|
  ub_document.payload
end

Factory.define :not_valid_ub_document, :parent => :ub_document do |ub_document|
  ub_document.payload { mock_uploaded_ubz('00000000-0000-0000-0000-0000notvalid.ubz') }
end


