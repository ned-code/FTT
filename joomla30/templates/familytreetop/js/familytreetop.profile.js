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
                var names = ["first_name", "middle_name", "last_name", "know_as"];
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
            var box, canvas, cont, connection, settings, points, vehicle, height;
            
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

            console.log(points);
            /*
            points = [], chainLength;
            calcPoints();
            chainLength = points.length;
            calcSpousePoints();
            calcLeft();

            vehicle= getVehicle(points);
            height = ((getRows() * (node.height + 40)));
            $(cont).css('min-height', height + "px");
            $(canvas).attr('height', height + "px");
            $(canvas).attr('width', $(box).width() + "px");


            renderBox(vehicle.pos);
            render(vehicle.pos, -1);
            render(vehicle.pos, 1);
            renderLine();
            */
            return true;

            function isPosEmpty(o){
                for(var key in points){
                    var e = points[key];
                    if(o.x == e.y && o.x == e.x){
                        return false;
                    }
                }
                return true;
            }
            function isUserExist(u){
                for(var key in points){
                    var e = points[key];
                    if(e.user.gedcom_id == u.gedcom_id){
                        return true;
                    }
                }
                return false;
            }
            function render(target, shift){
                var pos = parseInt(target) + parseInt(shift);
                if(target < 0 || target >= points.length) return false;
                renderBox(pos);
                render(pos, shift);
            }
            function renderBox(pos){
                var object = points[pos];
                if("undefined" === typeof(object)) return false;
                var user = object.user;
                var div = $('<div></div>');
                $(div).append('<div>'+user.shortname()+'</div>')
                $(div).append('<div style="color:dimgray;"><i class="icon-leaf"></i>'+user.relation+'</div>')
                $(div).css('position', 'absolute');
                $(div).css('line-height', '30px');
                $(div).css('background', getBackgroundColor(pos));
                $(div).css('text-align', 'center');
                $(div).css('width', node.width+'px');
                $(div).css('height', node.height+'px');
                $(div).css('top', getTop(pos) + 'px');
                $(div).css('left', getLeft(pos) + 'px');
                $(cont).append(div);

            }
            function renderLine(){
                var  cnvs = new fabric.StaticCanvas(canvas[0]);
                for(var key in points){
                    var point = points[key];
                    var prew = points[key - 1];
                    if("undefined" !== typeof(prew) && "undefined" !== typeof(point)){
                        var cords = getLineCords(prew, point, key);
                        drawLines(cnvs,cords);
                    }
                }
            }
            function drawLines(cnvs, cords){
                for(var key in cords){
                    var cord = cords[key];
                    cnvs.add(drawLine(cord));
                }
            }
            function drawLine(coords){
                return new fabric.Line(coords, {
                    fill: '#c3c3c3',
                    stroke: '#c3c3c3',
                    strokeWidth: 1,
                    selectable: false
                });
            }
            function calcSpousePoints(){
                var p = [], key;
                for(key in points){
                    var point = points[key];
                    var user = point.user;
                    var spouses = $this.mod('usertree').getSpouses(user.gedcom_id);
                    if(spouses.length != 0){
                        var spouse = $this.mod('usertree').user(spouses[0]);
                        var cords = {x: point.x + 1, y: point.y, user: spouse, spouse: key};
                        if(isPosEmpty(cords)&&!isUserExist(spouse)){
                            p.push(cords);
                        }
                    }
                }
                for(key in p){ points.push(p[key]); }
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
                var vehicle = _getVehicle_();
                _setOffset_(vehicle.pos);
                _setOffset_(vehicle.pos, -1);
                _setOffset_(vehicle.pos, 1);
                _setLeft_();
                return true;
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
                    if(object.y == next.y && object.x > next.x){
                        return "left"
                    } else if(object.y == next.y && object.x < next.x){
                        return "right";
                    } else if(object.y > next.y){
                        return "bottom";
                    } else if(object.y < next.y){
                        return "top";
                    }
                }
                function _getWidth_(object){
                    if(object.spouse){
                        return settings.node.width*2 + 20;
                    }
                    return settings.node.width;
                }
                function _getLeft_(object){
                    return 0;
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
                    points.forEach(function(e,i){
                        var prew = points[e.pos - 1];
                        if("undefined" !== typeof(prew)){
                            if(e.y == prew.y){
                                e.left = prew.left + prew.width + 40;
                            } else if(e.y > prew.y){
                                 
                            } else if(e.y < prew.y){

                            }
                        } else {
                            e.left = 0;
                        }
                    });
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

                    console.log(object);

                    if(shift != 0){
                        _setOffset_(index, shift);
                    }
                }
            }
            function calcLeft(){
                for(var key in points){
                    var object = points[key];
                    var prew = ("undefined" !== typeof(object.spouse))?points[object.spouse]:points[key - 1];
                    if("undefined" !== typeof(prew) && "undefined" !== typeof(prew.left)){
                        if(prew.y == object.y){
                            object.left = prew.left + parseInt(node.width + 20);
                        } else {
                            object.left = prew.left + parseInt(Math.ceil(node.width/2) + 10);
                        }
                    } else {
                        object.left = parseInt(node.width + 30) * object.x;
                    }
                }
            }
            function getPrew(key){
                if("undefined" !== typeof(points[(key - 1)])){
                    return points[(key-1)];
                }
                return {x:0,y:0,user:false};
            }
            function getRows(){
                var min = 0, max = 0;
                for(var key in points){
                    var point = points[key];
                    if(point.y < min){
                        min = point.y
                    }
                    if(point.y > max){
                        max = point.y;
                    }
                }
                return max + min * -1 + 1;
            }
            function getRow(y){
                var min = 0, max = 0;
                for(var key in points){
                    var point = points[key];
                    if(point.y < min){
                        min = point.y
                    }
                    if(point.y > max){
                        max = point.y;
                    }
                }
                var index = 0;
                for(var i = max; i >= min; i--){
                    if(i == y){
                        return index;
                    }
                    index++;
                }
            }
            function getBackgroundColor(pos){
                var point = points[pos];
                var user = point.user;
                if(connection[0] == user.gedcom_id){
                    return "#efe4b0";
                } else if(connection[connection.length - 1] == user.gedcom_id){
                    return "#ffc90e";
                } else {
                    return "#c3c3c3";
                }
            }
            function getLeft(pos){
                var object = points[pos];
                return object.left
            }
            function getTop(pos){
                var object = points[pos];
                var top = (node.height + 40) * getRow(object.y);
                object.top = top;
                return object.top;
            }
            function getMinMax(){
                var p = points, xmin = 0, xmax = 0, ymin = 0, ymax = 0;
                p.forEach(function(e,i){
                    if(xmin > e.x){ xmin = e.x; }
                    if(xmax < e.x){ xmax = e.x; }
                    if(ymin > e.y){ ymin = e.y; }
                    if(ymax < e.y){ ymax = e.y; }
                });
                return {x:{min:xmin,max:xmax},y:{min:ymin,max:ymax}};
            }
            function getVehicle(){
                var p = points, v = p[0], k, o;
                for(k in p){
                    o = p[k];
                    if(o.y > v.y || (o.y == v.y && o.x < v.x) ){
                        v = o;
                    }
                }
                return v;
            }
            function getLineCords(o1, o2, pos){
                if("undefined" !== typeof(o2.spouse) || o1.y == o2.y){
                       return getSpouseLine(o1,o2, pos);
                } else {
                    if(o1.y > o2.y){
                        return getDownLine(o1,o2);
                    } else {
                        return getUpLine(o1,o2);
                    }
                }
            }
            function getUpLine(o1, o2){
                var cords = [];
                cords.push([
                    o1.left + Math.ceil(node.width/2),
                    o1.top,
                    o1.left + Math.ceil(node.width/2),
                    o1.top - Math.ceil((o1.top - (o2.top + node.height))/2)
                ]);
                cords.push([
                    o1.left + Math.ceil(node.width/2),
                    o1.top - Math.ceil((o1.top - (o2.top + node.height))/2),
                    o2.left + Math.ceil(node.width/2),
                    o1.top - Math.ceil((o1.top - (o2.top + node.height))/2)
                ]);
                cords.push([
                    o2.left + Math.ceil(node.width/2),
                    o1.top - Math.ceil((o1.top - (o2.top + node.height))/2),
                    o2.left + Math.ceil(node.width/2),
                    o2.top + node.height
                ]);
                return cords;
            }
            function getDownLine(o1, o2){
                var cords = [];
                cords.push([
                    o1.left + Math.ceil(node.width/2),
                    o1.top + node.height,
                    o1.left + Math.ceil(node.width/2),
                    o1.top + node.height + Math.ceil((o2.top - (o1.top + node.height))/2)
                ]);
                cords.push([
                    o1.left + Math.ceil(node.width/2),
                    o1.top + node.height + Math.ceil((o2.top - (o1.top + node.height))/2),
                    o2.left + Math.ceil(node.width/2),
                    o1.top + node.height + Math.ceil((o2.top - (o1.top + node.height))/2)
                ]);
                cords.push([
                    o2.left + Math.ceil(node.width/2),
                    o1.top + node.height + Math.ceil((o2.top - (o1.top + node.height))/2),
                    o2.left + Math.ceil(node.width/2),
                    o2.top
                ]);
                return cords;
            }
            function getSpouseLine(o1, o2, pos){
                if("undefined" !== typeof(o2.spouse)){
                    var spouse = points[parseInt(o2.spouse)];
                    var target = points[parseInt(o2.spouse) + 1];
                    if(pos >= chainLength && "undefined" === typeof(target.spouse)){
                        if(o2.y > target.y){
                            return getDownLine(o2,target);
                        } else if(o2.y < target.y)  {
                            return getUpLine(o2,target);
                        }
                    }
                    return sim(spouse, o2);
                }
                return sim(o1, o2);
                function sim(e1, e2){
                    var c = [], x, y;
                    x = e1.left + node.width + Math.ceil((e2.left - (e1.left + node.width))/2);
                    y = e1.top + Math.ceil(node.height/2);
                    c.push([
                        x - 5,
                        y,
                        x + 6,
                        y
                    ]);
                    c.push([
                        x,
                        y - 5,
                        x,
                        y + 5
                    ]);
                    return c;
                }
            }
            function getCords(u,k){
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

