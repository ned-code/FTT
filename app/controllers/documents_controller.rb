class DocumentsController < ApplicationController
  before_filter :store_url_in_session_if_user_not_logged
  # need to be authenticate for alpha release.
  # need to remove this line and add authenticate_if_nedded and authenticate for index when we want to add again public document
  before_filter :authenticate_user!
  before_filter :instantiate_document, :only => [:show, :update, :duplicate, :destroy]
  #before_filter :authenticate_if_needed, :only => [:show]
  #before_filter :authenticate_user!, :only => [:index]
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
    allow all, :to => :explore
    allow all, :to => :featured
  end
  
  # GET /documents
  def index    
    respond_to do |format|
      format.html do
        set_return_to
      end
      format.json do
        per_page = 20
        @documents = Document.all_with_filter(current_user, params[:document_filter], params[:query], params[:page], per_page)
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
      end
    end
  end

  # GET /documents/explore
  def explore
    respond_to do |format|
      format.html do
        set_return_to
      end
      format.json do
        per_page = 8
        public_documents = Document.all_public_paginated_with_explore_params(params[:main_filter], params[:category_filter], params[:query], params[:page], per_page)

        docs_json = public_documents.map do |doc|
          cached_doc = Rails.cache.fetch("#{doc.cache_key}_explore") do
            doc.as_json( :include => { :pages => { :methods => :thumbnail_url, :include => :items } }, :methods => :extra_attributes)
          end
        end
        
        render :json => {
          :documents => docs_json,
          :pagination => {
            :per_page => per_page,
            :current_page => public_documents.current_page,
            :total_pages => public_documents.total_pages,
            :next_page => public_documents.next_page,
            :previous_page => public_documents.previous_page,
            :total => public_documents.total_entries
          }
        }
      end
    end
  end
  
  #Get /documents/featured
  def featured
    respond_to do |format|
      format.html do
        set_return_to
      end
      format.json do
        per_page = 8
        featured_documents = Document.all_featured_paginated(params[:page], per_page)
        docs_json = featured_documents.map do |doc|
          cached_doc = Rails.cache.fetch("#{doc.cache_key}_explore") do
            doc.as_json( :include => { :pages => { :methods => :thumbnail_url,  :include => :items} }, :methods => :extra_attributes)
          end
        end

        render :json => {
          :documents => docs_json,
          :pagination => {
            :per_page => per_page,
            :current_page => featured_documents.current_page,
            :total_pages => featured_documents.total_pages,
            :next_page => featured_documents.next_page,
            :previous_page => featured_documents.previous_page,
            :total => featured_documents.total_entries
          }
        }
      end
    end

  end
  
  # GET /documents/:id
  def show
    respond_to do |format|
      format.html do
        @get_return_to = get_return_to 
        render :layout => 'layouts/editor'
      end
      format.json do
        logger.debug "return document json."
        set_cache_buster
        render :json => Rails.cache.fetch(@document.cache_key) { @document.to_json(:include => { :pages => { :include => :items} }) }
      end
    end
  end
  
  # POST /documents
  def create
    @document = current_user.documents.create_with_uuid(params[:document])
    
    render :json => @document
  end

  # POST /documents/:id/duplicate
  def duplicate
    @new_document = @document.deep_clone_and_save!(current_user, params[:title])
    render :json => @new_document.to_json(:only => :uuid)
  end
  
  # PUT /documents/:id
  def update
    @document.must_notify = true;
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
    if request.format == "text/html"
      @document.view_counts.create(
        :session_id => request.session_options[:id],
        :ip_address => request.remote_ip,
        :user_id    => current_user.try(:id)
      )
    end
  end

  def store_url_in_session_if_user_not_logged
    if current_user.blank? && params[:action] == 'show' && params[:format] != 'json'
      set_return_to('document')
    end
  end
  
end