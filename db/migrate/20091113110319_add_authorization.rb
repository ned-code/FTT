class AddAuthorization < ActiveRecord::Migration
  def self.up
    create_table "roles", :force => true do |t|
      t.string   "name",              :limit => 40
      t.string   "authorizable_type", :limit => 40
      t.string  "authorizable_id"
      t.datetime "created_at"
      t.datetime "updated_at"
    end    
    create_table "roles_users", :id => false, :force => true do |t|
      t.integer  "user_id"
      t.integer  "role_id"
      t.datetime "created_at"
      t.datetime "updated_at"
    end
    if User.find_by_email("julien.bachmann@mnemis.com")
      User.find_by_email("julien.bachmann@mnemis.com").has_role!("admin")
    end
    if User.find_by_email("yann.ringgenberg@mnemis.com")
      User.find_by_email("yann.ringgenberg@mnemis.com").has_role!("admin")
    end
    if User.find_by_email("stelio.tzonis@mnemis.com")
      User.find_by_email("stelio.tzonis@mnemis.com").has_role!("admin")
    end    
    User.create({:password => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :password_confirmation => 'ycfeIDHUFvSzxXowiKZj6GBmlSUgwqYVqaCXJf0EfmZXLZUCvd', :name => "All", :email => "All@mnemis.com"})
  end

  def self.down
    drop_table "roles"
    drop_table "roles_users"
  end
end
