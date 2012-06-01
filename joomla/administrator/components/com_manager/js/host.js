function Host(){
    this.loadedModules = new Array();
}

Host.prototype = {
        callMethod:function(module, classname, method, args, callback){
            var url = storage.baseurl+storage.url+'php/ajax.php';
            var key = storage.request.key();
            var xnr = jQuery.ajax({
            	url: url,
		type: "POST",
		data: 'module='+module+'&class='+classname+'&method='+method+'&args='+args,
		dataType: "html",
		complete : function (req, err) {
			//storage.request.del(key);
			if(req.responseText.length!=0){
				callback(req);
			} else {
                callback(false);
            }
		}
	    });
	    storage.request.add(xnr, key);
	    return xnr;
	},
        getModuleParametersStructure:function(module, callback){
            var url = 'index.php?option=com_manager&task=callHostMethod';
                jQuery.ajax({
                    url: url,
                    type: "POST",
                    data: 'module='+module+'&method=getSettingsStructure',
                    dataType: "html",
                    complete : function (req, err) {
                            callback(req);
                    }
                });
        },
        getModuleParametersValues:function(module, callback){
            var url = 'index.php?option=com_manager&task=callHostMethod';
                jQuery.ajax({
                    url: url,
                    type: "POST",
                    data: 'module='+module+'&method=getSettingsValues',
                    dataType: "html",
                    complete : function (req, err) {
                            callback(req);
                    }
                });
        },
        getSiteSettings:function(tab, callback){
            var url = 'index.php?option=com_manager&task=callHostMethod';
                jQuery.ajax({
                    url: url,
                    type: "POST",
                    data: 'args='+tab+'&method=sendSiteSettings',
                    dataType: "html",
                    complete : function (req, err) {
                            callback(req);
                    }
                });
        },
        setModuleParametersValues:function(module, values, callback){
            var url = 'index.php?option=com_manager&task=callHostMethod';
                jQuery.ajax({
                    url: url,
                    type: "POST",
                    data: 'module='+module+'&args='+values+'&method=setSettingsValues',
                    dataType: "html",
                    complete : function (req, err) {
                            callback(req);
                    }
                });
        },
        getHelpWindow:function(name){
        	var url = storage.url+'help/'+name+'.html';
        	window.open(url, name, 'width=300,height=200,left=100,top=100,toolbar=0,location=0,direction=0,menubar=0,scrollbars=0,resizable=0,status=0,fullscreen=0');
        },
        stringBuffer:function(){
        	return (function(){
        		var b = "";
        		this.length = 0;
        		return {
        			_:function(s){
        				if(arguments.length>1){
        					var tmp="", l=arguments.length;
        					switch(l){
        						case 9: tmp=""+arguments[8]+tmp;
        						case 8: tmp=""+arguments[7]+tmp;
        						case 7: tmp=""+arguments[6]+tmp;
        						case 6: tmp=""+arguments[5]+tmp;
        						case 5: tmp=""+arguments[4]+tmp;
        						case 4: tmp=""+arguments[3]+tmp;
        						case 3: tmp=""+arguments[2]+tmp;
        						case 2: {
        							b+=""+arguments[0]+arguments[1]+tmp;
        							break;
        						}
        						default: {
        							var i=0;
        							while(i<arguments.length){
        								tmp += arguments[i++];
        							}
        							b += tmp;
        						}
        					}
        				} else {
        					b += s;
        				}
        				this.length = b.length;
        				return this;
        			},
        			clear:function(){
        				b = "";
        				this.length = 0;
        				return this;
        			},
        			result:function(){
        				return b;
        			}
        		}	
        	}).call(this)
        }
}
