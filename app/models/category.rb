class Category < ActiveRecord::Base

  has_many :documents

  attr_accessible :name

  named_scope :have_public_documents, :include => :documents, :conditions => ['documents.is_public = ?', true]

  def number_of_public_documents
    Document.count(:conditions => "category_id = #{id} and is_public = 1")
  end
end


# == Schema Information
#
# Table name: categories
#
#  id   :integer(4)      not null, primary key
#  name :string(255)     not null
#

