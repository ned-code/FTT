class UniboardPage < ActiveRecord::Base
  belongs_to :document, :class_name => 'UniboardDocument'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX
  validates_uniqueness_of :position, :scope => :uniboard_document_id

  before_update :increment_version

  private

    def increment_version
      self.version += 1 if changed?
    end
end
