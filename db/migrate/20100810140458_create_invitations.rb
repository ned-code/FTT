class CreateInvitations < ActiveRecord::Migration
  def self.up
    create_table :invitations, :id => false do |t|
      t.string :uuid, :limit => 36
      t.string :user_id, :limit => 36
      t.timestamps
    end
    
    execute 'ALTER TABLE invitations ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table :invitations
  end
end
