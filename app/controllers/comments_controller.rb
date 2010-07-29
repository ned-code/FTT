class CommentsController < ApplicationController

  before_filter :find_discussion
  before_filter :find_document
  before_filter :find_comment, :only => [:destroy]

  access_control do
    action :create do
      allow all, :if => :document_is_public?
      allow :editor, :of => :pseudo_document
    end
    action :destroy do
      allow all, :if => :current_user_is_comment_owner
      allow :editor, :of => :pseudo_document
    end
    allow :admin    
  end

  def create
    @comment = current_user.comments.new_with_uuid(params[:comment])
    respond_to do |format|
      if @discussion.present? && @comment.save
        @json_comment = @comment.as_application_json
        message = @json_comment
        message[:source] = params[:xmpp_client_id]
        @@xmpp_notifier.xmpp_notify(message.to_json, @comment.discussion.page.document.uuid)
        format.json { render :json => @json_comment }
      else
        format.json { render :json => @json_comment, :status => 203 }
      end
    end
  end

  def destroy
    @comment.safe_delete!
    message = { :source => params[:xmpp_client_id], :comment =>  { :discussion_id => @comment.discussion.id, :uuid => @comment.uuid }, :action => "delete" }
    @@xmpp_notifier.xmpp_notify(message.to_json, @comment.discussion.page.document.uuid)
    render :json => {}
  end

  private

  def find_discussion
    @discussion = Discussion.find_by_uuid(params[:discussion_id])
  end

  def find_comment
    @comment = @discussion.comments.find_by_uuid(params[:id])
  end

  def find_document
    @pseudo_document = Document.first(:joins => { :pages => :discussions },
                                      :conditions => ['discussions.uuid = ?', params[:discussion_id]],
                                      :select => 'documents.uuid, documents.is_public' )
  end

  def current_user_is_comment_owner
    if current_user.present? && @comment.present? && @comment.user_id.present? && current_user.uuid == @comment.user_id
      return true
    end
    return false
  end
  
end
