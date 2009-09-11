# == Schema Information
#
# Table name: ub_pages
#
#  id                   :integer         not null, primary key
#  uuid                 :string(255)
#  position             :integer
#  version              :integer         default(1)
#  uniboard_document_id :integer
#  created_at           :datetime
#  updated_at           :datetime
#  page_media_id        :integer
#  data                 :text(65537)
#


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
  belongs_to :media, :dependent => :destroy, :autosave => true, :class_name => 'UbMedia', :foreign_key => 'page_media_id'
  has_many :page_elements, :class_name => 'UbPageElement', :foreign_key => 'uniboard_page_id',
    :autosave => true, :dependent => :destroy

  validates_format_of :uuid, :with => UUID_FORMAT_REGEX

  def url(format = UbMedia::UB_PAGE_TYPE)
    if (media)
      page_resource = media.get_resource(format, nil)
      raise "No Media found for page #{self.uuid} in format #{format}" if page_resource == nil
      return page_resource.public_url
    end
    return ""
  end

  def mime_type(format = "svg")
    'image/svg+xml'
  end

  def thumbnail_url
    if (!self.media)
      return "/images/noThumb.jpg"
    end
    page_resource = self.media.get_resource(UbMedia::UB_THUMBNAIL_DESKTOP_TYPE, nil)
    raise "No Media found for page thumbnail #{self.uuid}" if page_resource == nil
    return page_resource.public_url
  end

  def thumbnail_mime_type
    'image/jpeg'
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

  def update_page_from_media
    self.version += 1 if !self.new_record?
    self.parse_svg_page(self.media.data)
  end

  def json_content
    result = { 'uuid' => uuid, 'data' => JSON.parse(data)}
    page_objects = []
    page_elements.each do |a_page_element|
      page_objects << JSON.parse(a_page_element.data)
    end
    result['page_objects'] = page_objects

    result.to_json
  end

  protected

  # Parse the svg file that describe the page and create all corresponding page element. This method assume that
  # medias used by the page exists. If some medias are missing an exception is raised.
  def parse_svg_page(svg_stream)
    unless svg_stream.is_a? String
      svg_stream.rewind
      svg_stream = svg_stream.read
    end

    # Get the UUID
    page_dom = REXML::Document.new(svg_stream)
    self.uuid ||= page_dom.root.attribute('uuid', 'ub')

    rect_element = page_dom.root.elements['rect']
    page_width = rect_element.attribute('width').value
    page_height = rect_element.attribute('height').value
    page_background = rect_element.attribute('fill').value
    data_hash = {}
    data_hash['css'] = {:width => "#{page_width}px", :height => "#{page_height}px", :backgroundColor => page_background}
    self.data = data_hash.to_json
    
    # create a map that map media uuid with corresponding page element. It will be used to optimize
    # the loop that search page element to update.
    uuid_element_map = {}
    page_elements.each do |a_page_element|
      if (a_page_element.media)
        uuid_element_map[a_page_element.uuid] = a_page_element
      end
    end

    # this copy of page elements will be used to find page elements that must be deleted
    original_page_elements = page_elements.dup


    # Now iterate on page elements to update or create corresponding page element
    page_dom.each_element("svg/image | svg/foreignObject | svg/video") do |element|

      element_uuid = element.attribute('uuid', 'ub')
      media_uuid = nil
      if (element_uuid.nil?)
        element_uuid = UUID.generate
      else
        element_uuid = element_uuid.value
      end
      if (element.name == "foreignObject" && !element.attribute('type', 'ub').nil? && element.attribute('type', 'ub').value == 'text')
        media_uuid = nil
      elsif (element.name == "foreignObject" && element.attribute('background', 'ub').value == "true")
        media_uuid = element.attribute("href", "xlink").value.match(UUID_FORMAT_REGEX)[0].match(UUID_FORMAT_REGEX)[0]
      else
        media_uuid = element_uuid.match(UUID_FORMAT_REGEX)[0]
      end

      element_uuid = element_uuid.match(UUID_FORMAT_REGEX)[0]
      page_element = uuid_element_map[element_uuid]
      if (page_element)
        original_page_elements.delete(page_element)
      else
        if (!media_uuid.nil?)
          media = UbMedia.find_by_uuid(media_uuid)
          #        raise "No matching media for element #{element} with uuid #{media_uuid}" if media == nil
          if (media != nil)
            page_element = page_elements.build(:media => media)
            page_element.uuid = element_uuid
          end
        else
            page_element = page_elements.build()
            page_element.uuid = element_uuid
        end
      end
      page_element.update_from_svg(element, page_width, page_height) if !page_element.nil?
    end

    #add svg drawing
    drawing_resource = media.get_resource('application/vnd.mnemis-uniboard-drawing', {})
    page_element = uuid_element_map[uuid]
    if (page_element)
      original_page_elements.delete(page_element)
    else
      media = UbMedia.find_by_uuid(uuid)
      page_element = page_elements.build(:media => media)
      page_element.uuid = uuid
    end
    drawing_hash = {}
    drawing_hash[:ubItemType] = UbMedia::UB_DRAWING_TYPE
    drawing_hash[:uuid] = uuid
    drawing_hash[:tag] = 'object'
    drawing_hash[:tag] = 'object'
    drawing_hash[:type] = "image/svg+xml"
    drawing_hash[:data] = drawing_resource.public_url
    drawing_hash[:css] = { :top => "0px", :left => "0px",:width => "#{page_width.to_s}px", :height => "#{page_height.to_s}px", :zIndex => "1999999"}
    page_element.data = drawing_hash.to_json

    # Remove all page elements that are no more used
    original_page_elements.each do|a_page_element|
      a_page_element.mark_for_destruction
    end
  end

end
