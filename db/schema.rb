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

ActiveRecord::Schema.define(:version => 20091211072724) do

  create_table "datastores", :force => true do |t|
    t.string   "ds_key",                          :null => false
    t.text     "ds_value",    :limit => 16777215, :null => false
    t.string   "widget_uuid", :limit => 36
    t.string   "user_id",     :limit => 36
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "documents", :id => false, :force => true do |t|
    t.string   "uuid",       :limit => 36
    t.string   "title"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :id => false, :force => true do |t|
    t.string   "uuid",       :limit => 36
    t.string   "page_id",    :limit => 36,       :null => false
    t.string   "media_id",   :limit => 36
    t.string   "media_type"
    t.text     "data",       :limit => 16777215
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "items", ["page_id"], :name => "index_items_on_page_id"

  create_table "medias", :id => false, :force => true do |t|
    t.string   "uuid",              :limit => 36
    t.string   "type"
    t.string   "file_file_name"
    t.string   "file_content_type"
    t.integer  "file_file_size"
    t.datetime "file_updated_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "properties",        :limit => 16777215
  end

  create_table "pages", :id => false, :force => true do |t|
    t.string   "uuid",         :limit => 36
    t.string   "document_id",  :limit => 36,                      :null => false
    t.string   "thumbnail_id", :limit => 36
    t.integer  "position",                                        :null => false
    t.integer  "version",                          :default => 1, :null => false
    t.text     "data",         :limit => 16777215
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "pages", ["document_id"], :name => "index_pages_on_document_id"

  create_table "roles", :force => true do |t|
    t.string   "name",              :limit => 40
    t.string   "authorizable_type", :limit => 40
    t.string   "authorizable_id"
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
    t.string   "email",                              :null => false
    t.string   "name",                               :null => false
    t.string   "crypted_password",                   :null => false
    t.string   "password_salt",                      :null => false
    t.string   "persistence_token",                  :null => false
    t.string   "single_access_token",                :null => false
    t.string   "perishable_token",                   :null => false
    t.integer  "login_count",         :default => 0, :null => false
    t.integer  "failed_login_count",  :default => 0, :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
  end

end
