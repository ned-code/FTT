class Layout < ActiveRecord::Base

  has_uuid

  attr_accessible :uuid, :name, :thumbnail_url  

  # ================
  # = Associations =
  # ================
  
  belongs_to :theme
  belongs_to :model_page, :class_name => "Page", :foreign_key => "model_page_id", :dependent => :delete
  has_many :pages

  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :thumbnail_url

  # ====================
  # = Instance Methods =
  # ====================

  def to_param
    uuid
  end

  def create_model_page!
    if self.model_page.blank?
      page = self.build_model_page

      doc = Nokogiri::HTML(open(self.template_url));
      doc_body = doc.xpath('/html/body')
      body_class = doc_body.attr('class').content

      style_body = get_style_hash_from_doc_item(doc_body)
      page_height = style_body['height'].present? ? style_body['height'] : '600px'
      page_width = style_body['width'].present? ? style_body['width'] : '800px'

      page.title = self.name
      page.data = { :class => body_class, :css => { :width => page_height, :height =>  page_width } }

      doc_body.children.each do |doc_item|
        if doc_item.class == Nokogiri::XML::Element
          case doc_item.node_name
            when 'div'
              item = page.items.build
              item.data = default_item_data_form_doc_item(doc_item)
              item.data[:tag] = 'div'
              if doc_item.attr('data-placeholder').present? && doc_item.attr('data-placeholder') == "true"
                item.data[:innerHTML] = ""
                item.data[:innerHTMLPlaceholder] = doc_item.inner_html
              else
                item.data[:innerHTML] = doc_item.inner_html
                item.data[:innerHTMLPlaceholder] = ""
              end
              item.data[:innerHTML] = doc_item.inner_html
              if doc_item['data-item-type'] == 'text'
                item.media_type = 'text'
              else
                item.media_type = 'widget'
              end
              item.data = item.data.to_yaml
            when 'img'
              item = page.items.build
              item.data = default_item_data_form_doc_item(doc_item)
              item.data[:tag] = 'img'
              item.data[:src] = doc_item.attr('src')
              item.media_type = 'image'
            when 'iframe'
              item = page.items.build
              item.data = default_item_data_form_doc_item(doc_item)
              item.data[:tag] = 'iframe'
              item.data[:src] = doc_item.attr('src')
              item.media_type = 'iframe'
            when 'object'
              case doc_item.attr('type')
                when 'video/youtube' || 'video/vimeo'
                  media = Medias::Widget.find_by_system_name(doc_item.attr('type').split(/\//)[1])
                  item = page.items.build
                  item.media_id = media.id
                  item.data = default_item_data_form_doc_item(doc_item)
                  item.data[:preference] = { :url => doc_item.attr('data') }
                  item.media_type = 'widget'
                when 'application/wd-app'
                  # media = Medias::Widget.find_by_uuid(doc_item.attr('data'))
                  # item = page.items.build
                  # item.media_id = media.id
                  # item.data = default_item_data_form_doc_item(doc_item)
                  # item.media_type = 'widget'
              end

            when 'svg'
              for svg_item in doc_item.children
                if svg_item.node_name == 'polyline'
                  item = page.items.build
                  item.data = default_item_data_form_doc_item(doc_item)
                  item.data[:css] = { :zIndex => "2000" }
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
    hash = Hash.new
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

  def get_params_hash_form_doc_item(doc_item)

    
  end

  def default_item_data_form_doc_item(doc_item)
    {
      :css => get_style_hash_from_doc_item(doc_item),
      :class => doc_item.attr('class'),
      :preference => { :rails_empty => 'dummy' }
    }
  end

end

# == Schema Information
#
# Table name: layouts
#
#  id            :integer(4)      not null, primary key
#  uuid          :string(255)
#  name          :string(255)
#  thumbnail_url :string(255)
#  theme_id      :integer(4)
#  model_page_id :integer(4)
#

