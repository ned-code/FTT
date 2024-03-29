(function($, $ftt){
    $ftt.module.create("MOD_RECENT_VISITORS", function(name, parent, ajax, renderType, popup){
        var module = this,
            content = null,
            sb = storage.stringBuffer(),
            settings = storage.settings,
            ul,
            functions ={
                ajax:function(func, params, callback){
                    ajax.call("recent_visitors", "JMBRecentVisitors", func, params, function(status){
                        callback(status);
                    });
                },
                createBody:function(json){
                    var st = storage.stringBuffer();
                    st._('<div class="jmb-rv-header" >');
                    st._('<span>')._(message.FTT_MOD_RECENT_VISITORS_HEADER)._('</span>');
                    st._('</div>');
                    st._('<div class="jmb-rv-content"></div>');
                    st._('<div class="jmb-rv-button">');
                    st._('</div>');
                    return jQuery(st.result());
                },
                get_avatar:function(object){
                    return storage.usertree.avatar.get({
                        object:object,
                        width:32,
                        height:32
                    });
                },
                get_time:function(time){
                    var t = time.split(/[- :]/);
                    return (t[0]!='0000'&&t[1]!='00'&&t[2]!='00')?new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]): false;
                },
                get_difference:function(time, object){
                    var st = storage.stringBuffer(),
                        now = functions.get_time(time),
                        lastLogin = functions.get_time(object.last_login),
                        different,
                        day,
                        hour;
                    if(!now||!lastLogin) return 'unknown';
                    different = Math.round((now.getTime() - lastLogin.getTime())/1000);
                    day = Math.floor(different/86400);
                    hour = Math.floor(different/3600%24);
                    if(day!=0){
                        st._(day)._(' ')
                        st._(message.FTT_MOD_RECENT_VISITORS_DAYS)._(' ');
                    }
                    st._(hour)._(' ');
                    st._(message.FTT_MOD_RECENT_VISITORS_HOURS)._(' ');
                    st._(message.FTT_MOD_RECENT_VISITORS_AGO)._(' ');
                    return st.result();
                },
                init_tipty_tooltip:function(time, object, container){
                    if(!object) return;
                    var 	st = storage.stringBuffer(),
                        user = object.user,
                        parse = storage.usertree.parse(object),
                        time = functions.get_difference(time, user),
                        fallback = st._('<div>')._(parse.name)._('</div>')._('<div>')._(time)._('</div>').result();
                    jQuery(container).tipsy({
                        gravity: 'sw',
                        html: true,
                        fallback: fallback
                    });
                },
                init_visitors:function(ul, json){
                    var st = storage.stringBuffer();
                    var objects = json.objects;
                    for(var key in objects){
                        var object = storage.usertree.pull[objects[key].gedcom_id];
                        if(typeof(object) == 'undefined') continue;
                        var user = object.user
                        st.clear();
                        st._('<li id="')._(user.gedcom_id)._('" >');
                        st._('<div id="father_line" class="line-without-border">');
                        st._('<div id="mother_line" class="line-without-border">')
                        st._('<div class="avatar">')._(functions.get_avatar(object))._('</div>');
                        st._('</div>');
                        sb._('</div>')
                        st._('</li>');
                        var html = st.result()
                        var li = jQuery(html);
                        jQuery(ul).append(li);
                        functions.init_tipty_tooltip(json.time, object, li);
                    }
                },
                setMiniTooltip:function(div, id){
                    module.fn.mod("tooltip").render('view', {
                        gedcom_id:id,
                        target:div,
                        afterEditorClose:function(){
                            module.fn.mod("tooltip").update();
                        }
                    });
                },
                init_mini_profile:function(ul,json){
                    var li = jQuery(ul).find('li');
                    jQuery(li).each(function(i,e){
                        var id = jQuery(e).attr('id');
                        var div = jQuery(e).find('div.avatar');
                        functions.setMiniTooltip(div, id);
                    });
                },
                reload:function(content, json){
                    jQuery(ul).remove();
                    ul = jQuery('<ul></ul>');
                    functions.init_visitors(ul, json);
                    functions.init_mini_profile(ul, json);
                    jQuery(content[1]).append(ul);
                    jQuery(obj).append(content);
                },
                render:function(callback){
                    functions.ajax('getRecentVisitors', null, function(json){
                        if(!json) return false;
                        if(json.error || json.objects.length == 0){
                            return jQuery(parent).remove();
                        }
                        if(json.language){
                            message = json.language;
                        }
                        content = functions.createBody(json);
                        ul = jQuery('<ul></ul>');
                        functions.init_visitors(ul, json);
                        functions.init_mini_profile(ul, json);
                        jQuery(content[1]).append(ul);
                        jQuery(parent).append(content);
                        if(callback) callback();
                    });
                }
            },
            message = {
                FTT_MOD_RECENT_VISITORS_HEADER:"Recent Visitors",
                FTT_MOD_RECENT_VISITORS_DAYS:"days",
                FTT_MOD_RECENT_VISITORS_HOURS:"hours",
                FTT_MOD_RECENT_VISITORS_AGO:"ago",
                FTT_MOD_RECENT_VISITORS_SHOW:"Show all"
            };

        functions.render(function(){
            storage.core.modulesPullObject.unset('JMBRecentVisitorsObject');
        });

        $FamilyTreeTop.fn.mod("family_line").bind('JMBRecentVisitorsObject', function(res){
            jQuery(content[1]).find('li').each(function(i, el){
                var type = 'is_'+res._line+'_line';
                var id = jQuery(el).attr('id');
                var object = storage.usertree.pull[id];
                var user = object.user;
                switch(res._type){
                    case "pencil":
                        if(parseInt(user[type])){
                            var div = jQuery(el).find('div#'+res._line+'_line');
                            if(res._active){
                                jQuery(div).addClass(res._line);
                            } else {
                                jQuery(div).removeClass(res._line);
                            }
                        }
                        break;

                    case "eye":
                        if(parseInt(user.is_father_line)&&parseInt(user.is_mother_line)){
                            var opt = [res.opt.mother.eye, res.opt.father.eye];
                            if(!opt[0]&&!opt[1]){
                                jQuery(el).hide();
                            } else if(opt[0]||opt[1]){
                                jQuery(el).show();
                            }
                        } else {
                            if(parseInt(user[type])){
                                if(res._active){
                                    jQuery(el).show();
                                } else {
                                    jQuery(el).hide();
                                }
                            }
                        }
                        break;
                }
            });
        });
        return this;
    });
})(jQuery, $FamilyTreeTop);


function JMBRecentVisitorsObject(obj, popup){
    $FamilyTreeTop.module.init("MOD_RECENT_VISITORS", obj, $FamilyTreeTop.fn.mod("ajax"), "desctop", popup);
}


