class Role < ActiveRecord::Base
  has_many :roles_accounts, :dependent => :delete_all
  has_many :accounts, :through => :roles_accounts
  belongs_to :authorizable, :polymorphic => true
end
