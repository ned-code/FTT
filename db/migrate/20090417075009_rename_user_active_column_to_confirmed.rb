class RenameUserActiveColumnToConfirmed < ActiveRecord::Migration
  def self.up
    rename_column(:users, :active, :confirmed)
  end

  def self.down
    rename_column(:users, :confirmed, :active)
  end
end
