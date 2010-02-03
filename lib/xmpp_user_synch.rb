require 'net/http'
require 'uri'

module XmppUserSynch
    
  def self.create_xmpp_user(user)
    if APP_CONFIG['synch_openfire_users']  
      openfire_user_service_op(user,'add')
    end
  end

  def self.update_xmpp_user(user)
    if APP_CONFIG['synch_openfire_users']  
      openfire_user_service_op(user,'update')
    end
  end

  def self.delete_xmpp_user(user)
    if APP_CONFIG['synch_openfire_users']  
      openfire_user_service_op(user,'delete')
    end
  end
   
   # synch_openfire_users: true
   # openfire_user_service_url: http://localhost:9090/plugins/userService/
   # openfire_user_service_secret: ??????
   #
   # http://localhost:9090/plugins/userService/userservice?type=add&secret=sk&username=kafka&password=drowssap&name=franz&email=franz@kafka.com
   #
  
  def self.openfire_user_service_op(user, op)
  
      base = APP_CONFIG['openfire_user_service_url'];
      secret = APP_CONFIG['openfire_user_service_secret'];
    
      url = base + 'userService/userservice?type=' + op + '&secret=' + secret + '&username=' + user.name + '&password=1234&name=' + user.name + '&email=' + user.email
      uri = URI.escape(url, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))

      Net::HTTP.get_print uri
  
  end
  
end
