class AddIndexesToRoles < ActiveRecord::Migration
  def self.up
    add_index :roles, :name
    add_index :roles, :authorizable_id
    add_index :roles, :authorizable_type
    add_index :roles, [:name, :authorizable_id, :authorizable_type], :unique => true    
    add_index :roles_users, :user_id
    add_index :roles_users, :role_id
    add_index :roles_users, [:user_id, :role_id], :unique => true
  end

  def self.down
    remove_index :roles, [:name, :authorizable_id, :authorizable_type]
    remove_index :roles, :authorizable_type
    remove_index :roles, :authorizable_id
    remove_index :roles, :name   
    remove_index :roles_users, :user_id
    remove_index :roles_users, :role_id
    remove_index :roles_users, [:user_id, :role_id]     
  end
end
