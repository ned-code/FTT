# Attributes:
#- uuid: string
#- position integer
#- version: integer
#- uniboard_document_id: integer
#- page_media_id: integer
#
class UbPage < ActiveRecord::Base
  default_scope :order => "position ASC", :include => [:document]
  
  named_scope :next, lambda { |*p| {
      :conditions => ['position > ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id],
      :limit => 1,
      :order => 'position ASC'
    }}
  named_scope :previous, lambda { |*p| {
      :conditions => ['position < ? AND uniboard_document_id = ?', p.position, p.uniboard_document_id],
      :limit => 1,
      :order => 'position DESC'
    }}

  belongs_to :document, :class_name => 'UbDocument', :foreign_key => 'uniboard_document_id'
  belongs_to :media, :class_name => 'UbMedia', :foreign_key => 'page_media_id'
  has_many :page_elements, :class_name => 'UbPageElement', :foreign_key => 'uniboard_page_id',
    :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  def config
    UbDocument.config
  end

  def url(format = "svg", request_domain = nil)
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def mime_type(format = "svg")
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def thumbnail_url
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def thumbnail_mime_type
    raise NotImplementedError, "Must be implemented in the '#{config.storage}' storage module"
  end

  def next
    UbPage.find(:first,
      :conditions => [
        'position > ? AND uniboard_document_id = ?',
        self.position,
        self.uniboard_document_id
      ],
      :order => 'position ASC',
      :include => [:document]
    )
  end

  def previous
    UbPage.find(:first,
      :conditions => [
        'position < ? AND uniboard_document_id = ?',
        self.position,
        self.uniboard_document_id],
      :order => 'position DESC',
      :include => [:document]
    )
  end

  protected

  # Storage
  def after_initialize
    begin
      require "storage/#{config.storage}"
    rescue
      logger.error "Storage '#{config.storage}' can't be loaded, fallback to 'filesystem' storage"
      require 'storage/filesystem'
    end

    @storage_module = Storage.const_get(config.storage.to_s.capitalize).const_get('UbPage')
    self.extend(@storage_module)
  end

end
