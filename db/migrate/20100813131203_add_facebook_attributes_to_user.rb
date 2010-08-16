class AddFacebookAttributesToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :facebook_token, :string
  end

  def self.down
    remove_column :users, :facebook_token
  end
end
