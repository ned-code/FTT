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
            permissions:"user_about_me,user_birthday,user_relationships,user_photos,friends_photos,read_stream,read_insights"
        }



        this.bindPull = [];

        this.moduleLinkPull = {};
        this.modulePull = [];

        this.dataString = "";
        this.userString = "";
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
        }
    }

    $FamilyTreeTop.prototype.init = function(){
        var $this = this;
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