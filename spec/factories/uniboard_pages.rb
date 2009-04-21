Factory.define :uniboard_page do |uniboard_page|
  uniboard_page.uuid UUID.new.generate
  uniboard_page.sequence(:position) {|n| n }

#  uniboard_page.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  uniboard_page.attribute_name "value"
#  uniboard_page.association_name {|a| a.association(:association_factory)}
end
