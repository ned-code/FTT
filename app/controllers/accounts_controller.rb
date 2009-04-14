class AccountsController < ApplicationController

  def index
    @accounts = Account.all
  end

  def show
    if params[:id]
      @account = Account.find(params[:id])
    else
      @account = current_account
    end
  end

  def new
    @account = Account.new
  end

  def create
    @account = Account.new(params[:account])
    
    if @account.save
      flash[:notice] = I18n.t 'flash.notice.account_registred'
      redirect_to accounts_url
    else
      render :action => :new
    end
  end

#  def invitation
#    @account = Account.find_using_perishable_token(params[:code])
#
#    unless @account
#      flash[:notice] = I18n.t 'flash.not_find_account_by_perishable_token'
#      redirect_to new_session_url
#    end
#
#    @account.activate!
#    reset_session
#    AccountSession.create(@account)
#  end

  def edit
    if params[:id]
      @account = Account.find(params[:id])
    else
      @account = current_account
    end
  end

  def update
    if params[:id]
      @account = Account.find(params[:id])
    else
      @account = current_account
    end
    
    if @account.update_attributes(params[:account])
      flash[:notice] = I18n.t 'flash.notice.account_updated'

      if params[:id]
        redirect_to accounts_url
      else
        redirect_to edit_account_url
      end
    else
      render :action => :edit
    end
  end

end
