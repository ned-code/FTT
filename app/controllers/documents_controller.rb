require "xmpp_notification"

class DocumentsController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_document, :only => [:update, :destroy, :show, :change_user_access, :user_access]
  access_control do
    allow :admin
    allow :owner, :of => :document
    allow :editor, :of => :document, :to => [:show]
    allow :reader, :of => :document, :to => [:show]
    allow logged_in, :to => [:index, :create]
    allow logged_in, :to => [:show], :if => :public_document?
  end
  
  @@global_user_names = ["all", "everybody", "any", "everyone", "people"]
  
  # GET /documents
  def index
    @documents = get_documents(params[:document_filter])

    respond_to do |format|
      format.html
      format.json { render :json => @documents }      
    end
  end
  
  # GET /documents/:id
  def show
    @is_reader = (params[:reader] == "true")
    respond_to do |format|
      format.html { render :layout => "layouts/editor" }
      format.json { render :json => @document.to_json(:include => { :pages => { :include => :items} }) }
    end
  end
  
  # POST /documents
  def create
    @document = Document.new(params[:document])
    @document.save
    @document.pages.create
    current_user.has_role!("owner", @document)
    render :json => @document      
  end
  
  # PUT /documents/:id
  def update
    @document.update_attributes(params[:document])
    
    render :json => @document
  end
  
  # PUT /documents/:id/change_user_access
  def change_user_access
    accesses = JSON.parse(params[:access]);
    new_list_has_global_user = false
    accesses.each_key do |user_email|
      if @@global_user_names.include? user_email.downcase
        global_user.has_no_roles_for!(@document)        
        global_user.has_role!(accesses[user_email], @document)
        new_list_has_global_user = true
      else
        user = User.find_by_email(user_email)
        new_user_role = accesses[user_email]        
        if (user && !user.has_role?(new_user_role, @document))
          #replace previous roles on document with new roles
          user.has_no_roles_for!(@document)
          user.has_role!(new_user_role, @document)
        end
      end
    end
    @document.users.each do |user|
      unless accesses[user.email] || (new_list_has_global_user && user == global_user)
        user.has_no_roles_for!(@document)
      end
    end
    render :json => user_access_hash
  end
  
  def user_access
    @access = user_access_hash
    logger.debug @access
    respond_to do |format|
      format.html { render :partial => "document_access"}
      format.json { render :json => @access }
    end
    
  end
  
  # DELETE /document/:id
  def destroy
    @document.destroy    
    render :json => {}
  end  

protected
  def load_document
    @document = Document.find_by_uuid(params[:id])
  end
  
  def user_access_hash
    all_document_access = @document.accepted_roles
    result = { :access => {}}
    all_document_access.each do |role|
      role.users.each do |user|
        entry = nil
        if (user == global_user)
          result[:access][t("label.everybody")] = role.name
        else
          result[:access][user.email] = role.name 
        end
      end
    end
    result
  end
  
  def get_documents(document_filter)
    documents_ids = []
    #TODO need to optimize document filtering by doing it in a single SQL query
    if document_filter
       # Filter possibilities: owner, editor, reader
       # Retrieve documents for the current user and the global user
       current_user.role_objects.all(:select => 'authorizable_id', :conditions => {:name => document_filter}).each do |role|
         documents_ids << role.authorizable_id if role.authorizable_id
       end
       global_user.role_objects.all(:select => 'authorizable_id', :conditions => {:name => document_filter}).each do |role|
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
         global_user.role_objects.all.each do |role|
           documents_ids << role.authorizable_id
         end
         roles = current_user.role_objects.all.each do |role|
           documents_ids << role.authorizable_id
         end
         documents = Document.find_all_by_id(documents_ids)
       else
         documents = Document.all
       end
     end
     return documents
  end
  
end