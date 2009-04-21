class UniboardPage < ActiveRecord::Base
  belongs_to :document, :class_name => 'UniboardDocument'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
end
