class Document < ActiveRecord::Base
  has_uuid
  set_primary_key :uuid
  
  attr_accessible :uuid, :title, :description, :size, :category_id, :style_url, :theme_id, :featured 
  
  composed_of :size, :class_name => 'Hash', :mapping => %w(size to_json),
                     :constructor => JsonHelper.method(:decode_json_and_yaml)
  
  # ================
  # = Scope =
  # ================
  
  scope :valid, :conditions => ['documents.deleted_at IS ?', nil]
  scope :not_deleted, :conditions => ['documents.deleted_at IS ?', nil]
  scope :deleted, :conditions => ['documents.deleted_at IS NOT ?', nil]
  scope :public, lambda{
    joins(:roles).
    where('roles.item_id is ? and roles.user_id is ? and roles.user_list_id is ? and roles.name in (?)',nil,nil,nil,Role::PUBLIC_ROLES)
  }
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC'
  has_many :view_counts, :as => :viewable
  has_many :roles
  # has_one :document_access
  
  belongs_to :metadata_media, :class_name => 'Media'
  belongs_to :creator, :class_name => 'User'
  belongs_to :category
  belongs_to :theme
  
  # ===============
  # = Validations =
  # ===============
  validates_numericality_of :featured

  # =============
  # = Callbacks =
  # =============

  before_update :validate_size
  before_create :set_default_theme
  before_create :create_default_page
  before_create :validate_size
  after_create :set_creator_as_editor
  after_save :refresh_cache
  after_destroy :refresh_cache
  
  # =================
  # = Class Methods =
  # =================
  
  
  #We want to be sure that we create a document with a size
  #TODO Remove this hack !
  def self.create_with_uuid(params)
    if params['size'].nil?
      params['size'] = { 'width' => '800px', 'height' => '600px'}
      params[:width] = '800px'
      params[:height] = '600px'
    end
    super
  end
  
  #
  # This method invalidate cache for docment with document_uuid. It is usefull to invalidate a document without fetching it and just using the uuid.
  #
  def self.invalidate_cache(document_uuid)
    Rails.cache.delete("document_#{document_uuid}")
    Rails.cache.delete("document_#{document_uuid}_explore")
  end
  
  def self.not_deleted_with_filter(current_user, document_filter, query, page_id, per_page)
    documents = Array.new
    paginate_params = {
            :page => page_id,
            :per_page => per_page,
            :order => 'created_at DESC'
    }
    conditions = ['(documents.title LIKE ? OR documents.description LIKE ?)', "%#{query}%", "%#{query}%"]
    if document_filter
      # Filter possibilities: reader, editor, creator, public
      if document_filter == 'creator'
        conditions[0] += ' AND documents.creator_id = ?'
        conditions << current_user.uuid
      else
        # Retrieve documents for the current user
        documents_ids = Array.new
        current_user.roles.all(:select => 'document_id', :conditions => { :name => document_filter } ).each do |role|
          documents_ids << role.document_id if role.document_id
        end
        # Must remove owned documents
        owner_ids = []
        current_user.documents.each do |doc|
          owner_ids << doc.uuid
        end
        # Diff of both arrays
        documents_ids = documents_ids - owner_ids
        conditions[0] += ' AND documents.uuid IN (?)'
        conditions << documents_ids
      end
    else
      if (!current_user.has_role?("admin"))
        documents_ids = Array.new
        roles = current_user.roles.all.each do |role|
          documents_ids << role.document_id
        end
        conditions[0] += ' AND documents.uuid IN (?)'
        conditions << documents_ids
      end
    end
    
    if document_filter == 'public'
      Document.not_deleted.public.where(conditions).paginate(paginate_params)
    else
      Document.not_deleted.where(conditions).paginate(paginate_params)
    end
  end

  def self.not_deleted_public_paginated_with_explore_params(order_string="", category_filter="all", query="", page_id=nil, per_page=8, include=[:category, :creator])
    paginate_params = {
            :page => page_id,
            :per_page => per_page,
            :include => include,
            :conditions => ['(documents.title LIKE ? OR documents.description LIKE ?)', "%#{query}%", "%#{query}%"],
            :order => 'created_at DESC'
    }

    if order_string.present? && order_string == 'viewed'
      paginate_params[:order] = 'views_count DESC'
    end

    if category_filter.present? && category_filter != "all"
      paginate_params[:conditions][0] += ' AND documents.category_id = ?'
      paginate_params[:conditions] << category_filter
    end

    Document.not_deleted.public.paginate(paginate_params)
  end

  #not more used with friends
  # def self.last_modified_not_deleted_from_following(current_user, limit=5)
  #   following_ids = current_user.following_ids
  #   if following_ids.present?
  #     all(
  #       :joins => "INNER JOIN roles ON roles.authorizable_id = documents.uuid INNER JOIN roles_users ON roles_users.role_id = roles.uuid",
  #       :conditions => ['creator_id IN (?) AND documents.deleted_at IS ? AND (documents.is_public = ? OR (roles.authorizable_type = ? AND roles.name IN (?) AND roles_users.user_id = ?))',
  #                     following_ids,
  #                     nil,
  #                     true,
  #                     self.class_name.to_s,
  #                     [ 'editor', 'reader' ],
  #                     current_user.uuid
  #       ],
  #       :limit => limit,
  #       :order => 'documents.updated_at DESC',
  #       :group => 'documents.uuid'
  #     )
  #   else
  #     []
  #   end
  # end
  
  def self.not_deleted_featured_paginated(page_id=nil, per_page=8, include=[:category, :creator])
    paginate_params = {:page => page_id, :per_page => per_page, :include => include}
    paginate_params[:order] = 'featured DESC'
    paginate_params[:conditions] = ['featured > ?', 0]
    Document.not_deleted.public.paginate(paginate_params)
  end
  
  
  # ====================
  # = Instance Methods =
  # ====================

  def invalidate_cache
    Document.invalidate_cache(self.uuid)
  end
  
  def share(with_comments=false)
    
    self.unshare #we want to be sure to remove all the single role associated with users and public
    role = Role.public.where(:document_id => self.uuid).first
    if role.nil?
      Role.create!(:document_id => self.uuid, :name => (with_comments ? Role::VIEWER_COMMENT : Role::VIEWER_ONLY))
    else
      if with_comments && role.name != Role::VIEWER_COMMENT
        role.update_attribute('name', Role::VIEWER_COMMENT)
      elsif !with_comments && role.name != Role::VIEWER_ONLY
        role.update_attribute('name', Role::VIEWER_ONLY)
      end
    end
  end
  
  def unshare
    self.roles.where('name in(?)', Role::PUBLIC_ROLES).delete_all
    self.invalidate_cache
  end
  
  def is_public?
    Role.public.where(:document_id => self.uuid).present?
  end
  
  def to_param
    self.uuid
  end

  def total_number_of_comments
    # TODO implement this
    rand(1000)
  end

  def as_application_json(options={})
    options = { :skip_pages => false, :skip_roles => false }.merge(options)

    hash = { 'document' => self.attributes }
    hash['document']['size'] = self.size
    hash['document']['is_public'] = self.is_public?

    if(options[:skip_pages] != true) 
      hash['document']['pages'] = []
      for page in self.pages.not_deleted
        hash['document']['pages'] << page.as_application_json['page']
      end
    end
    if(options[:skip_roles] != true)
      hash['document']['roles'] = []
      for role in self.roles
        hash['document']['roles'] << role.as_application_json['role']
      end
    end

    hash
  end

  def as_explore_json
    hash = self.as_application_json
    hash['document']['extra_attributes'] = self.extra_attributes
    hash
  end

  def extra_attributes
    {
      :creator_first_name => self.creator.first_name,
      :relative_created_at => self.relative_created_at,
      :category_name => self.category.present? ? self.category.name : nil,
    }
  end
  
  # return a Hash with width and height formated with unit
  def formated_size
    result = { 'width' => "800px", 'height' => "600px"}
    if size && size['width'] =~ /\d+%/
      result['width'] = size['width']
    elsif size && size['width']
      result['width'] = "#{size['width'].to_i.to_s}px" 
    end
    if size && size['height'] =~ /\d+%/
      result['height'] = size['height']
    elsif size && size['width']
      result['height'] = "#{size['height'].to_i.to_s}px" 
    end    
    return result
  end
  
  def to_access_json
    all_document_access = self.roles
    result = { :access => [], :list_access => [], :failed => [] }
    all_document_access.each do |role|
      if role.user_id.present?
        p 'acces by user'
        user = role.user
        is_creator = (self.creator && self.creator.uuid == role.user.uuid)? true : false
        user_infos = {:uuid => user.uuid, :username => user.username, :email => user.email, :role => role.name, :creator => is_creator}
        result[:access] << user_infos
      elsif role.user_list_id.present?
        p "to_access_json user list"
        p role.user_list.users
        user_list = role.user_list
        result[:list_access] << {:uuid => user_list.uuid, :name => user_list.name, :role => role.name}
      elsif role.user_id.blank? && role.user_list_id.blank?
        result[:public] = role.name
      end
    end
    if @unvalid_access_emails
      @unvalid_access_emails.each do |email|
        result[:failed] << email
      end
    end
    p result
    result
  end

  def create_role_for_users(current_user, accesses = {})
    role = accesses[:role]
    if Role::PUBLIC_ROLES.include?(role)
      #if we give public right to a single user, it means that the document is no more public anymore
      self.unshare # already invalidate_cache in this method
    else
      self.invalidate_cache
    end
    
    friends_list = accesses[:users]
    if friends_list.nil? || friends_list.empty?
      return false
    end
    friends_list.each do |friend_uuid|
      user = User.where(:uuid => friend_uuid).first
      user.has_role!(role,self)
      Notifier.add_role_notification(current_user, role, user, self).deliver
      #TODO notifiy inside webdoc
    end
  end

  def remove_role(current_user, params)
    params_parsed = JSON.parse(params)
    user = User.find(params_parsed['user_id'])
    role = params_parsed['role']
    if user
      user.has_no_role!(role, self)
      Notifier.removed_role_notification(current_user, role, user, self).deliver
      self.invalidate_cache
      #todo notify inside webdoc
    end
  end
  
  #Actually we look only on the user and public right, not list right
  def public_editor?
    self.find_public_roles && self.find_public_roles.include?(Role::EDITOR)
  end
  
  def public_contributor?
    self.find_public_roles && self.find_public_roles.include?(Role::CONTRIBUTOR)
  end
  
  def public_viewer_comment?
    self.find_public_roles && self.find_public_roles.include?(Role::VIEWER_COMMENT)
  end
  
  def public_viewer_only?
    self.find_public_roles && self.find_public_roles.include?(Role::VIEWER_ONLY)
  end
  
  def user_editor?(user)
    if self.find_user_roles(user) && self.find_user_roles(user).include?(Role::EDITOR)
      return true
    else    
      if self.find_user_lists_roles.present? && self.user_lists_roles_as_hash[Role::EDITOR].present?
        #We make the intersection between the lists where the user is member and the lists where the doc is assigned
        return (user.friends_user_lists.map{ |ul| ul.uuid } & self.user_lists_roles_as_hash[Role::EDITOR]).length > 0
      else
        return false
      end
    end
  end
  
  def user_contributor?(user)
    if self.find_user_roles(user) && self.find_user_roles(user).include?(Role::CONTRIBUTOR)
      return true
    else    
      if self.find_user_lists_roles.present? && self.user_lists_roles_as_hash[Role::CONTRIBUTOR].present?
        return (user.friends_user_lists.map{ |ul| ul.uuid } & self.user_lists_roles_as_hash[Role::CONTRIBUTOR]).length > 0
      else
        return false
      end
    end
  end
  
  def user_viewer_comment?(user)
    if self.find_user_roles(user) && self.find_user_roles(user).include?(Role::VIEWER_COMMENT)
      return true
    else    
      if self.find_user_lists_roles.present? && self.user_lists_roles_as_hash[Role::VIEWER_COMMENT].present?
        return (user.friends_user_lists.map{ |ul| ul.uuid } & self.user_lists_roles_as_hash[Role::VIEWER_COMMENT]).length > 0
      else
        return false
      end
    end
  end
  
  def user_viewer_only?(user)
    if self.find_user_roles(user) && self.find_user_roles(user).include?(Role::VIEWER_ONLY)
      return true
    else    
      if self.find_user_lists_roles.present? && self.user_lists_roles_as_hash[Role::VIEWER_ONLY].present?
        return (user.friends_user_lists.map{ |ul| ul.uuid } & self.user_lists_roles_as_hash[Role::VIEWER_ONLY]).length > 0
      else
        return false
      end
    end
  end

  def find_public_roles
    @public_roles_names ||= find_roles.select{ |r| r.user_id.blank? && r.user_list_id.blank? }.map{ |r| r.name }
  end
  
  def find_user_roles(user)
    @user_roles_names ||= find_roles.select{ |r| r.user_id.present? && r.user_list_id.blank? }.map{ |r| r.name }
  end
  
  def find_user_lists_roles
    @user_lists_roles ||= find_roles.select{ |r| r.user_id.blank? && r.user_list_id.present?}
  end
  
  def user_lists_roles_as_hash
    user_lists_roles_names_hash = {  Role::EDITOR => [],
                                Role::CONTRIBUTOR => [],
                                Role::VIEWER_COMMENT => [],
                                Role::VIEWER_ONLY => []
                                }
    self.find_user_lists_roles.each do |r|
      user_lists_roles_names_hash[r.name] << r.user_list_id
    end
    user_lists_roles_names_hash
  end

  def find_roles
    @roles ||= self.roles
  end
  
  def creator?(user)
    user == self.creator
  end
  
  def deep_clone(creator, title)
    cloned_document = self.clone
    cloned_document.uuid = nil
    cloned_document.theme_id = self.theme_id
    cloned_document.style_url = self.style_url
    cloned_document.created_at = nil
    cloned_document.updated_at = nil
    cloned_document.creator = creator
    if title.present?
      cloned_document.title = title
    else
      cloned_document.title = "Copy of " + self.title
    end
    self.pages.each do |page|
      cloned_document.pages << page.deep_clone
    end
    cloned_document
  end

  def deep_clone_and_save!(creator, title)
    cloned_document = nil
    self.transaction do
      cloned_document = self.deep_clone(creator, title)
      cloned_document.save!
      # TODO In version 2.3.6, there is a reset_counters(id, *counters) which do the next line properly
      # but this function don't exist in 2.3.5
      Document.connection.update("UPDATE `documents` SET `views_count` = #{cloned_document.view_counts.count} WHERE `uuid` = '#{cloned_document.uuid}'")
    end
    cloned_document
  end
 
  def safe_delete!
    super
    refresh_cache
  end
  
  #returns an array of all document's editors
  def  editors
    #TODO: manage the list
    users = User.joins(:roles).where('roles.document_id = ? AND roles.name = ?', self.id, Role::EDITOR).all
    users
  end
  
private
  
  # after_create
  def set_creator_as_editor
    Role.create!(:document_id => self.id, :user_id => creator_id, :name => Role::EDITOR)
  end
  
  #before_create
  def set_default_theme
    if theme_id.nil?
      theme = Theme.default
      self.theme_id = theme.id
      self.style_url = theme.style_url
    end
  end
  
  # before_create
  def create_default_page
    pages.build if pages.size == 0
  end

  # before_create
  def validate_size    
    if size.blank? || size == 'null' || size['height'].blank? || size['width'].blank? || size['width'] == '0' || size['height'] == '0'
      errors.add(:size, "Error in size of document")
      false
    else
      true
    end
  end
  
  #after_save
  #after_destroy
  def refresh_cache
    Document.invalidate_cache(self.uuid)  
  end
end



# == Schema Information
#
# Table name: documents
#
#  uuid        :string(36)      primary key
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  size        :text
#  category_id :string(36)
#  creator_id  :string(36)
#  views_count :integer(4)      default(0)
#  theme_id    :string(36)
#  style_url   :string(255)
#  featured    :integer(4)      default(0)
#

