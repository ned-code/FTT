class DocumentsController < DocumentController
  before_filter :authenticate_user!
  before_filter :load_document, :only => [:show, :update, :destroy]
  
  access_control do
    allow :admin
    allow logged_in, :to => [:index, :create]
    allow :editor, :of => :document, :to => [:update, :destroy]
    actions :show do
      allow :editor, :of => :document
      allow :reader, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
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
    respond_to do |format|
      format.html { render :layout => "layouts/editor" }
      format.json { render :json => @document.to_json(:include => { :pages => { :include => :items} }) }
    end
  end
  
  # POST /documents
  def create
    @document = current_user.documents.create(params[:document])
    
    render :json => @document
  end
  
  # PUT /documents/:id
  def update
    @document.update_attributes(params[:document])
    
    render :json => @document
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