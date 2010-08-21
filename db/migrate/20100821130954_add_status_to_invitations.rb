class AddStatusToInvitations < ActiveRecord::Migration
  def self.up
    add_column :invitations, :status, :string
  end

  def self.down
    remove_column :invitations, :status
  end
end
