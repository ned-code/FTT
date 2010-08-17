class AddAuthenticationTokenToUser < ActiveRecord::Migration
  def self.up
    create_table :tokens, :id => false do |t|
      t.string   :uuid, :limit => 36, :null => false
      t.string   :user_id, :limit => 36, :null => false
      t.string   :application_id, :limit => 36, :null => false
      t.string   :token, :limit => 36
      t.timestamps
    end

    execute 'ALTER TABLE tokens ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table :tokens
  end
end
