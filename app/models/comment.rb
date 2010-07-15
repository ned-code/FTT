class Comment < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :discussion_id, :user_id, :content, :created_at, :deleted_at

  validates_presence_of :discussion_id
  validates_presence_of :content
  validates_presence_of :user_id

  belongs_to :user
  belongs_to :discussion

  named_scope :root_only, :conditions => { :root => true }
  named_scope :not_deleted, :conditions => ['deleted_at IS ?', nil]
  named_scope :deleted, :conditions => ['deleted_at IS NOT ?', nil]

  before_save :check_if_root
  
  def check_if_root
    if self.discussion.comments.first(:conditions => { :root => true }).present?
      self.root = false
    else
      self.root = true
    end
    return true
  end

  def safe_delete!
    self.deleted_at = Time.now
    self.save!
  end

end
