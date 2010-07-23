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
        @documents = Document.not_deleted_with_filter(current_user, params[:document_filter], params[:query], params[:page], per_page)
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
        public_documents = Document.not_deleted_public_paginated_with_explore_params(params[:main_filter], params[:category_filter], params[:query], params[:page], per_page)

        docs_json = public_documents.map do |doc|
          cached_doc = Rails.cache.fetch("document_#{doc.uuid}_explore") do
            doc.as_explore_json
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
        featured_documents = Document.not_deleted_featured_paginated(params[:page], per_page)
        docs_json = featured_documents.map do |doc|
          cached_doc = Rails.cache.fetch("document_#{doc.uuid}_explore") do
            doc.as_explore_json
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
    if params[:_escaped_fragment_]
      # used to respond to the google robot, see: http://www.google.com/support/webmasters/bin/answer.py?hlrm=en&answer=174992
      # we do it in document controller because we don't want any redirect.
      @page = Page.find_by_uuid(params[:_escaped_fragment_])
      @items = @page.items.not_deleted.all(:conditions => [ 'media_type != ?', 'drawing'])
      @drawing_items = @page.items.not_deleted.all(:conditions => [ :media_type => 'drawing'])
      @text_items = @page.items.not_deleted.all(:conditions => { :media_type => 'text'})
      render :action => :static_page, :layout => 'static', :content_type => 'image/svg+xml' and return
    end
    if @document.present?
      respond_to do |format|
        format.html do
          @get_return_to = get_return_to 
          render :layout => 'layouts/editor'      
        end
        format.json do
          logger.debug "return document json."
          set_cache_buster
          render :json => Rails.cache.fetch("document_#{@document.uuid}") {
            @document.as_application_json
          }
        end
      end
    else
      render_optional_error_file(:not_found)
    end    
  end
  
  # POST /documents
  def create
    @document = current_user.documents.create_with_uuid(params[:document])
    @@xmpp_notifier.xmpp_create_node(@document.uuid) 
    render :json => @document
  end

  # POST /documents/:id/duplicate
  def duplicate
    @new_document = @document.deep_clone_and_save!(current_user, params[:title])
    render :json => @new_document.to_json(:only => :uuid)
  end
  
  # PUT /documents/:id
  def update
    @document.update_attributes(params[:document])
    message = @document.as_json({})
    message[:source] = params[:xmpp_client_id]    
    @@xmpp_notifier.xmpp_notify(message.to_json, @document.uuid)    
    render :json => @document
  end
  
  # DELETE /documents/:id
  def destroy
    @document.safe_delete!
    render :json => {}
  end
  
  protected
  
  def instantiate_document
    @document = Document.not_deleted.find_by_uuid(params[:id])
  end
  
  def authenticate_if_needed
    authenticate_user! unless document_is_public?
  end
  
  def create_view_count
    if request.format == "text/html" && @document
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