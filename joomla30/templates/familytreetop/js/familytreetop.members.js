$FamilyTreeTop.create("members", function($){
    'use strict';
    var $this = this,
        $users,
        $box = $('#membersTable'),
        $filter = $('#filterMembers'),
        $relPull = {"immediate_family":[], "grandparents":[], "grandchildren":[], "cousins":[], "in_laws":[], "unknown":[]},
        $pull = {},
        $sort = false,
        $isGender = true,
        $isLiving = true,
        $isMembers = true,
        $isRegistered = true,
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
            var relId = object.relationId, inLaw = object.inLaw;
            if(inLaw){
                $relPull["in_laws"].push(object);
            } else if(relId > 0 && relId < 13 && relId != 9){
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
        isSortable: function(object){
            if(!$sort){
                return true;
            } else if("undefined" !== typeof($sort["unknown"]) && !object.relationId){
                return true;
            } else if("undefined" !== typeof($sort[1000]) && object.inLaw){
                return true;
            } else if (object.relationId in $sort && !object.inLaw) {
                return true;
            }
            return false;
        },
        isGender: function(object){
            if("object" == typeof($isGender)){
                return (object.gender == $isGender['gender']);
            } else {
                return true;
            }
        },
        isLiving: function(object){
            if("object" == typeof($isLiving)){
                return (object.isAlive() == $isLiving['alive']);
            } else {
                return true;
            }
        },
        isRegistered: function(object){
            if("object" == typeof($isRegistered)){
                if(object.facebook_id != 0 && $isRegistered['registered']){
                    return true
                } else if(object.facebook_id != 0 && !$isRegistered['registered']){
                    return false;
                } else if(object.facebook_id == 0 && $isRegistered['registered']){
                    return false;
                } else if(object.facebook_id == 0 && !$isRegistered['registered']){
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        },
        render: function(){
            var key, object, birth, tr,td, avatar;
            $($box).find('tbody tr').remove();
            $users.sort(function(a,b){
                if(a.facebook_id == 0 && b.facebook_id == 0){
                    return 0;
                } else if(a.facebook_id != 0 && b.facebook_id == 0){
                    return -1;
                } else if(a.facebook_id == 0 && b.facebook_id != 0){
                    return 1;
                }
            });
            for (key in $users){
                if(!$users.hasOwnProperty(key)) continue;
                object = $users[key];
                birth = object.birth();
                tr = $('<tr class="familytreetop-hover-effect" gedcom_id="'+object.gedcom_id+'"></tr>');
                if($fn.isSortable(object)&&$fn.isGender(object)&&$fn.isLiving(object)&&$fn.isRegistered(object)){
                    avatar = object.avatar(["25","25"]);
                    $fn.setRelPullObject(object);
                    $(tr).append('<td><i class="icon-leaf"></i>'+object.relation+'</td>');
                    td = $('<td style="'+getPadding(avatar)+'" data-familytreetop-color="'+object.gender+'" gedcom_id="'+object.gedcom_id+'"></td>');
                    if($this.mod('usertree').isAvatar(avatar)){
                        var div = $(document.createElement('div'));
                        $(div).addClass('pull-left');
                        $(div).append(avatar);
                        $(td).append(div);
                    }
                    $(td).append('<div class="pull-left" style="'+getMaxWidth(avatar)+'"> <span style="cursor:pointer;">'+object.name()+'</span></div>');
                    $(tr).append(td);
                    $(tr).append('<td style="width:95px;">'+$this.mod('usertree').parseDate(birth.date)+'</td>');
                    $(tr).append('<td style="text-align: right;">'+$this.mod('usertree').parsePlace(birth.place)+'</td>');
                    $($box).append(tr);
                    $this.mod('popovers').render({
                        target: $(tr).find('td[gedcom_id]')
                    });
                    $this.mod('familyline').bind(tr, object.gedcom_id);
                }
            }
            return true;
            function getMaxWidth(a){
                return ($this.mod('usertree').isAvatar(avatar))?"max-width:200px;line-height: 35px;padding-left: 5px;":"";
            }
            function getPadding(a){
                return ($this.mod('usertree').isAvatar(avatar))?"padding:5px;":"padding:10px;";
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
            $sort = {};
            $($filter).find('[class-familytreetop="module-padding"] input:checked').each(function(i,e){
                var type = $(e).parent().parent().attr('familytreetop');
                switch(type){
                    case "immediate_family":
                        $sort[1] = true;
                        $sort[2] = true;
                        $sort[3] = true;
                        $sort[4] = true;
                        $sort[5] = true;
                        $sort[6] = true;
                        $sort[7] = true;
                        $sort[8] = true;
                        $sort[10] = true;
                        $sort[11] = true;
                        $sort[12] = true;
                        $sort[13] = true;
                        $sort[110] = true;
                        $sort[111] = true;
                        $sort[112] = true;
                        $sort[113] = true;
                        $sort[210] = true;
                        $sort[211] = true;
                        $sort[212] = true;
                        $sort[213] = true;
                    break;
                    case "grandparents":  $sort[103] = true; $sort[104] = true; $sort[203] = true; $sort[204] = true; break;
                    case "grandchildren": $sort[105] = true; $sort[106] = true; $sort[205] = true; $sort[206] = true; break;
                    case "cousins": $sort[9] = true; break;
                    case "in_laws": $sort[1000] = true; break;
                    case "unknown": $sort["unknown"] = true;
                }
            });
            $fn.render();
        });

        $($filter).find('.btn').click(function(){
            if($(this).hasClass('disabled')) return false;
            $(this).parent().find('.btn').removeClass('disabled');
            $(this).addClass('disabled');

            var type = $(this).attr('familytreetop').split(':');
            switch(type[0]){
                case "gender":
                    if(type[1] == "both"){
                        $isGender = true;
                    } else {
                        $isGender = {};
                        $isGender['gender'] = (type[1]=="male")?1:0;
                    }
                    break;
                case "living":
                    if(type[1] == "both"){
                        $isLiving = true;
                    } else {
                        $isLiving = {};
                        $isLiving['alive'] = (type[1]=="yes");
                    }
                    break;
                case "members":

                    break;
                case "registered":
                    if(type[1] == "both"){
                        $isRegistered = true;
                    } else {
                        $isRegistered = {};
                        $isRegistered['registered'] = (type[1]=="yes");
                    }
                    break;
            }
            $fn.render();
        });

        $('html').keyup(function(e){if(e.keyCode == 8)find()});
        $('input.input-medium.search-query').keypress(find);
    }
});