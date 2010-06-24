require "xmpp_notification"

class Page < ActiveRecord::Base

  has_uuid
  set_primary_key :uuid

  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"page/thumbnail/:uuid/:basename.:extension"
  has_attached_file :thumbnail,
                    :default_url   => "",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"
      

  attr_accessor_with_default :touch_document_active, true
  
  serialize :data
  
  # see XmppPageObserver
  attr_accessor_with_default :must_notify, false
  attr_accessor_with_default :deep_notify, false

  attr_accessor :remote_thumbnail_url

  attr_accessible :uuid, :position, :version, :data, :title, :items_attributes, :layout_kind, :remote_thumbnail_url

  # ================
  # = Associations =
  # ================
  
  has_many :items, :dependent => :delete_all
  belongs_to :document
  # belongs_to :thumbnail, :class_name => "Medias::Thumbnail"
  
  # should be placed after associations declaration
  accepts_nested_attributes_for :items, :allow_destroy => true
  
  # ==========
  # = Scopes =
  # ==========
  
  default_scope :order => "position ASC"
  
  # ===============
  # = Validations =
  # ===============

  # =============
  # = Callbacks =
  # =============

  before_validation :download_image_provided_by_remote_thumbnail_url
  before_save :update_position_if_moved
  before_save :set_page_data
  before_create :set_position
  after_save :touch_document
  after_destroy :update_next_page_position, :touch_document

  # =================
  # = Class Methods =
  # =================
  
  def self.find_by_uuid_or_position!(attr)
    if attr =~ /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/
      find_by_uuid!(attr)
    else
      find_by_position!(attr.to_i - 1)
    end
  end
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def next
    Page.first(
      :conditions => ['position > ? AND document_id = ?', position, document_id],
      :order      => 'position ASC'
    )
  end
  
  def previous
    Page.first(
      :conditions => ['position < ? AND document_id = ?', position, document_id],
      :order      => 'position DESC'
    )
  end
  
  def thumbnail_url
    thumbnail.try(:url) || "/images/no_thumb.jpg"
  end
  
  def to_param
    uuid
  end

  def deep_clone
    cloned_page = self.clone
    cloned_page.touch_document_active = false
    cloned_page.uuid = nil
    cloned_page.created_at = nil
    cloned_page.updated_at = nil
    self.items.each do |item|
      cloned_page.items << item.deep_clone
    end
    cloned_page
  end

  def touch
    update_attribute("updated_at", Time.now)
  end

  def touch_and_need_update_thumbnail
    update_attributes({
            :updated_at => Time.now,
            :thumbnail_need_update => true
    })
  end

  def self.process_pending_thumbnails
    pages = Page.all_need_process_thumbnail
    if pages.present?
      thumbnail_service = Services::Bluga.new
      pages.each do |page|
        thumbnail_service.process_page(page)
      end
    end
  end

  def self.all_need_process_thumbnail
    self.all(
      :conditions => ['thumbnail_secure_token IS ? AND thumbnail_need_update = ?', nil, true]
    )
  end

  def generate_and_set_thumbnail_secure_token
    self.thumbnail_secure_token = UUID::generate
  end
  
  private
  
  # before_save
  def update_position_if_moved
    if (!self.new_record? && self.position_was != self.position)
      logger.debug("must change page position")
      if (self.position < self.position_was)
        Page.update_all("position = position + 1", "position < #{self.position_was.to_i} and position >= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")        
      else
        Page.update_all("position = position - 1", "position > #{self.position_was.to_i} and position <= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")                
      end
    end
  end
  
  # before_save
  def set_page_data
    if document.present?
      default_css = { :width => document.formated_size[:width], :height => document.formated_size[:height] }
      if (self.data)
        self.data[:css] ||= default_css
      else
        self.data = { :css =>  default_css }
      end
    end
  end

  def download_image_provided_by_remote_thumbnail_url
    require 'open-uri'
    if remote_thumbnail_url.present?
      io = open(URI.parse(remote_thumbnail_url))
      def io.original_filename; base_uri.path.split('/').last; end
      self.thumbnail = io
    end
  end
  
  # before_create
  def set_position
    self.position ||= document.nil? ? 0 : document.pages.count
    #update following pages
    Page.update_all("position = position + 1", "position >= #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end
  
  # after_destroy
  def update_next_page_position
    Page.update_all("position = position - 1", "position > #{self.position.to_i} and uuid <> '#{self.uuid}' and document_id = '#{self.document_id}'")
  end

  # after_save
  # after_destroy
  def touch_document
    self.document.touch if self.document.present? && touch_document_active == true
  end
  
end



# == Schema Information
#
# Table name: pages
#
#  uuid         :string(36)      primary key
#  document_id  :string(36)
#  thumbnail_id :string(36)
#  position     :integer(4)      not null
#  version      :integer(4)      default(1), not null
#  data         :text(16777215)
#  created_at   :datetime
#  updated_at   :datetime
#  title        :string(255)     default("undefined")
#  layout_kind  :string(255)
#

