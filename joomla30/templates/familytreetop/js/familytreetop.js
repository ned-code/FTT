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

        this.dataString = {};
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

    $FamilyTreeTop.prototype.init = function(){
        var $this = this;
        $this.modulePull.forEach(function(el, id){
            var F = el.constructor;
            F.prototype = $FamilyTreeTop.prototype.fn;
            $this.modulePull[id].object = new F(jQuery);
        });

        $this.bindPull.forEach(function(el){
            var F = function(){};
            F.prototype = $FamilyTreeTop.prototype.fn;
            el.call(new F(), jQuery);
        });
    }

    $FamilyTreeTop.prototype.create = function(name, mod){
        this.modulePull.push({constructor:mod, object: null});
        this.moduleLinkPull[name] = this.modulePull.length - 1;
    }

    $FamilyTreeTop.prototype.bind = function(call){
        this.bindPull.push(call);
    }

    $FamilyTreeTop.prototype.mod = function(name){
        var id;
        if("undefined" !== typeof(this.moduleLinkPull[name])){
            id = this.moduleLinkPull[name];
            return this.modulePull[id].object;
        }
        return false;
    }



    w.$FamilyTreeTop = new $FamilyTreeTop();
})(window)