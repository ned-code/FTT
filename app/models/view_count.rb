class ViewCount < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  attr_accessible :user_id, :session_id, :ip_address, :uuid
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  belongs_to :viewable, :polymorphic => true, :counter_cache => :views_count
  
  # ===============
  # = Validations =
  # ===============
  
  validates_uniqueness_of :session_id, :scope => [:viewable_id, :viewable_type]
  
end


# == Schema Information
#
# Table name: view_counts
#
#  id            :integer(4)      not null, primary key
#  viewable_id   :integer(4)
#  viewable_type :string(255)
#  user_id       :integer(4)
#  session_id    :string(255)
#  ip_address    :string(255)
#  created_at    :datetime
#

