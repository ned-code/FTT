class AddUuidToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :uuid, :string
    add_index :users, :uuid

    User.all().each do |user| 
      user.uuid = UUID.new
      user.save
    end
  end

  def self.down
    remove_column :users, :uuid
    remove_index :users, :uuid
  end
end
