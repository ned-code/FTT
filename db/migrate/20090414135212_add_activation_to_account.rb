class AddActivationToAccount < ActiveRecord::Migration
  def self.up
    add_column :accounts, :active, :boolean, :null => false, :default => false
    Account.update_all :active => true
  end

  def self.down
    remove_column :accounts, :active
  end
end
