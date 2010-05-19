WebDoc.AppsMessagingController = $.klass({
  initialize: function() {
    
    // ============================================
    // = Listen to messages (coming in from apps) =
    // ============================================
    window.addEventListener('message', function(event) {
      
      if (event.data) {
         //uncomment the line below to see the other messages the opensocial gadget is sending me (t'hallucines...)
        // ddd("POSTMESSAGE RECEIVED ON WEBDOC: "+event.data)
        
        var registerInspectorPanes = event.data.match(/^app:(.*):register-inspector-panes:(.*)$/);
        var appCall = event.data.match(/^app:(.*):pane-to-app-call:(.*):(.*)$/);
            
        // ============================
        // = Register Inspector Panes =
        // ============================
        if (registerInspectorPanes) {
          var appId = registerInspectorPanes[1];
          var panes = registerInspectorPanes[2].split(":");
          
          WebDoc.appsContainer.getApp(appId).createInspectorPanes(panes);
        }

        // ====================
        // = Pane to App call =
        // ====================
        if (appCall) {
          // we now bounce the entire message (event.data) to the app
          var appId = appCall[1];
          this.sendCall(appId, event.data);
          
          // var functionName = appCall[2];
          // var functionParam = appCall[3];
          // var paneWindow = event.source;
          // ddd("I'll need to call the function \""+functionName+"\" (of app "+appId+") with param "+functionParam)
        }
      }
    }.pBind(this), false);
  },
  sendInitMessage: function(appId, appOrPaneFrameId) {
    $("#"+appOrPaneFrameId).load(function(event) {
      event.target.contentWindow.postMessage("webdoc-init:"+appId, "*");
    });
  },
  sendCall: function(appId, message) {
    var appFrameId = WebDoc.appsContainer.getApp(appId).getIframeId();
    $("#"+appFrameId)[0].contentWindow.postMessage(message, "*");
  }
});
