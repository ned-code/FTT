/*
 * UniBoard JavaScript Library
 * internationalization.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-07-30
 * Author: C�dric Michelet
 */
widget.internationalization = {
	//*****public methods**********************************************************************
	getLocalizedString: function(key,defaultValue) {
		if(typeof(widget.internationalization.localizedStrings) != 'undefined') {
			var v = widget.internationalization.localizedStrings[key];
			if(typeof(v) != 'undefined')
				return v;
		}
	
		if(typeof(defaultValue) != 'undefined')
			return defaultValue;
		
		return key;
	},
	//*****internal methods**********************************************************************
	_init: function() {
		widget._addEventListener('_load', widget.internationalization._onLoad);
	},
	_onLoad:function() {
		//by default, load always the english file || synchronous local load
		readFileHttp('Locales/en/localizedStrings.js', widget.internationalization._loadLocalization, true, false);
		//load the correct localization file if it exists (replace english localization)
		readFileHttp('Locales/' + widget.lang + '/localizedStrings.js', widget.internationalization._loadLocalization, true, false);

		//old ways
		//document.write('<script type="text/javascript" src="Locales/' + widget.lang  +'/localizedStrings.js"></scr' + 'ipt>');
		//dhtmlLoadScript("Locales/en/localizedStrings.js");
	},
	_loadLocalization:function(response) {
    // TODO JBA: should we really do eval. It is better to parse the result.
    if (response) {
      try {
        eval(response);
        if (typeof(localizedStrings) != 'undefined') 
          widget.internationalization.localizedStrings = localizedStrings; //store in a global context
      }
      catch(ex) {
        // TODO what should we do here
      }
    }
	}
}

widget.internationalization._init();

//helper function (shortcut)
function _(key,defaultValue) {
	return widget.internationalization.getLocalizedString(key, defaultValue);
}

//load dynamically a js script
/*
function dhtmlLoadScript(url)
{
   var e = document.createElement("script");
   e.src = url;
   e.type="text/javascript";
	e.onload = function() {alert("onload")};
   document.getElementsByTagName("head")[0].appendChild(e);
}*/