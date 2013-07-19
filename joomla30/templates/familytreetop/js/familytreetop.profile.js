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
            var box = $(this).find('[data-familytreetop-profile="relation"] fieldset');
            var canvas = $('<canvas></canvas>');
            var cont = $('<div style="position:relative;"></div>');
            $(box).append(cont);
            $(cont).append(canvas);
            var connection = $this.mod('usertree').getConnection(args.gedcom_id);
            var node = {
                width: 150,
                height: 60
            }
            var points = [];
            calcPoints();
            calcSpousePoints();
            calcLeft();

            var vehicle= getVehicle(points);
            var height = ((vehicle.y * (node.height + 40)) + 100);
            $(cont).css('min-height', height + "px");
            $(canvas).attr('height', height + "px");
            $(canvas).attr('width', $(box).width() + "px");

            renderBox(vehicle.pos);
            render(vehicle.pos, -1);
            render(vehicle.pos, 1);
            renderLine();

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
            function render(target, shift){
                var pos = parseInt(target) + parseInt(shift);
                if(target == 0 || target > points.length) return false;
                renderBox(pos);
                render(pos, shift);
            }
            function renderBox(pos){
                var object = points[pos];
                if("undefined" === typeof(object)) return false;
                var user = object.user;
                var div = $('<div>'+user.shortname()+'('+object.x+','+object.y+')</div>');
                $(div).css('position', 'absolute');
                $(div).css('border', '1px solid #000');
                $(div).css('background', 'white');
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
                        var cords = getLineCords(prew, point);
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
                    fill: '#0088cc',
                    stroke: '#0088cc',
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
                    if(spouses.length != 0 && key != points.length - 1){
                        var spouse = $this.mod('usertree').user(spouses[0]);
                        var cords = {x: point.x + 1, y: point.y, user: spouse, spouse: key};
                        if(isPosEmpty(cords)){
                            p.push(cords);
                        }
                    }
                }
                for(key in p){ points.push(p[key]); }
            }
            function calcPoints(){
                for(var key in connection){
                    var user = $this.mod('usertree').user(connection[key]);
                    if(key == 0){
                        points[key] = {x:0,y:0,user:user};
                    } else {
                        var cords = getCords(user, key);
                        var prew = points[key - 1];
                        points[key] = {x:prew.x + cords.x, y:prew.y + cords.y, user:user};
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
            function getLeft(pos){
                var object = points[pos];
                return object.left
            }
            function getTop(pos){
                var object = points[pos];
                var top = (node.height + 40) * (vehicle.y - object.y);
                object.top = top;
                return object.top;
            }
            function getVehicle(p){
                var v = {x:0,y:0,user:false};
                for(var k in p){
                    var o = p[k];
                    if(o.y > v.y || (o.y == v.y && o.x > v.x) ){
                        v = o;
                        v.pos = k;
                    }
                }
                return v;
            }
            function getLineCords(o1, o2){
                if("undefined" !== typeof(o2.spouse) || o1.y == o2.y){
                       return getSpouseLine(o1,o2);
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
            function getSpouseLine(o1,o2){
                var x1,x2,y1,y2, cords = [];

                return cords;
            }
            function getCords(u,k){
                var relId = parseInt(u.relationId);
                switch(relId){
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
            /*
            var tree = args.object.relationMap();
            var box = $(this).find('[data-familytreetop-profile="relation"] fieldset');
            var id = "jit"+$this.generateKey();
            $(box).attr('id', id);
            $(box).height(tree[1]*80 + 100);
            var st = new $jit.ST({
                injectInto: id,
                duration: 800,
                transition: $jit.Trans.Quart.easeInOut,
                offsetX:0,
                offsetY:tree[1]*50,
                levelDistance: 30,
                levelsToShow: tree[1],
                Node: {
                    height: 40,
                    width: 220,
                    type: 'rectangle',
                    color: '#f5f5f5',
                    overridable: true
                },
                Edge: {
                    type: 'bezier',
                    overridable: true
                },
                onCreateLabel: function(label, node){
                    label.id = node.id;
                    label.innerHTML = $fn.getLabelHtml(label,node);
                    $(label).width(220);
                    $(label).height(40);
                    $(label).addClass('text-center');
                    if($fn.isConnectionTarget(args, node)){
                        node.data.$color = "#ffc90e";
                    } else if($fn.isConnectionUser(args, node)){
                        node.data.$color = "#efe4b0";
                    } else {
                        node.data.$color = "c3c3c3";
                    }
                },
                onBeforePlotNode: function(node){
                    if(node.id.split("_")[1] == "TOP"){
                        node.data.$color = "#f5f5f5";
                    }
                },
                onBeforePlotLine: function(adj){
                    if(isTop(adj) || isInLawFromTo(adj) || isInLawToFrom(adj)){
                        adj.data.$color = "#f5f5f5";
                        adj.data.$lineWidth = 0;
                    }
                    function isTop(adj){
                        return adj.nodeTo.id.split("_")[1] == "TOP" ||adj.nodeFrom.id.split("_")[1] == "TOP";
                    }
                    function isInLawFromTo(adj){
                        return adj.nodeFrom.data.rel.in_law != "0" && adj.nodeTo.data.rel.in_law == "0";
                    }
                    function isInLawToFrom(adj){
                        return adj.nodeTo.data.rel.in_law != "0" && adj.nodeFrom.data.rel.in_law == "0";
                    }
                }
            });
            st.loadJSON(tree[0]);
            st.compute();
            st.select(st.root);
            st.switchPosition("top", "replot", function(){});
            */
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

