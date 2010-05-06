class XmppPageObserver < ActiveRecord::Observer
  observe :page

  def after_update(page)
    if page.must_notify && page.document.present?
      page_attributes = page.attributes
      message = { :source => xmpp_client_id, :page =>  page_attributes}
      XmppNotification.xmpp_notify(message.to_json, page.document.uuid)
    end
  end

  def after_create(page)
    if page.must_notify && page.document.present?
      #TODO nedd to find a nicer solution for merging json
      message = { :source => xmpp_client_id }
      json_result = page.to_json(:include => :items)
      message.merge!(JSON.parse(json_result))
      XmppNotification.xmpp_notify(message.to_json, page.document.uuid)
    end
  end

  def after_destroy(page)
    if (page.must_notify)
      message = { :source => xmpp_client_id, :page =>  { :uuid => page.uuid }, :action => "delete" }
      XmppNotification.xmpp_notify(message.to_json, page.document.uuid)
    end
  end

end
