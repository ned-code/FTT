$FamilyTreeTop.create("families", function($){
    'use strict';

    var $this = this, $animated, $box = $('#familiesHide'), $boxs = {}, $canvas = false, $start_id, $fn;

    $fn = {
        getSettings: function(settings){
            if(settings && settings.id != null){
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
        getCssParam: function(object ,name){
            var string = $(object).css(name);
            if("undefined" === typeof(string) || string.length == 0 || "auto" === string){
                return false;
            } else {
                return string.replace (/px/g, "");
            }
        },
        createArrow: function(type, args){
            var left = Math.ceil(((type  == 'up')?150:100)/2) - 12;
            return $('<div style="position:absolute;left:'+left+'px;top: -30px; cursor:pointer;background:white;"><a style="text-decoration: none;" onclick="return false;"><i class="icon-2x icon-circle-arrow-'+type+'"></i></a></div>')
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
            $(divs[1]).text((type=="up")?ind.name():ind.first_name);
            $(divs[2]).text(ind.birth('date.start_year'));

            var img = $(divs[0]).find('img');
            var avatar = ind.avatar((type=="up")?["140","140"]:["90","90"]);
            $(img).parent().append(avatar);
            $(img).remove();

            Holder.run({
                images: avatar[0]
            });

            if(args.abilityToMove && ((type == "up" && ind.isParentsExist()) || (type == "down" && (ind.isChildrensExist()||ind.isSpouseExist()) )) ){
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
        createEvent: function(id1, id2){
            var family = _getFamily_($this.mod('usertree').getFamilies(id2));
            var event = $this.mod('usertree').getFamilyEvent(family.family_id);
            var div = $(document.createElement('div'));
            $(div).append(_getData_(event.date));
            $(div).append(_getPlace_(event.place));
            return div;
            function _getData_(d){
                return $(document.createElement('div')).text($this.mod('usertree').parseDate(d));
            }
            function _getPlace_(p){
                return $(document.createElement('div')).text($this.mod('usertree').parsePlace(p));
            }
            function _getFamily_(f){
                for(var k in f){
                    if(!f.hasOwnProperty(k)) continue;
                    if(f[k].wife == id1 || f[k].husb == id1){
                        return f[k];
                    }
                }
            }
        },
        setPosition: function(boxs, settings){
            if($animated) return true;
            var boxes = [];
            boxs.forEach(function(object, index){
                $(object).css('position', 'absolute');
                switch(index){
                    case 0:
                    case 1:
                        $(object).css('top', getTop(index)).css("left", getParentIndent(index));
                        break;

                    case 2:
                        $(object).css('top', getEventTop(object, getTop(0))).css('left', getEventLeft(object));
                        break;

                    default:
                        $(object).css('top', getTop(index)).css("left", getLeft(index));
                        break;
                }
                boxes.push(object);
            });
            $(settings.parent).css('position', 'relative').css('min-height', getMinHeight());
            if($canvas){
                $($canvas).remove();
            }
            $canvas = $('<canvas height="'+getMinHeight()+'" width="'+$(settings.parent).width()+'" ></canvas>');
            $(settings.parent).append($canvas);

            $fn.drawCanvasArrow(boxes, settings);
            return true;
            function getRows(){
                var length = boxs.length - 3;
                var width = parseInt($(settings.parent).width());
                var rows = Math.ceil( (120 * length) / width );
                var limit = Math.ceil(length / rows);
                if(limit * rows < length){
                    rows++
                }
                return [rows, limit, width];
            }
            function getMinHeight(){
                var height = (getRows()[0] * 270);
                return height * 0.1 + 285 + height;
            }
            function getEventTop(obj, top){
                var h = $(obj).height();
                if(h == 0){
                    h = getTextHeight.call(obj);
                }
                return top + Math.ceil(150/2) - h - 10;
                function getTextHeight(font){
                    var f = font || '14px "Helvetica Neue",Helvetica,Arial,sans-serif',
                        o = $('<div>' + (this).html() + '</div>')
                            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
                            .appendTo($('body')),
                        h = o.height();
                    o.remove();
                    return h;
                }
            }
            function getTop(index){
                var height = getMinHeight();
                if(index < 3){
                    return height * 0.1;
                } else {
                    var rows = getRows();
                    var row = Math.ceil((index - 2)/rows[1]);
                    return height * 0.1 + 250 + 190*(row - 1);
                }

            }
            function getEventLeft(object){
                var w, p1, p2, k = 135;
                w = $(object).width();
                if(w == 0){
                    w = getTextWidth.call(object);
                }
                p1 = getNum.call($(boxes[0]).css('left'));
                p2 = getNum.call($(boxes[1]).css('left'));
                return ((p1 + k) + ((p2 - (p1 + k))/2 - (w/2)));
                function getNum(){ return ("undefined"!==typeof(this))?parseInt(this.replace(/[^-\d\.]/g, '')):0; };
                function getTextWidth(font){
                    var f = font || '14px "Helvetica Neue",Helvetica,Arial,sans-serif',
                        o = $('<div>' + (this).html() + '</div>')
                            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
                            .appendTo($('body')),
                        w = o.width();
                    o.remove();
                    return w;
                }
            }
            function getParentIndent(index){
                var width = parseInt($(settings.parent).width());
                var halfWidth = Math.ceil(width/2);
                var space = getSpace(halfWidth);
                return (index)?halfWidth + space:space;
                function getSpace(w){
                    var s = w - 150;
                    if(s <= 0){
                        return s;
                    } else {
                        return Math.ceil(s/2);
                    }
                }
            }
            function getLeft(index){
                var rows = getRows(), length = index - 2, step = 0, margin = 0;
                if(length <= rows[1]){
                    step = length;
                } else {
                    step = _getStepLength_(rows[1], length);
                }
                margin = _getMargin_(rows, index);
                return (step - 1) * 110 + margin;
                function _getStepLength_(limit, length){
                    var len = length - limit;
                    if(len <= limit || limit == 0){
                        return len;
                    }
                    return _getStepLength_(limit, len);
                }
                function _getMargin_(rows, index){
                    var count = _getCountOnRow_(rows, index);
                    return Math.ceil((rows[2] - count*110)/2);
                }
                function _getCountOnRow_(rows, index){
                    var length = boxs.length - 3, row = Math.ceil((index - 2)/rows[1]);
                    if(length - row*rows[1] >= 0){
                        return rows[1];
                    } else {
                        return length- (row-1)*rows[1];
                    }
                }
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
            var home = $($box).find('[familytreetop="home"]').clone();
            $(parent).append(home);
            return home;
        },
        drawCanvasArrow: function(boxs, settings){
            var canvas = $($box).find('canvas'), canvas, points = [], path = false;
            boxs.forEach(function(object, index){
                var point = {
                    object: object,
                    index: index,
                    top:$fn.getCssParam(object, "top"),
                    left:$fn.getCssParam(object, "left"),
                    right:$fn.getCssParam(object, "right"),
                    parent:$(object).hasClass('parent-box')
                }
                points.push(point);
            });
            canvas = new fabric.StaticCanvas($canvas[0]);

            var parentLineCoords = [parseInt(points[0].left) + 70, parseInt(points[0].top) + 70, parseInt(points[1].left) + 70, parseInt(points[1].top) + 70];
            var center = getCenter(parentLineCoords);
            canvas.add(drawLine(parentLineCoords));
            if(points.length > 3){
                canvas.add(drawLine([center[0], center[1], center[0], center[1] + 100]));
            }
            points.forEach(function(e,i){
                switch(i){
                    case 0:case 1:
                        var img = $(e.object).find('.icon-circle-arrow-up');
                        if(img.length == 1){
                            var top = parseInt(e.top);
                            var ident = parseInt(e.left) + 76;
                            canvas.add(drawLine([ident, top, ident, top - 50]));
                        }
                        break;
                    case 2: break;
                    default:
                        var prew = path;
                        var left = parseInt(e.left) + 50;
                        var top = parseInt(e.top);
                        path = [left, top, left, top - 40];

                        if(prew && path[1] == prew[1]){
                            canvas.add(drawLine([prew[2], prew[3], path[2], path[3]]));
                            canvas.add(drawLine(prew));
                            canvas.add(drawLine(path));
                        }
                        break;
                }
            });

            return true;
            function drawLine(coords){
                return new fabric.Line(coords, {
                    fill: '#ccc',
                    stroke: '#ccc',
                    strokeWidth: 1,
                    selectable: false
                });
            }
            function getCenter(coords){
                return [((coords[0] + coords[2]) / 2) - 4 , (coords[1] + coords[3]) / 2];
            }
        },
        click:function(settings){
            var gedcom_id = $(this).parent().parent().attr('gedcom_id');
            var arrow = $(this).find('i').attr('class').split('-').pop();
            settings.gedcom_id = (arrow == "down")?gedcom_id:$fn.getStartIdByParents(gedcom_id);
            $this.mod('popovers').hide();
            $this.render(settings);
        },
        clickHome:function(but){
            $(but).click(function(){
                $this.render($this.first);
            });
        },
        clear:function(settings){
            $(settings.parent).html('');
            if("undefined" != typeof($boxs) && "undefined" !== typeof($boxs[settings.id])){
                delete $boxs[settings.id];
            }
        },
        init: function(settings){
            $(settings.parent).css('position', 'relative');

            $fn.clear(settings);
            if(settings.iconHome && !isUser()){
                $fn.clickHome($fn.setIconHome(settings.parent));
            }
            return true;
            function isUser(){
                return $start_id == $this.mod('usertree').usermap().gedcom_id;
            }
        },
        append: function(settings, box){
            if("undefined" === typeof($boxs[settings.id])){
                $boxs[settings.id] = [];
            }
            $boxs[settings.id].push(box);
            $(settings.parent).append(box);
        },
        render: function(settings){
            var $usermap, $spouses, $childrens;

            $this.setFirst(settings);

            settings = $fn.getSettings(settings);

            if(settings && settings.parent == null){
                return false;
            }

            if(settings.gedcom_id){
                $start_id = settings.gedcom_id;
            } else {
                $usermap = $this.mod('usertree').usermap();
                $start_id = $usermap.gedcom_id;
            }

            if($start_id == null){
                return false;
            }

            $fn.init(settings);

            $childrens = $this.mod('usertree').getChildrens($start_id);
            if($childrens.length == 0 && !$this.mod('usertree').user($start_id).isSpouseExist()){
                $start_id = $fn.getStartIdByParents($start_id);
                $childrens = $this.mod('usertree').getChildrens($start_id);
            }
            $spouses = $this.mod('usertree').getSpouses($start_id);

            $fn.append(settings, $fn.createParent($start_id, settings));
            $fn.append(settings, $fn.createParent($spouses[0], settings));
            $fn.append(settings, $fn.createEvent($start_id, $spouses[0]));

            $childrens.forEach(function(gedcom_id){
                $fn.append(settings, $fn.createChild(gedcom_id, settings));
            });

            $fn.setPosition($boxs[settings.id], settings);
            $fn.setPopovers($boxs[settings.id]);

            $this.mod('usertree').trigger(function(){
                $this.render(settings);
            });
            $(window).resize(function(){
                $fn.setPosition($boxs[settings.id], settings);
            });
        },
        animation: function(){}
    };

    $this.first = false;
    $this.setFirst = function(settings){
        if(!$this.first){
            $this.first = settings;
        }
    }

    $this.render = function(settings, timeout){
        if("undefined" !== typeof(timeout)){
            setTimeout(function(){
                $fn.render(settings);
            }, settings.timeout);
        } else {
            $fn.render(settings);
        }
    };




});