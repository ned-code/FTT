# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100317104610) do

  create_table "categories", :force => true do |t|
    t.string "name", :null => false
  end

  create_table "datastore_entries", :force => true do |t|
    t.string   "ds_key",                      :null => false
    t.text     "ds_value",   :limit => 65537, :null => false
    t.string   "user_id",    :limit => 36
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "item_id"
  end

  create_table "documents", :force => true do |t|
    t.string   "uuid",        :limit => 36
    t.string   "title"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
    t.text     "size"
    t.integer  "category_id"
    t.integer  "creator_id"
    t.boolean  "is_public",                 :default => false
    t.integer  "views_count",               :default => 0
  end

  create_table "followships", :force => true do |t|
    t.integer  "follower_id",  :null => false
    t.integer  "following_id", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :force => true do |t|
    t.string   "uuid",       :limit => 36
    t.integer  "page_id",                     :null => false
    t.integer  "media_id"
    t.string   "media_type"
    t.text     "data",       :limit => 65537
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "position"
  end

  add_index "items", ["page_id"], :name => "index_items_on_page_id"

  create_table "medias", :force => true do |t|
    t.string   "uuid",        :limit => 36
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "properties",  :limit => 65537
    t.integer  "user_id"
    t.string   "file"
    t.string   "system_name"
    t.string   "title"
    t.text     "description"
  end

  add_index "medias", ["system_name"], :name => "index_medias_on_system_name"
  add_index "medias", ["user_id"], :name => "index_medias_on_user_id"

  create_table "pages", :force => true do |t|
    t.string   "uuid",         :limit => 36
    t.integer  "document_id",                                            :null => false
    t.integer  "thumbnail_id"
    t.integer  "position",                                               :null => false
    t.integer  "version",                       :default => 1,           :null => false
    t.text     "data",         :limit => 65537
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title",                         :default => "undefined"
  end

  add_index "pages", ["document_id"], :name => "index_pages_on_document_id"

  create_table "roles", :force => true do |t|
    t.string   "name",              :limit => 40
    t.string   "authorizable_type", :limit => 40
    t.integer  "authorizable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["authorizable_id"], :name => "index_roles_on_authorizable_id"
  add_index "roles", ["authorizable_type"], :name => "index_roles_on_authorizable_type"
  add_index "roles", ["name", "authorizable_id", "authorizable_type"], :name => "index_roles_on_name_and_authorizable_id_and_authorizable_type", :unique => true
  add_index "roles", ["name"], :name => "index_roles_on_name"

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer  "user_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles_users", ["role_id"], :name => "index_roles_users_on_role_id"
  add_index "roles_users", ["user_id", "role_id"], :name => "index_roles_users_on_user_id_and_role_id", :unique => true
  add_index "roles_users", ["user_id"], :name => "index_roles_users_on_user_id"

  create_table "users", :force => true do |t|
    t.string   "email",                                             :null => false
    t.string   "username",                                          :null => false
    t.string   "encrypted_password",                                :null => false
    t.string   "password_salt",                                     :null => false
    t.string   "confirmation_token",   :limit => 20
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "reset_password_token", :limit => 20
    t.string   "remember_token",       :limit => 20
    t.datetime "remember_created_at"
    t.integer  "sign_in_count"
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.integer  "failed_attempts",                    :default => 0
    t.string   "unlock_token",         :limit => 20
    t.datetime "locked_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "avatar"
    t.text     "bio"
    t.string   "gender"
    t.string   "website"
  end

  add_index "users", ["confirmation_token"], :name => "index_users_on_confirmation_token", :unique => true
  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true
  add_index "users", ["unlock_token"], :name => "index_users_on_unlock_token", :unique => true
  add_index "users", ["username"], :name => "index_users_on_username"

  create_table "view_counts", :force => true do |t|
    t.integer  "viewable_id"
    t.string   "viewable_type"
    t.integer  "user_id"
    t.string   "session_id"
    t.string   "ip_address"
    t.datetime "created_at"
  end

end
