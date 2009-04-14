class AccountsController < ApplicationController

  def index
    @accounts = Account.all
    respond_to do |format|
      format.html
      format.xml { render :xml => @accounts }
    end
  end

  def show
    @account = Account.find(params[:id])
    respond_to do |format|
      format.html
      format.xml { render :xml => @account }
    end
  end

  def new
    @account = Account.new
  end

  def create
    @account = Account.new(params[:account])

    respond_to do |format|
      if @account.save
        @account.deliver_email_confirmation!
        
        format.html do
          flash[:notice] = I18n.t 'flash.notice.account_registred'
          redirect_to accounts_url
        end
        format.xml  { render :xml => @account, :status => :created, :location => @account }
      else
        format.html { render :action => 'new' }
        format.xml  { render :xml => @account.errors, :status => :unprocessable_entity }
      end
    end
  end

  def confirm
    @account = Account.find_using_perishable_token(params[:id])

    if @account and @account.activate!
      reset_session
      AccountSession.create(@account)

      flash[:notice] = I18n.t 'flash.notice.account_confirmed'
      redirect_to accounts_url
    else
      flash[:notice] = I18n.t 'flash.notice.not_find_account_by_perishable_token'
      redirect_to new_session_url
    end
  end

  def edit
    @account = Account.find(params[:id])
  end

  def update
    @account = Account.find(params[:id])

    respond_to do |format|
      if @account.update_attributes(params[:account])
        format.html do
          flash[:notice] = I18n.t 'flash.notice.account_updated'
          redirect_to accounts_url
        end
        format.xml  { head :ok }
      else
        format.html { render :action => 'edit '}
        format.xml  { render :xml => @account.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy
    @account = Account.find(params[:id])
    @account.destroy

    respond_to do |format|
      format.html do
        flash[:notice] = I18n.t 'flash.notice.account_destroyed'
        redirect_to accounts_url
      end
      format.xml { head :account_destroyed }
    end
  end
end
