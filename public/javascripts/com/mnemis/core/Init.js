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

// TODO need to find how to determine automatically the correct domain
com.mnemis.core.domains = ["http://localhost:3000/javascripts/", "http://st-ub.mnemis.com/javascripts/"];

/*
 *  Import a module based on the name of the module.
 */
com.mnemis.core.Import = function(moduleName)
{
    if (com.mnemis.core.modules.indexOf(moduleName) == -1)
    {
        for(var index = 0; index < com.mnemis.core.domains.length;index++)
            {
                // search for javascripts in domains
                if (com.mnemis.core.LoadFromDomain(com.mnemis.core.domains[index], moduleName))
                    {
                        console.log("script loaded");
                        break;
                    }
            };
    }
}

com.mnemis.core.LoadFromDomain = function(domain, moduleName)
{
    var result = "error"
    $.ajaxSetup({async: false});
    console.log("search script in domain " + domain);
    var request =$.getScript(domain + moduleName, function(data, status)
        {
            console.log("result " +status);
           result = status;
        });
    $.ajaxSetup({async: true});
    console.log("out with status " + request);
    return (request && result == "success")
}

com.mnemis.core.Provide = function(moduleName)
{
    if (com.mnemis.core.modules.indexOf(moduleName) == -1)
    {
        com.mnemis.core.modules.push(moduleName);
    }
}