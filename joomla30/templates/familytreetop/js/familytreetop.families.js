$FamilyTreeTop.create("families", function($){
    'use strict';

    var $this = this, $animated, $box = $('#families'), $boxs = {}, $fn;

    $fn = {
        getSettings: function(settings){
            if(settings.id != null){
                return settings;
            } else {
                settings =  $.extend({}, {
                    id: null,
                    parent: null,
                    gedcom_id: false,
                    animation: true,
                    abilityToMove: true,
                    editable: true,
                    iconHome: true
                }, settings);
                if(settings.id == null){
                    settings.id = $this.generateKey();
                }
                return settings;
            }
        },
        getStartIdByParents: function(id){
            var family = $this.mod('usertree').getParents(id);
            return family.mother;
        },
        createArrow: function(type, args){
            var left = Math.ceil(((type  == 'up')?160:110)/2) - 7;
            return $('<div style="position:absolute;left:'+left+'px;top: -20px; cursor:pointer;"><i class="icon-circle-arrow-'+type+'"></i></div>')
                .click(function(){
                    $fn.click.call(this, args);
                });
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

            if(args.abilityToMove && ((type == "up" && ind.isParentsExist()) || (type == "down" && ind.isChildrensExist())) ){
                $(divs[0]).append($fn.createArrow(type, args));
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
                        $(object).css('top', getTop(index)).css((index)?"right":"left", getParentIndent(index));
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
                return [ Math.ceil(length/limit), limit, width];
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
                    var row = Math.ceil((index - 2)/rows[1]);
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
                    row = Math.ceil(len / rows[1]),
                    indent = 0,
                    position;

                if(row == rows[0] && length != rows[1]){
                    indent = Math.round((rows[2] - length * 120) / 2);
                }
                if(row == 1){
                    position = len;
                } else {
                    position = rows[1]*row - len;
                }
                return (position - 1) * 120 + indent;
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
        setIconHome: function(parent){
            $(parent).append($($box).find('[familytreetop="home"]'));
        },
        click:function(settings){
            var gedcom_id = $(this).parent().parent().attr('gedcom_id');
            var arrow = $(this).find('i').attr('class').split('-').pop();
            settings.gedcom_id = (arrow == "down")?gedcom_id:$fn.getStartIdByParents(gedcom_id);
            $this.mod('popovers').hide();
            $this.render(settings);
        },
        clear:function(settings){
            if("undefined" != typeof($boxs) && "undefined" !== typeof($boxs[settings.id])){
                $boxs[settings.id].forEach(function(el){
                    $(el).unbind().remove();
                });
                delete $boxs[settings.id];
            }
        },
        init: function(settings){
            $(settings.parent).css('position', 'relative');

            $fn.clear(settings);

            if(settings.iconHome){
                $fn.setIconHome(settings.parent);
            }
        },
        append: function(settings, box){
            if("undefined" === typeof($boxs[settings.id])){
                $boxs[settings.id] = [];
            }
            $boxs[settings.id].push(box);
            $(settings.parent).append(box);
        },
        animation: function(){}
    };

    $this.render = function(settings){
        var $usermap, $start_id, $sircar, $spouses, $childrens, $family;

        settings = $fn.getSettings(settings);

        if(settings.parent == null){
            return false;
        }

        $fn.init(settings);

        if(settings.gedcom_id){
            $start_id = settings.gedcom_id;
        } else {
            $usermap = $this.mod('usertree').usermap();
            $start_id = $usermap.gedcom_id;
        }

        if($start_id == null){
            return false;
        }

        $childrens = $this.mod('usertree').getChildrens($start_id);
        if($childrens.length == 0){
            $start_id = $fn.getStartIdByParents($start_id);
            $childrens = $this.mod('usertree').getChildrens($start_id);
        }
        $spouses = $this.mod('usertree').getSpouses($start_id);

        $fn.append(settings, $fn.createParent($start_id, settings));
        $fn.append(settings, $fn.createParent($spouses[0], settings));
        $fn.append(settings, $fn.createEvent($spouses[0]));

        $childrens.forEach(function(gedcom_id){
            $fn.append(settings, $fn.createChild(gedcom_id, settings));
        });

        $fn.setPosition($boxs[settings.id]);
        $fn.setPopovers($boxs[settings.id]);
    };

});