class UpdateInvitation < ActiveRecord::Migration
  def self.up
    add_column :invitations, :document_id, :string, :limit => 36
    add_column :invitations, :role, :string, :default => nil
  end

  def self.down
    remove_column :invitations, :document_id
    remove_column :invitations, :role
  end
end
