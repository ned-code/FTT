require 'spec_helper'

describe Followship do
  
  should_allow_mass_assignment_of :following_id
  should_not_allow_mass_assignment_of :id, :follower_id, :created_at, :updated_at
  
end



# == Schema Information
#
# Table name: followships
#
#  follower_id  :string(36)      not null
#  following_id :string(36)      not null
#  created_at   :datetime
#  updated_at   :datetime
#  uuid         :string(36)      primary key
#

