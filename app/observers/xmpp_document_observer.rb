class XmppDocumentObserver < ActiveRecord::Observer
  observe :document

  def after_create(document)
    XmppNotification.xmpp_create_node(document.uuid)  
  end

end
