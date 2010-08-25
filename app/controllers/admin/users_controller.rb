class Admin::UsersController < Admin::AdminController

  # GET /admin/users
  def index
    @users = User.all

    respond_to do |format|
      format.html
    end
  end

end