Factory.define :ub_media do |ub_media|
#  media.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  media.attribute_name "value"
#  media.association_name {|a| a.association(:association_factory)}
end

Factory.define :ub_media_page, :parent => :ub_media do |ub_media|
  ub_media.conversions { |conversion| [conversion.association(:ub_conversion, :media_type => "thumbnail", :path => "12345678-1234-1234-1234-123456789123.thumbnail.jpg"),
    conversion.association(:ub_conversion, :media_type => "application/xhtml+xml", :path => "12345678-1234-1234-1234-123456789123.xhtml")] }
  ub_media.media_type "ub_page/svg"
  ub_media.path {|a| "#{UUID.generate}.svg"}
  ub_media.data {|a| File.open(File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz_source', 'valid', 'page0001-0000-0000-0000-000000000000.svg'))}
#  media.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  media.attribute_name "value"
#  media.association_name {|a| a.association(:association_factory)}
end
