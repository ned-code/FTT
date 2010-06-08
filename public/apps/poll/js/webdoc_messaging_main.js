// ===========================
// = Post messages to webdoc =
// ===========================

WebDoc.registeredAppCalls = {};

WebDoc.registerInspectorPanes = function(panes) { // panes is an array of strings, each string represents the view name specified in the app's xml
  
  if (typeof(panes) == "string") {
    panes = [panes];
  }
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":register-inspector-panes:"+panes.join(":"),"*");
};

WebDoc.registerAppCall = function(functionName, handler, context) {
  
  WebDoc.registeredAppCalls[functionName] = handler;
  WebDoc.registeredAppCalls[functionName+"Context"] = context;
  
  // webdoc_win,postMessage(myId+"", '*');
};

WebDoc.adjustAppHeight = function() {
  var height = document.height;
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":adjust-height:"+height,"*");
};


// ==============================================
// = Listen to messages (coming in from WebDoc) =
// ==============================================

window.addEventListener('message', function(event) {
  // ddd(event.source+" : "+event.data);
  
  // ================
  // = Init message =
  // ================
  var initData = event.data.match(/^webdoc-init:(.*):dom-id:(.*):edit-mode:(.*)$/);
  if (initData) {
    WebDoc.appId = initData[1];
    WebDoc.domId = initData[2];
    WebDoc.isEditMode = eval(initData[3]); //boolean
    WebDoc.webdocWindow = event.source;
    if (WebDoc.appInit) WebDoc.appInit();
    
    // call WebDoc back with this app reference (not necessary?)
    // WebDoc.webdocWindow.postMessage("app-id:"+WebDoc.appId,"*");
  }

  // ===============================
  // = WebDoc mode changed message =
  // ===============================
  var wdModeChanged = event.data.match(/^wd-edit-mode:(.*)$/);
  if (wdModeChanged) {
    WebDoc.isEditMode = eval(wdModeChanged[1]); //boolean
    
    if (WebDoc.isEditMode) {
      WebDoc.appEnteredEditMode();
    }
    else {
      WebDoc.appEnteredPreviewMode();
    }
  }
  
  // ====================
  // = Pane to App call =
  // ====================
  var paneToAppCall = event.data.match(/^app:(.*):pane-to-app-call:(.*):(.*)$/);
  if (paneToAppCall) {
    var appId = paneToAppCall[1];
    
    if (appId == WebDoc.appId) { //just proceed if appId matches
      var functionName = paneToAppCall[2];
      var functionParam = paneToAppCall[3];
      // var paneWindow = event.source;
      
      // ddd("I need to execute the function \""+functionName+"\" with param "+functionParam);
      
      var handler = WebDoc.registeredAppCalls[functionName];
      var context = WebDoc.registeredAppCalls[functionName+"Context"];
      handler.apply(context, [functionParam]);
    }
  }

}, false);

