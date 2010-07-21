class CommentsController < ApplicationController
  before_filter :find_comment, :only => [:destroy]  

  def create
    @comment = current_user.comments.new_with_uuid(params[:comment])

    respond_to do |format|
      if @comment.save
        @json_comment = @comment.as_json(:include => { :user => { :methods => :avatar_thumb_url } }, :methods => :safe_content)
        format.json { render :json => @json_comment }
      else
        format.json { render :json => @json_comment, :status => 203 }
      end
    end
  end

  def destroy
    @comment.safe_delete!
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
