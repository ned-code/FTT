class UniboardPage < ActiveRecord::Base
  default_scope :order => "position ASC", :include => [:document]

  named_scope :next, lambda { |*p| {:conditions => ['position > ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id], :limit => 1, :order => 'position ASC'} }
  named_scope :previous, lambda { |*p| {:conditions => ['position < ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id], :limit => 1, :order => 'position DESC'} }

  belongs_to :document, :class_name => 'UniboardDocument', :foreign_key => 'uniboard_document_id'

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  after_initialize :initialize_storage

  def config
    UniboardDocument.config
  end

  def url
    raise NotImplementedError, 'Must be implemented in the storage module'
  end

  def thumbnail_url
    raise NotImplementedError, 'Must be implemented in the storage module'
  end

  def next
    UniboardPage.find(:first, :conditions => ['position > ? AND uniboard_document_id = ?', self.position, self.uniboard_document_id], :order => 'position ASC', :include => [:document])
  end

  def previous
    UniboardPage.find(:first, :conditions => ['position < ? AND uniboard_document_id = ?', self.position, self.uniboard_document_id], :order => 'position DESC', :include => [:document])
  end

  private

    # Storage
    def initialize_storage
      case config[:storage]
      when :s3
        require 'storage/s3'
      else
        require 'storage/filesystem'
      end

      @storage_module = Storage.const_get(config[:storage].to_s.capitalize).const_get('UniboardPage')
      self.extend(@storage_module)
    end
end
