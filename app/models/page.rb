module PageJsonHelper
  def self.decode_json_and_yaml(value)
    unless (value.nil?)
      begin
        return ActiveSupport::JSON.decode(value)
      rescue
        return YAML.load(value)
      end  
    end
    return nil
  end
end

class Page < ActiveRecord::Base

  has_uuid
  set_primary_key :uuid

  store_prefix = S3_CONFIG[:storage] == 's3' ? '' : 'uploads/'
  attachment_path = store_prefix+"page/thumbnail/:uuid/:basename.:extension"
  has_attached_file :thumbnail,
                    :default_url   => "/images/icon_no_thumb_page_640x480.png",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? attachment_path : ":rails_root/public/#{attachment_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{attachment_path}"
      

  attr_accessor_with_default :touch_document_active, true
  
#  serialize :data
  composed_of :data, :class_name => 'Hash', :mapping => %w(data to_json),
                         :constructor => PageJsonHelper.method(:decode_json_and_yaml),
                         :converter   => PageJsonHelper.method(:decode_json_and_yaml)  
  
  # see XmppPageObserver
  attr_accessor_with_default :must_notify, false
  attr_accessor_with_default :deep_notify, false

  attr_accessor :remote_thumbnail_url

  attr_accessible :uuid, :position, :version, :data, :title, :items_attributes, :layout_kind, :remote_thumbnail_url, :thumbnail_need_update

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
    thumbnail.url
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

  def touch_and_need_update_thumbnail

    if (!thumbnail_need_update)
      update_attributes!({
              :thumbnail_need_update => 1
      })
    end
    touch_document
  end

  def self.process_pending_thumbnails
    self.cleanup_old_requests
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

  def self.cleanup_old_requests
    old_requests = Page.all(
            :conditions => [
                    'thumbnail_secure_token IS NOT ? AND thumbnail_need_update = ? AND thumbnail_request_at IS NOT ? AND thumbnail_request_at < ?',
            nil, true, nil, (Time.now-30.minutes).utc])
    if old_requests.present?
      old_requests.each do |page|
        page.thumbnail_secure_token = nil
        page.thumbnail_request_at = nil
        page.save!
      end
    end
  end

  def generate_and_set_thumbnail_secure_token
    self.thumbnail_secure_token = UUID::generate
  end
  
  def items_attributes=(params={})
    params.each_value do |item_hash|
      self.items << Item.new_with_uuid(item_hash)
    end
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
      default_css = { 'width' => document.formated_size['width'], 'height' => document.formated_size['height'] }
      if (self.data)
        self.data['css'] ||= default_css
      else
        self.data = { 'css' =>  default_css }
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
    self.document.invalidate_cache if self.document.present? && touch_document_active == true
  end
  
end




# == Schema Information
#
# Table name: pages
#
#  uuid                   :string(36)      default(""), not null, primary key
#  document_id            :string(36)
#  thumbnail_id           :string(36)
#  position               :integer(4)      not null
#  version                :integer(4)      default(1), not null
#  data                   :text(16777215)
#  created_at             :datetime
#  updated_at             :datetime
#  title                  :string(255)     default("undefined")
#  layout_kind            :string(255)
#  thumbnail_file_name    :string(255)
#  thumbnail_need_update  :boolean(1)
#  thumbnail_secure_token :string(36)
#  thumbnail_request_at   :datetime
#

