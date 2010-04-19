class DocumentsController < ApplicationController
  before_filter :instantiate_document, :only => [:show, :update, :duplicate, :destroy]
  before_filter :authenticate_if_needed, :only => [:show]
  before_filter :authenticate_user!, :only => [:index]
  after_filter :create_view_count, :only => :show
  
  access_control do
    allow :admin
    allow logged_in, :to => [:index, :create, :duplicate]
    allow :editor, :of => :document, :to => [:update, :destroy]
    action :show do
      allow all, :if => :document_is_public?
      allow :reader, :of => :document
      allow :editor, :of => :document      
    end
  end
  
  # GET /documents
  def index    
    respond_to do |format|
      format.html
      format.json {
        per_page = 20
        @documents = Document.all_with_filter(current_user, params[:document_filter], params[:page], per_page)
        render :json => { 
          :documents => @documents,
          :pagination => {
            :per_page => per_page,
            :current_page => @documents.current_page,
            :total_pages => @documents.total_pages, 
            :next_page => @documents.next_page,
            :previous_page => @documents.previous_page,
            :total => @documents.total_entries
          }
        }
      }
    end
  end
  
  # GET /documents/:id
  def show
    respond_to do |format|
      format.html { render :layout => "layouts/editor" }
      format.json do
        set_cache_buster

        render :json => Rails.cache.fetch(@document.cache_key) { @document.to_json(:include => { :pages => { :include => :items} }) }
      end
    end
  end
  
  # POST /documents
  def create
    @document = current_user.documents.create(params[:document])
    
    render :json => @document
  end

  # POST /documents/:id/duplicate
  def duplicate
    @new_document = @document.deep_clone_and_save!(current_user)
    render :json => @new_document.to_json(:only => :uuid)
  end
  
  # PUT /documents/:id
  def update
    @document.update_attributes(params[:document])
    
    render :json => @document
  end
  
  # DELETE /documents/:id
  def destroy
    @document.destroy
    
    render :json => {}
  end
  
  protected
  
  def instantiate_document
    @document = Document.find_by_uuid(params[:id])     
  end
  
  def authenticate_if_needed
    authenticate_user! unless document_is_public?
  end
  
  def create_view_count
    if (request.format() === "text/html")
      @document.view_counts.create(
        :session_id => request.session_options[:id],
        :ip_address => request.remote_ip,
        :user_id    => current_user.try(:id)
      )
    end
  end
  
end