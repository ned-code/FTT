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
    discussion_hash = @discussion.as_application_json
    message = discussion_hash
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @discussion.page.document.uuid)
    respond_to do |format|
      if @discussion.save
        format.json { render :json => discussion_hash }
      else
        format.json { render :json => discussion_hash, :status => 203 }
      end
    end
  end
  
  def update
    @discussion.update_attributes!(params[:discussion])
    discussion_hash = @discussion.as_application_json
    message = discussion_hash
    message[:source] = params[:xmpp_client_id]
    @@xmpp_notifier.xmpp_notify(message.to_json, @discussion.page.document.uuid)
    render :json => discussion_hash
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
    if params[:page_id].present?
      @pseudo_document = Document.first(:joins => :pages,
                                        :conditions => ['pages.uuid = ?', params[:page_id]],
                                        :select => 'documents.uuid, documents.is_public')
    elsif params[:discussion].present? && params[:discussion][:page_id].present?
      @pseudo_document = Document.first(:joins => :pages,
                                        :conditions => ['pages.uuid = ?', params[:discussion][:page_id]],
                                        :select => 'documents.uuid, documents.is_public' )
    elsif @discussion.present?
      @pseudo_document = Document.first(:joins => { :pages => :discussions },
                                        :conditions => ['discussions.uuid = ?', @discussion.uuid],
                                        :select => 'documents.uuid, documents.is_public')
    end
  end

  def current_user_is_discussion_owner
    if current_user.present? && @discussion.present? && @discussion.user_id.present? && current_user.uuid == @discussion.user_id
      return true
    end
    return false
  end
  
end
