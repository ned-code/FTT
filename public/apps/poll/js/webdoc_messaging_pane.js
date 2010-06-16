// ===========================
// = Post messages to webdoc =
// ===========================

WebDoc.appCall = function(functionName, param) {
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":pane-to-app-call:"+functionName+":"+param,"*");
};

WebDoc.adjustPaneHeight = function() {
  var height = document.height;
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":pane-id:"+WebDoc.domId+":adjust-height:"+height,"*");
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
    
    // Call WebDoc back with to auto adjust the height of this pane
    WebDoc.adjustPaneHeight();
  }
}, false);
