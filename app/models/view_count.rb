class ViewCount < ActiveRecord::Base
  
  belongs_to :user
  belongs_to :viewable, :polymorphic => true, :counter_cache => :views_count
  
  validates_uniqueness_of :session_id, :scope => [ :viewable_id, :viewable_type ]
  
end

# == Schema Information
#
# Table name: view_counts
#
#  id            :integer         not null, primary key
#  viewable_id   :integer
#  viewable_type :string(255)
#  user_id       :integer
#  session_id    :string(255)
#  ip_address    :string(255)
#  created_at    :datetime
#

