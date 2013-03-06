$FamilyTreeTop.create("tabs", function($){
    'use strict';
    var $this = this, $pull;

    $pull = {};

    $this.bind = function(id, call){
        if("undefined" === typeof($pull[id])){
            $pull[id] = [];
        }
        $pull[id].push(call);
    }

    $this.click = function(target, e){
        if("undefined" === typeof($pull[target])) return false;
        $pull[target].forEach(function(call){
            call(e);
        })
    }

    $this.init = function(){
        $('#familyTreeTopTabs a').click(function (e) {
            var target = $(this).attr('href');
            $this.click.call(this, target, e);
        });
    }

});