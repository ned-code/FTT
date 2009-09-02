DEBUG = true;


// create mnemis namespace
var com;

if (!com) { 
    com = {};
}
if (!com.mnemis) { 
    com.mnemis = {};
}
if (!com.mnemis.core) { 
    com.mnemis.core = {};
}

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
console.log("Debug: " + DEBUG);
/*
 *  Import a module based on the name of the module.
 */
com.mnemis.core.Import = function(moduleName)
{
    if (jQuery.inArray(moduleName, com.mnemis.core.modules) == -1) 
    {
        var domain = "";
        if (com.mnemis.core.applicationPath)
        {
            domain = com.mnemis.core.applicationPath;
        }
        com.mnemis.core.LoadFromDomain(domain, moduleName)
    }
}

com.mnemis.core.LoadFromDomain = function(domain, moduleName)
{
    var result = "error"
    $.ajaxSetup({
        async: false
    });
    var request =$.getScript(domain + "/javascripts/" + moduleName, function(data, status)
    {
        result = status;
    });
    $.ajaxSetup({
        async: true
    });
    // in DEBUG mode we want to have script available in firebug so script must be in the html.
    // scripts will be downloaded twice but it is just for debug.
    if (DEBUG)
    {
        var head= document.getElementsByTagName('head')[0];
        var script= document.createElement('script');
        script.type= 'text/javascript';
        script.src= "/javascripts/" + moduleName;
        head.appendChild(script);
    }
    return (request && result == "success")
}

com.mnemis.core.Provide = function(moduleName)
{
    // module are loaded only one time.
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
        return true;
    }
    else
    {
        return false;
    }
}