function Host(){
    this.loadedModules = new Array();
}

Host.prototype = {
        callMethod:function(module, classname, method, args, callback){
            var url = 'index.php?option=com_manager&task=callMethod';
            var xnr = jQuery.ajax({
            	url: url,
		type: "POST",
		data: 'module='+module+'&class='+classname+'&method='+method+'&args='+args,
		dataType: "html",
		complete : function (req, err) {
			callback(req);
		}
	    });
	    if(storage&&storage.request) storage.request.add(xnr);
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
        		var string = Array();
        		return {
        			_:function(str){
        				string.push(str);
        				return this;
        			},
        			clear:function(){
        				string = Array();
        				return this;
        			},
        			result:function(){
        				return string.join("");
        			}
        		}
        	}).call(this);	
        }
}
