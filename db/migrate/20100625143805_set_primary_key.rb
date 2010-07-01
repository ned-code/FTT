class SetPrimaryKey < ActiveRecord::Migration
  def self.up
    execute 'ALTER TABLE categories ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE datastore_entries ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE followships ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE items ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE layouts ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE medias ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE pages ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE roles ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE themes ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE users ADD PRIMARY KEY (uuid);'
    execute 'ALTER TABLE view_counts ADD PRIMARY KEY (uuid);'
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration
  end
end
