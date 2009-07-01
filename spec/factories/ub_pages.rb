Factory.define :ub_page do |ub_page|
  ub_page.uuid UUID.generate
  ub_page.sequence(:position) {|n| n }
  ub_page.media { |media| media.association(:ub_media_page)}
#  ub_page.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  ub_page.attribute_name "value"
#  ub_page.association_name {|a| a.association(:association_factory)}
end

Factory.define :ub_page_with_doc, :parent => :ub_page do |ub_page|
  ub_page.uuid UUID.generate
  ub_page.sequence(:position) {|n| n }
  ub_page.document {|a| a.association(:ub_document)}

#  ub_page.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  ub_page.attribute_name "value"
#  ub_page.association_name {|a| a.association(:association_factory)}
end
