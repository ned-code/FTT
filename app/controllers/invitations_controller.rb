class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => :create
  
  def index
    @invitations = current_user.invitations
  end
  
  def create
    Invitation.generate(current_user, params[:invitations])
    render :json => {}
  end
end
