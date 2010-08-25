class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => :create
  
  def index
    @invitations = current_user.invitations
  end
  
  def create
    if params[:invitations].present?
      Invitation.generate(current_user, params[:invitations])
    end
    render :json => {}
  end
end
