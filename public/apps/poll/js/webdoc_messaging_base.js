// ==================================================================
// = Note, this library should probably remains jQuery-independent, = 
// = so that we don't force the app developer to include jQuery     =
// ==================================================================

//Setting up namespaces
var WebDoc = WebDoc || {};

WebDoc.appId = null;
WebDoc.webdocWindow = null;

WebDoc.initMessage = function(initData, messageEvent) {
  WebDoc.appId = initData[1];
  WebDoc.webdocWindow = messageEvent.source;
  // ddd("MESSAGING:App-"+WebDoc.appId+": Got the init message from WebDoc + its reference")
  if (WebDoc.appInit) WebDoc.appInit();
  // call WebDoc back with this app reference (not necessary?)
  // WebDoc.webdocWindow.postMessage("app-id:"+WebDoc.appId,"*");
}

// function ddd(message) { if (console && console.log) { console.log.apply(console, arguments); }  }