class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => :create
  skip_before_filter :process_invitation
  
  def index
    @invitations = current_user.invitations
  end
  
  def new
    @invitation = Invitation.new
  end
  def create
    if params[:invitation].present?
      Invitation.generate(current_user, params[:invitation])
    end
    respond_to do |format|
      format.json { render :json => {} }
      format.html { redirect_to invitations_path }
    end
    
  end

  def destroy
    @invitation = Invitation.where( :uuid => params[:id]).first
    @invitation.destroy
    flash[:notice] = 'Invitation removed'    
    redirect_to invitations_path
  end
end
