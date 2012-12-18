(function($ftt){
    $ftt.module.create("MOD_MYFAMILY", function(name, parent, ajax){
        var $module = this,
            $moduleName = "JMBMyfamilyObject",
            $msg = {
                FTT_MOD_MYFAMILY_HEADER_TITLE: "My Family on Facebook"
            },
            $fn = {};

        jQuery(parent).css('height', "94.5%");

        $fn = {
            getMsg:function(n){
                var t = 'FTT_MOD_MYFAMILY_'+n.toUpperCase();
                if(typeof($msg[t]) != 'undefined'){
                    return $msg[t];
                }
                return '';
            },
            getCombined:function(family){
                var users = $module.fn.getUsers("facebook"), pull = {}, key, object;
                for(key in users){
                    if(object = $module.fn.isUserExist(users[key][0].gedcom_id)){
                        pull[users[key][0].facebook_id] = { type: "FamilyTreeTop", object:object };
                    }
                }
                for(key in family){
                    if("undefined" === typeof(pull[family[key].uid])){
                        pull[family[key].uid] = { type:"facebook", object:family[key] }
                    }
                }
                return pull;

            },
            getHome:function(callback){
                var auth = FB.getAuthResponse();
                FB.api("/me/home?access_token="+auth.accessToken, function(r){
                    callback(r);
                });
            },
            getFeed:function(facebook_id, callback, level){
                if("undefined" === level){
                    level = 0;
                }
                FB.api("/"+facebook_id+"/feed", function(response){
                    callback(response);
                });
            },
            getAuthResponse:function(){
                return FB.getAuthResponse();
            },
            getFamily:function(callback){
                FB.api({
                    method: 'fql.query',
                    query: 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id ='+$module.fn.getUsertree().facebook_id
                },function(response) {
                   callback(response);
                });
            },
            setMsg:function(msg){
                for(var key in $msg){
                    if(typeof(msg[key]) != 'undefined'){
                        $msg[key] = msg[key];
                    }
                }
                return true;
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
            exit:function(){ storage.core.modulesPullObject.unset($moduleName); return 0; },
            reload:function(){ console.log("reload") },
            create:function(){
                var sb = storage.stringBuffer();
                sb._('<div class="ftt-myfamily-container">');
                sb._('<div class="ftt-myfamily-header"><span>')._($fn.getMsg("header_title"))._('</span></div>');
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

        $module.data.cont = $fn.create();
        jQuery(parent).append($module.data.cont);

        $module.data.relations = {};
        $module.data.items = {};
        $module.data.table = null;
        $module.data.lastTr = null;

        $fn.init(function(users){
            var key, el, facebook_id, parse;
            $module.data.table = jQuery("<table></table>");
            jQuery(parent).find(".ftt-myfamily-content").append($module.data.table);
            for(key in users){
                el = users[key];
                if("facebook" === el.type){
                    facebook_id = el.object.uid;
                    $module.data.relations[facebook_id] = el.object.relationship;
                } else if("gedcom" === el.type){
                    parse = $module.fn.parse(el.object);
                    facebook_id = parse.facebook_id;
                    $module.data.relations[facebook_id] = parse.relation;
                }
                $module.data.lastTr = jQuery("<tr><td colspan='3'><div class='ftt-myfamily-list-item-load'></div></td></tr>");
                $module.data.items[facebook_id] = $module.data.lastTr;
                jQuery($module.data.table).append($module.data.lastTr);
                $fn.getFeed(facebook_id, function(feed){
                    var object, data, sb, parse, relation;
                    if ("undefined" === typeof(feed.data) || feed.data.length == 0) {
                        return false;
                    } else {
                        if("undefined" !== typeof(feed.data)){
                            data = feed.data[0];
                            sb = $module.fn.stringBuffer();
                            relation = $module.data.relations[facebook_id];
                            sb._('<td><divя class="ftt-myfamily-list-item-relation">')._(relation)._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-text">')._(data.story || data.message || data.description || '')._('</div></td>');
                            jQuery($module.data.items[facebook_id]).find('div.ftt-myfamily-list-item-load').parent().remove();
                            jQuery($module.data.items[facebook_id]).append(sb.result());
                        }
                    }
                });
            }
        });
    });
})($FamilyTreeTop)

function JMBMyfamilyObject(parent){
    $FamilyTreeTop.module.init("MOD_MYFAMILY", parent, this.ajax);
}


JMBMyfamilyObject.prototype = {
    ajax:function(method,args,callback){
        storage.callMethod("myfamily", "FTTMyFamily", method, args, function(req){
            callback(req.responseText);
        })
    }
}

