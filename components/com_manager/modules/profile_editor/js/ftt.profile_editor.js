(function($ftt){
    $ftt.module.create("MOD_SYS_PROFILE_EDITOR", function(){
        var $module = this;
        /*
        * DATA
         */
        $module.data.arguments = arguments;
        $module.data.msg = {
            "FTT_MOD_SYS_PROFILE_EDITOR_SLIDE_HEADER_BUTTON_BACK":"Back"
        }
        $module.data.callbacks = {};
        $module.data.slide = false;
        $module.data.gedcom_id = false;
        $module.data.object = false;
        $module.data.parse = false;


        /*
        * FUNCTIONS
         */
        $module.fn.ajax = function(f, p, c){
            storage.callMethod("myfamily", "FTTProfileEditor", f, p, function(res){
                c(storage.getJSON(res.responseText));
            })
        }

        $module.fn.extend = function(def, set){
            return jQuery.extend({}, def, set);
        }

        $module.fn.getMsg = function(n){
            var t = 'FTT_MOD_SYS_PROFILE_EDITOR_'+n.toUpperCase();
            if(typeof($module.data.msg[t]) != 'undefined'){
                return $module.data.msg[t];
            }
            return '';
        }

        $module.fn.setMsg = function(msg){
            for(var key in $module.data.msg){
                if(typeof(msg[key]) != 'undefined'){
                    $module.data.msg[key] = msg[key];
                }
            }
            return true;
        }

        $module.fn.echo = function(){
            var cbs = $module.data.callbacks;
            for(var key in cbs){
                if(!cbs.hasOwnProperty(key)) continue;
                cbs[key]();
            }
            $module.data.callbacks = {};
        }

        $module.fn.parse = function(o){
            if(!o&&!$module.data.object) return false;
            return storage.usertree.parse(o || $module.data.object);
        }

        $module.fn.getObject = function(gedcom_id){
            if(!gedcom_id&&!$module.data.gedcom_id) return false;
            return storage.usertree.pull[gedcom_id || $module.data.gedcom_id];
        }
        /*
        * SLIDE
         */
        $module.fn.slide = function(){
            var slide = this,
                fn = false,
                settings = false,
                div = false,
                offsetParent = false;

            fn = {
                createListItems: function(bxs){
                    var items = []
                    for(var key in bxs){
                        if(!bxs.hasOwnProperty(key)) continue;
                        var prms = bxs[key];
                        var box = $module.fn.box(prms);
                        items.push({prms:prms, object:box});
                    }
                    return items.sort(function(a, b){
                        return a.prms.level - b.prms.level;
                    });
                },
                createFacebookBox:function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-facebook-box">');
                        sb._('<div class="ftt-profile-editor-facebook-box-title"><span>facebook</span></div>');
                        sb._('<div class="ftt-profile-editor-facebook-box-content">');
                            sb._('<ul style="margin: 10px;">');
                                sb._('<li><div class="ftt-profile-editor-facebook-box-content-timeline">');
                                    sb._('<a style="text-decoration: none;" id="timeline" href="javascript:void(0)">Timeline</a>');
                                sb._('</div></li>')
                                sb._('<li><div class="ftt-profile-editor-facebook-box-content-about">');
                                    sb._('<a style="text-decoration: none;" id="about" href="javascript:void(0)">About</a>');
                                sb._('</div></li>');
                                sb._('<li><div class="ftt-profile-editor-facebook-box-content-likes">');
                                    sb._('<a style="text-decoration: none;" id="likes" href="javascript:void(0)">Likes</a>');
                                sb._('</div></li>');
                                sb._('<li><div class="ftt-profile-editor-facebook-box-content-following">');
                                    sb._('<a style="text-decoration: none;" id="following" href="javascript:void(0)">Following</a>');
                                sb._('</div></li>')
                                sb._('<li><div class="ftt-profile-editor-facebook-box-content-send_message">');
                                    sb._('<a style="text-decoration: none;" id="send_message" href="javascript:void(0)">Send message</a>');
                                sb._('</div></li>');
                            sb._('</ul>');
                        sb._('</div>');
                    sb._("</div>");
                    return jQuery(sb.result());
                },
                createUnregisterBox:function(){

                },
                createSlide:function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-slide">');
                        sb._('<div class="ftt-profile-editor-slide-header"></div>');
                        sb._('<div class="ftt-profile-editor-slide-content"></div>');
                    sb._('</div>');
                    return sb.result();
                },
                createHeaderButton:function(text){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div class="ftt-profile-editor-slide-header-button">');
                        sb._('<a href="javascript:void(0);">')._(text)._('</span>');
                    sb._('</div>');
                    return jQuery(sb.result());
                },
                initHeaderButtons:function(div){
                    var back = fn.createHeaderButton($module.fn.getMsg("SLIDE_HEADER_BUTTON_BACK"));
                    jQuery(div).find('.ftt-profile-editor-slide-header').append(back);
                    jQuery(back).click(function(){
                        $module.data.slide.close();
                    });
                },
                appendListItems:function(ul, bxs){
                    var levels = {}, index = 0;
                    for(var key in bxs){
                        if(!bxs.hasOwnProperty(key)) continue;
                        var el = bxs[key];
                        if(!(el.prms.level in levels)){
                            levels[el.prms.level] = index;
                            jQuery(ul).append('<li id="'+index+'"></li>');
                            index++;
                        }
                        jQuery(ul).find('li[id="'+levels[el.prms.level]+'"]').append(el.object);
                    }
                },
                appendFacebook:function(ul){
                    if($module.data.parse && $module.data.parse.facebook_id != "0"){
                        var li = jQuery(ul).find('li[id="0"]');
                        var table = jQuery('<table><tr><td style="vertical-align: top; width: 100%;"></td><td style="width: 200px;"></td></tr></table>');
                        jQuery(table[0].rows[0].cells[1]).append(fn.createFacebookBox())
                        jQuery(table[0].rows[0].cells[0]).append(jQuery(li).find('div').first());
                        jQuery(li).append(table);
                        //createUnregisterBox
                    }
                }
            }

            settings = {
                width: 720
            };

            div = jQuery(fn.createSlide());
            offsetParent = jQuery("#_content").offset();
            jQuery(div).width(settings.width).css("left", -1*(settings.width));
            fn.initHeaderButtons(div);

            return {
                object: div,
                close: function(){
                    if(!$module.data.slide) return false;
                    jQuery(div).animate({"left":"-="+(settings.width)+"px"}, "slow", function(){
                        jQuery(div).remove();
                    });
                    jQuery(".header").animate({"left":"0px"}, "slow");
                    jQuery(".main").animate({"left":"0px"}, "slow");
                    working = false;
                    $module.data.slide = false;
                    $module.fn.echo();
                },
                content: function(boxes){
                    var ul = jQuery("<ul></ul>");
                    jQuery(div).find(".ftt-profile-editor-slide-content").append(ul);
                    fn.appendListItems(ul, fn.createListItems(boxes));
                    fn.appendFacebook(ul);
                },
                init: function(){
                    jQuery("#_content").append(div);
                    jQuery(div).animate({"left":"0px"}, "slow");
                    jQuery(".header").animate({"left":settings.width}, "slow");
                    jQuery(".main").animate({"left":settings.width}, "slow");
                }
            }
        }
        /*
        * BOX
         */
        $module.fn.box = function(settings){
            var box = this, fn;
            fn = {
                createButton:function(st){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div');
                        sb._(("undefined"!==typeof(st.id))?' id="'+st.id+'" ':"");
                        sb._(("undefined"!==typeof(st.className))?' class="'+st.className+'" ':"");
                    sb._('>');
                        sb._('<a href="javascript:void(0)">')._(st.name)._('</a>');
                    sb._('</div>');
                    return jQuery(sb.result()).click(st.onClick);
                },
                createButtons:function(buttons){
                    if(!buttons) return [];
                    var btns = [];
                    for(var key in buttons){
                        if(!buttons.hasOwnProperty(key)) continue;
                        btns.push(fn.createButton(buttons[key]));
                    }
                    return btns;
                },
                createBox: function(st){
                    var cont, sb = $module.fn.stringBuffer();
                    sb._('<div id="')._(st.id || '')._('" class="ftt-profile-editor-box">');
                        sb._('<div class="ftt-profile-editor-box-header">');
                            sb._('<div class="ftt-profile-editor-box-header-title"><span>')._(st.name || '')._('</span></div>');
                            sb._('<div class="ftt-profile-editor-box-header-buttons">');
                            sb._('</div>');
                        sb._('</div>');
                        sb._('<div class="ftt-profile-editor-box-content"></div>');
                    sb._('</div>');
                    cont = jQuery(sb.result());
                    jQuery(cont).find(".ftt-profile-editor-box-header-buttons").append(fn.createButtons(st.buttons || false));
                    fn.appendContent(cont, st);
                    return cont;
                },
                appendContent: function(cont, st){
                    if("undefined"===typeof(st.content)) return false;
                    jQuery(cont).find(".ftt-profile-editor-box-content").append(st.content);
                }
            }
            return fn.createBox(settings);
        }
        /**
         * BASIC INFO
         */
        $module.fn.basic = function(gedcom_id){
            var fn;

            fn = {
                event: function(type){
                    var p = $module.data.parse;
                    return [p.date('birth'), " ", p.getPlaceString('birth')].join("");
                },
                line: function(title, text, check){
                    if("undefined" !== typeof(check) && !check) return "";
                    var sb = $module.fn.stringBuffer();
                    sb._('<tr>');
                        sb._('<td><div class="ftt-profile-editor-box-content-element-title"><span>')._(title)._('</span></div></td>');
                        sb._('<td><div class="ftt-profile-editor-box-content-element-text"><span>')._(text)._('</span></div></td>');
                    sb._('</tr>');
                    return sb.result();
                },
                avatar: function(){
                    return storage.usertree.avatar.get({
                        object: $module.data.object,
                        width:81,
                        height:90
                    });
                },
                create: function(){
                    var sb = $module.fn.stringBuffer();
                    sb._('<div>');
                        sb._('<div style="display: inline-block; vertical-align: top; margin:5px;">')._(fn.avatar())._('</div>');
                        sb._('<div style="display: inline-block; vertical-align: top; margin: 5px;">');
                            sb._('<table>');
                                sb._(fn.line("Full Name:", $module.data.parse.full_name));
                                sb._(fn.line("Know As:", $module.data.parse.nick));
                                sb._(fn.line("Born:", fn.event("birth"), $module.data.parse.is_birth));
                                sb._(fn.line("Death:", fn.event("death"), $module.data.parse.is_death));
                                sb._(fn.line("Relation:", $module.data.parse.relation));
                            sb._('</table>');
                        sb._('</div>');
                    sb._('</div>');
                    return jQuery(sb.result());
                }
            }
            return fn.create();
        }

        /*
        * FAMILY
         */
        $module.fn.family = function(){

            return "";
        }

        /*
        * PHOTOS
         */
        $module.fn.photos = function(){

            return "";
        }

        /*
        * RELATION
         */
        $module.fn.relation = function(){
            var $fn = {
                    createNode:function(id, data){
                        return {
                            id:"FTTRelationMapperNodeId_"+id,
                            name:"FTTRelationMapperNodeName_"+id,
                            data:data,
                            children:[]
                        }
                    },
                    createTree:function(conn, vertex){
                        var setNodes =function(el, prev, conn, pos, iter){
                            var p = parseInt(pos) + parseInt(iter);
                            if("undefined" !== conn[p] && conn.length == p + 1){
                                var target = conn[p];
                                var object = storage.usertree.pull[target.id];
                                if(parseInt(object.user.in_law)){
                                    var node = $fn.createNode(target.id,{conn:conn, id:target.id, in_law:true});
                                    prev.children.push(node);
                                    return true;
                                }
                            }
                            if("undefined" !== typeof(conn[p])){
                                var o = conn[p];
                                var node = $fn.createNode(o.id,{conn:conn, id:o.id, in_law:false});
                                el.children.push(node);
                                setNodes(node, el, conn, p, iter);
                            }
                        }
                        var start = $fn.createNode(vertex[0], {conn:conn, id:vertex[0], in_law:false});
                        setNodes(start, start, conn, vertex[1], -1);
                        setNodes(start, start, conn, vertex[1], 1);
                        return start;
                    },
                    createLabel:function(node){
                        var sb = storage.stringBuffer();
                        var id = node.id.split("_")[1];
                        var object = storage.usertree.pull[id];
                        var parse = storage.usertree.parse(object);
                        sb._('<div class="ftt-relation-mapper-node">');
                        if(node.data.in_law){
                            sb._('<div class="ftt-relation-mapper-node-plus">&nbsp;</div>');
                        }
                        sb._('<div class="ftt-relation-mapper-node-name">')._(parse.name)._('</div>');
                        sb._('<div class="ftt-relation-mapper-node-relation">')._(parse.relation)._('</div>');
                        sb._('</div>');
                        return sb.result();
                    },
                    getVertex:function(conn){
                        var vertex = [conn[0].id, 0];
                        for(var key in conn){
                            if(!conn.hasOwnProperty(key)) continue;
                            var stream = conn[key].stream;
                            if(stream == 3){
                                var index = parseInt(key) + 1;
                                var el = conn[index];
                                vertex = [el.id, index]
                            }
                        }
                        return vertex;
                    },
                    getTree:function(object){
                        var conn = object.user.connection;
                        var vertex = $fn.getVertex(conn);
                        return [conn, vertex, $fn.createTree(conn, vertex)];
                    },
                    getLevelToShow:function(tree){
                        return tree[0].length;
                    },
                    setTree:function(tree){
                        var st = new $jit.ST({
                            injectInto: 'ftt_relation_mapper_viz',
                            transition: $jit.Trans.Quart.easeInOut,
                            levelDistance: 30,
                            //offsetX:240,
                            offsetY:70,
                            levelsToShow: $fn.getLevelToShow(tree),
                            constrained: false,
                            Node: {
                                height: 28,
                                width: 120,
                                align:"center",
                                type: 'rectangle',
                                color: '#aaa',
                                overridable: true
                            },
                            Edge: {
                                type: 'bezier',
                                overridable: true
                            },
                            onCreateLabel: function(label, node){
                                label.id = node.id;
                                label.innerHTML = $fn.createLabel(node);
                            },
                            onBeforePlotNode: function(node){
                                var last = node.data.conn.pop();
                                if("undefined" !== typeof(last) && parseInt(node.data.id) === parseInt(last.id)){
                                    node.data.$color = "#FFC90E";
                                } else {
                                    node.data.$color = "#EFE4B0";
                                }
                            },
                            onBeforePlotLine:function(adj){
                                if(adj.nodeTo.data.in_law){
                                    adj.data.$color = "#FFFFFF";
                                }
                            }
                        });
                        st.loadJSON(tree[2]);
                        st.compute();
                        st.onClick(st.root);
                        st.switchPosition("top", "replot", {
                            onComplete: function(){
                            }
                        });
                    }
                },
                $tree = $fn.getTree($module.data.object);

            if($module.data.gedcom_id == storage.usertree.gedcom_id) return false;
            setTimeout(function(){
                $fn.setTree($tree);
            }, 1);
            var height = (function(t){
                var items = t[0];
                var level = 0;
                for(var key in items){
                    if(!items.hasOwnProperty(key)) continue;
                    var item = items[key];
                    if(item.level > level){
                        level = item.level;
                    }
                }
                return 58*level;
            })($tree);
            var width = 600;
            return jQuery('<div id="ftt_relation_mapper_viz" style="width:'+width+'px; height:'+height+'px; margin: 0 auto;"></div>');
        }

        /*
        * EDITOR
         */
        return {
            editor:function(settings){
                if($module.data.slide) return false;
                //data
                $module.data.gedcom_id = settings.gedcom_id;
                $module.data.object = $module.fn.getObject($module.data.gedcom_id);
                $module.data.parse = $module.fn.parse($module.data.object);

                if(!$module.data.object) return false;

                // create slide with info module structure
                $module.data.slide = $module.fn.slide();
                $module.data.slide.content([
                    {
                        id: "basic_info",
                        name: "Basic Info",
                        level: 0,
                        buttons: [
                            {
                                id: "edit",
                                name: "Edit",
                                className: "edit",
                                onClick:function(){
                                    console.log("basic info edit!");
                                }
                            }
                        ],
                        content: $module.fn.basic($module.data.gedcom_id)
                    },
                    {
                        id: "family",
                        name: "Family",
                        level: 1,
                        buttons: [],
                        content: $module.fn.family()
                    },
                    {
                        id: "photos",
                        name: "Photos",
                        level: 2,
                        buttons: [
                            {
                                id: "add",
                                name: "Add Photo",
                                onClick:function(){
                                    console.log("added new photo!");
                                }
                            }
                        ],
                        content: $module.fn.photos()
                    },
                    {
                        id: "relation",
                        name: "Relation on you: "+ $module.data.parse.relation,
                        level: 3,
                        buttons: [],
                        content: $module.fn.relation()
                    }
                ]);
                $module.data.slide.init();
            },
            bind:function(n, c){
                if(!(n in $module.data.callbacks)){
                    $module.data.callbacks[n] = c;
                }
            },
            close:function(){
                if(!$module.data.slide) return;
                $module.data.slide.close();
            }
        }
    }, true);
})($FamilyTreeTop);


