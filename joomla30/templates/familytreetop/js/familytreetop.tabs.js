$FamilyTreeTop.create("tabs", function($){
    'use strict';
    var $this = this, $fn, $pull, $box, $active = false;

    $pull = {
        all: []
    };

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
        });
    }

    $this.init = function(){
        $box = $('#familyTreeTopTabs');
        $('#familyTreeTopTabs a').click(function (e) {
            if($(this).hasClass('dropdown-toggle')){
                return true;
            }

            var data = $(this).attr('data-familytreetop'),
                parent = $(this).parent().parent();
            $active = $($box).find('a[data-familytreetop="' + data + '"]');

            if($(parent).hasClass('nav')){
                $($box).find('li').removeClass('active');
                $($active).parent().addClass('active');
            }

            

            $this.click.call(this, "all", e);
            return false;
        });
    }

});