class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => :create
  skip_before_filter :process_invitation
  def index
    @invitations = current_user.invitations
  end
  
  def create
    if params[:invitation].present?
      Invitation.generate(current_user, params[:invitation])
    end
    render :json => {}
  end
end
