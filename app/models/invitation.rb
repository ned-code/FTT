class Invitation < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  # ===============
  # = Validations =
  # ===============
  validates_uniqueness_of :uuid
  validates_presence_of :user_id, :uuid
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
end
