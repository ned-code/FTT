require 'xmpp_user_synch'

class User < ActiveRecord::Base
  set_primary_key :uuid
  acts_as_authorization_subject

  avatars_path = "uploads/user/avatar/:id/:cw_style:basename.:extension"
  has_attached_file :avatar,
                    :styles => { :thumb=> "128x128#" },
                    :default_url   => "/images/thumb_icon_no_photo_128x128.png",
                    :storage => S3_CONFIG[:storage].to_sym,
                    :s3_credentials => S3_CONFIG,
                    :bucket => S3_CONFIG[:assets_bucket],
                    :path => S3_CONFIG[:storage] == 's3' ? avatars_path : ":rails_root/public/#{avatars_path}",
                    :url => S3_CONFIG[:storage] == 's3' ? ":s3_domain_url" : "/#{avatars_path}"

  validates_attachment_size :avatar,
                            :less_than => 1.megabytes,
                            :unless => Proc.new {|user| user.avatar }

  validates_attachment_content_type :avatar,
                                    :content_type => ['image/jpeg', 'image/png', 'image/gif'],
                                    :unless => Proc.new {|user| user.avatar }

  has_uuid
  # Include default devise modules.
  # Others available are :lockable, :timeoutable and :activatable.
  devise :registerable, :database_authenticatable, :confirmable, :recoverable, :rememberable, :trackable, :validatable, :lockable

  attr_accessor :terms_of_service
  attr_accessor :clear_avatar

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :username, :first_name, :last_name, :terms_of_service,
                  :bio, :website, :gender, :uuid, :avatar, :clear_avatar

  # =============
  # = Callbacks =
  # =============

  validate :must_be_allowed_email, :on => :create
  before_save :check_clear_avatar
  after_create :create_xmpp_user, :notify_administrators

  # ===============
  # = Validations =
  # ===============

  validates_presence_of :username, :first_name, :last_name
  validates_acceptance_of :terms_of_service, :on => :create
  validates_uniqueness_of :uuid

  # ================
  # = Associations =
  # ================

  has_many :images, :class_name => 'Medias::Image', :order => 'created_at DESC'
  has_many :videos, :class_name => 'Medias::Video', :order => 'created_at DESC'
  has_many :documents, :foreign_key => :creator_id
  has_many :following_connections, :class_name => 'Followship', :foreign_key => 'follower_id'
  has_many :follower_connections, :class_name => 'Followship', :foreign_key => 'following_id'
  has_many :following, :through => :following_connections
  has_many :followers, :through => :follower_connections
  has_many :datastore_entries
  has_many :discussions
  has_many :comments

  # ===================
  # = Instance Method =
  # ===================

  def name
    first_name ? "#{first_name} #{last_name}" : username
  end

  def documents_count
    documents.count
  end

  def mutual_connection(user)
    self.mutual_follower?(user)
  end

  def has_only_editor_role!(document, message = nil)
    if !self.has_role?("editor", document)
      self.has_no_roles_for!(document)
      self.has_role!("editor", document)
    end
  end

  def has_only_reader_role!(document, message = nil)
    if !self.has_role?("reader", document)
      self.has_no_roles_for!(document)
      self.has_role!("reader", document)
    end
  end

  def follow(user_id)
    following_connections.create(:following_id => user_id)
  end

  def unfollow(user_id)
    following_connections.destroy(following_connections.find_by_following_id(user_id))
  end

  def follower?(user)
    followers.include?(user)
  end

  def following?(user)
    following.include?(user)
  end

  def mutual_follower?(user)
    following.include?(user) and followers.include?(user)
  end

  def mutual_followers
    mutual = []
    following.each do |user|
      mutual << user if followers.include?(user)
    end
    mutual
  end

  def avatar_thumb_url
    self.avatar.url(:thumb)
  end

  def as_application_json
    hash = { 'user' => self.attributes }
    hash['user']['avatar_thumb_url'] = self.avatar_thumb_url
    hash
  end

  # Need to use this method instead of the original to_json cause user references document and vice versa
  def to_social_panel_json(current_user)
    { :user =>
      {
        :uuid => self.uuid,
        :username => self.username,
        :bio => self.bio,
        :uuid => self.uuid,
        :avatar_thumb_url => self.avatar_thumb_url,
        :documents_count => self.documents_count,
        :following_info => self.follower?(current_user)
      }
    }.to_json
  end

  def category
    documents_count > 5 ? 'Publisher' : 'User'
  end

protected

  # after_create
  def create_xmpp_user
    XmppUserSynch.create_xmpp_user(self)
  end

  #after create. This is a temporary action until invitation has been implemented.
  def notify_administrators
    if (APP_CONFIG['notify_administrator_on_user_creation'])
      Notifier.deliver_new_user_notification(APP_CONFIG['administrator_emails'], self)
    end
  end

  # before create
  def check_clear_avatar
    avatar.clear if clear_avatar == 1.to_s
  end

  def must_be_allowed_email
    if (APP_CONFIG['must_check_user_email'])
      allowed_users = []
      begin
        allowed_users = YAML.load_file("#{Rails.root}/config/allowed_user_email.yml")
      rescue => exception
        logger.warn("cannot open file '#{Rails.root}/config/allowed_user_email.yml'. Reason: #{exception.message}")
      end
      errors.add(:email, :not_authorized_email) unless allowed_users.include? self.email
    end
  end
  
end







# == Schema Information
#
# Table name: users
#
#  email                :string(255)     not null
#  username             :string(255)     not null
#  encrypted_password   :string(255)     not null
#  password_salt        :string(255)     not null
#  confirmation_token   :string(20)
#  confirmed_at         :datetime
#  confirmation_sent_at :datetime
#  reset_password_token :string(20)
#  remember_token       :string(20)
#  remember_created_at  :datetime
#  sign_in_count        :integer(4)
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  failed_attempts      :integer(4)      default(0)
#  unlock_token         :string(20)
#  locked_at            :datetime
#  created_at           :datetime
#  updated_at           :datetime
#  first_name           :string(255)
#  last_name            :string(255)
#  avatar_file_name     :string(255)
#  bio                  :text
#  gender               :string(255)
#  website              :string(255)
#  uuid                 :string(255)     default(""), not null, primary key
#  avatar_content_type  :string(255)
#  avatar_file_size     :integer(4)
#  avatar_updated_at    :datetime
#  id                   :integer(4)
#

