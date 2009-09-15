Factory.define :page do |page|
  page.uuid {UUID.generate}
  page.sequence(:position) {|n| n }

#  page.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  page.attribute_name "value"
#  page.association_name {|a| a.association(:association_factory)}
end

Factory.define :page_with_doc, :parent => :page do |page|
  page.uuid {UUID.generate}
  page.sequence(:position) {|n| n }
  page.media { |media| media.association(:media_page)}
  page.document {|a| a.association(:document)}

#  page.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  page.attribute_name "value"
#  page.association_name {|a| a.association(:association_factory)}
end
