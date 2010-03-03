class DocumentsController < DocumentController
  before_filter :load_document, :only => [:show, :update, :destroy]
  
  access_control do
    allow :admin
    allow logged_in, :to => [:index, :create]
    allow :editor, :of => :document, :to => [:update, :destroy]
    action :show do
      allow :reader, :of => :document
      allow :editor, :of => :document
      allow all, :if => :document_is_public?
    end
  end
  
  # GET /documents
  def index
    per_page = 20
    @documents = Document.all_with_filter(current_user, params[:document_filter], params[:page], per_page)
    
    respond_to do |format|
      format.html
      format.json { render :json => { 
        :documents => @documents,
        :pagination => {
          :per_page => per_page,
          :current_page => @documents.current_page,
          :total_pages => @documents.total_pages, 
          :next_page => @documents.next_page,
          :previous_page => @documents.previous_page,
          :total => @documents.total_entries }
        }
      } 
      
    end
  end
  
  # GET /documents/:id
  def show
      @editor_mode = current_user.has_role?("editor", @document)
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