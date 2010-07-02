class Layout < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid

  attr_accessible :uuid, :title, :thumbnail_url, :kind

  # ================
  # = Associations =
  # ================
  
  belongs_to :theme
  belongs_to :model_page, :class_name => "Page", :foreign_key => "model_page_id", :dependent => :delete

  # ===============
  # = Validations =
  # ===============

  validates_presence_of :title
  validates_presence_of :thumbnail_url
  validates_presence_of :template_url
  validates_presence_of :kind

  # ====================
  # = Instance Methods =
  # ====================

  def to_param
    uuid
  end

  def create_model_page!
    if self.model_page.blank?
      page = self.build_model_page

      doc = nil
      if S3_CONFIG[:storage] == 's3'
        doc = Nokogiri::HTML(open(self.template_url));
      else
        doc = Nokogiri::HTML(open(File.join(Rails.root, 'public', self.template_url)));
      end
      doc_body = doc.xpath('/html/body')
      body_class = doc_body.attr('class').content

      style_body = get_style_hash_from_doc_item(doc_body)
      page_height = style_body['height'].present? ? style_body['height'] : '600px'
      page_width = style_body['width'].present? ? style_body['width'] : '800px'

      page.title = self.title
      page.layout_kind = self.kind
      page.data = HashWithIndifferentAccess.new
      page.data[:class] = body_class
      page.data[:css] = HashWithIndifferentAccess.new
      page.data[:css][:width] = page_height
      page.data[:css][:height] =  page_width

      doc_body.children.each do |doc_item|
        if doc_item.class == Nokogiri::XML::Element
          case doc_item.node_name
            when 'div'
              item = build_default_item(page, doc_item)
              item.data[:tag] = 'div'
              if doc_item.attr('data-placeholder').present? && doc_item.attr('data-placeholder') == "true"
                inner_html = Item.sanitize_html_to_serialize(doc_item.inner_html)
                item.data[:innerHTMLPlaceholder] = inner_html
                item.data[:class] += " empty"
              else
                item.inner_html = inner_html
                item.data[:innerHTMLPlaceholder] = ""
              end
              if doc_item['data-item-type'] == 'text'
                item.media_type = 'text'
              else
                item.media_type = 'widget'
              end
              item.data = item.data.to_yaml
            when 'img'
              item = build_default_item(page, doc_item)
              item.data[:tag] = 'img'
              src = doc_item.attr('src')
              path = ""
              unless src.start_with? "http://"
                path = self.theme.attachment_root_url
              end
              item.data[:src] = path + src
              item.media_type = 'image'
              if doc_item.attr('data-placeholder').present? && doc_item.attr('data-placeholder') == "true"
                item.data[:is_placeholder] = "true"
              end
            when 'iframe'
              item = build_default_item(page, doc_item)
              item.data[:tag] = 'iframe'
              item.data[:src] = doc_item.attr('src')
              item.media_type = 'iframe'
            when 'object'
              item = build_default_item(page, doc_item)
              if doc_item.attr('type') == 'video/vimeo' || doc_item.attr('type') == 'video/youtube'
                media = Medias::Widget.find_by_system_name(doc_item.attr('type').split(/\//)[1])
                item.data[:preference][:url] = doc_item.attr('data')
              else # application/wd-app
                media = Medias::Widget.find_by_uuid(doc_item.attr('data'))
              end
              item.media_id = media.uuid
              item.media_type = 'widget'
              for object_item in doc_item.children
                if object_item == 'param'
                  if object_item.attr('name').present? && object_item.attr('value').present?
                    item.data[:preference][object_item.attr('name')] = object_item.attr('value')
                  end
                end
              end
            when 'svg'
              for svg_item in doc_item.children
                if svg_item.node_name == 'polyline'
                  item = build_default_item(page, doc_item)
                  item.data[:css] = HashWithIndifferentAccess.new
                  item.data[:css][:zIndex] = "2000"
                  item.data[:tag] = 'polyline'
                  item.data[:stroke] = doc_item.attr('stroke')
                  item.data[:strokeWidth] = doc_item.attr('strokeWidth')
                  item.data[:points] = doc_item.attr('points')
                  item.media_type = 'drawing'
                end
              end
          end
        end
      end

      page.touch_document_active = false
      self.save!
    end
    
    true
  end

  def get_style_hash_from_doc_item(doc_item)
    hash = HashWithIndifferentAccess.new
    if doc_item.attr('style').present?
      doc_item.attr('style').content.split(/;/).each do |s|
        css_rule = s.split(/:/)
        css_key = css_rule[0].strip.chomp
        css_val = css_rule[1].strip.chomp
        hash[css_key] = css_val
      end
    end
    hash
  end

  def default_item_data_form_doc_item(doc_item)
    hash = HashWithIndifferentAccess.new
    css_hash = get_style_hash_from_doc_item(doc_item)
    classes = []
    classes.concat(doc_item.attr('class').split(' ')) if doc_item.attr('class').present?
    hash[:css] = css_hash if css_hash.present? 
    hash[:class] = classes.select { |class_name| !(class_name =~ /layout_*./)}.join(' ')
    hash[:wrapClass] = classes.select { |class_name| class_name =~ /layout_*./}.join(' ')
    hash[:preference] = HashWithIndifferentAccess.new
    hash[:preference][:rails_empty] = 'dummy'
    hash
  end

  def build_default_item(page, doc_item)
    item = page.items.build
    item.kind = doc_item.attr('data-item-kind') if doc_item.attr('data-item-kind').present?
    item.data = default_item_data_form_doc_item(doc_item)
    item
  end

end



# == Schema Information
#
# Table name: layouts
#
#  uuid          :string(255)     default(""), not null, primary key
#  title         :string(255)
#  thumbnail_url :string(255)
#  theme_id      :string(36)
#  model_page_id :string(36)
#  template_url  :string(255)
#  kind          :string(255)
#

