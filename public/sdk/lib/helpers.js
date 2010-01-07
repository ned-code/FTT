/*
 * UniBoard JavaScript Library
 * helpers.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-12-01
 * Author: Cédric Michelet
 *
 * Global functions (helpers) /wd = webdoc/
 */

/* Log a message in the console if available */
function wd_log(message) {
	if(typeof(console) != 'undefined')
		console.log(message)
}

/**********************************************************************************************
 **************************** HTML5 - inter-frame communication *******************************
 **********************************************************************************************/
/* Build a communication message */
function wd_build_communication_message(methodName, parameters) {
	var m = {};
	m.methodName = methodName;
	m.parameters = parameters;
	return m;
}
/* Install the global event listener in the window for the event 'message' */
function wd_install_message_listener() {
	window.addEventListener("message", function(e) {
			var m = json_to_object(e.data);
			//check if it's a valid message
			if(!wd_check_is_valid_message(m))
				return;
			//interpret/execute the message
			wd_message_relay(m);
	}, false);
}

/* Check if a communication message is valid */
function wd_check_is_valid_message(message) {
	if(typeof(message.methodName) != 'string') {
		wd_log('Communication message is not valid. message.methodName doesn\'t exist or is not a string.')
		return false;
	}
	if(typeof(message.parameters) != 'array') {
		wd_log('Communication message is not valid. message.parameters doesn\'t exist or is not an array.')
		return false;
	}
}

/* Interpret a message, and call the corresponding local javascript function with the correct parameter */
function wd_message_relay() {
	/*
	var func = this[message.methodName];
	if(func) func(); //call the function
	else alert('Error: function (' + message.methodName + ') not found.');
	*/
	var func = message.methodName + '(';
	for(i=0; i<message.parameters.length; i++) {
		if(i != 0)
			func += ',';
		var s = typeof(message.parameters[i]) == 'string' ? true : false;
		if(s) func += '\'';					
		func += message.parameters[i];
		if(s) func += '\'';
	}
	func += ')';
	eval(func);
}

/**********************************************************************************************
 ************************************* JSON ***************************************************
 **********************************************************************************************/
function object_to_json(theObject) {
	/*return JSON.stringify(jsonObject, function (key, value) {
		return value;
	});*/
	//return JSON.stringify(jsonObject,null,'\t');
	JSONstring.compactOutput=true;
	JSONstring.includeProtos=false;     
	JSONstring.includeFunctions=false;     
	JSONstring.detectCirculars=true;          
	JSONstring.restoreCirculars=true;

	return JSONstring.make(theObject);
}
//deprecated. Need to be replaced by object_to_json
function JSON_to_text(jsonObject) {
	console.log('deprecated. Need to be replaced by object_to_json');
	return object_to_json(jsonObject);
}

function json_to_object(text) {
	return JSONstring.toObject(text);
}
//deprecated. Need to be replaced by json_to_object
function text_to_JSON(text) {
	console.log('deprecated. Need to be replaced by json_to_object');
	return json_to_object(text);
}

/**********************************************************************************************
 ************************************* XML HTTP ***********************************************
 **********************************************************************************************/
/*allow to read a local file. Used to process the config.xml*/
function readFileHttp(fname, callback, asText, asynchrone) {
	xmlhttp = getXmlHttp();
	
	if(xmlhttp == null) {
		loadDefault();
		return;
	}
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState==4) {
			if(asText == null || asText == false)
				callback(xmlhttp.responseXML); //responseText
			else
				callback(xmlhttp.responseText);
		}
	}
	
	if(asynchrone == null || asynchrone == true) { //load asynchronous
		xmlhttp.open("GET", fname, true);
		xmlhttp.send(null);
	}
	else { //load synchronous
		xmlhttp.open("GET", fname, false);
		var requestTimer = setTimeout(function() { //abort load after 1 second = timeout
		       xmlhttp.abort();
		     }, 1000);
		try {
		xmlhttp.send(null);
		}
		catch(err) {
			//handle error, if request is aborted
		}
		clearTimeout(requestTimer);
		callback(xmlhttp.responseText);
	}
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