/*
 * UniBoard JavaScript Library
 * sdk_all.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-12-01
 * Author: Cédric Michelet
 *
 * Include all files required by the sdk
 */
 
if(typeof(libPath) == 'undefined')
	libPath = ''; 
 /*include sdk lib. Because of the parser of IE7, we need to split </script> in 2, to avoid the end of the script*/
document.write('<script type="text/javascript" src="' + libPath + 'helpers.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'core.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'ext/jquery.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'ext/jsonStringify.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'network.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'preferences.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'messages.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'communication.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'internationalization.js"></scr' + 'ipt>');
document.write('<script type="text/javascript" src="' + libPath + 'datastore.js"></scr' + 'ipt>');