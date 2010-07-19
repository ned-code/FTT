module DiscussionJsonHelper
  def self.decode_json_and_yaml(value)
    unless(value.nil?)
      begin
        return ActiveSupport::JSON.decode(value)
      rescue
        return YAML.load(value)
      end
    end
    return nil
  end
end

class Discussion < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  OBJECT_LINKED_ALLOWED = %w(page)

  attr_accessible :uuid, :page_id, :properties

  composed_of :properties, :class_name => 'Hash', :mapping => %w(properties to_json),
                           :constructor => DiscussionJsonHelper.method(:decode_json_and_yaml)

  belongs_to :page
  has_many :comments

  validates_presence_of :page_id

  serialize :properties

  before_save :validate_presence_of_object_linked

  named_scope :not_deleted, :conditions => ['discussions.deleted_at IS ?', nil]
  named_scope :deleted, :conditions => ['discussions.deleted_at IS NOT ?', nil]

  def validate_presence_of_object_linked
    columns = OBJECT_LINKED_ALLOWED.map{ |o| "#{o}_id"}
    columns.each do |column|
      if self.__send__(column.to_sym).present?
        return true
      end
    end
    return false
  end

  def safe_delete!
    self.deleted_at = Time.now
    self.save!
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
#

