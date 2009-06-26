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

#  def config
#    UbDocument.config
#  end

  def url(format = "ub_page/svg")
    page_resource = media.get_resource(format)
    raise "No Media found for page #{self.uuid} in format #{format}" if page_resource == nil
    return page_resource.public_url
  end

  def mime_type(format = "svg")
  end

  def thumbnail_url
    page_resource = self.media.get_resource("thumbnail", nil)
    raise "No Media found for page thumbnail #{self.uuid}" if page_resource == nil
    return page_resource.public_url
  end

  def thumbnail_mime_type
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

  # Parse the svg file that describe the page and create all corresponding page element. This method assume that
  # medias used by the page exists. If some medias are missing an exception is raised.
  def parse_svg_page(svg_stream)    
    # Get the UUID
    page_dom = REXML::Document.new(svg_stream)
    self.uuid = page_dom.root.attribute('uuid', 'ub')

    # create a map that map media uuid with corresponding page element. It will be used to optimize
    # the loop that search page element to update.
    media_element_map = {}
    page_elements.each do |a_page_element|
      if (a_page_element.media)
        media_element_map[a_page_element.media.uuid] = a_page_element
      end
    end

    # this copy of page elements will be used to find page elements that must be deleted
    original_page_elements = page_elements.dup
    

    # Now iterate on page elements to update or create corresponding page element
    page_dom.each_element("svg/image | svg/foreignObject | svg/video") do |element|

      uuid_attribute = element.attribute('uuid', 'ub').value
      raise "Invalid svg page format: media #{element.to_s} has no ub:uuid attribute" if uuid_attribute == nil
      media_uuid = uuid_attribute.match(UUID_FORMAT_REGEX)[0]
      page_element = media_element_map[media_uuid]
      if (page_element)
        original_page_elements.delete(page_element)
      else
        media = UbMedia.find_by_uuid(media_uuid)
        raise "No matching media for element #{element} with uuid #{media_uuid}" if media == nil
        page_element = page_elements.build(:media => media)
      end
      page_element.update_from_svg(element)
    end

    # Remove all page elements that are no more used
    original_page_elements.each do|a_page_element|
      a_page_element.mark_for_destruction
    end
  end

  protected

  # Storage
#  def after_initialize
#    begin
#      require "storage/#{config.storage}"
#    rescue
#      logger.error "Storage '#{config.storage}' can't be loaded, fallback to 'filesystem' storage"
#      require 'storage/filesystem'
#    end
#
#    @storage_module = Storage.const_get(config.storage.to_s.capitalize).const_get('UbPage')
#    self.extend(@storage_module)
#  end

end
