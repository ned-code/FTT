require 'spec_helper'

describe Followship do
  
  should_allow_mass_assignment_of :following_id
  should_not_allow_mass_assignment_of :id, :follower_id, :created_at, :updated_at
  
end


# == Schema Information
#
# Table name: followships
#
#  id           :integer(4)      not null, primary key
#  follower_id  :integer(4)      not null
#  following_id :integer(4)      not null
#  created_at   :datetime
#  updated_at   :datetime
#

