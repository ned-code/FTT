Factory.define :ub_document do |ub_document|
  ub_document.uuid { UUID.generate }
#  ub_document.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  ub_document.attribute_name "value"
#  ub_document.pages {|a| a.association(:ub_page) }
end

Factory.define :empty_ub_document, :parent => :ub_document do |ub_document|
end

Factory.define :not_valid_ub_document, :parent => :ub_document do |ub_document|
end
