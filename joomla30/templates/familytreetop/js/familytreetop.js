(function(w, undefined){
    'use strict';

    var $FamilyTreeTop = function(){
        this.app = {
            config:{
                appId:"208893339231244",
                status: true,
                coockie: true,
                xfbml: true
            },
            permissions:"user_about_me,user_birthday,user_relationships,user_photos,friends_photos,read_stream,read_insights"
        }

        this.bindPull = [];

        this.moduleLinkPull = {};
        this.modulePull = [];
    }

    $FamilyTreeTop.prototype.create = function(name, mod){
        this.modulePull.push({constructor:mod, object: null});
        this.moduleLinkPull[name] = this.modulePull.length - 1;
    }

    $FamilyTreeTop.prototype.bind = function(call){
        this.bindPull.push(call);
    }

    $FamilyTreeTop.prototype.init = function(){
        var $this = this;
        $this.bindPull.forEach(function(el){
            var F = function(){};
            F.prototype = $FamilyTreeTop.prototype.fn;
            el.call(new F(), jQuery);
        });

        $this.modulePull.forEach(function(el){
            console.log(el);
        });

    }

    $FamilyTreeTop.prototype.fn = {
        ajax:function(task, args,callback){
            jQuery.ajax({
                url:"index.php?option=com_familytreetop&task="+task,
                data:args,
                type: "POST",
                dataType:"json"
            }).done(callback);
        }
    }

    w.$FamilyTreeTop = new $FamilyTreeTop();
})(window)