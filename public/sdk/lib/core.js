/*
 * UniBoard JavaScript Library
 * core.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-07-24
 * Author: C�dric Michelet
 */
var widget = {
	//*****public properties**********************************************************************
	version_sdk: '0.01',
	uuid: null,
	lang: 'fr_FR',
	body: null,
	
	//*****internal properties**********************************************************************
	autoRefreshDelay: 0,
	autoRefreshTimeout: null, //pointer to a timer
	eventsListener: new Array(),
	
	//*****events**********************************************************************
	onLoad: function() {},
	onRefresh: function() {},
	onResize: function() {},
	onKeyboardAction: function(key, isSpecialChar) {},
	onPreferencesChange: function() {},
	
	//*****public methods**********************************************************************
	log: function(message) {wd_log(message)},
	setAutoRefresh: function(delay) {
		this.autoRefreshDelay = delay;
		if(delay == 0) {
			if(this.autoRefreshTimeout != null)
				clearTimeout(this.autoRefreshTimeout);
				this.autoRefreshTimeout = null;
		}
		else {
			if(this.autoRefreshTimeout == null)
				this.autoRefreshTimeout = setTimeout('widget._onRefresh()', this.autoRefreshDelay*1000);
		}
	},
	
	//*****internal methods**********************************************************************
	_onLoad: function(widgetBody) {		
		if(typeof(widgetBody) == 'undefined')
			this.body = document.body;
		else
			this.body = widgetBody;
	
		//try to load properties of the widget
//		if(typeof(uniboard) != 'undefined') {
//			this.uuid = uniboard.widgetItem.uuid();
//		}
	
		//install keyboard handler
		document.onkeydown = function(e){widget._handleKeys(e)};
		document.onkeypress = function(e){widget._handleKeys(e)};
		this._callListenersForEvent('_load');
		widget.onLoad();
		this._callListenersForEvent('load');
	},
	_onRefresh: function() {
		if(this.autoRefreshDelay != 0)
			setTimeout('widget._onRefresh()', this.autoRefreshDelay*1000);
		else
			this.autoRefreshTimeout = null;
		this.onRefresh();
	},
	_onPreferencesChange: function() {
		this.onPreferencesChange();
	},
	_addEventListener: function(event, func) {
		this.eventsListener.push(new Array(event,func));
	},
	_callListenersForEvent: function(event) {
		for(i=0; i<this.eventsListener.length; i++) {
			if(this.eventsListener[i][0] == event)
				this.eventsListener[i][1]();
			
		}
	},
	_handleKeys: function(e) {
		var evt = (e) ? e : window.event; //IE reports window.event not arg
		if (evt.type == "keydown") {
			//treat only special char
			c = evt.keyCode;
			
			//make sure it's a special character
			if(c <16 || // non printables
				(c> 16 && c <32) ||  // avoid shift
                (c> 32 && c <41) ||     // navigation keys
                 c == 46) {   
					this.onKeyboardAction(c, true);
				}
		}
		else {
			//treat only normal char
			c = evt.charCode;
			if(c != 0)
				this.onKeyboardAction(c, false);
		}
	}
};