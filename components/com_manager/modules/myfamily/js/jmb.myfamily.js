(function($ftt){
    $ftt.module.create("MOD_MYFAMILY", function(name, parent){
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

        //$module.data.relations = {};
        //$module.data.trs = {};

        $fn.init(function(users){
            console.log(users);
        });


        /*
         getFamilyList:function(callback){
         FB.api({
         method: 'fql.query',
         query: 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id ='+storage.usertree.facebook_id
         },function(response) {
         if(response.error_code){
         $fn.getFamilyList(callback);
         } else {
         if(!response){
         callback(false);
         }
         var family =[], stack = {};

         var st = storage.usertree.users;
         for(var key in st){
         if(!st.hasOwnProperty(key) || key == storage.usertree.facebook_id || key in stack) continue;
         var el = st[key][0];
         var object = storage.usertree.pull[el.gedcom_id];
         var parse = storage.usertree.parse(object);
         family.push({uid:parse.facebook_id, relationship:parse.relation, name:parse.name});
         stack[parse.facebook_id] = true;
         }
         for(var key in response){
         if(!st.hasOwnProperty(key) || key == storage.usertree.facebook_id || key in stack) continue;
         family.push(response[key]);
         stack[response[key].uid] = true;
         }
         callback(family);
         }
         }
         );
         },
         getFeed:function(facebook_id, callback){
         var path = "/"+facebook_id+"/feed";
         FB.api(path, function(feed){
         callback(feed, facebook_id);
         });
         },
         */
        /*
        $fn.getFamilyList(function(family){
            var table, key, facebook_id, tr;
            if(!family) return $fn.exit();
            table = $fn.createTable();
            jQuery($module.data.cont).find(".ftt-myfamily-content").append(table);
            for(var key in family){
                if(!family.hasOwnProperty(key)) continue;
                facebook_id = family[key].uid;
                $module.data.relations[facebook_id] = family[key].relationship;
                $module.data.trs[facebook_id] = $fn.createTr(facebook_id);
                jQuery(table).append($module.data.trs[facebook_id]);
                $fn.getFeed(facebook_id, function(feed, facebook_id){
                    var object, data, sb, parse, relation;
                    if ("undefined" === typeof(feed.data) || feed.data.length == 0) {
                        jQuery($module.data.trs[facebook_id]).find('div.ftt-myfamily-list-item-load').parent().remove();
                        return false;
                    } else {
                        if("undefined" !== typeof(feed.data)){
                            data = feed.data[0];
                            sb = $module.fn.stringBuffer();
                            if (object = $fn.userInSystem(facebook_id)) {
                                parse = storage.usertree.parse(object);
                                relation = parse.relation;
                            } else {
                                relation = $module.data.relations[facebook_id];
                            }
                            sb._('<td><divя class="ftt-myfamily-list-item-relation">')._(relation)._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                            sb._('<td><div class="ftt-myfamily-list-item-text">')._(data.story || data.message || data.description || '')._('</div></td>');
                            jQuery($module.data.trs[facebook_id]).find('div.ftt-myfamily-list-item-load').parent().remove();
                            jQuery($module.data.trs[facebook_id]).append(sb.result());
                        }
                    }
                });
            }
            $fn.exit();
        });
        */
    });
})($FamilyTreeTop)

function JMBMyfamilyObject(parent){
    $FamilyTreeTop.module.init("MOD_MYFAMILY", parent);
}




