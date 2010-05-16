// ===========================
// = Post messages to webdoc =
// ===========================

WebDoc.registerInspectorPanes = function(panes) { // panes is an array of strings, each string represents the view name specified in the app's xml
  
  if (typeof(panes) == "string") {
    panes = [panes];
  }
  WebDoc.webdocWindow.postMessage("app:"+WebDoc.appId+":register-inspector-panes:"+panes.join(":"),"*");
}
