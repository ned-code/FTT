
class PageElement < ActiveRecord::Base

  belongs_to :page, :class_name => 'UniboardPage', :foreign_key => 'uniboard_page_id'
  belongs_to :media, :class_name => 'Media', :foreign_key => 'media_id'
end
