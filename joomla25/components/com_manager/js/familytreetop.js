/*
 (function($, $ftt){
 $ftt.module.create("MOD_", function(name, parent, ajax, renderType, popup){

 return this;
 });
 })(jQuery, $FamilyTreeTop);
 */


/**
 * FamilyTreeTop Object
 */
(function(w){
    var $ftt = {};
    w.$FamilyTreeTop = $ftt;

    $ftt.global = {
        base: "",
        alias: "",
        loginType: 0,
        path: "components/com_manager/"
    }

    $ftt.dev = {
        __debug__:false,
        message:function(){
            if(this.__debug__){
                console.log(arguments);
            }
            return false;
        }
    }

    $ftt.module = {
        active:{},
        type:{},
        system:{},
        normal:{},
        isExist:function(type, name){
            return ("undefined" !== typeof(this[type][name]));
        },
        isTypeExist:function(name){
            return ("undefined" !== typeof(this.type[name]));
        },
        extend: function(child, parent){
            for(var method in parent){
                if(!parent.hasOwnProperty(method)) continue;
                child[method] = parent[method];
            }
            return child;
        },
        get:function(name){
            var module = this;
            if(module.isTypeExist(name)){
                var type = module.type[name];
                if(module.isExist(type, name)){
                    return module[type][name];
                }
            }
            return $ftt.dev.message("this module doesn't exist.");
        },
        create:function(name, value, system){
            var module = this;
            if(!module.isTypeExist(name)){
                var type = ("undefined" !== typeof(system))?"system":"normal";
                if(!module.isExist(type, name)){
                    module.type[name] = type;
                    module[type][name] = { object:value, data:{}, init:function(){ module.init(name); } };
                    if("undefined" !== typeof(system)){
                        module[type][name].init();
                    }
                    return true;
                }
            }
            return $ftt.dev.message("this module already exist.");
        },
        destroy:function(name){
            var module = this;
            if(module.isTypeExist(name)){
                var type = module.type[name];
                if(module.isExist(type, name)){
                    delete module.type[name];
                    delete module[type][name];
                    delete module.active[name];
                    return true;
                }
            }
            return $ftt.dev.message("this module doesn't exist.");
        },
        init:function(name){
            var module = this;
            if(module.isTypeExist(name)){
                var type = module.type[name];
                if(module.isExist(type, name)){
                    module.active[name] = module[type][name].object.apply({ fn:module.extend({}, $ftt.fn), data:module[type][name].data, dev:$ftt.dev }, arguments);
                    return true;
                }
            }
            return $ftt.dev.message("this module doesn't exist.");
        }
    }

    $ftt.fn = {
        json:function(str){
            var json;
            try {
                json = jQuery.parseJSON(str);
            } catch (e) {
                return false;
            }
            return json;
        },
        mod:function(name, normal){
            var name = "MOD_"+(("undefined" !== typeof(normal))?"":"SYS_")+name.toUpperCase();
            if("undefined" !== typeof($ftt.module.active[name])){
                return $ftt.module.active[name];
            } else {
                return {
                    error:true,
                    init:function(){
                        console.log(name+" module doesn't exist", arguments);
                    }
                }
            }
        },
        call:function(module, classname, method, args, callback, mandatory){
            $FamilyTreeTop.fn.mod("ajax").call(module, classname, method, args, callback, mandatory);
        },
        user:function(){
            var usertree;
            if(usertree = $FamilyTreeTop.fn.mod("usertree")){
                return usertree.user(true);
            }
            return false;
        },
        usertree:function(){
          return $FamilyTreeTop.fn.mod("usertree");
        },
        facebook:function(){
            return $FamilyTreeTop.fn.mod("facebook");
        },
        avatar:function(){
            return $FamilyTreeTop.fn.mod("avatar");
        },
        photos:function(){
            return $FamilyTreeTop.fn.mod("photos");
        },
        alert:function(message, callback){
            var object = jQuery('<div style="text-align: center;"></div>');
            if (!message) {
                message = '';
            }
            if (typeof(message) == "string") {
                jQuery(object).text(message);
            } else if (typeof(message) == "object") {
                jQuery(object).append(message);
            }
            jQuery(object).dialog({
                width:350,
                minHeight:80,
                resizable:false,
                draggable:false,
                closeOnEscape:false,
                modal:true,
                close:callback
            });
        },
        stringBuffer:function(){
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
        }
    }
})(window);
