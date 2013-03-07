$FamilyTreeTop.create("families", function($){
    'use strict';

    var $this = this, $animated, $box = $('#families'), $boxs = [], $fn;

    $fn = {
        getSettings: function(settings){
            return $.extend({}, settings, {
                animation: true,
                abilityToMove: true,
                editable: true,
                iconHome: true
            });
        },
        createArrow: function(type){
            var left = Math.ceil(((type  == 'up')?160:110)/2) - 7;
            return $('<div style="position:absolute;left:'+left+'px;top: -20px; cursor:pointer;"><i class="icon-circle-arrow-'+type+'"></i></div>');

        },
        createEdit: function(object, gedcom_id){
            $this.mod('editmenu').render(object, gedcom_id);
        },
        createBox: function(ind, cl, type, args){
            if(!ind) return [];
            var divs = $(cl).find('div');
            $(cl).attr('gedcom_id', ind.gedcom_id);
            $(divs[0]).find('img').attr('gedcom_id', ind.gedcom_id);
            $(divs[1]).text(ind.name());
            $(divs[2]).text('...');

            if(args.abilityToMove){
                $(divs[0]).append($fn.createArrow(type));
            }
            if(args.editable){
                $fn.createEdit(divs[0], ind.gedcom_id);
            }
            return cl;
        },
        createParent: function(id, args){
            var ind = $this.mod('usertree').user(id);
            var cl = $($box).find('.parent-box').clone();
            return $fn.createBox(ind, cl, 'up', args);
        },
        createChild: function(id, args){
            var ind = $this.mod('usertree').user(id);
            var cl = $($box).find('.child-box').clone();
            return $fn.createBox(ind, cl, 'down', args);
        },
        createEvent: function(){
            return $('<div>...</div>');
        },
        setPosition: function(boxs){
            if($animated) return true;
            boxs.forEach(function(object, index){
                $(object).css('position', 'absolute');
                switch(index){
                    case 0:
                    case 1:
                        $(object).css('top', getTop(index)).css((index)?"left":"right", getParentIndent(index));
                        break;

                    case 2:
                        $(object).css('top', getEventTop()).css('left', getEventLeft());
                        break;

                    default:
                        $(object).css('top', getTop(index)).css("left", getLeft(index));
                        break;
                }
            });
            $('#thisMonth .span12').css('position', 'relative').css('min-height', getMinHeight());
            return true;
            function getRows(){
                var length = boxs.length - 3;
                var width = $('.tab-content').width();
                var limit = Math.ceil(width / (120 * length));
                var rows = Math.ceil(length/limit);
                return [Math.round(length/rows), limit, width];
            }
            function getMinHeight(){
                var height = (getRows()[0] * 270);
                return height * 0.1 + 250 + height;
            }
            function getEventTop(){
                var height = getMinHeight();
                return height * 0.1 + 70;
            }
            function getTop(index){
                var height = getMinHeight();
                if(index < 3){
                    return height * 0.1;
                } else {
                    var objectHeight = $(boxs[0]).height();
                    var rows = getRows();
                    var row = Math.ceil((index - 2)/rows[0]);
                    return height * 0.1 + 250 + 110*(row - 1);
                }

            }
            function getEventLeft(){
                var width = $('.tab-content').width();
                return Math.ceil(width/2);
            }
            function getParentIndent(index){
                var width = $('.tab-content').width();
                var half = Math.ceil(width/2);
                var space = half - 160;
                if(space <= 0){
                    return space;
                } else {
                    return Math.ceil(space/2);
                }
            }
            function getLeft(index){
                var length = boxs.length - 3,
                    len = index - 2,
                    rows = getRows(),
                    row = Math.ceil(len / rows[0]),
                    indent = 0,
                    position;
                if(row == rows[0] && length != rows[1]){
                    indent = Math.round((rows[2] - length * 110) / 2);
                }
                if(row == 1){
                    position = len;
                } else {
                    position = rows[1]*row - len;
                }
                return 5 + (position - 1) * 110 + indent;
            }
        },
        setPopovers:function(boxs){
            boxs.forEach(function(object){
                var target = $(object).find('img');
                $this.mod('popovers').render({
                    target: target
                });
            });
        },
        click:function(){

        },
        initHome: function(object){
            $(object).append($($box).find('[familytreetop="home"]'));
        },
        init: function(parent, settings){
            $(parent).css('position', 'relative');
            $(parent).css('min-height', '100px');
            if(settings.iconHome){
                $fn.initHome(parent);
            }
        },
        append: function(parent, box){
            $boxs.push(box);
            $(parent).append(box);
        },
        animation: function(){}
    };

    $this.render = function(parent, settings){
        var $usermap, $start_id, $childrens, $family;

        if("undefined" === typeof(settings)){
            settings = {};
        }
        settings = $fn.getSettings(settings);
        $fn.init(parent, settings);

        $usermap = $this.mod('usertree').usermap();
        $start_id = $usermap.gedcom_id;
        if($start_id == null){
            return false;
        }

        $childrens = $this.mod('usertree').getChildrens($start_id);
        if($childrens.length == 0){
            $family = $this.mod('usertree').getParents($start_id);
            $childrens = $this.mod('usertree').getChildrensByFamily($family.family_id);
        } else {
            $family = $this.mod('usertree').getFamilyIdByGedcomId($start_id);
        }

        $fn.append(parent, $fn.createParent($family.father, settings));
        $fn.append(parent, $fn.createParent($family.mother, settings));
        $fn.append(parent, $fn.createEvent());

        $childrens.forEach(function(gedcom_id){
            $fn.append(parent, $fn.createChild(gedcom_id, settings));
        });

        $fn.setPosition($boxs);
        $fn.setPopovers($boxs);

        if(settings.animation){
            $fn.animation($boxs);
        }

        $(window).resize(function(){
            $fn.setPosition($boxs);
        })
    };

});