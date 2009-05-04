class UniboardPage < ActiveRecord::Base
  default_scope :order => "#{table_name}.position ASC", :include => [:document]

  belongs_to :document, :class_name => 'UniboardDocument', :foreign_key => 'uniboard_document_id'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
end
