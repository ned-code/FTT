// ===========================
// = Post messages to webdoc =
// ===========================

WebDoc.appCalls.register = function(functionName, handler) {
  // webdoc_win,postMessage(myId+"", '*');
}

WebDoc.appCalls.execute = function(functionName, param) {
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":pane-to-app-call:"+functionName+":"+param,"*");
}
