class UniboardPage < ActiveRecord::Base
  default_scope :order => "#{table_name}.position ASC", :include => [:document]

  belongs_to :document, :class_name => 'UniboardDocument', :foreign_key => 'uniboard_document_id'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  def url
    AWS::S3::S3Object.url_for("documents/#{document.uuid}/#{uuid}.svg", bucket)
  end

  # return bucket name from document
  def bucket
    document.bucket
  end
end
