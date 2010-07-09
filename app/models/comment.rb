class Comment < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :discussion_id, :user_id, :content, :deleted_at

  belongs_to :user
  belongs_to :discussion

  named_scope :root_only, :conditions => { :root => true }


end
