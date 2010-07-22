class CommentsController < ApplicationController
  before_filter :find_comment, :only => [:destroy]  

  def create
    @comment = current_user.comments.new_with_uuid(params[:comment])
    respond_to do |format|
      if @comment.save
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
    @comment = Comment.find_by_uuid(params[:id])
  end
end
