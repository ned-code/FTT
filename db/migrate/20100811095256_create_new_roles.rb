class CreateNewRoles < ActiveRecord::Migration
  
  #we define the clase Rolesuser here because this model doens't exist anymore
  class RolesUser < ActiveRecord::Base
    belongs_to :user
    belongs_to :role
  end
  
  def self.up
    new_roles = []
    RolesUser.all.each do |r|
      name = r.role.name
      user_id = r.user.uuid
      document_id = r.role.authorizable_id

      new_roles << { :name => name,
                     :user_id => user_id,
                     :document_id => document_id
                    }
    end
    
    create_table :new_roles, :id => false do |t|
      t.string :uuid, :limit => 36
      t.string :name
      t.string :user_id, :limit => 36
      t.string :user_list_id, :limit => 36
      t.string :item_id, :limit => 36
      t.string :document_id, :limit => 36
      t.timestamps
    end
    
    execute 'ALTER TABLE new_roles ADD PRIMARY KEY (uuid);'
    
    Role.set_table_name 'new_roles'
    Role.reset_column_information
    new_roles.each do |r|
      role = Role.new
      role.document_id = r[:document_id]
      role.name = r[:name]
      role.user_id = r[:user_id]
      p r[:document_id]
      role.save!
    end
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
