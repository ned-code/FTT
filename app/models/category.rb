class Category < ActiveRecord::Base

  has_many :documents

  attr_accessible :name
  
end

# == Schema Information
#
# Table name: categories
#
#  id   :integer         not null, primary key
#  name :string(255)     not null
#

