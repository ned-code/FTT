#Model used to register user before the full opening of webdoc

class Register < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  validates_presence_of :email
  validates_uniqueness_of :email
end
