function Host(){
    this.loadedModules = new Array();
}

Host.prototype = {
        callMethod:function(module, classname, method, args, callback){
            var url = 'index.php?option=com_manager&task=callMethod';
			jQuery.ajax({
				url: url,
				type: "POST",
				data: 'module='+module+'&class='+classname+'&method='+method+'&args='+args,
				dataType: "html",
				complete : function (req, err) {
					callback(req);
				}
			});
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
        }



}
