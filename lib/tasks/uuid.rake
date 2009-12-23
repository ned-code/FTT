task :move_uuid_to_id => :environment do
   
  ActiveRecord::Migration.execute "alter table documents add id INT(11) UNSIGNED primary key auto_increment not null"
  ActiveRecord::Migration.execute "alter table pages add id INT(11) UNSIGNED primary key auto_increment not null"
  ActiveRecord::Migration.execute "alter table items add id INT(11) UNSIGNED primary key auto_increment not null"
  ActiveRecord::Migration.execute "alter table medias add id INT(11) UNSIGNED primary key auto_increment not null"

  ActiveRecord::Migration.execute "update pages t1 set document_id = (select id from documents where uuid = t1.document_id)"
  ActiveRecord::Migration.execute "update items i1 set page_id = (select id from pages where uuid = i1.page_id)"
  ActiveRecord::Migration.execute "update items i1 set media_id = (select id from medias where uuid = i1.media_id)"
  ActiveRecord::Migration.execute "update roles r1 set authorizable_id = (select id from documents where uuid = r1.authorizable_id) where authorizable_type = 'Document'"

  ActiveRecord::Migration.execute "alter table pages modify document_id INT(11) UNSIGNED"
  ActiveRecord::Migration.execute "alter table pages modify thumbnail_id INT(11) UNSIGNED"
  ActiveRecord::Migration.execute "alter table items modify page_id INT(11) UNSIGNED"
  ActiveRecord::Migration.execute "alter table items modify media_id INT(11) UNSIGNED"
  ActiveRecord::Migration.execute "alter table roles modify authorizable_id INT(11) UNSIGNED"
  
end