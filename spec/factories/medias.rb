Factory.define :media do |media|
  media.path 'test/test'
#  media.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  media.attribute_name "value"
#  media.association_name {|a| a.association(:association_factory)}
end

Factory.define :media_page, :parent => :media do |media|
  media.conversions { |conversion| [conversion.association(:conversion, :media_type => Media::UB_THUMBNAIL_DESKTOP_TYPE, :path => "12345678-1234-1234-1234-123456789123.thumbnail.jpg"),
    conversion.association(:conversion, :media_type => "application/xhtml+xml", :path => "12345678-1234-1234-1234-123456789123.xhtml")] }
  media.media_type Media::UB_PAGE_TYPE
  media.path {|a| "test/#{UUID.generate}.svg"}
  media.data {|a| File.open(File.join(RAILS_ROOT, 'spec', 'fixtures', 'files', 'ubz_source', 'valid', 'page0001-0000-0000-0000-000000000000.svg'),'rb')}
#  media.sequence(:uniqu_attribute_name) {|n| "value #{n}" }
#  media.attribute_name "value"
#  media.association_name {|a| a.association(:association_factory)}
end
