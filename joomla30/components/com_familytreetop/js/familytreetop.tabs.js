$FamilyTreeTop.create("tabs", function($){
    'use strict';
    var $this = this, $fn, $pull, $box, $tabs, $active = false;

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
        $tabs = $('.tab-content');
        $('#familyTreeTopTabs a').click(function (e) {
            if($(this).hasClass('dropdown-toggle')){
                return true;
            }

            var data = $(this).attr('data-familytreetop'),
                parts = data.split('/'),
                parent = $(this).parent().parent(),
                tab;

            $active = $($box).find('a[data-familytreetop="' + data + '"]');

            $($box).find('li').removeClass('active');
            if($(parent).hasClass('nav')){
                $($active).parent().addClass('active');
            } else {
                $($active).parent().parent().parent().addClass('active');
            }

            $($tabs).find('[familytreetop-tab="1"]').hide();
            tab = $($tabs).find('#'+parts[0]+'.tab-pane');
            $(tab).show();

            if(parts.length == 2){
                $(tab).find('[data-familytreetop="span"]').removeClass('span6').addClass('span12').hide();
                $(tab).find('#' + parts[1]).show();
            } else if(parts.length == 1){
                $(tab).find('[data-familytreetop="span"]').removeClass('span12').addClass('span6').show();
            }

            $this.click.call(this, "all", e);
            $(document.body).click();
            return false;
        });
    }

});