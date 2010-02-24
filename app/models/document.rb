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
  
  def self.all_with_filter(current_user, document_filter)
    documents_ids = []
    #TODO need to optimize document filtering by doing it in a single SQL query
      if document_filter
        # Filter possibilities: editor, reader
        # Retrieve documents for the current user and the global user
        current_user.role_objects.all(:select => 'authorizable_id', :conditions => {:name => document_filter}).each do |role|
          documents_ids << role.authorizable_id if role.authorizable_id
        end
        
        # On shared as editor and shared as viewer filter, must remove owned documents
        if document_filter != 'owner'
          owner_ids = []
          current_user.role_objects.all(:select => 'authorizable_id', :conditions => {:name => 'owner'}).each do |role|
          owner_ids << role.authorizable_id
        end
        # Diff of both arrays
        documents_ids = documents_ids - owner_ids
      end
      documents = Document.find_all_by_id(documents_ids)
      else
        if (!current_user.has_role?("superAdmin"))
          roles = current_user.role_objects.all.each do |role|
            documents_ids << role.authorizable_id
          end
          documents = Document.find_all_by_id(documents_ids)
        else
          documents = Document.all
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
    result = { :access => [] }
    all_document_access.each do |role|
      role.users.each do |user|
        user_infos = [:id => user.id, :username => user.username, :email => user.email, :role => role.name]
        result[:access] << user_infos
      end
    end
    result
  end
  
  def update_accesses(accesses = {})
    accesses_parsed = JSON.parse(accesses);
    readers = accesses_parsed['readers']
    editors = accesses_parsed['editors']
    # Get accesses on document
    all_document_access = self.accepted_roles
    all_document_access.each do |role|
      role.users.each do |user|
        if editors.include?(user.id)
          user.add_editor_role(self)
        elsif readers.include?(user.id)
          user.add_reader_role(self)
        else
          user.has_no_roles_for!(self)
        end
      end
    end
  end
  
  def create_accesses(accesses = {})
    accesses_parsed = JSON.parse(accesses);
    readers = accesses_parsed['readers']
    editors = accesses_parsed['editors']
    readers.each do |user_email|
      user = User.find_by_email(user_email)
      user.add_reader_role(self) if user
    end
    editors.each do |user_email|
      user = User.find_by_email(user_email)
      user.add_editor_role(self) if user
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
#

