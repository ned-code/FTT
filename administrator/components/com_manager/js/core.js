// dhtmlx load event
storage = {};
storage.obj = {};
storage.url = '/components/com_manager/';
storage.baseurl = '';
host = new Host();
var date = new Date();
var id =  Math.floor(date.getTime() /1000);
storage.session = id;

storage.request = {};
storage.request.pull = {};
storage.request.pull.length = 0;
storage.request.key = function(){
	return (new Date()).valueOf();
}
storage.request.add = function(object, key){
	storage.request.pull[key] = object;
	storage.request.pull.length++;
}
storage.request.del = function(key){
	delete storage.request.pull[key];
	storage.request.pull.length--;
}
storage.request.cleaner = function(){
	var pull = storage.request.pull;
	if(pull.length!=0){
		for(var key in pull){
			if(key!='length'){
				pull[key].abort();
				delete pull[key];
			}
		}
	}
	storage.request.pull.length = 0;
}


storage.get = {
    baseurl:function(){
        var url =  storage.baseurl;
        var parts = url.split('/');
        var end = parts.splice(parts.length - 2 , 1 );
        return parts.join('/');
    }
}

storage.getJSON = function(str){
    var json;
    try {
        json = jQuery.parseJSON(str);
    } catch (e) {
        return false;
    }
    return json;
}

storage.stringBuffer = function(){
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

storage.callMethod = function(module, classname, method, args, callback){
    var url = storage.get.baseurl()+storage.url+'php/ajax.php';
    var key = storage.request.key();
    var xnr = jQuery.ajax({
        url: url,
        type: "POST",
        data: 'module='+module+'&class='+classname+'&method='+method+'&args='+args,
        dataType: "html",
        complete : function (req, err) {
            if(err == "success"){
                callback(req);
            } else {
                callback(false);
            }
        }
    });
    storage.request.add(xnr, key);
    return xnr;
}

dhtmlxEvent(window,"load",function(){
    var dhxLayoutParent, dhxLayout, dhxTree;
	
    dhxLayoutParent = new dhtmlXLayoutObject("dhxLayoutObj", "1C");

    dhxLayout = dhxLayoutParent.cells('a').attachLayout("2U");
    dhxLayout.cells("a").hideHeader();
    dhxLayout.cells("b").hideHeader();
    dhxLayout.cells("a").setWidth(200);
    dhxLayout.cells("a").fixSize(true);

    dhxTree = dhxLayout.cells("a").attachTree();
    dhxTree.setIconSize("16","16")
    dhxTree.setSkin('dhx_skyblue');
    var manager = new MyBranchesManager();    
    dhxTree.setImagePath("components/com_manager/codebase/imgs/csh_bluebooks_custom/");
    dhxTree.loadXML(manager.getComManagerXMLTree());
    storage.obj.dhxLayoutParent = dhxLayoutParent;
    storage.obj.dhxLayout = dhxLayout;
    storage.obj.dhxTree = dhxTree;

    dhxTree.attachEvent("onSelect", function(id){
    	var manager = new MyBranchesManager();
        var div = document.createElement("div");
        div.setAttribute("id", "container");
        div.style.height = '100%';
        dhxLayout.cells("b").attachObject(div);
        manager.includeModuleFiles(id, "container");
        }
    );
       
});
