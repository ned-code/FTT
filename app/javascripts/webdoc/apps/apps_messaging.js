WebDoc.AppsMessagingController = $.klass({
  initialize: function() {
    
    // ============================================
    // = Listen to messages (coming in from apps) =
    // ============================================
    window.addEventListener('message', function(event) {
      
      if (event.data) {
         //uncomment the line below to see the other messages the opensocial gadget is sending me....t'hallucines...
        // ddd("RICEVUTO MESSAGGIO SU WEBDOC: "+event.data)
        
        // var appId = event.data.match(/^app-id:(\w+)$/);
        var registerInspectorPanes = event.data.match(/^app:(.*):register-inspector-panes:(.*)$/);
        var appCall = event.data.match(/^app:(.*):pane-to-app-call:(.*):(.*)$/);
        
        // ==========
        // = App ID =
        // ==========
        // if (appId) {
        //   // appsAndPanes.push(event.source)
        //   var id = appId[1];
        //   ddd("MESSAGING:WebDoc: Got back message from app:"+id);
        // }
        
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
          var appId = appCall[1];
          var functionName = appCall[2];
          var functionParam = appCall[3];
          var paneWindow = event.source;
          
          ddd("I'll need to call the function \""+functionName+"\" (of app "+appId+") with param "+functionParam)
          //   var appWindow = f(inspectorSource)
        }
      }
    }, false);
  },
  sendInitMessage: function(appId, appOrPaneFrameid) {
    $("#"+appOrPaneFrameid).load(function(event) {
      event.target.contentWindow.postMessage("webdoc-init:"+appId, "*");
    });
  }
});
