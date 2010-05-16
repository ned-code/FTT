// ==================================================================
// = Note, this library should probably remains jQuery-independent, = 
// = so that we don't force the app developer to include jQuery     =
// ==================================================================

var WebDoc = WebDoc || {};
WebDoc.appCalls = {};

WebDoc.appId = null;
WebDoc.webdocWindow = null;

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
    WebDoc.appId = init[1];
    WebDoc.webdocWindow = event.source;
    ddd("MESSAGING:App-"+WebDoc.appId+": Got the init message from WebDoc + its reference")
    
    // call WebDoc back with this app reference (not necessary?)
    // WebDoc.webdocWindow.postMessage("app-id:"+WebDoc.appId,"*");
  }

}, false);


function ddd(message) { if (console && console.log) { console.log.apply(console, arguments); }  }