$FamilyTreeTop.create("profile", function($){
    'use strict';
    var $this = this, $fn, $box;

    $fn = {
        isConnectionUser: function(args, node){
            var con = $this.mod('usertree').getConnection(args.object.gedcom_id);
            if(node.data.usr.gedcom_id == con[0]){
                return true;
            }
            return false;
        },
        isConnectionTarget: function(args, node){
            var con = $this.mod('usertree').getConnection(args.object.gedcom_id);
            if(node.data.usr.gedcom_id == con[con.length - 1]){
                return true;
            }
            return false;
        },
        setAbout:function(args){
            var box = $(this).find('[data-familytreetop-profile="about"] fieldset'), avatar;
            avatar = args.object.avatar(["100","100"]);
            $(box).find('li').each(function(index, element){
                var names = ["first_name", "middle_name", "last_name", "know_as", "proxyRelation"];
                var value = args.object[names[index]];
                if(value != null && value.length != 0){
                    $(element).find('span').text(args.object[names[index]]);
                } else {
                    $(element).remove();
                }
            });
            $(box).find('[data-familytreetop="avatar"]').append(avatar);
            Holder.run({
                images:avatar[0]
            })
        },
        setRelation:function(args){
            var box, canvas, cont, connection, settings, points;
            
            box = $(this).find('[data-familytreetop-profile="relation"] fieldset');
            canvas = $('<canvas></canvas>');
            cont = $('<div style="position:relative;"></div>');

            $(box).append(cont);
            $(cont).append(canvas);

            connection = $this.mod('usertree').getConnection(args.gedcom_id);

            if(connection.length == 1) {
                return false;
            }
            settings = {
                node:{
                    width: 150,
                    height: 60
                }
            }

            calcPoints();
            calcPointsOffset();

            $(canvas).attr('height', (getMaxRow() * (settings.node.height + 40)) + "px");
            $(canvas).attr('width', $(box).width() + "px");

            render();
            return true;
            function render(){
                var  cnvs = new fabric.StaticCanvas(canvas[0])
                points.forEach(function(object){
                    object.box = renderBox(object, false);
                    if(object.spouse){
                        var spouse = $.extend({}, object);
                        spouse.user = object.spouse;
                        spouse.left = object.left + settings.node.width + 40;
                        object.spouseBox = renderBox(spouse, true);
                    }
                    renderLines(object, cnvs)
                });
            }
            function renderBox(object, spouse){
                var user = object.user;
                var div = $('<div></div>');
                $(div).append('<div>'+user.shortname()+'</div>')
                $(div).append('<div style="color:dimgray;"><i class="icon-leaf"></i>'+user.relation+'</div>')
                $(div).css('position', 'absolute');
                $(div).css('line-height', '30px');
                $(div).css('background', getBackgroundColor(object.pos, spouse));
                $(div).css('text-align', 'center');
                $(div).css('width', settings.node.width+'px');
                $(div).css('height', settings.node.height+'px');
                $(div).css('top', object.top + 'px');
                $(div).css('left', object.left + 'px');
                $(cont).append(div);
                return div;
            }
            function renderLines(object, cnvs){
                var prew = object.prewObject;
                if(object.spouse){
                    _drawSpouseLine_(object);
                    _drawPlusLines_(object);
                }
                if("undefined" !== typeof(prew)){
                    if(prew.direction == "shift"){
                        _drawSpouseLine_(prew);
                        _drawPlusLines_(prew);
                    } else if(prew.direction == "top"){
                        _drawVertLine1_(object);
                        _drawVertLine2_(prew);
                        _drawHorLine_(prew, object);
                    } else if(prew.direction == "bottom"){
                        _drawVertLine1_(prew);
                        _drawVertLine2_(object);
                        _drawHorLine_(object, prew);
                    }
                }
                return true;
                function _drawPlusLines_(o){
                    var center = [
                        o.left + settings.node.width + 20,
                        o.top + (settings.node.height/2) - 15
                    ]
                    //hor
                    cnvs.add(drawLine([
                        center[0] - 5,
                        center[1],
                        center[0] + 6,
                        center[1]
                    ],2));
                    //ver
                    cnvs.add(drawLine([
                        center[0],
                        center[1] - 5,
                        center[0],
                        center[1] + 6
                    ],2));
                }
                function _drawSpouseLine_(o){
                    cnvs.add(drawLine([
                        o.left + settings.node.width,
                        o.top + Math.ceil(settings.node.height/2),
                        o.left + settings.node.width + 40,
                        o.top + Math.ceil(settings.node.height/2)
                    ]));
                }
                function _drawStraightLine_(o){
                    cnvs.add(drawLine([
                        o.left + Math.ceil(settings.node.width/2),
                        o.top,
                        o.left + Math.ceil(settings.node.width/2),
                        o.top - 40 - Math.ceil(settings.node.height/2)
                    ]));
                }
                function _drawHorLine_(p,o){
                    cnvs.add(drawLine([
                        p.left + Math.ceil(settings.node.width/2),
                        p.top - 20,
                        o.left + settings.node.width + 20,
                        p.top - 20
                    ]));
                }
                function _drawVertLine1_(o){
                    cnvs.add(drawLine([
                        o.left + settings.node.width + 20,
                        o.top + Math.ceil(settings.node.height/2),
                        o.left + settings.node.width + 20,
                        o.top + settings.node.height + 20
                    ]));
                }
                function _drawVertLine2_(o){
                    cnvs.add(drawLine([
                        o.left + Math.ceil(settings.node.width/2),
                        o.top,
                        o.left + Math.ceil(settings.node.width/2),
                        o.top - 20
                    ]));
                }

            }
            function drawLine(coords, width){
                return new fabric.Line(coords, {
                    fill: '#c3c3c3',
                    stroke: '#c3c3c3',
                    strokeWidth: ("undefined"!==typeof(width))?width:1,
                    selectable: false
                });
            }
            function calcPoints(){
                var key, user, spouses, object, cords, prew;
                points = [];
                for(key in connection){
                    user = $this.mod('usertree').user(connection[key]);
                    cords = _getCords_(user, key);
                    prew = _getPrew_(key);

                    object = {x:prew.x + cords.x, y:prew.y + cords.y, user:user, pos:parseInt(key)};

                    spouses = $this.mod('usertree').getSpouses(user.gedcom_id);

                    object.spouse = (spouses.length != 0)?$this.mod('usertree').user(spouses[0]):0;

                    points[key] = object;
                }
                return true;
                function _getPrew_(key){
                    if("undefined" !== typeof(points[(key - 1)])){
                        return points[(key-1)];
                    }
                    return {x:0,y:0,user:false};
                }
                function _getCords_(u,k){
                    var relId = parseInt(u.relationId);
                    switch(relId){
                        case 1:
                            return {x:0,y:0};
                        case 2:
                        case 1000:
                            return {x:1,y:0};
                        case 3:
                        case 4:
                        case 103:
                        case 104:
                        case 203:
                        case 204:
                            return {x:1,y:1};
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                        case 9:
                        case 10:
                        case 11:
                        case 12:
                        case 13:
                        case 105:
                        case 106:
                        case 107:
                        case 108:
                        case 110:
                        case 111:
                        case 112:
                        case 113:
                        case 205:
                        case 206:
                        case 207:
                        case 208:
                        case 210:
                        case 211:
                        case 212:
                        case 213:
                            return {x:1,y:-1};

                    }
                }
            }
            function calcPointsOffset(){
                var _vehicle = _getVehicle_();
                if("undefined" === typeof(_vehicle)) return false;
                _setOffset_(_vehicle.pos);
                _setOffset_(_vehicle.pos, -1);
                _setOffset_(_vehicle.pos, 1);
                _setLeft_();
                return _vehicle;
                function _getVehicle_(){
                    var p = points, v = p[0], k, o;
                    for(k in p){
                        o = p[k];
                        if(o.y > v.y || (o.y == v.y && o.x < v.x) ){
                            v = o;
                        }
                    }
                    return v;
                }
                function _getNext_(index){
                    var next = points[index + 1];
                    if("undefined" === typeof(next)){
                        return false;
                    }
                    return next;
                }
                function _getDirection_(object, next){
                    if(!next) return false;
                    if(object.y == next.y){
                        return "shift"
                    } else if(object.y > next.y){
                        return "bottom";
                    } else if(object.y < next.y){
                        return "top";
                    }
                }
                function _getWidth_(object){
                    if(object.spouse){
                        var prew = points[object.pos - 1];
                        var next = points[object.pos + 1];
                        if("undefined" !== typeof(prew) && prew.user.gedcom_id == object.spouse.gedcom_id){
                            return settings.node.width;
                        } else if("undefined" !== typeof(next) && next.user.gedcom_id == object.spouse.gedcom_id){
                            return settings.node.width;
                        }
                        return settings.node.width*2 + 40;
                    }
                    return settings.node.width;
                }
                function _getTop_(object){
                    return (settings.node.height + 40) * _getRow_(object);
                }
                function _getRow_(object){
                    var min = 0, max = 0, index = 0, key;
                    for(key in points){
                        if(points[key].y < min){ min = points[key].y; }
                        if(points[key].y > max){ max = points[key].y; }
                    }
                    for(key = max ; key >= min; key--){
                        if(key == object.y){
                            return index;
                        }
                        index++;
                    }
                }
                function _setLeft_(){
                    if(points.length == 0){
                        return false;
                    } else if(points.length == 1){
                        points[0].left = 0;
                        return true;
                    }
                    points.forEach(function(e,i){
                        var prew = points[e.pos - 1];
                        var next = points[e.pos + 1];
                        if("undefined" !== typeof(prew)){
                            if(e.direction == "shift"
                                //|| "undefined" !== typeof(next) && next.direction == "bottom"
                                || prew.direction == "shift"){
                                e.spouse = false;
                                e.width = settings.node.width;
                            }
                            if(prew.direction == "shift"){
                                e.left = prew.left + prew.width + 40;
                            } else if(prew.direction == "top"){
                                if(e.direction == "bottom" && e.spouse || !e.spouse){
                                    e.left = prew.left;
                                } else if(e.spouse){
                                    e.left = prew.left - Math.ceil(e.width/2) + Math.ceil(settings.node.width/2);
                                    if(e.left < 0){
                                        _correctLeftPosition_(e.left, i);
                                    }
                                }
                            } else if(prew.direction == "bottom"){
                                if(prew.spouse){
                                    if("undefined" !== typeof(prew.prewObject) && prew.prewObject.direction == "top"){
                                        e.left = prew.prewObject.left + prew.prewObject.width + 40;
                                    } else {
                                        e.left = prew.left + Math.ceil(prew.width/2) - Math.ceil(settings.node.width/2);
                                    }
                                } else {
                                    e.left = prew.left;
                                }
                            }
                            e.prewObject = prew;
                            _correctPosition_(e);
                        } else {
                            if(e.direction != "bottom"){
                                e.left = 0;
                                e.spouse = false;
                                e.width = settings.node.width;
                            }
                            if(e.direction == "top" && next.spouse){
                                e.left = 0 + Math.ceil(next.width/2) - Math.ceil(settings.node.width/2);
                            } else {
                                e.left = 0;
                            }
                        }
                    });
                    return true;
                    function _correctPosition_(object){
                        points.forEach(function(e,i){
                            if(e.y == object.y && e.pos != object.pos){
                                var a = { x: e.left, y: e.left + e.width };
                                var b = { x: object.left, y: object.left + object.width };
                                if(a.x <= b.y && a.x >= b.x
                                    || a.y >= b.x && a.y <= b.y
                                    || b.x >= a.x && b.y <= a.y){
                                    object.left = e.left + e.width + 40;
                                }
                            }
                        });
                        return true;

                    }
                    function _correctLeftPosition_(left, index){
                        if(left > 0) return false;
                        var shift = left * -1;
                        points.forEach(function(e, i){
                            if("undefined" !== typeof(e.left)){
                                e.left = e.left + shift;
                            }
                        });
                    }
                }
                function _setOffset_(key, shift){
                    if("undefined" === typeof(shift)){
                        shift = 0;
                    }
                    var index = key + shift,
                        object,
                        next;
                    if(index < 0 || index == points.length){
                        return false;
                    }

                    object = points[index];
                    next = _getNext_(index);

                    object.direction = _getDirection_(object, next);
                    object.width = _getWidth_(object);
                    object.height = settings.node.height;
                    object.top = _getTop_(object);

                    if(shift != 0){
                        _setOffset_(index, shift);
                    }
                }
            }
            function getMaxRow(){
                var min = 0, max = 0, key;
                for(key in points){
                    if(points[key].y < min){ min = points[key].y; }
                    if(points[key].y > max){ max = points[key].y; }
                }
                if(min < 0){
                    min = min * -1;
                }
                return max + min + 1;
            }
            function getBackgroundColor(pos, spouse){
                var point = points[pos];
                var user = point.user;
                if(spouse){
                    return "#c3c3c3";
                } else if(connection[0] == user.gedcom_id){
                    return "#efe4b0";
                } else if(connection[connection.length - 1] == user.gedcom_id){
                    return "#ffc90e";
                } else {
                    return "#c3c3c3";
                }
            }
        },
        setFamily:function(args){
            var box = $(this).find('[data-familytreetop-profile="family"] fieldset'), familyBox = $('<div style="position:relative;"></div>');
            $(box).append(familyBox);
            $this.mod('families').render({
                parent: familyBox,
                gedcom_id: args.object.gedcom_id,
                abilityToMove: false,
                editable: false,
                iconHome: false
            }, 1000);
        },
        setPhotos:function(args){
            var ul = $(this).find('[data-familytreetop-profile="photos"] fieldset ul');
            args.object.medias().forEach(function(el, index){
                var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                $(li).find('img').attr('src', el.thumbnail_url);
                $(li).attr('data-familytreetop-delete', el.delete_url);
                $(li).data(el);
                $(ul).append(li);
            });
            if(args.object.facebook_id){
                FB.api('/'+args.object.facebook_id+'/albums', function(albums){
                   var data = albums.data;
                   $(data).each(function(i, album){
                       FB.api('/'+album.id+'/photos', function(photos){
                           var d = photos.data;
                           $(d).each(function(i, photo){
                               var li = $('<li><img style="cursor:pointer;" class="img-polaroid" src=""></li>');
                               $(li).find('img').attr('src', photo.picture);
                               $(ul).append(li);
                           });
                       });
                   });
                });
            }
        },
        getLabelHtml:function(label, node){
            var user = node.data.usr, box = $('<div class="text-center"></div>');
            if(!user) return "";
            $(box).append('<div>'+user.shortname()+'</div>');
            $(box).append('<div style="color: #7f7f7f;"><i class="icon-leaf"></i>'+user.relation+'</div>');
            if(node.data.in_law){
                $(box).append('<div style="position: absolute;top: 10px;left: -10px;"><i class="icon-plus"></i></div>');
            }
            return $(box).html();
        },
        getModalBox:function(){
            var cl = $($box).clone().hide();
            $('body').append(cl);
            $(cl).on('hide', function(){
                $(cl).remove();
            });
            return cl;
        }
    }

    $box = $('#profile');

    $this.render = function(args){
        var parent = $fn.getModalBox(), object = args.object;

        $(parent).find('#profileLabel').text(object.shortname());
        $(parent).find('[familytreetop="facebook"]').attr('facebook_id', object.facebook_id);
        $(parent).find('[familytreetop="invite"]').attr('gedcom_id', object.gedcom_id);
        $(parent).find('[familytreetop="edit"]').attr('gedcom_id', object.gedcom_id);
        if(object.facebook_id == 0){
            $(parent).find('[familytreetop="facebook"]').hide();
        } else {
            $(parent).find('[familytreetop="invite"]').hide();
        }
        $(parent).find('[familytreetop="facebook"]').click(function(){
            var facebook_id = $(this).attr('facebook_id');
            window.open("http://www.facebook.com/"+facebook_id,'_blank');
        });
        $(parent).find('[familytreetop="edit"]').click(function(){
            var gedcom_id = $(this).attr('gedcom_id');
            $(parent).modal('hide');
            $this.mod('editor').render(gedcom_id);
        });
        $(parent).find('[familytreetop="invite"]').click(function(){
            var gedcom_id = $(this).attr('gedcom_id');
            $(parent).modal('hide');
            $this.mod('friendselector').render(gedcom_id);
        });


        $fn.setAbout.call(parent, args);
        $fn.setPhotos.call(parent, args);
        $(parent).on('shown', function(){
            $fn.setRelation.call(parent, args);
            $fn.setFamily.call(parent, args);
        });

        $(parent).modal({dynamic:true});

    }

});

