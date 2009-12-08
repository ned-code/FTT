class ApplicationController < ActionController::Base
  include AuthenticatedSystem
  rescue_from Acl9::AccessDenied, :with => :deny_access

  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  helper :all
  helper_method :current_session, :current_user
  filter_parameter_logging :password, :password_confirmation
  
protected
  
  def deny_access
    render_optional_error_file(:not_found)
  end 
  
  def global_user
    @user ||= User.find_by_name("All")
  end
  
  def public_document?
    public_read_document? || public_edit_document?
  end
  def public_read_document?
    global_user.has_role?("reader",@document)
  end
      
  def public_edit_document?
    global_user.has_role?("editor",@document)
  end  
  
  def xmpp_notify(message)
    begin
    jid = "server@webdoc"
    pass = "1234"
    client = Jabber::Client.new(jid)
    client.connect "localhost"
    begin
      client.auth(pass)
      pubsubjid="pubsub.webdoc" 
      service=Jabber::PubSub::ServiceHelper.new(client,pubsubjid)
      item = Jabber::PubSub::Item.new 
      message=Jabber::Message.new(nil,message) 
      item.add(message) 
      service.publish_item_to(@page.document_id,item)    
    ensure
      client.close
    end
  rescue Exception => e
    logger.warn "XMPP server is down. Collaboration is disabled #{e}"
  end
  end
end