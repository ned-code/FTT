class UserList < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  # ===============
  # = Validations =
  # ===============
  
  validates_presence_of :name, :user_id
  
  # ================
  # = Associations =
  # ================
  
  belongs_to :user
  has_many :user_lists_friends, :dependent => :destroy
  has_many :friendships, :through => :user_lists_friends
  has_many :roles
  
  def users
    @users ||= self.find_users
    @users
  end
  
  def find_users
    #TODO: improve the request ! this is ugly now !!!
    users = []
    users_friend_ids = []
    if self.default?
      users_friend_ids = User.joins(:default_list => {:user_lists_friends => :friendship}).where('user_lists.uuid = ?',self.id).where('friendships.status = ?',Friendship::ACCEPTED).select(:friend_id).all
    else
      users_friend_ids = User.joins(:user_lists => {:user_lists_friends => :friendship }).where('user_lists.uuid = ?',self.id).where('friendships.status = ?',Friendship::ACCEPTED).select(:friend_id).all
    end
    users = User.where('users.uuid IN (?)', users_friend_ids.map{|u| u.friend_id}).all
    users
  end
  
  def member?(user)
    users.include?(user)
  end
  
  def default?()
    self.default
  end
  
  def destroy
    return if default #prevent to destroy the default list
    super
  end
end
