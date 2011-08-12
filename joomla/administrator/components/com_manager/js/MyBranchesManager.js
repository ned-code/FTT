function MyBranchesManager(){
	this.inc = 0;
	return this;
}

MyBranchesManager.prototype = {
    /*
     * @desc: renders module, appends it to specified container and runs module initializing script
     * @params: <int>module id, <string> container id
     */
    call:function(data){
    	var self = this;
    	if(typeof window[data['object']]=='function'){
    		eval('new '+data['object']+'("'+data['container']+'");');
    	}
        else {
        	setTimeout(function(){
        		self.call(data);
        	},1000);
        }
    }, 
    appendModule:function( id,  container_id){
    	var self = this;
        var xnr = jQuery.ajax({
          url: 'index.php?option=com_manager&task=getModule&f=module&id='+id,
            type: "GET",
            dataType: "html",
            complete : function (req, err) {   
            	if(!document.getElementById(container_id)) return;
                document.getElementById(container_id).innerHTML = req.responseText;
                jQuery.getJSON('index.php?option=com_manager&task=moduleScript&f=init&id='+id, function(data){
                	self.call(data);
                });
            }
        });
        if(storage&&storage.request) storage.request.add(xnr);
        return xnr;
    },
    /*
     * @desc: if module is loading for the first time includes its files, calls appendModule method
     * @params: <int>module id, <string> container id
     */
    includeModuleFiles:function(id,  container_id){
    	var self = this;
        for(var i =0; i<host.loadedModules.length; i++){
            if((host.loadedModules[i].id == id)){
                MyBranchesManager.prototype.appendModule(id, container_id);
                break;
            }
        }
        if(i==host.loadedModules.length){
            var mod = {};
            mod.id = id;
           host.loadedModules.push(mod);
           var xnr = jQuery.ajax({
                url: 'index.php?option=com_manager&task=getXML&f=append&id='+id,
                type: "GET",
                contentType: "xml",
                dataType: "xml",
                complete : function (req, err, url) {
                    if(req.responseXML.childNodes[0].nodeName=="xml")
                        var context=req.responseXML.childNodes[1];
                    else
                        var context=req.responseXML.childNodes[0];
                    var script;
                    for(var i=0; i < context.childNodes.length; i++){
                        switch (context.childNodes[i].nodeName){
                            case "js" :{
                                    script = document.createElement("script");
                                    script.src = context.childNodes[i].attributes[0].value;
                                    script.type="text/javascript";
                                    document.getElementsByTagName("head")[0].appendChild(script);
                                    break;}
                            case "css" :{
                                    script =  document.createElement("link");
                                    script.href = context.childNodes[i].attributes[0].value;
                                    script.rel="stylesheet";
                                    script.type="text/css";
                                    document.getElementsByTagName("head")[0].appendChild(script);
                                    break;}
                        }
                    }
                   self.appendModule(id, container_id);
                }
            });
            if(storage&&storage.request) storage.request.add(xnr);  
        }
    }, 
     getLayoutUrl:function(type){
        return storage.url+'tpl/'+type+'.tpl';
    },
    getComManagerXMLTree:function(){
       return 'index.php?option=com_manager&task=getXml&f=tree';
    }, 
    renderPage:function(div, obj){
        for(var i = 1; i <= obj.tdLength; i++){
            for(var j = 0; j < obj[i-1].divLength; j++){
                var div = jQuery('<div></div>');
                jQuery(div).attr('id', 'mod_'+i+'_'+j);
                jQuery('#page_layout_content_'+i).append(div);
                this.includeModuleFiles(obj[i-1][j].id, "mod_"+i+"_"+j);
            }
        }
    },
    callMethod:function(moduleName, methodName, args, callback){
          var xnr = jQuery.ajax({
            url: 'components/com_manager/php/getModules.php',
            type: "POST",
            data:{module:moduleName, method:methodName, arguments:args},
            dataType: "text",
            complete : function (req, err, url) {
                callback();
            }
          });
          if(storage&&storage.request) storage.request.add(xnr);
          return xnr;
    }
}