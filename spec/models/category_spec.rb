require 'spec_helper'

describe Category do
  
  should_allow_mass_assignment_of :name
  should_not_allow_mass_assignment_of :id

  should_have_many :documents
  
end

# == Schema Information
#
# Table name: categories
#
#  id   :integer         not null, primary key
#  name :string(255)     not null
#

