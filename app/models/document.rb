class Document < ActiveRecord::Base
  has_uuid
  acts_as_authorization_object
  
  attr_accessible :uuid, :title, :description, :size, :category_id, :is_public
  
  serialize :size
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC', :dependent => :destroy
  has_many :view_counts, :as => :viewable
  has_one :document_access
  belongs_to :metadata_media, :class_name => 'Media'
  belongs_to :creator, :class_name => 'User'
  belongs_to :category
  
  # ===============
  # = Validations =
  # ===============
  
  # =============
  # = Callbacks =
  # =============
  
  before_create :create_default_page
  after_create :set_creator_as_editor
  
  # =================
  # = Class Methods =
  # =================
  
  def self.all_with_filter(current_user, document_filter, pageId, per_page)
    documents_ids = []
    if document_filter
      # Filter possibilities: reader, editor, creator, public
      if document_filter == 'creator'
        return current_user.documents.paginate(:page => pageId, :per_page => per_page, :order => 'created_at DESC')
      elsif document_filter == 'public'
        return Document.paginate(:page => pageId, :per_page => per_page, :conditions => { :is_public => true }, :order => 'created_at DESC' )
      else
        # Retrieve documents for the current user
        current_user.role_objects.all(:select => 'authorizable_id', :conditions => { :name => document_filter } ).each do |role|
          documents_ids << role.authorizable_id if role.authorizable_id
        end
        
        # Must remove owned documents
        owner_ids = []
        current_user.documents.each do |doc|
          owner_ids << doc.id
        end
        # Diff of both arrays
        documents_ids = documents_ids - owner_ids
        documents = Document.paginate(:page => pageId, :per_page => per_page, :conditions => { :id => documents_ids }, :order => 'created_at DESC' )
      end
    else
      if (!current_user.has_role?("admin"))
        roles = current_user.role_objects.all.each do |role|
          documents_ids << role.authorizable_id
        end
        documents = Document.paginate(:page => pageId, :per_page => per_page, :conditions => { :id => documents_ids }, :order => 'created_at DESC' ) 
      else
        documents = Document.paginate(:page => pageId, :per_page => per_page, :order => 'created_at DESC' )
      end
    end
    documents
  end

  def self.all_public_paginated_with_explore_params(order_string="", category_filter="all", page_id=nil, per_page=8, include=[:category, :creator])
    documents = Array.new
    paginate_params = {:page => page_id, :per_page => per_page, :include => include}

    if order_string.present? && order_string == 'viewed'
      paginate_params[:order] = 'views_count DESC'
    else
      paginate_params[:order] = 'created_at DESC'
    end

    if category_filter.present? && category_filter != "all"
      paginate_params[:conditions] = ['documents.is_public = ? AND documents.category_id = ?', true, category_filter]
    else
      paginate_params[:conditions] = ['documents.is_public = ?', true]
    end

    documents = Document.paginate(paginate_params)
  end

  def self.last_modified_from_following(current_user, limit=5)
    following_ids = current_user.following_ids
    if following_ids.present?
      all(
        :joins => "INNER JOIN roles ON roles.authorizable_id = documents.id INNER JOIN roles_users ON roles_users.role_id = roles.id",
        :conditions => ['creator_id IN (?) AND (documents.is_public = ? OR (roles.authorizable_type = ? AND (roles.name = ? OR roles.name = ?) AND roles_users.user_id = ?))',
                      following_ids,
                      true,
                      self.class_name.to_s,
                      'editor',
                      'reader',
                      current_user.id
        ],
        :limit => limit,
        :order => 'documents.updated_at DESC',
        :group => 'documents.id'
      )
    else
      []
    end
  end

  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
  end
  
  # return a Hash with width and height formated with unit
  def formated_size
    result = { :width => "800px", :height => "600px"}
    if size && size[:width] =~ /\d+%/
      result[:width] = size[:width]
    elsif size
      result[:width] = "#{size[:width].to_i.to_s}px" 
    end
    if size && size[:height] =~ /[0-9]+%/
      result[:height] = size[:height]
    elsif size
      result[:height] = "#{size[:height].to_i.to_s}px" 
    end    
    return result
  end
  
  def to_access_json
    all_document_access = self.accepted_roles
    result = { :access => [], :failed => [] }
    all_document_access.each do |role|
      role.users.each do |user|
        is_creator = (self.creator && self.creator.id == user.id)? true : false
        user_infos = [:id => user.id, :username => user.username, :email => user.email, :role => role.name, :creator => is_creator]
        result[:access] << user_infos
      end
    end
    if @unvalid_access_emails
      @unvalid_access_emails.each do |email|
        result[:failed] << email
      end
    end
    result
  end
  
  def to_user_for_this_role_json(role_name)
    role = self.accepted_roles.first(:conditions => { :name => role_name })
    result = { :access => [], :failed => [] }
    role.users.each do |user|
      is_creator = (self.creator && self.creator.id == user.id)? true : false
      user_infos = [:id => user.id, :username => user.username, :email => user.email, :creator => is_creator]
      result[:access] << user_infos
    end
    if @unvalid_access_emails
      @unvalid_access_emails.each do |email|
        result[:failed] << email
      end
    end
    result
  end
  
  # No more used in current GUI
  def create_accesses(current_user, accesses = {})
    accesses_parsed = JSON.parse(accesses);
    readers = accesses_parsed['readers']
    editors = accesses_parsed['editors']
    readers_message = accesses_parsed['readersMessage']
    editors_message = accesses_parsed['editorsMessage']
    
    readers.each do |user_email|
      user = User.find_by_email(user_email.strip)
      if user 
        if !user.has_role?("reader", self)
          user.has_only_reader_role!(self)
          Notifier.deliver_role_notification(current_user, "reader", user, self, readers_message)
        end
      else
        add_unvalid_email_to_array(user_email)
      end
    end
    editors.each do |user_email|
      user = User.find_by_email(user_email)
      if user
        if !user.has_role?("editor", self)
          user.has_only_editor_role!(self)
          Notifier.deliver_role_notification(current_user, "editor", user, self, editors_message)
        end
      else
        add_unvalid_email_to_array(user_email)
      end
    end
  end
  
  def create_role_for_users(current_user, accesses = {})
    accesses_parsed = JSON.parse(accesses);
    role = accesses_parsed['role']
    recipients = accesses_parsed['recipients']
    message = accesses_parsed['message']
    
    recipients.each do |user_email|
      user = User.find_by_email(user_email.strip)
      if user 
        if !user.has_role?(role, self)
          #user.has_only_reader_role!(self)
          user.has_role!(role, self)
          Notifier.deliver_role_notification(current_user, role, user, self, message)
        end
      else
        add_unvalid_email_to_array(user_email)
      end
    end
  end
  
  # No more used in current GUI
  def update_accesses(current_user, accesses = {})
    accesses_parsed = JSON.parse(accesses);
    readers = accesses_parsed['readers']
    editors = accesses_parsed['editors']
    # Get accesses on document
    all_document_access = self.accepted_roles
    all_document_access.each do |role|
      role.users.each do |user|
        if editors.include?(user.id)
          if !user.has_role?("editor", self)
            user.has_only_editor_role!(self)
            Notifier.deliver_role_notification(current_user, "editor", user, self, nil)
          end
        elsif readers.include?(user.id)
          if !user.has_role?("reader", self)
            user.has_only_reader_role!(self)
            Notifier.deliver_role_notification(current_user, "reader", user, self, nil)
          end
        else
          user.has_no_roles_for!(self)
          Notifier.deliver_no_role_notification(current_user, user, self)
        end
      end
    end
  end 
  
  def remove_role(current_user, params)
    params_parsed = JSON.parse(params)
    user = User.find(params_parsed['user_id'])
    role = params_parsed['role']
    if user
      user.has_no_role!(role, self)
      Notifier.deliver_removed_role_notification(current_user, role, user, self)
    end
  end

  def deep_clone(creator)
    cloned_document = self.clone
    cloned_document.uuid = nil
    cloned_document.created_at = nil
    cloned_document.updated_at = nil
    cloned_document.is_public = false
    cloned_document.creator = creator
    cloned_document.title = "Copy of " + self.title
    self.pages.each do |page|
      cloned_document.pages << page.deep_clone
    end
    cloned_document
  end

  def deep_clone_and_save!(creator)
    cloned_document = nil
    self.transaction do
      cloned_document = self.deep_clone(creator)
      cloned_document.save!
      # TODO In version 2.3.6, there is a reset_counters(id, *counters) which do the next line properly
      # but this function don't exist in 2.3.5
      Document.connection.update("UPDATE `documents` SET `views_count` = #{cloned_document.view_counts.count} WHERE `id` = #{cloned_document.id}")
    end
    cloned_document
  end
  
private
  
  # after_create
  def set_creator_as_editor
    accepts_role!("editor", creator) if creator
  end
  
  # before_create
  def create_default_page
    pages.build if pages.size == 0
  end
  
  def add_unvalid_email_to_array(email)
    @unvalid_access_emails ||= []
    @unvalid_access_emails << email
  end
  
end

# == Schema Information
#
# Table name: documents
#
#  id          :integer         not null, primary key
#  uuid        :string(36)
#  title       :string(255)
#  deleted_at  :datetime
#  created_at  :datetime
#  updated_at  :datetime
#  description :text
#  size        :text
#  category_id :integer
#  creator_id  :integer
#  is_public   :boolean         default(FALSE)
#  views_count :integer         default(0)
#

