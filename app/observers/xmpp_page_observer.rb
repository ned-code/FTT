class XmppPageObserver < ActiveRecord::Observer
  observe :page

  def after_update(page)
    publish_page_message(page)
  end

  def after_create(page)
    publish_page_message(page)
  end

  def after_destroy(page)
    if (page.must_notify)
      message = { :source => xmpp_client_id, :page =>  { :uuid => page.uuid }, :action => "delete" }
      XmppNotification.xmpp_notify(message.to_json, page.document.uuid)
    end
  end
  
private

  def publish_page_message(page) 
    if page.must_notify && page.document.present?    
      page.reload
      options = {};
      options[:include] = :items if page.deep_notify
      message = page.as_json(options)
      message[:source] = xmpp_client_id
      XmppNotification.xmpp_notify(message.to_json, page.document.uuid)
    end
  end

end
