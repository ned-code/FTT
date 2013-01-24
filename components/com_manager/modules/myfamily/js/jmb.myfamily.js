(function($ftt){
    $ftt.module.create("MOD_MYFAMILY", function(name, parent, ajax){
        var $module = this,
            $moduleName = "JMBMyfamilyObject",
            $msg = {
                FTT_MOD_MYFAMILY_HEADER_TITLE: "My Family on Facebook",
                FTT_MOD_MYFAMILY_CLICK_HERE: "Click here"
            },
            $fn = {};

        $module.data.facebook_id = storage.usertree.facebook_id;
        $module.data.parent = parent;
        $module.data.cont = null;
        $module.data.table = null;
        $module.data.activeItem = null;
        $module.data.items = {};
        $module.data.events = {};
        $module.data.tips = {};
        $module.data.btSettings = {
            trigger: 'none',
            fill: '#F7F7F7',
            strokeStyle: '#B7B7B7',
            spikeLength: 10,
            spikeGirth: 10,
            padding: 8,
            cornerRadius: 0,
            width: 360,
            closeWhenOthersOpen: true,
            cssStyles: {
                fontFamily: '"lucida grande",tahoma,verdana,arial,sans-serif',
                fontSize: '11px'
            }
        }

        $fn = {
            getType:function(){
                var type = jQuery(document.body).attr("_type");
                return parseInt(type);
            },
            getMsg:function(n){
                var t = 'FTT_MOD_MYFAMILY_'+n.toUpperCase();
                if(typeof($msg[t]) != 'undefined'){
                    return $msg[t];
                }
                return '';
            },
            getCombined:function(family){
                var users = $module.fn.getUsers(), pull = {}, key, object;
                for(key in users){
                    if(object = $module.fn.getUser(users[key][0].gedcom_id)){
                        pull[users[key][0].facebook_id] = { type: "gedcom", object:object };
                    }
                }
                for(key in family){
                    if("undefined" === typeof(pull[family[key].uid])){
                        pull[family[key].uid] = { type:"facebook", object:family[key] }
                    }
                }
                $module.dev.message("getCombined", pull);
                return pull;

            },
            getHome:function(callback){
                var auth = $fn.getAuthResponse();
                FB.api("/me/home?&limit=100&access_token="+auth.accessToken, function(r){
                    $module.dev.message("getHome", r);
                    callback(r);
                });
            },
            getAuthResponse:function(){
                var auth = FB.getAuthResponse();
                $module.dev.message("getAuthResponse", auth);
                return auth;
            },
            getFamily:function(callback){
                FB.api({
                    method: 'fql.query',
                    query: 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id =me()'
                },function(response) {
                   $module.dev.message("getFamily", response);
                   callback(response);
                });
            },
            getUpdateTime:function(time){
                if("undefined" === typeof(time)) return '';
                var updated_time = new Date(time);
                var now_time = new Date();
                var different = Math.round((now_time.getTime() - updated_time.getTime())/1000);
                var day = Math.floor(different/86400);
                var hour = Math.floor(different/3600%24);
                var mints = Math.floor(different/60%60);
                return [(day)?day + " days ":"", (hour)?hour + " hours ":"", (mints)?mints+" minutes ":"", "ago"].join("");
            },
            getRelation:function(data, el){
                if("undefined" !== typeof(data)){
                    if("facebook" === data.type){
                        return '<span id="'+el.id+'" class="_facebook">'+data.object.relationship+"</span>";
                    } else if("gedcom" === data.type){
                        var parse = $module.fn.parse(data.object);
                        return '<span id="'+parse.gedcom_id+'" class="_gedcom">'+parse.relation+'</span>';
                    }
                }
                return '';
            },
            getName:function(data, el){
                var facebook_id = el.id.split("_")[0];
                if(facebook_id in data){
                    var user = data[facebook_id];
                    if("facebook" === user.type){
                        return user.object.name;
                    } else if("gedcom" === user.type){
                        var parse = $module.fn.parse(user.object);
                        return parse.name;
                    }
                } else {
                    return el.from.name;
                }
                return "unknown";
            },
            getMessage:function(el){
                return el.story || el.message || el.description || '';
            },
            getLink:function(el){
                return el.link || "#" ;
            },
            getPicture:function(el){
                var sb = $module.fn.stringBuffer();
                if("undefined" !== typeof(el.picture)){
                    sb._('<img src="')._(el.picture)._('">');
                } else {
                    sb._("");
                }
                return sb.result();
            },
            getTitle:function(el){
                return el.name || (el.link)?$fn.getMsg("click_here"):"" ;
            },
            setMsg:function(msg){
                for(var key in $msg){
                    if(typeof(msg[key]) != 'undefined'){
                        $msg[key] = msg[key];
                    }
                }
                return true;
            },
            isImageExist:function(el){
                return ("undefined" !== typeof(el.picture));
            },
            each:function(arr, callback){
                for(var key in arr){
                    if(!arr.hasOwnProperty(key)) continue;
                    callback(key, arr[key]);
                }
            },
            clickToRelation:function(object){
                var id = jQuery(object).attr('id');
                var obj = $module.fn.getUser(id);
                if(obj){
                    jQuery($module.data.activeItem).btOff();
                    storage.profile.editor('view', {
                        object:obj,
                        start:"view_relation_mapper"
                    });
                }
            },
            click:function(object){
                var id = jQuery(object).attr("id");
                var settings = jQuery.extend(true, {}, $module.data.btSettings, {
                    contentSelector:["jQuery('#", id, "-tip-myfamily')"].join(''),
                    preBuild:function(){
                        $module.data.activeItem = object;
                    },
                    preHide:function(){
                        jQuery($module.data.tips[id]).remove();
                        jQuery($module.data.items[id]).removeClass("active");
                    }
                });
                $fn.tip(id, function(){
                    jQuery($module.data.tips[id]).find("img").unbind();
                    jQuery(object).bt(settings);
                    jQuery(object).btOn();
                    return false;
                });
            },
            tip:function(id, callback){
                var el = $module.data.events[id];
                var sb = $module.fn.stringBuffer();
                sb._("<div id='")._(el.id)._("-tip-myfamily' class='ftt-myfamily-tip' style='display:none;'>");
                    sb._('<div class="ftt-myfamily-tip-title"><a href="')._($fn.getLink(el))._('">')._($fn.getTitle(el))._('</a></div>');
                    sb._('<div class="ftt-myfamily-tip-icon">')._($fn.getPicture(el))._('</div>');
                    sb._('<div class="ftt-myfamily-tip-message">')._($fn.getMessage(el))._('</div>');
                    sb._('<div class="ftt-myfamily-tip-comments">&nbsp;</div>');
                sb._("</div>");
                $module.data.tips[el.id] = jQuery(sb.result());
                jQuery(document.body).append($module.data.tips[el.id]);
                if($fn.isImageExist(el)){
                    jQuery($module.data.tips[el.id]).find("img").bind("load", callback);
                } else {
                    setTimeout(callback, 1)
                }
            },
            init:function(callback){
                if("undefined" !== typeof(window.FB)){
                    $fn.getFamily(function(family){
                        if(family.error_code){
                            setTimeout(function(){
                                $fn.init(callback);
                            }, 1000);
                        } else {
                           callback($fn.getCombined(family));
                           $fn.exit();
                        }
                    });
                } else {
                    setTimeout(function(){
                        $fn.init(callback);
                    }, 1000);
                }
            },
            render:function(){
                $fn.init(function(users){
                    $fn.getHome(function(home){
                        $module.data.table = jQuery('<table id="ftt_myfamily_data"></table>');
                        jQuery($module.data.parent).find(".ftt-myfamily-content").append($module.data.table);
                        $fn.each(home.data, function(i, el){
                            var facebook_id = el.id.split("_")[0], sb = $module.fn.stringBuffer();
                            if(facebook_id in users && facebook_id != $module.data.facebook_id ){
                                sb._('<tr id="')._(el.id)._('">');
                                sb._('<td><div class="ftt-myfamily-list-item-relation">')._($fn.getRelation(users[facebook_id], el))._('</div></td>');
                                sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                                sb._('<td style="vertical-align: top;" >');
                                sb._('<div class="ftt-myfamily-list-item-text"><span class="ftt-myfamily-list-item-author">')._($fn.getName(users, el))._('</span> ')._($fn.getMessage(el))._('</div>');
                                sb._('<div class="ftt-myfamily-list-item-time">')._($fn.getUpdateTime(el.updated_time))._('</div>');
                                sb._('</td>');
                                sb._("</tr>");
                                $module.data.items[el.id] = jQuery(sb.result());
                                $module.data.events[el.id] = el;
                                jQuery($module.data.items[el.id]).click(function(){
                                    if(jQuery(this).hasClass("active")) return false;
                                    jQuery(this).addClass("active");
                                    $fn.click(this);
                                    return false;
                                });
                                jQuery($module.data.items[el.id]).find('.ftt-myfamily-list-item-relation span._gedcom').click(function(){
                                    $fn.clickToRelation(this);
                                    return false;
                                });
                                jQuery($module.data.table).append($module.data.items[el.id]);
                            }
                        });
                        $module.data.interval = 0;
                        $module.data.timerActive = false;
                        $module.data.timer = window.setInterval(function(){
                            $module.data.interval++;
                            jQuery($module.data.cont).find('.ftt-myfamily-header-update-text-count').text($module.data.interval+" mins ago");
                        }, 1000*60);
                    });
                });
            },
            exit:function(){ storage.core.modulesPullObject.unset($moduleName); return 0; },
            reload:function(){ console.log("reload") },
            create:function(){
                var sb = storage.stringBuffer();
                sb._('<div class="ftt-myfamily-container">');
                    sb._('<div class="ftt-myfamily-header"><span>')._($fn.getMsg("header_title"))._('</span>');
                        sb._('<div class="ftt-myfamily-header-update">');
                            sb._('<table>');
                                sb._('<tr>');
                                    sb._('<td>');
                                        sb._('<div class="ftt-myfamily-header-update-button">&nbsp;</div>');
                                    sb._('</td>');
                                    sb._('<td>');
                                        sb._('<div class="ftt-myfamily-header-update-text">');
                                            sb._('<div class="ftt-myfamily-header-update-text-title">Updated:</div>');
                                            sb._('<div class="ftt-myfamily-header-update-text-count">0 mins ago</div>');
                                        sb._('</div>');
                                    sb._('</td>');
                                sb._('</tr>');
                            sb._('</table>');
                        sb._('</div>');
                    sb._('</div>');
                    sb._('<div class="ftt-myfamily-content"></div>')
                sb._('</div>');
                return jQuery(sb.result());
            },
            bindProfile:function(callback){
                storage.profile.bind($moduleName, function(){
                    callback
                });
            }
        }

        if($fn.getType() == 0){
            $module.data.cont = $fn.create();
            jQuery($module.data.parent).append($module.data.cont);
            $fn.render();
            jQuery($module.data.cont).find('.ftt-myfamily-header-update-button').click(function(){
                if($module.data.timerActive) return false;
                $module.data.timerActive = true;
                jQuery($module.data.cont).find('table#ftt_myfamily_data').remove();
                jQuery($module.data.cont).find('.ftt-myfamily-header-update-text-count').text("0 mins ago");
                clearInterval($module.data.timer);
                $fn.render();
            });
        } else {
            ajax('get', null, function(res){
                $fn.exit();
                jQuery(parent).append('<div class="ftt-myfamily-wiki-content"><iframe style="height: 500px;width: 100%;" src="'+res[0].link+'"></iframe><div class="ftt-myfamily-show"><a target="_blank" href="'+res[0].link+'">&nbsp;</a></div></div>');
            });
        }

        storage.addEvent(storage.tabs, function(){
            clearInterval($module.data.timer);
        });

        return this;
    });
})($FamilyTreeTop)

function JMBMyfamilyObject(parent){
    $FamilyTreeTop.module.init("MOD_MYFAMILY", parent, this._ajax);
}
JMBMyfamilyObject.prototype = {
    _ajax:function(func, params, callback){
        storage.callMethod("myfamily", "FTTMyFamily", func, params, function(res){
            callback(storage.getJSON(res.responseText));
        })
    }
}

