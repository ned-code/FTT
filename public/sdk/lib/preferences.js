/*
 * UniBoard JavaScript Library
 * preferences.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-07-28
 * Author: Cédric Michelet
 */
 widget.preferences = {
	//*****internal properties**********************************************************************
	viewContent: '',
 
	//*****public methods**********************************************************************
	getValue: function(name, defaultValue) {return uniboard.preference(name, defaultValue)},
	setValue: function(name, value) {uniboard.setPreference(name, value);},
	
	//*****internal methods**********************************************************************
	_init: function() {
		//Michelet - 17.12.2009 - not used anymore in WebDoc version
		//widget._addEventListener('_load', widget.preferences._onLoad);
	},
	_onLoad:function() {
		//install edit button if needed
		var _div = document.createElement('div');
		_div.style.position = 'absolute';
		_div.style.top = 0;
		_div.style.right = 0;

		_div.innerHTML = '<a href="javascript:widget.preferences._renderEditPane();">[Edit]</a>';

		widget.body.appendChild(_div);
	},
	_renderEditPane: function() {
		this.viewContent = widget.body.innerHTML;
		
		var editPane;
		
		//var keys = uniboard.preferences.keys();
		var keys = new Array();
		keys[0] = new Array('key1','value 1',false);
		keys[1] = new Array('key2','value 2',true);
		
		editPane = 'EDIT PREFERENCES<br><br><table>';
		
		for(i=0; i<keys.length; i++) {
			editPane += '<tr><td>' + keys[i][0] + ' : </td><td>';
			if(!keys[i][2]) {//is editable
				editPane += '<input type="textbox" id="pref_' + keys[i][0] + '" value="';
				var val = this.getValue(keys[i][0]);
				if(typeof(val) == 'undefined' || val == '')
					editPane += keys[i][1];
				else
					editPane += val;
				editPane += '" />';
			}
			else {//is read-only
				editPane += keys[i][1];
			}
			editPane += '</td></tr>';
		}
		
		editPane += '</table><br><input type="button" value="Cancel" onclick="javascript:widget.preferences._closePreferences();" /> <input type="button" value="Save" onclick="javascript:widget.preferences._saveAndClosePreferences();" />';
		
		widget.body.innerHTML = editPane;
	},
	_saveAndClosePreferences: function() {
		//var keys = uniboard.preferences.keys();
		var keys = new Array();
		keys[0] = new Array('key1','value 1',false);
		keys[1] = new Array('key2','value 2',true);
		
		for(i=0; i<keys.length; i++) {
			var v = document.getElementById('pref_' + keys[i][0]);
			if(!keys[i][2] && v) {
				this.setValue(keys[i][0], v.value);
			}
		}
		
		this.onPreferencesChange();
		this._closePreferences();
		widget._onRefresh();
	},
	_closePreferences: function() {
		widget.body.innerHTML = this.viewContent;
		widget._onRefresh();
	}
}

widget.preferences._init();