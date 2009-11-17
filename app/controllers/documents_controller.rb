class DocumentsController < ApplicationController
  before_filter :login_required
  before_filter :load_document, :only => [:update, :destroy, :show, :change_user_access, :user_access]
  access_control do
    allow :admin
    allow logged_in, :to => [:index, :create]
    allow :owner, :of => :document, :to => [:update, :destroy, :show, :change_user_access, :user_access]
    allow :editor, :of => :document, :to => [:show]    
    allow :reader, :of => :document, :to => [:show]    
  end    
  
  # GET /documents
  def index
    @documents = Document.all
    if (!current_user.has_role?("admin"))
      @documents = @documents.select { |a_doc| a_doc.accepts_roles_by?(current_user)}
    end
    respond_to do |format|
      format.html
      format.json { render :json => @documents }      
    end
  end
  
  # GET /documents/:id
  def show
    @is_reader = (params[:reader] == "true")
    respond_to do |format|
      format.html
      format.json { render :json => @document.to_json(:include => { :pages => { :include => :items} }) }
    end
  end
  
  # POST /documents
  def create
    @document = Document.new(params[:document])
    @document.uuid = params[:document][:uuid]
    @document.pages.build # add default page
    @document.save
    current_user.has_role!("owner", @document);
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
    accesses.each_key do |user_email|
      user = User.find_by_email(user_email)
      new_user_role = accesses[user_email]        
      if (user && !user.has_role?(new_user_role, @document))
        #replace previous roles on document with new roles
        user.has_no_roles_for!(@document)
        user.has_role!(new_user_role, @document)
      end
    end
    @document.users.each do |user|
      unless accesses[user.email]
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
    @document = Document.find(params[:id]) 
  end
  
  def user_access_hash
    all_document_access = @document.accepted_roles
    result = { :access => {}}
    all_document_access.each do |role|
      role.users.each do |user|
        result[:access][user.email] ||= ""
        result[:access][user.email] << role.name 
      end
    end
    result
  end
end