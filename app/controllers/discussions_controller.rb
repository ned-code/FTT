class DiscussionsController < ApplicationController

  before_filter :find_discussion
  before_filter :find_document

  access_control do
    action :index, :create do
      allow all, :if => :document_is_public?
      allow :editor, :of => :pseudo_document
    end
    actions :update, :destroy do
      allow all, :if => :current_user_is_discussion_owner      
      allow :editor, :of => :pseudo_document
    end
    allow :admin    
  end
  
  def index
    raise 'no params id' if params[:page_id].blank?
    
    if params[:page_id].present?
      @discussions = Page.find_by_uuid(params[:page_id]).discussions.not_deleted.all(:include => { :comments => :user },
                                                                                     :conditions => ['comments.deleted_at IS ?', nil],
                                                                                     :order => 'discussions.created_at DESC, comments.created_at ASC')
    end

    respond_to do |format|
      format.json do
        @as_json_discussions = @discussions.map{ |d| d.as_application_json }
        render :json => @as_json_discussions
      end
    end    
  end  

  def create
    @discussion = current_user.discussions.new_with_uuid(params[:discussion])
    message = @discussion.as_application_json
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @discussion.page.document.uuid)
    respond_to do |format|
      if @discussion.save
        format.json { render :json => @discussion }
      else
        format.json { render :json => @discussion, :status => 203 }
      end
    end
  end
  
  def update
    @discussion.update_attributes!(params[:discussion])
    message = @discussion.as_application_json
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @discussion.page.document.uuid)
    render :json => @discussion
  end

  def destroy
    @discussion.safe_delete!
    message = { :source => params[:xmpp_client_id], :discussion =>  { :page_id => @discussion.page.id, :uuid => @discussion.uuid }, :action => "delete" }
    @@xmpp_notifier.xmpp_notify(message.to_json, @discussion.page.document.uuid)
    render :json => {}
  end

  private

  def find_discussion
    @discussion = Discussion.find_by_uuid(params[:id]) if params[:id]    
  end

  def find_document
    if params[:page_id]
      @pseudo_document = Document.find_by_sql("select do.uuid, do.is_public from documents do, pages pa where pa.uuid = '#{params[:page_id]}' and pa.document_id = do.uuid;").first
    elsif params[:discussion].present? && params[:discussion][:page_id].present?
      @pseudo_document = Document.find_by_sql("select do.uuid, do.is_public from documents do, pages pa where pa.uuid = '#{params[:discussion][:page_id]}' and pa.document_id = do.uuid;").first
    elsif @discussion.present?
      @pseudo_document = Document.find_by_sql("select do.uuid, do.is_public from documents do, pages pa, discussions di where di.uuid = '#{@discussion.uuid}' and di.page_id = pa.uuid and pa.document_id = do.uuid;").first  
    end
  end

  def current_user_is_discussion_owner
    if current_user.present? && @discussion.present? && @discussion.user_id.present? && current_user.uuid == @discussion.user_id
      return true
    end
    return false
  end
  
end
