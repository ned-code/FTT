class Category < ActiveRecord::Base
  
  attr_accessible :name
  
end

# == Schema Information
#
# Table name: categories
#
#  id   :integer         not null, primary key
#  name :string(255)     not null
#

