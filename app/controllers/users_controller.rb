class UsersController < ApplicationController

  # access_control do
  #   allow logged_in, :except => [:index]
  #   allow :admin, :to => [:index]
  # end
  
  # GET /users
  def index
    @users = User.all
  end
  
  # GET /users/:id
  def show
    @user = User.find(params[:id])
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
    authorize! :read, Document
    respond_to do |format|
      format.html do
        set_return_to
      end
      format.json do
        per_page = 20
        @documents = Document.not_deleted_with_filter(current_user, params[:document_filter], params[:query], params[:page], per_page)
        render :json => {
          :documents => @documents.map{ |d| d.as_application_json },
          :pagination => {
            :per_page => per_page,
            :current_page => @documents.current_page,
            :total_pages => @documents.total_pages,
            :next_page => @documents.next_page,
            :previous_page => @documents.previous_page,
            :total => @documents.total_entries
          }
        }
      end
    end
  end
  
end