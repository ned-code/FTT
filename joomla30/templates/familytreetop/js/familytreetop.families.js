$FamilyTreeTop.create("families", function($){
    'use strict';

    var $this = this, $animated, $box = $('#familiesHide'), $boxs = {}, $bgs = {}, $canvas = false, $start_id, $fn;

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
        getDefaultSpouse: function(gedcom_id, spouses){
            if(spouses.length == 0) return 0;
            var user = $this.mod('usertree').user(gedcom_id), spouse_id = spouses[0];
            $(spouses).each(function(i, id){
                var family_id = $this.mod('usertree').getFamilyIdByPartners(gedcom_id, id);
                if(family_id == user.family_id){
                    spouse_id = id;
                }
            });
            return spouse_id;
        },
        getChildrens: function(id1, id2){
            if(!id2) return [];
            var colors = ["#3f48cc","#1d9441","#b97a57","#934293","#eab600","#00a2e8","#ed1c24","#7092be"], index = 0;
            var families = _concat_(_getFamilies_(id1), _getFamilies_(id2));
            var childrens = _getChildrens_(families);
            var childs = [];
            for(var key in childrens){
                if(!childrens.hasOwnProperty(key)) continue;
                var a = childrens[key];
                if(a.length > 0){
                    var fam = families[key];
                    var color;
                    if(_isDefaultFamily_(fam)){
                        color = false;
                    } else {
                        color = colors[index];
                        index++;
                    }
                    $bgs[fam.husb] = color;
                    $bgs[fam.wife] = color;
                    for(var k in a){
                        if(!a.hasOwnProperty(k)) continue;
                        var id = a[k];
                        childs.push({
                            color: color,
                            gedcom_id: id
                        })
                    }
                }
            }

            return childs.sort(function(a,b){
                var userA, userB, yearA, yearB;
                userA = $this.mod('usertree').user(a.gedcom_id);
                userB = $this.mod('usertree').user(b.gedcom_id);

                yearA = (userA)?int(userA.birth('date.start_year')):0;
                yearB = (userB)?int(userB.birth('date.start_year')):0;
                return yearA - yearB;
                function int(y){
                    var i = parseInt(y);
                    return (isNaN(i))?9999:i;
                }
            });
            function _isDefaultFamily_(_F_){
                return ( ( _F_.husb == id1 && _F_.wife == id2 )
                    || ( _F_.husb == id2 && _F_.wife == id1 ) );
            }
            function _getChildrens_(_F_){
                var _C_ = {};
                for(var key in _F_){
                    if(!_F_.hasOwnProperty(key)) continue;
                    _C_[key] = $this.mod('usertree').getChildrensByFamily(key);

                }
                return _C_;
            }
            function _getFamilies_(_id_){ return $this.mod('usertree').getFamilies(_id_); }
            function _concat_(_f1_, _f2_){
                var _F_ = {}, _K_;
                __SORT__(_f1_);
                __SORT__(_f2_);
                return _F_;
                function __SORT__(_ARRAY_){
                    if("undefined" === typeof(_ARRAY_) || _ARRAY_.length == 0) return false;
                    for(_K_ in _ARRAY_){
                        if(!_ARRAY_.hasOwnProperty(_K_)) continue;
                        if("undefined" === typeof(_F_[_K_])){
                            _F_[_K_] = _ARRAY_[_K_];
                        }
                    }
                }
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
        createFacebookIcon: function(object, ind){
            $(object).append('<div style="width:24px;height:24px;background:white;clear:both;border-radius:5px;bottom: 5px;position: absolute;right: 5px;"><a style="text-decoration: none;" target="_blank" href="https://www.facebook.com/'+ind.facebook_id+'"><i style="line-height: 25px;" class="icon-facebook-sign icon-2x"></i></a></div>')
        },
        createBox: function(ind, cl, type, args){
            if(!ind) return [];
            var divs = $(cl).find('div');
            $(cl).attr('gedcom_id', ind.gedcom_id);
            $(divs[1]).text(ind.nickname(("up"!=type)));
            $(divs[2]).text(ind.date());
            var img = $(divs[0]).find('img');
            var avatar = ind.avatar((type=="up")?["140","140"]:["90","90"]);
            $(img).parent().append(avatar);
            $(img).remove();

            Holder.run({
                images: avatar[0]
            });
            if(ind.facebook_id != 0){
                $fn.createFacebookIcon(divs[0], ind);
            }
            if(args.abilityToMove && ((type == "up" && ind.isParentsExist()) || (type == "down" && (ind.isChildrensExist()||ind.isSpouseExist()) )) ){
                $(divs[0]).append($fn.createArrow(type, args));
            }
            if(args.editable){
                $fn.createEdit(divs[0], ind.gedcom_id);
            }
            return cl;
        },
        createMultiSpouse:function(id, sp_id, args){
            var left = $($box).find('.multiparent-left-box').clone();
            var right = $($box).find('.multiparent-right-box').clone();
            $(_getSpousesSort_(id, sp_id)).each(function(i, e){
                $(left).append(_setData_(e));
            });
            $(_getSpousesSort_(sp_id, id)).each(function(i, e){
                $(right).append(_setData_(e));
            });
            $fn.append(args, left);
            $fn.append(args, right);
            return true;
            function _getSpouseBox_(){ return $($box).find('.spouse-box').clone(); }
            function _getSpouses_(_id_){ return $this.mod('usertree').getSpouses(_id_); }
            function _getUserData_(_id_){ return $this.mod('usertree').user(_id_); }
            function _setData_(_e_){
                var _divs_ = $(_e_.object).find('div');
                var _avatar_ = _e_.data.avatar(["90","90"]);
                var _img_ = $(_divs_[0]).find('img');

                if("undefined" !== $bgs[_e_.data.gedcom_id] && $bgs[_e_.data.gedcom_id]){
                    $(_avatar_).css('background-color', $bgs[_e_.data.gedcom_id]);
                }
                $(_img_).parent().append(_avatar_);
                $(_img_).remove();

                $(_divs_[1]).text(_e_.data.first_name);

                Holder.run({
                    images: _avatar_[0]
                });
                if(args.editable){
                    $fn.createEdit(_divs_[0], _e_.data.gedcom_id);
                }
                return _e_.object;
            }
            function _getSpousesSort_(_id1_, _id2_){
                var _m_ = [];
                $(_getSpouses_(_id1_)).each(function(_i_,_e_){
                    if(_e_ != _id2_){
                        _m_.push({
                            object : _getSpouseBox_(),
                            data : _getUserData_(_e_)
                        });
                    }
                });
                return _m_;
            }
        },
        createParent: function(id, args, husb){
            var ind = $this.mod('usertree').user(id);
            var cl = $($box).find('.parent-box').clone();
            var box = $fn.createBox(ind, cl, 'up', args);
            if(husb && $FamilyTreeTop.joyride){
                $(box).find('#editMenu').attr('id', 'JoyrideStop1');
            }
            return box;
        },
        createChild: function(id, color, args){
            var ind = $this.mod('usertree').user(id);
            var cl = $($box).find('.child-box').clone();
            var box = $fn.createBox(ind, cl, 'down', args);
            if(color){
                $(box).find('img').css('background-color', color);
            }
            return box;
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

                    case 3:
                    case 4:
                        $(object).css('top', getTop(index)).css('left', getSpouseIndent(index));
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
                 var height = (getRows()[0] * 170);
                 return ((settings.editable)?400:280) + height + getRows()[0] * 30;
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
                if(index < 5){
                    return height * 0.1;
                } else {
                    var rows = getRows();
                    var row = Math.ceil((index - 4)/rows[1]);
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
            function getSpouseIndent(index){
                if(index == 3){
                    var left = parseInt($fn.getCssParam(boxs[0], "left"));
                    return left - 130;
                } else {
                    var left = parseInt($fn.getCssParam(boxs[1], "left"));
                    return left + 170;
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
                var rows = getRows(), length = index - 4, step = 0, margin = 0;
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
                    var length = boxs.length - 5, row = Math.ceil((index - 4)/rows[1]);
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
                var gedcom_id = $(points[0].object).attr('gedcom_id');
                var user = $this.mod('usertree').user(gedcom_id);
                if(user.isChildrensExist()){
                    canvas.add(drawLine([center[0], center[1], center[0], center[1] + 100]));
                }
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
                    case 3:case 4: break;
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
            var $usermap, $spouses, $childrens, $spouse_id, $user, $husb, $wife;

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

            $spouses = $this.mod('usertree').getSpouses($start_id);
            $spouse_id = $fn.getDefaultSpouse($start_id, $spouses);
            $childrens = $fn.getChildrens($start_id, $spouse_id);
            if($childrens.length == 0 && !$this.mod('usertree').user($start_id).isSpouseExist()){
                $start_id = $fn.getStartIdByParents($start_id);
                if($start_id == null) return false;
                $spouses = $this.mod('usertree').getSpouses($start_id);
                $spouse_id = $fn.getDefaultSpouse($start_id, $spouses);
                $childrens = $fn.getChildrens($start_id, $spouse_id);
            }

            $user = $this.mod('usertree').user($start_id);
            if(parseInt($user.gender)){
                $husb = $start_id;
                $wife = $spouse_id;
            } else {
                $husb = $spouse_id;
                $wife = $start_id;
            }

            $fn.append(settings, $fn.createParent($husb, settings, true));
            $fn.append(settings, $fn.createParent($wife, settings, false));
            $fn.append(settings, $fn.createEvent($husb, $wife));

            $fn.createMultiSpouse($husb, $wife, settings);

            $childrens.forEach(function(object){
                $fn.append(settings, $fn.createChild(object.gedcom_id, object.color, settings));
            });

            $fn.setPosition($boxs[settings.id], settings);

            if(settings.abilityToMove){
                $fn.setPopovers($boxs[settings.id]);
            }
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
        $this.mod('usertree').trigger(settings, $fn.render);
        if($FamilyTreeTop.joyride) {
            var show = false;
            $FamilyTreeTop.load(function(){
                $('[data-familytreetop="family_tree"]').click();
                setTimeout(function(){
                    $FamilyTreeTop.bootjoyride();
                }, 500);
            });
        }
    };




});