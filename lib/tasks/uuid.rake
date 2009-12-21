task :move_uuid_to_id => :environment do
  
  # ===================================================
  # = Change the db like this before execute the task =
  # ===================================================
  # change_column :documents, :uuid, :string, :primary => false
  # add_column :documents, :id, :integer, :primary => true
  # change_column :pages, :uuid, :string, :primary => false
  # add_column :pages, :id, :integer, :primary => true
  # change_column :items, :uuid, :string, :primary => false
  # add_column :items, :id, :integer, :primary => true
  # change_column :medias, :uuid, :string, :primary => false
  # add_column :medias, :id, :integer, :primary => true
  
  # Set ids
  %w[Document Page Item Media].each do |model|
    eval(model).all.each_with_index do |document, index|
      document.update_attribute :id, index + 1
    end
  end
  
  # Update foreign_keys
  Page.all.each do |page|
    page.document_id = Document.find_by_uuid(page.document_id).id
    page.thumbnail_id = Media.find_by_uuid(page.thumbnail_id).id
    page.save!
  end
  Item.all.each do |item|
    item.page_id = Page.find_by_uuid(item.page_id).id
    item.media_id = Media.find_by_uuid(item.media_id).id
    item.save!
  end
  Role.all(:conditions => { :authorizable_type => 'Document' }).each do |role|
    role.authorizable_id = Document.find_by_uuid(role.authorizable_id).id
    role.save!
  end
  
  # ===================================================
  # = Change the db like this after excecute the task =
  # ===================================================
  # change_column :pages, :document_id, :integer
  # change_column :pages, :thumbnail_id, :integer
  # change_column :items, :page_id, :integer
  # change_column :items, :media_id, :integer
  # change_column :roles, :authorizable_id, :integer
end