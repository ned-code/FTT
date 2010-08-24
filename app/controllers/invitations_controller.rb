class InvitationsController < ApplicationController
  before_filter :authenticate_user!, :only => :create
  def show
    @invitation = Invitation.find(params[:id])
  end
  
  def create
    Invitation.generate(current_user, params[:invitations])
    render :json => {}
  end
end
