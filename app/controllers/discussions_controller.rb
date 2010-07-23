class DiscussionsController < ApplicationController

  before_filter :find_discussion
  before_filter :find_document

  access_control do
    allow :admin
    action :index, :create do
      allow all, :if => :document_is_public?
      allow :reader, :of => :document
      allow :editor, :of => :document
    end
    actions :update, :destroy do
      allow all, :if => :current_user_is_discussion_owner      
      allow :editor, :of => :document
    end
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
      @document = Page.find_by_uuid(params[:page_id]).document
    elsif params[:discussion].present? && params[:discussion][:page_id].present?
      @document = Page.find_by_uuid(params[:discussion][:page_id]).document
    elsif @discussion.present?
      @document = @discussion.page.document  
    end
  end

  def current_user_is_discussion_owner
    if current_user.present? && @discussion.present? && @discussion.user_id.present? && current_user.uuid == @discussion.user_id
      return true
    end
    return false
  end

end
