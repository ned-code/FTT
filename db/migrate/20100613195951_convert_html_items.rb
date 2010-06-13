class ConvertHtmlItems < ActiveRecord::Migration
  def self.up
    execute "UPDATE items set media_type = 'html' where media_id is null and media_type = 'widget'";
    execute "UPDATE items set media_type = 'html' where media_id = 0 and media_type = 'widget'";
  end

  def self.down
    execute "UPDATE items set media_type = 'widget' where media_type = 'html'";    
  end
end
