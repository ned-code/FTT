class XmppItemObserver < ActiveRecord::Observer
  observe :item

  def after_update(item)
    #TODO find another solution. Currently it is the only solution I found to disable notification when 
    # item is created in the same transaction then its containing page.
    if (item.must_notify)    
      message = { :source => xmpp_client_id, :item =>  item.attributes }
      XmppNotification.xmpp_notify(message.to_json, item.page.document.uuid)
    end
  end

  def after_create(item)
    #TODO find another solution. Currently t is the only solution I found to disable notification when 
    # item is created in the same transaction then its containing page.    
    if (item.must_notify)
      message = { :source => xmpp_client_id, :item =>  item.attributes }
      if (item.page)
        XmppNotification.xmpp_notify(message.to_json, item.page.document.uuid)
      end
    end
  end

  def after_destroy(item)
    message = { :source => xmpp_client_id, :item =>  { :page_id => item.page.id, :uuid => item.uuid }, :action => "delete" }
    XmppNotification.xmpp_notify(message.to_json, item.page.document.uuid)        
  end
  
end
