(function(w, undefined){
    'use strict';

    var $FamilyTreeTop = function(){
        this.bindPull = [];
        this.objectPull = {};
    }

    $FamilyTreeTop.prototype.bind = function(call){
        this.bindPull.push([call]);
    }

    $FamilyTreeTop.prototype.init = function(){
        this.bindPull.forEach(function(el){
            var F = function(){};
            F.prototype = $FamilyTreeTop.prototype.fn;
            el[0].call(new F(), jQuery);
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
        },
        getFacebookPermissions:function(){
            return "user_about_me,user_birthday,user_relationships,user_photos,friends_photos,read_stream,read_insights";
        }
    }

    w.$FamilyTreeTop = new $FamilyTreeTop();
})(window)