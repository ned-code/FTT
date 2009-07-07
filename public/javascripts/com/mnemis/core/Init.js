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