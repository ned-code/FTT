/*
 * UniBoard JavaScript Library
 * sandbox.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-07-24
 * Author: Cédric Michelet
 */

w_width = '200';
w_height = '200';
 
if(typeof(libPath) == 'undefined')
	libPath = ''; 
 /*include sdk lib. Because of the parser of IE7, we need to split </script> in 2, to avoid the end of the script*/
document.write('<script type="text/javascript" src="' + libPath + 'sdk_all.js"></scr' + 'ipt>');

/*allow to read a local file. Used to process the config.xml*/
function readFileHttp(fname, callback) {
	xmlhttp = getXmlHttp();
	
	if(xmlhttp == null) {
		loadDefault();
		return;
	}
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			callback(xmlhttp.responseXML); //responseText
		}
	}
	xmlhttp.open("GET", fname, true);
	xmlhttp.send(null);
}
/*Helper to get the rpc object*/
function getXmlHttp() {
	if (window.XMLHttpRequest) {
		xmlhttp=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (xmlhttp == null) {
		alert("Your browser does not support XMLHTTP.");
	}
	return xmlhttp;
}
/*init the visual aspect of the widget with the default/loaded values*/
function initWithValues() {
	document.body.style.backgroundColor = '#C3CDDF';
	
	//include the widget inside a div
	var _div = document.createElement('div');
	_div.style.position = 'relative';
	_div.style.border = 'solid 1px';
	_div.style.width = w_width + 'px';
	_div.style.height = w_height + 'px';
	_div.style.backgroundColor = 'white';
	
	var _content = document.body.innerHTML;
	document.body.innerHTML = '';
	_div.innerHTML = _content;
	
	document.body.appendChild(_div);
	
	widget.height = w_height;
	widget.width = w_width;

	widget._onLoad(_div);
}
/*process the config file*/
function loadConfig(response) {
	var root = response.getElementsByTagName('widget').item(0);
	w_width = root.getAttribute('width');
	w_height = root.getAttribute('height');
	initWithValues();
}
/*set default value*/
function loadDefault() {
	w_width = '200';
	w_height = '200';
	
	initWithValues();
}
/*function loaded at startup*/
function init() {
	installPreferencesSandbox();

	//load config file
	readFileHttp('config.xml', loadConfig);
}

/************override preference*********************************/
function installPreferencesSandbox() {
	widget.preferences.getValue = function(name, defaultValue) {return ""};
	widget.preferences.setValue = function(name, value) {};
}

/**********************************************************************************************/
window.onload=init;