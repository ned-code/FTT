class Comment < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :discussion_id, :user_id, :content, :created_at, :deleted_at

  validates_presence_of :discussion_id

  belongs_to :user
  belongs_to :discussion

  named_scope :root_only, :conditions => { :root => true }

  before_save :check_if_root

  def check_if_root
    if self.discussion.comments.first(:conditions => { :root => true }).present?
      self.root = false
    else
      self.root = true
    end
    return true
  end

end
