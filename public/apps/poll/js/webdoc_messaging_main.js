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
  var initData = event.data.match(/^webdoc-init:(.*):dom-id:(.*)$/);
  if (initData) {
    WebDoc.appId = initData[1];
    WebDoc.domId = initData[2];
    WebDoc.webdocWindow = event.source;
    if (WebDoc.appInit) WebDoc.appInit();
    
    // call WebDoc back with this app reference (not necessary?)
    // WebDoc.webdocWindow.postMessage("app-id:"+WebDoc.appId,"*");
  }
  
  // ====================
  // = Pane to App call =
  // ====================
  var appCall = event.data.match(/^app:(.*):pane-to-app-call:(.*):(.*)$/);
  if (appCall) {
    var appId = appCall[1];
    
    if (appId == WebDoc.appId) { //just proceed if appId matches
      var functionName = appCall[2];
      var functionParam = appCall[3];
      // var paneWindow = event.source;
      
      // ddd("I need to execute the function \""+functionName+"\" with param "+functionParam);
      
      var handler = WebDoc.registeredAppCalls[functionName];
      var context = WebDoc.registeredAppCalls[functionName+"Context"];
      handler.apply(context, [functionParam]);
    }
  }

}, false);

