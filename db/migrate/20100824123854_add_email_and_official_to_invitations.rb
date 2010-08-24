class AddEmailAndOfficialToInvitations < ActiveRecord::Migration
  def self.up
    add_column :invitations, :email, :string
    add_column :invitations, :official, :boolean, :default => false
  end

  def self.down
    remove_column :invitations, :email
    remove_column :invitations, :official
  end
end
