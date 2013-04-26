$FamilyTreeTop.create("members", function($){
    'use strict';
    var $this = this,
        $users,
        $box = $('#membersTable'),
        $filter = $('#filterMembers'),
        $relPull = {"immediate_family":[], "grandparents":[], "grandchildren":[], "cousins":[], "in_laws":[], "unknown":[]},
        $pull = {},
        $fn;

    $fn = {
        setRelPullObject: function(object){
            var relId = object.relationId;
            if(relId > 0 && relId < 13 && relId != 9){
                $relPull["immediate_family"].push(object);
            } else if(relId == 103 || relId == 104 || relId == 203 || relId == 204){
                $relPull["grandparents"].push(object);
            } else if(relId == 105 || relId == 106 || relId == 205 || relId == 206){
                $relPull["grandchildren"].push(object);
            } else if(relId == 9){
                $relPull["cousins"].push(object);
            } else {
                $relPull["unknown"].push(object);
            }
        },
        createFilterList: function(){
            var ul = $($filter).find('ul'), prop, object, li;
            for(prop in $relPull){
                if(!$relPull.hasOwnProperty(prop)) continue;
                object = $relPull[prop];
                li = $(ul).find('[familytreetop="'+prop+'"]');
                $(li).find('[familytreetop="count"]').text(object.length);
            }
        },
        order: function(type){
            $users.map(function(){});
        },
        render: function(){
            $($box).find('tbody tr').remove();
            for ( var key in $users ){
                if(!$users.hasOwnProperty(key)) continue;
                var object = $this.mod('usertree').user($users[key].gedcom_id);
                var birth = object.birth();
                var tr = $('<tr></tr>');
                $fn.setRelPullObject(object);
                $(tr).append('<td>'+object.relation+'</td>');
                $(tr).append('<td>'+object.name()+'</td>');
                $(tr).append('<td>'+$this.mod('usertree').parseDate(birth.date)+'</td>');
                $(tr).append('<td class="visible-desktop">'+$this.mod('usertree').parsePlace(birth.place)+'</td>');
                $($box).append(tr);
            }
        }
    }

    $this.init = function(){
        //table user rows
        $users = $this.mod('usertree').getUsers();
        $fn.render();

        //sort header columns
        $($box).find('[familytreetop="sort"]').click(function(){
            var type = $(this).attr('familytreetop-type');
            $fn.order(type);
            $fn.render();
            return false;
        });

        //filter checkbox
        $fn.createFilterList();

        //input search
        var find = function(){
            var temp = $('input.input-medium.search-query').val();
            if(temp.length == 0){
                $('#membersTable tbody tr').show();
            } else {
                $('#membersTable tbody td:nth-child(2):not(:contains("'+temp+'"))').parent().hide();
            }
        }
        $('html').keyup(function(e){if(e.keyCode == 8)find()});
        $('input.input-medium.search-query').keypress(find);
    }
});