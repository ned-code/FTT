(function($ftt){
    $ftt.module.create("MOD_MYFAMILY", function(name, parent, ajax){
        var $module = this,
            $moduleName = "JMBMyfamilyObject",
            $msg = {
                FTT_MOD_MYFAMILY_HEADER_TITLE: "My Family on Facebook"
            },
            $fn = {};

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
                        pull[users[key][0].facebook_id] = { type: "gedcom", object:object };
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
            getRelation:function(data, el){
                if("undefined" !== typeof(data)){
                    if("facebook" === data.type){
                        return data.object.relationship;
                    } else if("gedcom" === data.type){
                        return $module.fn.parse(data.object).relation;
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
                return el.story || el.message || el.description || el.name || '';
            },
            setMsg:function(msg){
                for(var key in $msg){
                    if(typeof(msg[key]) != 'undefined'){
                        $msg[key] = msg[key];
                    }
                }
                return true;
            },
            each:function(arr, callback){
                for(var key in arr){
                    if(!arr.hasOwnProperty(key)) continue;
                    callback(key, arr[key]);
                }
            },
            click:function(el){
                console.log(el);
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

        $module.data.parent = parent;
        $module.data.cont = $fn.create();

        jQuery($module.data.parent).append($module.data.cont);

        $module.data.table = null;
        $module.data.activeItem = null;
        $module.data.items = {};

        $fn.init(function(users){
            $fn.getHome(function(home){
                $module.data.table = jQuery("<table></table>");
                jQuery($module.data.parent).find(".ftt-myfamily-content").append($module.data.table);
                $fn.each(home.data, function(i, el){
                    var facebook_id = el.id.split("_")[0], sb = $module.fn.stringBuffer();
                    if(facebook_id in users){
                        sb._('<tr id="')._(facebook_id)._('">');
                            sb._('<td><div class="ftt-myfamily-list-item-relation">')._($fn.getRelation(users[facebook_id], el))._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                            sb._('<td style="vertical-align: top;" ><div class="ftt-myfamily-list-item-text"><span class="ftt-myfamily-list-item-author">')._($fn.getName(users, el))._('</span> ')._($fn.getMessage(el))._('</div></td>');
                        sb._("</tr>");
                        $module.data.items[facebook_id] = jQuery(sb.result());
                        jQuery($module.data.items[facebook_id]).click(function(){
                            if($module.data.activeItem == this) return false;
                            if(null !== $module.data.activeItem){
                                jQuery($module.data.activeItem).removeClass("active");
                            }
                            jQuery(this).addClass("active");
                            $module.data.activeItem = this;
                            $fn.click(this);
                            return false;
                        });
                        jQuery($module.data.table).append($module.data.items[facebook_id]);
                    }
                });
            });
        });

        /*
        $fn.init(function(users){
            var key, el, facebook_id, parse, access_token;
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
                $module.data.lastTr = jQuery("<tr id='"+facebook_id+"'><td colspan='3'><div class='ftt-myfamily-list-item-load'></div></td></tr>");
                $module.data.items[facebook_id] = $module.data.lastTr;
                jQuery($module.data.table).append($module.data.lastTr);
                access_token = $fn.getAuthResponse().accessToken;
                $fn.getFeed(facebook_id, access_token, function(feed, facebook_id){
                    var object, data, sb, parse, relation;
                    if ("undefined" === typeof(feed.data) || feed.data.length == 0) {
                        jQuery($module.data.items[facebook_id]).find('div.ftt-myfamily-list-item-load').parent().remove();
                        return false;
                    } else {
                        if("undefined" !== typeof(feed.data)){
                            data = feed.data[0];
                            sb = $module.fn.stringBuffer();
                            relation = $module.data.relations[facebook_id];
                            sb._('<td><divя class="ftt-myfamily-list-item-relation">')._(relation)._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-text">')._(data.story || data.message || data.description || data.name || '')._('</div></td>');
                            jQuery($module.data.items[facebook_id]).find('div.ftt-myfamily-list-item-load').parent().remove();
                            jQuery($module.data.items[facebook_id]).append(sb.result());
                        }
                    }
                });
            }
        });
        */
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

