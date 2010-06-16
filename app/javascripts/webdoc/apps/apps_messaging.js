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
        var adjustAppHeight = event.data.match(/^app:(.*):adjust-height:(.*)$/);
        var adjustPaneHeight = event.data.match(/^app:(.*):pane-id:(.*):adjust-height:(.*)$/);
            
        // ============================
        // = Register Inspector Panes =
        // ============================
        if (registerInspectorPanes) {
          var appId = registerInspectorPanes[1];
          var panes = registerInspectorPanes[2].split(":");
          var app = WebDoc.appsContainer.getApp(appId);
          if (app) app.createInspectorPanes(panes);
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
        
        // =====================
        // = Adjust App height =
        // =====================
        if (adjustAppHeight) {
          // we now bounce the entire message (event.data) to the app
          var appId = adjustAppHeight[1];
          var height = adjustAppHeight[2];
          
          var app = WebDoc.appsContainer.getApp(appId);
          if (app) app.appView.adjustHeight(height);
        }
        
        // ======================
        // = Adjust Pane height =
        // ======================
        if (adjustPaneHeight) {
          // we now bounce the entire message (event.data) to the app
          var appId = adjustPaneHeight[1];
          var paneId = adjustPaneHeight[2];
          var height = parseInt(adjustPaneHeight[3],10);
          
          var app = WebDoc.appsContainer.getApp(appId);
          if (app) app.appView.inspectorPanesManager.adjustAppPaneHeight(paneId, height);
        }
      }
    }.pBind(this), false);
  },
  
  sendInitMessage: function(appId, appOrPaneFrameId) { 
    // ex1 (app):  appId="0", appOrPaneFrameId="app_iframe_0"
    // ex2 (pane): appId="0", appOrPaneFrameId="app_iframe_0_settings"
    
    var editMode = WebDoc.application.boardController.currentPageView().isEditable(); // true is current page is in Edit mode, false if it's in Preview mode
    var message = "webdoc-init:"+appId+":dom-id:"+appOrPaneFrameId+":edit-mode:"+editMode;
    $("#"+appOrPaneFrameId).load(function(event) {
      event.target.contentWindow.postMessage(message, "*");
    });
  },
  
  notifyModeChanged: function(mode) {
    // Tell all the apps the WebDoc mode (Edit/Preview) has changed
    // mode=true => Edit, false => Preview
    var message = "wd-edit-mode:"+mode;
    $.each(WebDoc.appsContainer.apps, function(k, v) {
      this.sendCall(v, message);
    }.pBind(this));
  },
  
  sendCall: function(appOrAppId, message) {
    var app = (typeof appOrAppId == "object") ? appOrAppId : WebDoc.appsContainer.getApp(appOrAppId);
    var appFrameId = app.getIframeId();
    $("#"+appFrameId)[0].contentWindow.postMessage(message, "*");
  }
  
});
