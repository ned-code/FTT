(function(w, undefined){
    'use strict';

    var $FamilyTreeTop = function(){
        this.app = {
            config:{
                appId:false,
                status: true,
                coockie: true,
                xfbml: true
            },
            data:false,
            permissions:false
        }

        this.template = "";

        this.currenturl = "";
        this.rooturl = "";
        this.baseurl = "";
        this.templateurl = "";

        this.bindPull = [];

        this.moduleLinkPull = {};
        this.modulePull = [];

        this.dataString = "";
        this.userString = "";
        this.facebookString = "";
    }

    $FamilyTreeTop.prototype.fn = {
        ajax:function(task, args,callback){
            jQuery.ajax({
                url:"index.php?option=com_familytreetop&task="+task,
                data:args,
                type: "POST",
                dataType:"json"
            }).done(callback);
        },
        mod: function(name){
            return w.$FamilyTreeTop.mod(name);
        },
        app:function(){
            var ftt = w.$FamilyTreeTop;
            return {
                link: function(){
                    return ftt.app.data.link
                },
                description: function(){
                    return ftt.app.data.description;
                }
            }
        },
        url: function(path){
            var ftt = w.$FamilyTreeTop;
            if("undefined" === typeof(path)){
                path = "";
            }
            return {
                app: function(){
                    return $FamilyTreeTop.prototype.app().link() ;
                },
                base: function(e){
                    if("undefined" !== typeof(e)){
                        return ftt.baseurl + path;
                    }
                    return ftt.rooturl + path;
                },
                template: function(e){
                    if("undefined" !== typeof(e)){
                        return ftt.templateurl + path;
                    }
                    return ftt.rooturl + '/templates/' + ftt.template + path;
                }
            }
        },
        stringBuffer: function(){
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
                    del:function(){
                        b = "";
                        this.length = 0;
                        return this;
                    },
                    ret:function(){
                        return b;
                    }
                }
            }).call(this);
        },
        generateKey:function(){
            var s4 = function(){return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);}
            return s4()+s4()+s4()+s4()+s4()+s4()+s4()+s4();
        },
        isExist:function(array, name, value){
            var items = name.split('.'), prop, object, key, element;
            for(prop in array){
                if(!array.hasOwnProperty(prop)) continue;
                object = array[prop];
                for(key in items){
                    if(!items.hasOwnProperty(key)) continue;
                    element = items[key];
                    if("$" !== element && "undefined" !== typeof(object[element])){
                        object = object[element];
                    }
                }
                if(object == value){
                    return true;
                }
            }
            return false;
        }
    }

    $FamilyTreeTop.prototype.init = function(){
        var $this = this;

        $this.app.data = $.parseJSON($this.app.data);

        //init modules;
        $this.modulePull.forEach(function(el, id){
            var F = el.constructor;
            F.prototype = $FamilyTreeTop.prototype.fn;
            $this.modulePull[id].object = new F(jQuery);
        });
        //init scripts
        $this.bindPull.forEach(function(el){
            var F = function(){};
            F.prototype = $FamilyTreeTop.prototype.fn;
            el.call(new F(), jQuery);
        });
        //init
        $this.mod('tabs').init();
    }

    $FamilyTreeTop.prototype.mod = function(name){
        var id;
        if("undefined" !== typeof(this.moduleLinkPull[name])){
            id = this.moduleLinkPull[name];
            return this.modulePull[id].object;
        }
        return false;
    }

    $FamilyTreeTop.prototype.create = function(name, mod){
        this.modulePull.push({constructor:mod, object: null});
        this.moduleLinkPull[name] = this.modulePull.length - 1;
    }

    $FamilyTreeTop.prototype.bind = function(call){
        this.bindPull.push(call);
    }

    w.$FamilyTreeTop = new $FamilyTreeTop();
})(window)