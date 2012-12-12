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
                sb._('<div class="ftt-myfamily-content">TEST TEST TEST</div>')
            sb._('</div>');
            return sb.result();
        },
        bindProfile:function(callback){
            storage.profile.bind($moduleName, function(){
                callback
            });
        },
        getFamilyList:function(callback){
            FB.api({
                method: 'fql.query',
                query: "SELECT name, birthday, profile_id, relationship FROM family WHERE profile_id = "+storage.usertree.facebook_id
            }, function(response){
                callback(response);
            });
        }
    }

    $cont = $fn.create();
    jQuery(parent).append($cont);
    $fn.exit();
}

JMBMyfamilyObject.prototype = {
    ajax:function(func, params, callback){
        storage.callMethod("myfamily", "FTTMyFamily", func, params, function(res){
            callback(storage.getJSON(res.responseText));
        });
    }
}




