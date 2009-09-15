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

ActiveRecord::Schema.define(:version => 20090616124636) do

  create_table "conversions", :force => true do |t|
    t.string   "path",       :null => false
    t.string   "mime_type",  :null => false
    t.string   "parameters"
    t.integer  "media_id",   :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "documents", :force => true do |t|
    t.string   "uuid",                             :null => false
    t.integer  "metadata_media_id"
    t.string   "title"
    t.integer  "version",           :default => 1, :null => false
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :force => true do |t|
    t.string   "uuid",                                              :null => false
    t.integer  "page_id",                                           :null => false
    t.integer  "media_id",                                          :null => false
    t.text     "data",       :limit => 65537
    t.string   "item_type",                   :default => "object", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "medias", :force => true do |t|
    t.string   "uuid",           :null => false
    t.string   "path",           :null => false
    t.string   "mime_type",      :null => false
    t.integer  "version",        :null => false
    t.string   "storage_config"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pages", :force => true do |t|
    t.string   "uuid",                                        :null => false
    t.integer  "position",                                    :null => false
    t.integer  "version",                      :default => 1, :null => false
    t.integer  "document_id",                                 :null => false
    t.text     "data",        :limit => 65537
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles", :force => true do |t|
    t.string   "name",              :limit => 40
    t.string   "authorizable_type", :limit => 40
    t.integer  "authorizable_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "roles_users", :id => false, :force => true do |t|
    t.integer  "user_id"
    t.integer  "role_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                  :null => false
    t.string   "name",                                   :null => false
    t.boolean  "confirmed",           :default => false, :null => false
    t.string   "crypted_password",                       :null => false
    t.string   "password_salt",                          :null => false
    t.string   "persistence_token",                      :null => false
    t.string   "single_access_token",                    :null => false
    t.string   "perishable_token",                       :null => false
    t.integer  "login_count",         :default => 0,     :null => false
    t.integer  "failed_login_count",  :default => 0,     :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
  end

end
