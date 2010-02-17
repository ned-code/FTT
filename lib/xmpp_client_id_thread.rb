module XmppClientIdThread
  
  def self.included(base)
    base.class_eval do
      def self.xmpp_client_id
        Thread.current[:xmpp_client_id]
      end
    end
  end
  
  def xmpp_client_id
    Thread.current[:xmpp_client_id]
  end
  
end

# Set it all up.
if Object.const_defined?("ActiveRecord")
  ActiveRecord::Base.send(:include, XmppClientIdThread)
  ActiveRecord::Observer.send(:include, XmppClientIdThread)
  #PagesController.send(:include, XmppClientIdThread)
end
