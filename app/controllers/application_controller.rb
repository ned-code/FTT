class ApplicationController < ActionController::Base

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_user_session, :current_user

  layout 'default'

  filter_parameter_logging :password, :password_confirmation

  # Override from authoriztation plugin to return Forbidden status for XML requests
  def handle_redirection_with_http_auth
    case request.format
    when Mime::XML
      if @current_user && @current_user != :false
        head :forbidden, :content_type => 'application/xml'
      else
        headers['CONTENT-TYPE'] = 'application/xml'
        request_http_basic_authentication
      end

      false  # Want to short-circuit the filters
    else
      handle_redirection_without_http_auth
    end
  end
  alias_method_chain :handle_redirection, :http_auth

  protected

  def current_user_session
    @current_user_session ||= UserSession.find
  end

  def current_user
    @current_user ||= current_user_session && current_user_session.user
  end

  def destroy_current_user_session
    current_user_session.destroy if current_user_session
    @current_user = @current_user_session = nil
  end

  def store_location
    session[:return_to] = request.request_uri
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end

  def orbited_javascript
    [
    "<script type=\"text/javascript\" src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/Orbited.js\"></script>",
    '<script type="text/javascript">',
    '  document.domain = document.domain;',
    '  var Orbited;',
    "  if (Orbited) {",
    "    Orbited.settings.port = #{APP_SETTINGS[:orbited_port]};",
    "    Orbited.settings.hostname = '#{APP_SETTINGS[:orbited_host]}';",
    '     TCPSocket = Orbited.TCPSocket;',
    '   }',
    "  var AUTH_TOKEN = \"#{protect_against_forgery? ? form_authenticity_token : ''}\";",
    "  $.ajaxSetup({data:{authenticity_token : AUTH_TOKEN}});",
    '</script>',
    "<script src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/protocols/stomp/stomp.js\"></script>"
    ].join("\n")
  end

end
