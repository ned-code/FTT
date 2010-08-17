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

  scope :root_only, :conditions => { :root => true }
  scope :valid,
              :joins => { :discussion => {:page => :document }},
              :conditions => ['comments.deleted_at IS ? AND discussions.deleted_at IS ? AND pages.deleted_at is ? AND documents.deleted_at IS ?',nil, nil, nil, nil]
              
  scope :not_deleted, :conditions => ['comments.deleted_at IS ?', nil]
  scope :deleted, :conditions => ['comments.deleted_at IS NOT ?', nil]

  before_save :check_if_root
  
  def check_if_root
    if self.discussion.comments.first(:conditions => { :root => true }).present?
      self.root = false
    else
      self.root = true
    end
    return true
  end

  def as_application_json
    hash = { 'comment' => self.attributes }
    hash['comment']['safe_content'] = self.safe_content
    hash['comment']['relative_created_at'] = self.relative_created_at
    hash['comment']['user'] = self.user.attributes
    hash['comment']['user']['avatar_thumb_url'] = self.user.avatar_thumb_url
    hash
  end

  def safe_content
    sanitize(self.content)
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

