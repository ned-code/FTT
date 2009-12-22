require "xmpp4r" 
require "xmpp4r/pubsub"

module XmppHelper
  
  def xmpp_create_node(node_name)
    begin
      #TODO get all xmpp connection paramas from config file
      jid = "server@webdoc.com"
      pass = "1234"
      client = Jabber::Client.new(jid)
      client.connect "localhost"
      begin
        client.auth(pass)
        pubsubjid="pubsub.webdoc.com" 
        service=Jabber::PubSub::ServiceHelper.new(client,pubsubjid) 
        service.create_node(@document.uuid,Jabber::PubSub::NodeConfig.new(nil,{ 
                            "pubsub#title" => node_name, 
                            "pubsub#node_type" => "leaf", 
                            "pubsub#send_last_published_item" => "never", 
                            "pubsub#send_item_subscribe" => "0", 
                            "pubsub#publish_model" => "open"}))  
      ensure
        client.close  
      end
    rescue
      logger.warn "Node not created because XMPP server is down. Collabiration is disabled"
    end  
  end
  
  def xmpp_notify(message)
    continue = true
    number_of_try = 0;
    while continue do
      continue = false
      begin
        jid = "server@webdoc.com"
        pass = "1234"
        client = Jabber::Client.new(jid)
        client.connect "localhost"
        begin
          client.auth(pass)
          pubsubjid="pubsub.webdoc.com" 
          service=Jabber::PubSub::ServiceHelper.new(client,pubsubjid)
          item = Jabber::PubSub::Item.new 
          message=Jabber::Message.new(nil,message) 
          item.add(message)
          begin
            service.publish_item_to(@document.uuid,item)
          rescue Jabber::ServerError
            xmpp_create_node(@document.uuid);
            if (number_of_try < 1)
              continue = true;
            end            
          end    
        ensure
          client.close
        end
      rescue Exception => e
        logger.warn "XMPP server is down. Collaboration is disabled #{e}"
      end
      number_of_try += 1
    end
  end
end