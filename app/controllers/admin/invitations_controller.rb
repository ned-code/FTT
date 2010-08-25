class Admin::InvitationsController < Admin::AdminController
  
  def index
    @invitations = Invitation.all
  end
  
  def new
    @invitation = Invitation.new
  end
  
  def create
    Invitation.generate(current_user, params[:invitation],true)
    redirect_to admin_invitations_path
  end
  
  def destroy
    @invitation = Invitation.where( :uuid => params[:id]).first
    @invitation.destroy
    flash[:notice] = 'Invitation removed'    
    redirect_to admin_invitations_path
  end
end