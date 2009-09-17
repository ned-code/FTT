# TODO
class OrbitedController < ApplicationController
  before_filter :login_required
    
  def orbited_javascript
    [
      "<script type=\"text/javascript\" src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/Orbited.js\"></script>",
      '<script type="text/javascript">',
      '  document.domain = document.domain;',
      '  var Orbited;',
      "  if (Orbited) {",
      "    Orbited.settings.port = #{APP_SETTINGS[:orbited_port]};",
      "    Orbited.settings.hostname = '#{APP_SETTINGS[:orbited_host]}';",
      '     TCPSocket = Orbited.TCPSocket;',
      '   }',
      "  var AUTH_TOKEN = \"#{protect_against_forgery? ? form_authenticity_token : ''}\";",
      "  $.ajaxSetup({data:{authenticity_token : AUTH_TOKEN}});",
      '</script>',
      "<script src=\"http://#{APP_SETTINGS[:orbited_host]}:#{APP_SETTINGS[:orbited_port]}/static/protocols/stomp/stomp.js\"></script>"
    ].join("\n")
  end
  
end