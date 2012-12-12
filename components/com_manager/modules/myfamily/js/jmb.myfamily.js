function JMBMyfamilyObject(parent){
    var $module = this,
        $moduleName = "JMBMyfamilyObject",
        $cont,
        $list,
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
        getFamilyList:function(callback){
            FB.getLoginStatus(function(status){
                if(status.status == "connected"){
                    FB.api({
                            method: 'fql.query',
                            query: 'SELECT name, birthday, profile_id, relationship FROM family WHERE profile_id ='+storage.usertree.facebook_id
                        },function(response) {
                            callback(response);
                        }
                    );
                } else {
                    callback(false);
                }

            });
        },
        bindProfile:function(callback){
            storage.profile.bind($moduleName, function(){
                callback
            });
        }
    }

    $cont = $fn.create();
    jQuery(parent).append($cont);

    $fn.getFamilyList(function(response){
        if(!response) return false;
        var ul = jQuery('<ul></ul>');
        for(var key in response){
            if(!response.hasOwnProperty(key)) continue;
            var object = response[key];
            var li = jQuery('<li id="'+object.profile_id+'">'+object.name+'('+object.relationship+')</li>');
            jQuery(ul).append(li);
        }
        jQuery($cont).find(".ftt-myfamily-content").append(ul);
    });
    $fn.exit();
}

JMBMyfamilyObject.prototype = {
    ajax:function(func, params, callback){
        storage.callMethod("myfamily", "FTTMyFamily", func, params, function(res){
            callback(storage.getJSON(res.responseText));
        });
    }
}




