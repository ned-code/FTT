function JMBMyfamilyObject(parent){
    var $module = this,
        $moduleName = "JMBMyfamilyObject",
        $cont,
        $msg = {
            FTT_MOD_MYFAMILY_HEADER_TITLE: "My Family"
        },
        $fn = {};

    $fn = {
        setMsg:function(msg){
            for(var key in $msg){
                if(typeof(msg[key]) != 'undefined'){
                    $msg[key] = msg[key];
                }
            }
            return true;
        },
        getMsg:function(n){
            var t = 'FTT_MOD_MYFAMILY_'+n.toUpperCase();
            if(typeof($msg[t]) != 'undefined'){
                return $msg[t];
            }
            return '';
        },
        getFamilyList:function(callback){
            FB.api({
                    method: 'fql.query',
                    query: 'SELECT name, birthday, uid, relationship FROM family WHERE profile_id ='+storage.usertree.facebook_id
                },function(response) {
                    if(response.error_code){
                        $fn.getFamilyList(callback);
                    } else {
                        callback(response);
                    }
                }
            );
        },
        init:function(callback){
            if("undefined" !== typeof(window.FB) ){
                callback();
            } else {
                setTimeout(function(){
                    $fn.init(callback);
                }, 1000);
            }
        },
        exit:function(){ storage.core.modulesPullObject.unset($moduleName); },
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
        },
        userInSystem:function(facebook_id){
            if("undefined" !== typeof(storage.usertree.users[facebook_id])){
                var el = storage.usertree.users[facebook_id];
                var gedcom_id =el[0].gedcom_id;
                if("undefined" !== typeof(storage.usertree.pull[gedcom_id])){
                    return storage.usertree.pull[gedcom_id];
                }
            } else {
                return false;
            }
        }
    }

    $cont = $fn.create();
    jQuery(parent).append($cont);

    $fn.init(function(){
        $fn.getFamilyList(function(response){
            if(!response) return false;
            var table = jQuery('<table></table>');
            var relations = {};
            for(var key in response){
                if(!response.hasOwnProperty(key)) continue;
                var object = response[key];
                relations[object.uid] = object.relationship;
                var tr = jQuery('<tr id="'+object.uid+'"><td><div class="ftt-myfamily-list-item-load">&nbsp;</div></td></tr>')
                jQuery(table).append(tr);
                FB.api("/"+object.uid+"/feed", function(feed){
                    if(feed.data.length == 0){
                        jQuery(tr).remove();
                        return false;
                    }
                    var data = feed.data[0],
                        sb = storage.stringBuffer(),
                        facebook_id = data.from.id,
                        object,
                        parse,
                        relation;
                    if(object = $fn.userInSystem(facebook_id)){
                        parse = storage.usertree.parse(object);
                        relation = parse.relation;
                    } else {
                        relation = relations[facebook_id];
                    }
                    sb._('<td><div class="ftt-myfamily-list-item-relation">')._(relation)._('</div></td>');
                    sb._('<td><div class="ftt-myfamily-list-item-avatar">')._(storage.usertree.avatar.facebook(facebook_id, 50, 50))._('</div></td>');
                    sb._('<td><div class="ftt-myfamily-list-item-text">')._(data.story)._('</div></td>');
                    jQuery(tr).find('div.ftt-myfamily-list-item-load').parent().remove();
                    jQuery(tr).append(sb.result());
                });
            }
            jQuery($cont).find(".ftt-myfamily-content").append(table);
        });
        $fn.exit();
    });
}

JMBMyfamilyObject.prototype = {
    ajax:function(func, params, callback){
        storage.callMethod("myfamily", "FTTMyFamily", func, params, function(res){
            callback(storage.getJSON(res.responseText));
        });
    }
}




