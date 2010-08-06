class Category < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  after_save :invalidate_cache
  after_destroy :invalidate_cache
  
  has_many :documents

  attr_accessible :name, :uuid

  scope :have_public_documents, :include => :documents, :conditions => ['documents.is_public = ?', true]

  def number_of_public_documents
    Document.count(:conditions => "category_id = '#{uuid}' and is_public = 1")
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

