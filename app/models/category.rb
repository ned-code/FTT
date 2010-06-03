class Category < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  has_many :documents

  attr_accessible :name, :uuid

  named_scope :have_public_documents, :include => :documents, :conditions => ['documents.is_public = ?', true]

  def number_of_public_documents
    Document.count(:conditions => "category_id = #{id} and is_public = 1")
  end
end



# == Schema Information
#
# Table name: categories
#
#  name :string(255)     not null
#  uuid :string(36)      primary key
#

