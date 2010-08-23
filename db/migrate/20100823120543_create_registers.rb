class CreateRegisters < ActiveRecord::Migration
  def self.up
    create_table :registers, :id => false  do |t|
      t.string :email
      t.string :uuid, :limit => 36
      t.timestamps
    end
    
    execute 'ALTER TABLE registers ADD PRIMARY KEY (uuid);'
  end

  def self.down
    drop_table :registers
  end
end
