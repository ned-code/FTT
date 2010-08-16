class Category < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  after_save :invalidate_cache
  after_destroy :invalidate_cache
  
  has_many :documents

  attr_accessible :name, :uuid
  
  scope :have_public_documents, lambda {
    joins(:documents => :roles).where('roles.item_id is ? and roles.user_id is ? and roles.user_list_id is ? and (roles.name = ? or roles.name = ?)',nil,nil,nil,Role::VIEWER_ONLY, Role::VIEWER_COMMENT)
  }
  
  def number_of_public_documents
    Document.not_deleted.public.
      where('documents.category_id = ?', self.uuid).count
  end
  
private

  def invalidate_cache
    Rails.cache.delete("categories_json")
  end
end




# == Schema Information
#
# Table name: categories
#
#  name :string(255)     not null
#  uuid :string(36)      default(""), not null, primary key
#

