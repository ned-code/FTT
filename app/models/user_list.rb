class UserList < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :name, :user_id
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  has_many :user_lists_friends, :dependent => :destroy
  has_many :friendships, :through => :user_lists_friends
  
  def destroy
    return if default #prevent to destroy the default list
    super
  end
end
