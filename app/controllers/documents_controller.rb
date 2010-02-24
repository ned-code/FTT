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
    @documents = Document.all_with_filter(current_user, params[:document_filter])
    
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
  
end