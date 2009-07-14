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

ActiveRecord::Schema.define(:version => 20090713102337) do

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

  create_table "ub_conversions", :force => true do |t|
    t.string   "path"
    t.string   "media_type"
    t.string   "parameters"
    t.integer  "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ub_conversions", ["media_id"], :name => "media_fk"

  create_table "ub_documents", :force => true do |t|
    t.string   "uuid"
    t.string   "bucket"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "version",           :default => 1
    t.datetime "deleted_at"
    t.string   "title"
    t.integer  "status"
    t.integer  "metadata_media_id"
    t.boolean  "is_public"
  end

  add_index "ub_documents", ["uuid"], :name => "document_uuid_index", :unique => true

  create_table "ub_medias", :force => true do |t|
    t.string   "uuid"
    t.string   "path"
    t.string   "media_type"
    t.integer  "version"
    t.integer  "page_element_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "storage_config"
  end

  add_index "ub_medias", ["page_element_id"], :name => "page_element_fk"
  add_index "ub_medias", ["uuid"], :name => "media_uuid_index", :unique => true

  create_table "ub_page_elements", :force => true do |t|
    t.integer  "uniboard_page_id"
    t.integer  "media_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ub_page_elements", ["uniboard_page_id"], :name => "page_fk"

  create_table "ub_pages", :force => true do |t|
    t.string   "uuid"
    t.integer  "position"
    t.integer  "version",              :default => 1
    t.integer  "uniboard_document_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "page_media_id"
  end

  add_index "ub_pages", ["uniboard_document_id"], :name => "doument_fk"
  add_index "ub_pages", ["uuid"], :name => "page_uuid_index", :unique => true

  create_table "ub_sync_transaction_items", :force => true do |t|
    t.integer  "ub_sync_transaction_id", :null => false
    t.string   "path",                   :null => false
    t.string   "storage_config",         :null => false
    t.integer  "part_nb",                :null => false
    t.integer  "part_total_nb",          :null => false
    t.string   "part_check_sum",         :null => false
    t.string   "item_check_sum",         :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "content_type"
  end

  add_index "ub_sync_transaction_items", ["ub_sync_transaction_id"], :name => "transaction_fk"

  create_table "ub_sync_transactions", :force => true do |t|
    t.string   "uuid",             :null => false
    t.string   "ub_client_uuid",   :null => false
    t.string   "ub_document_uuid", :null => false
    t.integer  "user_id",          :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ub_sync_transactions", ["uuid"], :name => "transaction_uuid_index", :unique => true

  create_table "users", :force => true do |t|
    t.string   "email",                                  :null => false
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
    t.string   "firstname"
    t.string   "lastname"
  end

end
