class ApplicationController < ActionController::Base
  protect_from_forgery
  
  rescue_from CanCan::AccessDenied do |exception|
    flash[:notice] = exception.message
    redirect_to root_url
  end
  
  before_filter :set_first_visit_time
  before_filter :token_authenticate
  before_filter :authenticate_user!
  before_filter :set_xmpp_client_id_in_thread
  before_filter :process_invitation

  helper :all
  helper_method :current_session, :current_user
  
protected

  def forbidden_access
    render :file => "#{Rails.public_path}/403.html", :status => 403 and return
  end

  def token_authenticate
    if params[:user_token].present?
      token = Token.where(['token = ?', params[:user_token]]).first
      # TODO create a method next tests!
      if token.present? && ['images'].include?(controller_name) && ['index', 'create'].include?(action_name)
        session[:app_id] = token.application_id
        env['warden'].set_user(token.user)
        request.format = :json
      else
        render :json => {}, :status => 403 and return
      end
    else
      session[:app_id] = nil
      http_authenticate
    end
  end

  def http_authenticate
    if !['65.49.79.67', '86.57.245.87'].include?(request.remote_ip) && Rails.env != 'test' && !(controller_name == 'sessions' && action_name == 'create')
      authenticate_or_request_with_http_basic do |username, password|
        username == "wduser" && password == "wdalpha001"
      end
      # Can be removed with Rails 3: http://wiki.github.com/plataformatec/devise/devise-and-http-authentication
      warden.custom_failure! if performed?
    end
  end

  def set_xmpp_client_id_in_thread
    Thread.current[:xmpp_client_id] = params[:xmpp_client_id]
  end


  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def set_return_to(scope=nil)
    if scope == nil
      session[:return_to] = request.fullpath if request && request.get?
    else
      session[:"return_to_#{scope}"] = request.fullpath if request && request.get?
    end
  end

  def get_return_to(scope=nil)
    path = nil
    if scope == nil
      path = session[:return_to] || root_path
    else
      path = session[:"return_to_#{scope}"] || root_path
      session[:"return_to_#{scope}"] = nil
    end
    path
  end

  def document_is_public?
    if @pseudo_document.present?
      return @pseudo_document.is_public?
    end
    if @document.present?
      return @document.is_public?
    end
  end

  def set_first_visit_time
    if (!cookies[:first_visit])
      cookies[:first_visit] = Time.now.to_i
    end
  end
  
  def process_invitation
    if params[:invitation]
      invitation = Invitation.pending.where(:uuid => params[:invitation]).first
      if invitation.present?
        invitation.accept!(current_user)
        if invitation.document.present?
          redirect_to document_path(invitation.document)
        else
          redirect_to root_path
        end
      end
    end
  end

end
