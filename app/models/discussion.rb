class Discussion < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  OBJECT_LINKED_ALLOWED = %w(page)

  attr_accessible :uuid, :page_id, :properties

  composed_of :properties, :class_name => 'Hash', :mapping => %w(properties to_json),
                           :constructor => JsonHelper.method(:decode_json_and_yaml)

  belongs_to :page
  belongs_to :user
  has_many :comments

  validates_presence_of :page_id

  serialize :properties

  before_save :validate_presence_of_object_linked
  
  scope :valid,
              :joins => { :page => :document },
              :conditions => ['discussions.deleted_at IS ? AND pages.deleted_at is ? AND documents.deleted_at IS ?',nil, nil, nil]
  scope :not_deleted, :conditions => ['discussions.deleted_at IS ?', nil]
  scope :deleted, :conditions => ['discussions.deleted_at IS NOT ?', nil]

  def validate_presence_of_object_linked
    columns = OBJECT_LINKED_ALLOWED.map{ |o| "#{o}_id"}
    columns.each do |column|
      if self.__send__(column.to_sym).present?
        return true
      end
    end
    return false
  end

  def as_application_json
    hash = { 'discussion' => self.attributes }
    hash['discussion']['properties'] = self.properties 
    hash['discussion']['comments'] = self.comments.map do |c|
      c.as_application_json['comment']
    end
    hash
  end
  
end


# == Schema Information
#
# Table name: discussions
#
#  uuid       :string(36)      not null, primary key
#  page_id    :string(36)
#  deleted_at :datetime
#  properties :text
#  created_at :datetime
#  updated_at :datetime
#  user_id    :string(36)      not null
#

