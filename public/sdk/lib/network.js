/*
 * UniBoard JavaScript Library
 * network.js
 *
 * Copyright (c) 2009 Mnemis
 *
 * Date: 2009-07-31
 * Author: Cédric Michelet
 * 
 * Actually, rely on jQuery core. This lib NEED to be included/loaded.
 */
widget.network = {
	//*****public methods**********************************************************************
	getText: function(url,callback) {
		this._ajax(url,null,'GET','text',callback);
	},
	getXML: function(url,callback) {
		this._ajax(url,null,'GET','xml',callback);
	},
	getJson: function(url,callback) {
		this._ajax(url,null,'GET','json',callback);
	},
	postText: function(url,data,callback) {
		this._ajax(url,data,'POST','text',callback);
	},
	deleteText: function(url,callback) {
		this._ajax(url,null,'DELETE','text',callback);
	},
	//*****internal methods**********************************************************************
	_ajax: function(url,data,type,dataType,callback) {
		jQuery.ajax({
			type:type,
			url:url,
			data:data,
			dataType:dataType,
			success:function(response){
				callback(response,null);
            },
            error:function (xhr, ajaxOptions, thrownError){
				callback(null,thrownError);
            }
          });
	}
}