class Discussion < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  OBJECT_LINKED_ALLOWED = %w(page)

  attr_accessible :uuid, :page_id, :deleted_at, :properties

  belongs_to :page
  has_many :comments, :dependent => :delete_all

  validates_presence_of :page_id

  serialize :properties

  before_save :validate_presence_of_object_linked

  def validate_presence_of_object_linked
    columns = OBJECT_LINKED_ALLOWED.map{ |o| "#{o}_id"}
    columns.each do |column|
      if self.__send__(column.to_sym).present?
        return true
      end
    end
    return false
  end


end
