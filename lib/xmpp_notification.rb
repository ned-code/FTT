require "xmpp4r" 
require "xmpp4r/pubsub"

class XmppNotification
  @@xmpp_client = Jabber::Client.new('server@webdoc.com')
  @@xmpp_off = false
  
  def self.xmpp_create_node(node_name)
    if (!@@xmpp_off)
      begin  
        Rails.logger.warn "************************************ XMPP Get pubsub service"
#        service = self.get_pubsub_service("pubsub.webdoc.com") 
#        begin
#          Rails.logger.warn "************************************ Create node"
#          service.create_node(node_name, Jabber::PubSub::NodeConfig.new(nil,{ 
#                    "pubsub#title" => node_name, 
#                    "pubsub#node_type" => "leaf", 
#                    "pubsub#send_last_published_item" => "never", 
#                    "pubsub#send_item_subscribe" => "0", 
#                    "pubsub#publish_model" => "open"})) 
#        rescue Jabber::JabberError => error
#          Rails.logger.warn "Error on create node #{error}"
#        end
           
      end 
    end
  end
  
  def self.xmpp_notify(message, node)
    if (!@@xmpp_off)    
      continue = true
      number_of_try = 0
      while continue do
        
        continue = false
        service = self.get_pubsub_service("pubsub.webdoc.com") 
  
        item = Jabber::PubSub::Item.new 
        message=Jabber::Message.new(nil,message) 
        item.add(message)
        begin
          service.publish_item_to(node,item)
        rescue Jabber::ServerError => error
          xmpp_create_node(node)
          if (number_of_try < 1)
            continue = true;
          end            
        end    
        number_of_try += 1
      end
    end
  end
  
  def self.xmpp_connect
    pass = "1234"
    begin
      @@xmpp_client.connect "localhost"
      @@xmpp_client.auth(pass)
    rescue Exception => error
      Rails.logger.warn "Cannot connect to XMPP server #{error}"
      @@xmpp_off = true
    end    
  end
  
  def self.get_pubsub_service(pubsubjid)
    service = nil
    begin
      Rails.logger.warn "************************************ New Serice helper"
      service = Jabber::PubSub::ServiceHelper.new(@@xmpp_client,pubsubjid)
      Rails.logger.warn "************************************ OK"
    rescue Exception => error      
      Rails.logger.warn "Error on pubsub service #{error}"
      self.xmpp_connect
      service=Jabber::PubSub::ServiceHelper.new(@@xmpp_client,pubsubjid)
    end
    return service
  end
end
