/*
 * UniBoard JavaScript Library
 * communication.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-12-01
 * Author: Cédric Michelet
 * 
 * Automatize the communication between iFrame by using the communication API of HTML5.
 *
 * The method relay take 1 parameter, a message object which should have 2 attributs:
 * message.methodName: name of the javascript function to call
 * message.parameters: array of parameters to pass to the function
 */
widget.communication = {
	//*****internal methods**********************************************************************
	_init: function() {
		widget._addEventListener('load', widget.communication._onLoad);
	},
	_onLoad:function() {
		//install the 'message' event listener
		wd_install_message_listener();
	}
}
widget.communication._init();