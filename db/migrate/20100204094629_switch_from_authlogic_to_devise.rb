class SwitchFromAuthlogicToDevise < ActiveRecord::Migration
  def self.up
    rename_column :users, :crypted_password, :encrypted_password
    
    # Devise
    change_table(:users) do |t|
      t.string    :confirmation_token, :limit => 20
      t.datetime  :confirmed_at
      t.datetime  :confirmation_sent_at
      t.string    :reset_password_token, :limit => 20
      t.string    :remember_token, :limit => 20
      t.datetime  :remember_created_at
      t.integer   :sign_in_count
      t.datetime  :current_sign_in_at
      t.datetime  :last_sign_in_at
      t.string    :current_sign_in_ip
      t.string    :last_sign_in_ip
      t.integer   :failed_attempts, :default => 0
      t.string    :unlock_token, :limit => 20
      t.datetime  :locked_at
      
      t.timestamps
    end
    
    add_index :users, :email,                :unique => true
    add_index :users, :confirmation_token,   :unique => true
    add_index :users, :reset_password_token, :unique => true
    add_index :users, :unlock_token,         :unique => true
    
    # Authlogic
    remove_column :users, :persistence_token
    remove_column :users, :single_access_token
    remove_column :users, :perishable_token
    remove_column :users, :login_count
    remove_column :users, :failed_login_count
    remove_column :users, :last_request_at
    remove_column :users, :current_login_at
    remove_column :users, :last_login_at
    remove_column :users, :current_login_ip
    remove_column :users, :last_login_ip
  end
  
  def self.down
    rename_column :users, :encrypted_password, :crypted_password
    
    # Devise
    remove_column :users, :confirmation_token
    remove_column :users, :confirmed_at
    remove_column :users, :confirmation_sent_at
    remove_column :users, :reset_password_token
    remove_column :users, :remember_token
    remove_column :users, :remember_created_at
    remove_column :users, :sign_in_count
    remove_column :users, :current_sign_in_at
    remove_column :users, :last_sign_in_at
    remove_column :users, :current_sign_in_ip
    remove_column :users, :last_sign_in_ip
    remove_column :users, :failed_attempts
    remove_column :users, :unlock_token
    remove_column :users, :locked_at
    
    remove_column :users, :created_at
    remove_column :users, :updated_at
    
    remove_index :users, :email
    remove_index :users, :confirmation_token
    remove_index :users, :reset_password_token
    remove_index :users, :unlock_token
    
    # Authlogic
    add_column :users, :persistence_token,    :string,    :null => false                # required
    add_column :users, :single_access_token,  :string,    :null => false                # optional, see Authlogic::Session::Params
    add_column :users, :perishable_token,     :string,    :null => false                # optional, see Authlogic::Session::Perishability
    add_column :users, :login_count,          :integer,   :null => false, :default => 0 # optional, see Authlogic::Session::MagicColumns
    add_column :users, :failed_login_count,   :integer,   :null => false, :default => 0 # optional, see Authlogic::Session::MagicColumns
    add_column :users, :last_request_at,      :datetime                                 # optional, see Authlogic::Session::MagicColumns
    add_column :users, :current_login_at,     :datetime                                 # optional, see Authlogic::Session::MagicColumns
    add_column :users, :last_login_at,        :datetime                                 # optional, see Authlogic::Session::MagicColumns
    add_column :users, :current_login_ip,     :string                                   # optional, see Authlogic::Session::MagicColumns
    add_column :users, :last_login_ip,        :string                                   # optional, see Authlogic::Session::MagicColumns
  end
end
