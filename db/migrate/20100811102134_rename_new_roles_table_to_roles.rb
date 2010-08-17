class RenameNewRolesTableToRoles < ActiveRecord::Migration
  def self.up
    rename_table :new_roles, :roles
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
