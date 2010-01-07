/*
 * UniBoard JavaScript Library
 * datastore.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-12-14
 * Author: Cédric Michelet
 *
 * http://www.w3.org/TR/webstorage/
 * http://www.quirksmode.org/dom/html5.html#localstorage
 */
 widget.datastore = {
	//*****internal properties**********************************************************************
	server_url: '/datastores/',
	public_setCallback: null,
	public_getCallback: null,
	public_getForCurrentUserCallback: null,
	public_removeCallback: null,
	public_getAllKeysCallback: null,
	
	//*****public methods**********************************************************************
	set: function(key, value, isUnique, callback) {
		var url = widget.datastore.server_url;
		url += widget.uuid + '/datastoreEntries';
		if(typeof(callback) == 'undefined')
			widget.datastore.public_setCallback = null;
		else
			widget.datastore.public_setCallback = callback;
			
		data = {
			key: key,
			value: value,
			unique_key: isUnique
		};
			
		widget.network.postText(url, data, widget.datastore._setCallback);
	},
	get: function(key, callback) {
		var url = widget.datastore.server_url;
		url += widget.uuid + '/datastoreEntries/' + key; 
		if(typeof(callback) == 'undefined')
			widget.datastore.public_getCallback = null;
		else
			widget.datastore.public_getCallback = callback;
		widget.network.getJson(url, widget.datastore._getCallback);
	},
	getForCurrentUser: function(key, callback) {
		var url = widget.datastore.server_url;
		url += widget.uuid + '/datastoreEntries/' + key + '?only_current_user=true'; 
		if(typeof(callback) == 'undefined')
			widget.datastore.public_getForCurrentUserCallback = null;
		else
			widget.datastore.public_getForCurrentUserCallback = callback;
		widget.network.getJson(url, widget.datastore._getForCurrentUserCallback);
	},
	remove: function(key, callback) {
		var url = widget.datastore.server_url;
		url += widget.uuid + '/datastoreEntries/' + key;
		if(typeof(callback) == 'undefined')
			widget.datastore.public_removeCallback = null;
		else
			widget.datastore.public_removeCallback = callback;
		widget.network.deleteText(url, widget.datastore._removeCallback);
	},
	getAllKeys: function() {
		var url = widget.datastore.server_url;
		url += 'getAllKeys?widget_uuid=' + widget.uuid; 
		if(typeof(callback) == 'undefined')
			widget.datastore.public_getAllKeysCallback = null;
		else
			widget.datastore.public_getAllKeysCallback = callback;
		widget.network.getJson(url, widget.datastore._getAllKeysCallback);
	},
	//*****private methods**********************************************************************
	_setCallback: function(data,error) {
		if(widget.datastore.public_setCallback != null) {
			if(error != null)
				widget.datastore.public_setCallback(data, error);
			else
				if(data == '')
					widget.datastore.public_setCallback(null, null);
				else
					widget.datastore.public_setCallback(data, null);
		}
	},
	_getCallback: function(data,error) {
		if(widget.datastore.public_getCallback == null)
			return;
		if(error != null) {
			widget.datastore.public_getCallback(null, error);
			return;
		}
			
		var ret = new Array();
		if(data) {
			for(i=0;i<data.length;i++) {
				ret[i] = data[i].datastore_entry.ds_value;
			}
		}
		widget.datastore.public_getCallback(ret, null);
	},
	_getForCurrentUserCallback: function(data,error) {
		if(widget.datastore.public_getForCurrentUserCallback == null)
			return;
		if(error != null) {
			widget.datastore.public_getForCurrentUserCallback(null, error);
			return;
		}
		
		var ret = null;
		if(data) {
			if(data.length > 0)
				ret = data[0].datastore_entry.ds_value;
		}
		widget.datastore.public_getForCurrentUserCallback(ret, null);
	},
	_removeCallback: function(data,error) {
		if(widget.datastore.public_removeCallback != null) {
			if(error != null)
				widget.datastore.public_removeCallback(data, error);
			else
				if(data == '')
					widget.datastore.public_removeCallback(null, null);
				else
					widget.datastore.public_removeCallback(data, null);
		}
	},
	_getAllKeysCallback: function(data,error) {
		if(widget.datastore.public_getAllKeysCallback == null)
			return;
		if(error != null) {
			widget.datastore.public_getAllKeysCallback(null, error);
			return;
		}
		var ret = new Array();
		for(i=0;i<r.length;i++) {
			ret[i] = r[i].ds_key;
		}
		widget.datastore.public_getAllKeysCallback(ret, null);
	},
	
	//**************************************************************************************
	//*** OLD - not used anymore - TO BE DELETED **********************************************
	//**************************************************************************************
	computer: {
		//*****public methods**********************************************************************
		save: function(key,value) {
			localStorage.setItem(key,value);
		},
		get: function(key) {
			return localStorage.getItem(key);
		},
		remove: function(key) {
			localStorage.removeItem(key);
		},
		getAllKeys: function() {
			var ret = new Array();
			
			for(i=0;i<localStorage.length;i++) {
				ret[i] = localStorage.key(i);
			}
			return ret;
		}
	},
	document: {
		//*****public methods**********************************************************************
		save: function(key,value) {
			console.log('temp implementation of widget.datastore.document.save !!!');
			widget.datastore.computer.save(key,value);
		},
		get: function(key) {
			console.log('temp implementation of widget.datastore.document.get !!!');
			return widget.datastore.computer.get(key);
		},
		remove: function(key) {
			console.log('temp implementation of widget.datastore.document.remove !!!');
			widget.datastore.computer.removeItem(key);
		},
		getAllKeys: function() {
			console.log('temp implementation of widget.datastore.document.getAllKeys !!!');
			return widget.datastore.computer.getAllKeys();
		}
	},
	server: {
		//*****public methods**********************************************************************
		save: function(key,value) {
			console.log('temp implementation of widget.datastore.server.save !!!');
			widget.datastore.computer.save(key,value);
		},
		get: function(key) {
			console.log('temp implementation of widget.datastore.server.get !!!');
			return widget.datastore.computer.get(key);
		},
		remove: function(key) {
			console.log('temp implementation of widget.datastore.server.remove !!!');
			widget.datastore.computer.removeItem(key);
		},
		getAllKeys: function() {
			console.log('temp implementation of widget.datastore.server.getAllKeys !!!');
			return widget.datastore.computer.getAllKeys();
		}
	}
}