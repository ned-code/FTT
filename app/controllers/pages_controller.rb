class PagesController < DocumentController
  before_filter :instantiate_document, :instantiate_page
  before_filter :authenticate_user!, :except => [:show, :callback_thumbnail]
  before_filter :authenticate_if_needed, :only => [:show, :callback_thumbnail]
  access_control do
    actions :index, :show do
      allow all, :if => :document_is_public?
    end
    action :show, :callback_thumbnail do
      allow all, :if => :has_valid_secure_token?
    end
    allow :editor, :of => :document    
    allow :admin    
  end
  
  # GET /documents/:document_id/pages
  def index
    render :json => @document.pages.not_deleted
  end
  
  # GET /documents/:document_id/pages/:id
  def show
    @page ||= @document.pages.not_deleted.find_by_uuid_or_position!(params[:id])
    respond_to do |format|
      format.html do
        render :layout => "layouts/static_page"
      end
      format.json do
        render :json => @page.to_json(:include => :items)
      end
    end
  end
  
  # POST /documents/:document_id/pages
  def create
    deep_notify = params[:page][:items_attributes].present?
    @page = @document.pages.new_with_uuid(params[:page])
    @page.save!
    options = {};
    options[:include] = :items if deep_notify
    message = @page.as_json(options)
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @page.document.uuid)     
    if (params[:page][:items_attributes].present?)
      render :json => @page.to_json(:include => :items)
    else
      render :json => @page
    end
  end
  
  # PUT /documents/:document_id/pages/:id
  def update
    deep_notify = params[:page][:items_attributes].present?
    @page = @document.pages.not_deleted.find_by_uuid(params[:id])
    @page.update_attributes!(params[:page])
    # TODO JBA seems that update atribute does not refresh nested attributes so we need to refresh
    @page.reload
    options = {};
    options[:include] = :items if deep_notify
    message = @page.as_json(options)
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @page.document.uuid)    
    if (deep_notify)
      render :json => @page.to_json(:include => :items)
    else
      render :json => @page
    end
  end
  
  # DELETE /documents/:document_id/pages/:id
  def destroy
    @page = @document.pages.not_deleted.find_by_uuid(params[:id])
    if @page.present?
      @page.safe_delete!
      message = { :source => params[:xmpp_client_id], :page =>  { :uuid => @page.uuid }, :action => "delete" }
      @@xmpp_notifier.xmpp_notify(message.to_json, @document.uuid)
    end
    render :json => {}
  end

  def callback_thumbnail
    Services::Bluga.recieve(params)
    render :text => ''
  end
  
private

  def instantiate_page
    @page = @document.pages.find_by_uuid(params[:id])
  end
  
  def authenticate_if_needed
    authenticate_user! unless has_valid_secure_token?
  end

  def has_valid_secure_token?
    return false if params[:secure_token].blank?
    id = params[:id]
    id = params[:page_id] if id.length < 36 
    @page ||= Page.first(:conditions => ['uuid = ? && thumbnail_secure_token = ?', id, params[:secure_token]])
    if @page.present?
      return true
    else
      return false
    end
  end
  
end