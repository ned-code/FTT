require 'storage'
require 'xmpp_user_synch'

class User < ActiveRecord::Base
  acts_as_authorization_subject
  mount_uploader :avatar, AvatarUploader
  
  # Include default devise modules.
  # Others available are :lockable, :timeoutable and :activatable.
  devise :registerable, :authenticatable, :confirmable, :recoverable, :rememberable, :trackable, :validatable, :lockable
  
  attr_accessor :terms_of_service
  
  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :username, :first_name, :last_name, :terms_of_service,
                  :avatar, :avatar_cache, :remove_avatar, :bio, :website, :gender

  after_create :create_xmpp_user
  
  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :username, :first_name, :last_name
  validates_acceptance_of :terms_of_service, :on => :create
  
  # ================
  # = Associations =
  # ================
  
  has_many :images, :class_name => 'Medias::Image', :order => 'created_at DESC'
  has_many :videos, :class_name => 'Medias::Video', :order => 'created_at DESC'
  
  # ===================
  # = Instance Method =
  # ===================
  
  def name
    first_name ? "#{first_name} #{last_name}" : username
  end
  
  def create_xmpp_user
    XmppUserSynch.create_xmpp_user(self)
  end
  
end
# == Schema Information
#
# Table name: users
#
#  id                   :integer         not null, primary key
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
#  sign_in_count        :integer
#  current_sign_in_at   :datetime
#  last_sign_in_at      :datetime
#  current_sign_in_ip   :string(255)
#  last_sign_in_ip      :string(255)
#  failed_attempts      :integer         default(0)
#  unlock_token         :string(20)
#  locked_at            :datetime
#  created_at           :datetime
#  updated_at           :datetime
#  first_name           :string(255)
#  last_name            :string(255)
#  avatar               :string(255)
#  bio                  :text
#  gender               :string(255)
#  website              :string(255)
#

