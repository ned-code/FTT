class UsersController < ApplicationController
  
  # GET /users
  def index
    @users = User.all
  end
  
  # GET /users/:id
  def show
  	#TODO manage if there is any documents for users
    @user = User.find(params[:id])
    @more_author_documents = @user.documents
    category_id = @user.documents.first.nil? ? 1 : @user.documents.first.category_id
    @related_documents = Document.all(:conditions => { :category_id => category_id}, :limit => 12 )
    @document = @user.documents.pop
    
    if @document.nil?
    	@document = Document.first
    end

    respond_to do |format|
      format.html
      format.json { render :json => @user.to_social_panel_json(current_user) }
    end
  end
  
  def favorites
    @user = current_user
    respond_to do |format|
      format.html { render :layout => false}
    end
  end

  def dashboard
    set_return_to
  end
  
end