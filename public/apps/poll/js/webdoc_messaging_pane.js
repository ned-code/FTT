// ===========================
// = Post messages to webdoc =
// ===========================

WebDoc.appCall = function(functionName, param) {
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":pane-to-app-call:"+functionName+":"+param,"*");
}

// ==============================================
// = Listen to messages (coming in from WebDoc) =
// ==============================================

window.addEventListener('message', function(event) {
  // ddd(event.source+" : "+event.data);
  
  // ================
  // = Init message =
  // ================
  var init = event.data.match(/^webdoc-init:(.*)$/);
  if (init) {
    WebDoc.initMessage(init, event);
  }

}, false);
