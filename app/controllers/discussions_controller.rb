class DiscussionsController < ApplicationController

  def index
    
  end  

  def create
    @discussion = Discussion.new(params[:discussion])
    @discussion.uuid = params[:discussion][:uuid]

    respond_to do |format|
      if @discussion.save
        format.json { render :json => @discussion }
      else
        format.json { render :json => @discussion, :status => 203 }
      end
    end
  end

  def destroy

  end

end
