class XmppDocumentObserver < ActiveRecord::Observer
  observe :document

  def after_create(document)
    XmppNotification.xmpp_create_node(document.uuid)  
  end
  
  def after_update(document)
    if (document.must_notify)    
      message = { :source => xmpp_client_id, :document =>  document.attributes }
      XmppNotification.xmpp_notify(message.to_json, document.uuid)
    end
  end

end
