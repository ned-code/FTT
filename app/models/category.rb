class Category < ActiveRecord::Base

  has_many :documents

  attr_accessible :name


  def number_of_public_documents
    Document.count(:conditions => "category_id = #{id} and is_public = 1")
  end
end

# == Schema Information
#
# Table name: categories
#
#  id   :integer         not null, primary key
#  name :string(255)     not null
#

