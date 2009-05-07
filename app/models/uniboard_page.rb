class UniboardPage < ActiveRecord::Base
  default_scope :order => "position ASC", :include => [:document]

  named_scope :next, lambda { |*p| {:conditions => ['position > ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id], :limit => 1, :order => 'position ASC'} }
  named_scope :previous, lambda { |*p| {:conditions => ['position < ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id], :limit => 1, :order => 'position DESC'} }

  belongs_to :document, :class_name => 'UniboardDocument', :foreign_key => 'uniboard_document_id'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  def url
    AWS::S3::S3Object.url_for("documents/#{document.uuid}/#{uuid}.svg", bucket)
  end

  def thumbnail_url
    AWS::S3::S3Object.url_for("documents/#{document.uuid}/#{uuid}.thumbnail.jpg", bucket)
  end

  def next
    UniboardPage.find(:first, :conditions => ['position > ? AND uniboard_document_id = ?', self.position, self.uniboard_document_id], :order => 'position ASC', :include => [:document])
  end

  def previous
    UniboardPage.find(:first, :conditions => ['position < ? AND uniboard_document_id = ?', self.position, self.uniboard_document_id], :order => 'position DESC', :include => [:document])
  end

  # return bucket name from document
  def bucket
    document.bucket
  end
end
