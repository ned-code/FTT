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
  
  # GET /documents
  def index
    @documents = Document.get_documents(current_user, params[:document_filter])
    
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