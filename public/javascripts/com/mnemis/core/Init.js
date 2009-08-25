// create mnemis namespace
var com;

if (!com) { com = {};}
if (!com.mnemis) { com.mnemis = {};}
if (!com.mnemis.core) { com.mnemis.core = {};}

// create a console object if it doesn't exist
var console;
if (!console)
{
	console = {};
	console.log = function(){};
}

// array of all modules that are already providen
com.mnemis.core.modules = [];
console.log("init Mnemis FW");
// create gears local server if gears is installed
if (window.google && google.gears)
{
    console.log("google is defined!");
    try {
        com.mnemis.core.localServer =
        google.gears.factory.create('beta.localserver');
    } catch (ex) {
        console.log('Could not create local server: ' + ex.message);
    }
    com.mnemis.core.documentStore = com.mnemis.core.localServer.openStore("Documents");
    if (!com.mnemis.core.documentStore)
    {
        com.mnemis.core.documentStore = com.mnemis.core.localServer.createStore("Documents");
        // by default store is disable and we enabled it only if connection is broken
        com.mnemis.core.documentStore.enabled = true;
    }
    
    com.mnemis.core.store = com.mnemis.core.localServer.createManagedStore("Uniboard5");
    com.mnemis.core.store.manifestUrl = "/gears_manifest.json";
    com.mnemis.core.store.checkForUpdate();

    var timerId = window.setInterval(function() {
    // When the currentVersion property has a value, all of the resources
    // listed in the manifest file for that version are captured. There is
    // an open bug to surface this state change as an event.
      if (com.mnemis.core.store.currentVersion)
      {
        window.clearInterval(timerId);
        console.log("file are available offline");
        console.log(com.mnemis.core.store.lastErrorMessage);
      }
      else if (com.mnemis.core.store.updateStatus == 3)
      {
        console.log("Error: " + com.mnemis.core.store.lastErrorMessage);
      }
    }, 500);
}

com.mnemis.core.capture = function(urls)
{
  var store = com.mnemis.core.localServer.openStore("Documents");
  if (!store) {
    console.log('Please create a store for the captured resources');
    return;
  }
  // Capture this page and the js library we need to run offline.
  store.capture(urls, com.mnemis.core.captureCallback);
}

com.mnemis.core.captureCallback = function(url, success, captureId) {
  console.log(url + ' captured ' + (success ? 'succeeded' : 'failed'));
}

/*
 *  Import a module based on the name of the module.
 */
com.mnemis.core.Import = function(moduleName)
{
    if (jQuery.inArray(moduleName, com.mnemis.core.modules) == -1) 
    {
        com.mnemis.core.LoadFromDomain(com.mnemis.core.applicationPath, moduleName)
    }
}

com.mnemis.core.LoadFromDomain = function(domain, moduleName)
{
    var result = "error"
    $.ajaxSetup({async: false});
    var request =$.getScript(domain + "/javascripts/" + moduleName, function(data, status)
        {
           result = status;
        });
    $.ajaxSetup({async: true});
    return (request && result == "success")
}

com.mnemis.core.Provide = function(moduleName)
{
    if (jQuery.inArray(moduleName, com.mnemis.core.modules) == -1) 
    {
        com.mnemis.core.modules.push(moduleName);

        // create namespace
        var pathElements = moduleName.split("/");
        var lastPathElement = window;
        for (var index = 0; index < pathElements.length - 1; index++)
        {
            var pathElement = pathElements[index];
            if (!lastPathElement[pathElement])
            {
                lastPathElement[pathElement] = {};
            }
            lastPathElement = lastPathElement[pathElement];
        }
    }
}