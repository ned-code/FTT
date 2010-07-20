class DiscussionsController < ApplicationController

  before_filter :find_discussion, :only => [:update, :destroy]

  # access_control do
  #   allow :admin
  #   allow logged_in, :to => [:index, :create, :duplicate]
  #   allow :editor, :of => :document, :to => [:update, :destroy]
  #   action :index do
  #     allow all, :if => :document_is_public?
  #     allow :reader, :of => :document
  #     allow :editor, :of => :document
  #   end
  # end
  
  def index
    raise 'no params id' if params[:page_id].blank?
    
    if params[:page_id].present?
      @discussions = Page.find_by_uuid(params[:page_id]).discussions.not_deleted.all(:include => { :comments => :user },
                                                                                     :conditions => ['comments.deleted_at IS ?', nil],
                                                                                     :order => 'discussions.created_at DESC, comments.created_at DESC')
    end

    respond_to do |format|
      format.json do

        @as_json_discussions = @discussions.map{ |d| d.as_json(:include => { :comments => { :include => { :user => { :methods => :avatar_thumb_url } } }}) }

        render :json => @as_json_discussions
      end
    end    
  end  

  def create
    @discussion = Discussion.new_with_uuid(params[:discussion])

    respond_to do |format|
      if @discussion.save
        format.json { render :json => @discussion }
      else
        format.json { render :json => @discussion, :status => 203 }
      end
    end
  end
  
  def update
    @discussion.update_attributes(params[:discussion])
    render :json => @discussion
  end

  def destroy
    @discussion.safe_delete!
    render :json => {}
  end

  private

  def find_discussion
    @discussion = Discussion.find_by_uuid(params[:id])    
  end

end
