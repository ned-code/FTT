
class UbPageElement < ActiveRecord::Base

  belongs_to :page, :class_name => 'UbPage', :foreign_key => 'uniboard_page_id'
  belongs_to :media, :class_name => 'UbMedia', :foreign_key => 'media_id'
end
