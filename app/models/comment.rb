class Comment < ActiveRecord::Base

  include ActionView::Helpers
  
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :discussion_id, :user_id, :content

  validates_presence_of :discussion_id
  validates_presence_of :content
  validates_presence_of :user_id

  belongs_to :user
  belongs_to :discussion

  named_scope :root_only, :conditions => { :root => true }
  named_scope :not_deleted, :conditions => ['comments.deleted_at IS ?', nil]
  named_scope :deleted, :conditions => ['comments.deleted_at IS NOT ?', nil]

  before_save :check_if_root
  
  def check_if_root
    if self.discussion.comments.first(:conditions => { :root => true }).present?
      self.root = false
    else
      self.root = true
    end
    return true
  end

  def safe_content
    sanitize(self.content)
  end

  def safe_delete!
    if self.deleted_at.blank?
      self.deleted_at = Time.now
      self.save!
    end
  end

end

# == Schema Information
#
# Table name: comments
#
#  uuid          :string(36)      not null, primary key
#  discussion_id :string(36)      not null
#  user_id       :string(36)      not null
#  content       :text
#  deleted_at    :datetime
#  root          :boolean(1)
#  created_at    :datetime
#  updated_at    :datetime
#

