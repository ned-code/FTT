Factory.define :document do |document|
  document.uuid { UUID.generate }
#  document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  document.attribute_name "value"
end

Factory.define :document_with_1_page, :parent => :document do |document|

  document.pages {|a| [a.association(:page)] }
#  document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  document.attribute_name "value"
end

Factory.define :empty_document, :parent => :document do |document|
end

Factory.define :not_valid_document, :parent => :document do |document|
end
