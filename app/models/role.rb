# == Schema Information
#
# Table name: roles
#
#  id                :integer         not null, primary key
#  name              :string(40)
#  authorizable_type :string(40)
#  authorizable_id   :integer
#  created_at        :datetime
#  updated_at        :datetime
#

class Role < ActiveRecord::Base
  has_many :roles_users, :dependent => :delete_all
  has_many :users, :through => :roles_users
  belongs_to :authorizable, :polymorphic => true
end
