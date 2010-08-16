class UpdatePublicDocuments < ActiveRecord::Migration
  def self.up
    Document.where(:is_public => true).all.each do |d|
      Role.create!(:document_id => d.uuid, :name => Role::VIEWER_COMMENT)
    end
    
  end

  def self.down
    Role.where(:user_id => nil, :user_list_id => nil, :item_id => nil, :name => Role::VIEWER_COMMENT).all.each do |r|
      Document.where(:uuid => r.document_id).first.update_attribue('is_public', true)
    end
  end
end
