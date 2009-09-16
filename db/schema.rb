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
    t.string   "path",                     :null => false
    t.string   "mime_type",                :null => false
    t.string   "parameters"
    t.string   "media_id",   :limit => 36, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "documents", :id => false, :force => true do |t|
    t.string   "uuid",              :limit => 36
    t.string   "metadata_media_id", :limit => 36
    t.string   "title"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :id => false, :force => true do |t|
    t.string   "uuid",       :limit => 36
    t.string   "page_id",    :limit => 36,                          :null => false
    t.string   "media_id",   :limit => 36,                          :null => false
    t.string   "item_type",                   :default => "object", :null => false
    t.text     "data",       :limit => 65537
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "medias", :id => false, :force => true do |t|
    t.string   "uuid",           :limit => 36
    t.string   "path",                         :null => false
    t.string   "mime_type",                    :null => false
    t.integer  "version",                      :null => false
    t.string   "storage_config"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "pages", :id => false, :force => true do |t|
    t.string   "uuid",         :limit => 36
    t.string   "document_id",  :limit => 36,                   :null => false
    t.string   "thumbnail_id", :limit => 36
    t.integer  "position",                                     :null => false
    t.integer  "version",                       :default => 1, :null => false
    t.text     "data",         :limit => 65537
    t.datetime "created_at"
    t.datetime "updated_at"
  end

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
