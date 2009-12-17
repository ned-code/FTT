# == Schema Information
#
# Table name: roles
#
#  id                :integer         not null, primary key
#  name              :string(40)
#  authorizable_type :string(40)
#  authorizable_id   :string(255)
#  created_at        :datetime
#  updated_at        :datetime
#

class Role < ActiveRecord::Base
  acts_as_authorization_role
end

