class Role < ActiveRecord::Base
  has_many :roles_users, :dependent => :delete_all
  has_many :users, :through => :roles_users
  belongs_to :authorizable, :polymorphic => true
end
