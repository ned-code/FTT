class Discussion < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :page_id, :deleted_at, :properties

  belongs_to :page
  has_many :comments


end
