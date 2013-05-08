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
        getUserArray: function(users){
            var result = [];
            for(var prop in users){
                if(!users.hasOwnProperty(prop)) continue;
                var user = $this.mod('usertree').user(users[prop].gedcom_id);
                result.push(user);
            }
            return result;
        },
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
        orderByRelation: function(a,b){
            var _a = parseInt(a.relationId), _b = parseInt(b.relationId);
            if(_a == 0 && _b == 0){
                return 0;
            } else if(_a != 0 && _b == 0){
                return -1
            } else if(_a == 0 && _b != 0){
                return 1;
            } else if(_a < _b){
                return -1;
            } else if(_a > _b){
                return 1;
            } else if(_a == _b){
                return 0;
            }
        },
        orderByName: function(a,b){
            var compA = a.name().toUpperCase();
            var compB = b.name().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        },
        orderByYear: function(a,b){
            var aB = a.birth();
            var bB = b.birth();
            if(!aB && !bB){
                return 0;
            } else if(aB && !bB){
                return -1;
            } else if(!aB && bB){
                return 1;
            } else {
                var aDate = (aB.date.start_year!=null)?parseInt(aB.date.start_year):0;
                var bDate = (bB.date.start_year!=null)?parseInt(bB.date.start_year):0;
                if(aDate > bDate){
                    return -1;
                } else if(aDate < bDate){
                    return 1;
                } else {
                    return 0;
                }
            }
        },
        orderByPlace: function(a,b){
            var aB = a.birth();
            var bB = b.birth();
            if(!aB && !bB){
                return 0;
            } else if(aB && !bB){
                return -1;
            } else if(!aB && bB){
                return 1;
            } else {
                var aPlace = (aB.place.country!=null)?aB.place.country.toUpperCase():"";
                var bPlace = (bB.place.country!=null)?bB.place.country.toUpperCase():"";
                return (aPlace < bPlace) ? -1 : (aPlace > bPlace) ? 1 : 0;
            }
        },
        order: function(type){
            $users.sort(function(a,b){
                return $fn['orderBy'+type](a,b);
            })
        },
        render: function(){
            $($box).find('tbody tr').remove();
            for ( var key in $users ){
                if(!$users.hasOwnProperty(key)) continue;
                var object = $users[key];
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
        $users = $fn.getUserArray($this.mod('usertree').getUsers());
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

        $($filter).find('[class-familytreetop="module-padding"] input').click(function(){
            console.log(this);
        });

        $($filter)

        $('html').keyup(function(e){if(e.keyCode == 8)find()});
        $('input.input-medium.search-query').keypress(find);
    }
});