class CommentsController < ApplicationController
  def create
    @comment = Comment.new(params[:comment])
    @comment.uuid = params[:comment][:uuid]
    @comment.user = current_user

    respond_to do |format|
      if @comment.save
        @json_comment = @comment.as_json(:include => { :user => { :methods => :avatar_thumb_url } })
        format.json { render :json => @json_comment }
      else
        format.json { render :json => @json_comment, :status => 203 }
      end
    end
  end

  def destroy

  end

  private

  def find_discussion
    @discussion = Discussion.find_by_uuid(params[:discussion_id])
  end

  def find_comment
    @comment = Comment.find_by_uuid(params[:uuid])
  end
end
