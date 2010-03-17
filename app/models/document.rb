class Document < ActiveRecord::Base
  has_uuid
  acts_as_authorization_object
  
  serialize :size
  
  # ================
  # = Associations =
  # ================
  
  has_many :pages, :order => 'position ASC', :dependent => :destroy
  has_one :document_access
  belongs_to :metadata_media, :class_name => 'Media'
  belongs_to :creator, :class_name => 'User'
  
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
  
  # ====================
  # = Instance Methods =
  # ====================
  
  def to_param
    uuid
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
  def create_accesses(accesses = {})
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
          Notifier.deliver_role_notification("reader", user, self, readers_message)
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
          Notifier.deliver_role_notification("editor", user, self, editors_message)
        end
      else
        add_unvalid_email_to_array(user_email)
      end
    end
  end
  
  def create_role_for_users(accesses = {})
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
          Notifier.deliver_role_notification(role, user, self, message)
        end
      else
        add_unvalid_email_to_array(user_email)
      end
    end
  end
  
  # No more used in current GUI
  def update_accesses(accesses = {})
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
            Notifier.deliver_role_notification("editor", user, self, nil)
          end
        elsif readers.include?(user.id)
          if !user.has_role?("reader", self)
            user.has_only_reader_role!(self)
            Notifier.deliver_role_notification("reader", user, self, nil)
          end
        else
          user.has_no_roles_for!(self)
          Notifier.deliver_no_role_notification(user, self)
        end
      end
    end
  end 
  
  def remove_role(params)
    params_parsed = JSON.parse(params)
    user = User.find(params_parsed['user_id'])
    role = params_parsed['role']
    if user
      user.has_no_role!(role, self)
      Notifier.deliver_removed_role_notification(role, user, self)
    end
  end
  
private
  
  # after_create
  def set_creator_as_editor
    accepts_role!("editor", creator)
  end
  
  # before_create
  def create_default_page
    pages.build
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
#

