function JMBInvitateObject(obj){
    var module = this;
    var sb = host.stringBuffer();
    var user = storage.usertree.usermap;

    module.msg = {
        FTT_MOD_INVITATE_MESSAGE_YOU_LOGGED_INTO: "You are currently logged into Facebook as %%. This person is already registered in Family Tree Top.",
        FTT_MOD_INVITATE_MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK: "Click <a id='logout' href='#'>here</a> to log into Facebook with a different account.",
        FTT_MOD_INVITATE_HELLO: "Hello",
        FTT_MOD_INVITATE_HAS_INVITED_YOU: "has invited you to join this family tree.",
        FTT_MOD_INVITATE_ACCEPT: "Accept Invitation",
        FTT_MOD_INVITATE_DENY: "Deny Invitation"
    }

    module.ajax('checkUser', null, function(res){
        var json = storage.getJSON(res.responseText);

        module.setMsg(json.msg);
        if(json.success){
            sb._('<div class="exist">');
                sb._(module.getMsg('MESSAGE_YOU_LOGGED_INTO').replace('%%', user.name));
                sb._(module.getMsg('MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK'));
            sb._('</div>');
        } else {
            if(!json.sender){
                storage.alert('This invitation link is no longer valid.');
                window.location.href = storage.baseurl + 'index.php/first-page';
                return false;
            }
            sb._('<table>');
                sb._('<tr>');
                    sb._('<td>');
                        sb._('<div class="text"><span>')._(module.getMsg('HELLO'))._(' ')._(user.name)._('</span></div>');
                        sb._('<div class="text"><span>')._(json.sender)._(' ')._(module.getMsg('HAS_INVITED_YOU'))._('</span></div>');
                    sb._('</td>');
                sb._('</tr>');
                sb._('<tr>');
                    sb._('<td>');
                        sb._('<div class="avatar">');
                            sb._('<img src="http://graph.facebook.com/')._(user.facebookId)._('/picture?type=large">');
                        sb._('</div>');
                    sb._('</td>');
                sb._('</tr>');
                sb._('<tr>');
                    sb._('<td>');
                        sb._('<div class="accept"><a id="accept" href="#">')._(module.getMsg('ACCEPT'))._('</a></div>');
                    sb._('</td>');
                sb._('</tr>');
                sb._('<tr>');
                    sb._('<td>');
                        sb._('<div class="accept"><a id="deny" href="#">')._(module.getMsg('DENY'))._('</a></div>');
                    sb._('</td>');
                sb._('</tr>');
            sb._('</table>');
        }
        var htmlObject = jQuery(sb.result());
        jQuery(obj).append(htmlObject);
        jQuery(htmlObject).find('a').click(function(){
            var id = jQuery(this).attr('id');
            switch(id){
                case "logout":
                    FB.logout(function(){
                        window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=logout&return=login';
                    });
                    break;

                case "accept":
                    module.ajax('accept', null, function(acceptResponse){
                        var parseAcceptResponse = storage.getJSON(acceptResponse.responseText);
                        if(parseAcceptResponse){
                            window.location = storage.baseurl+'index.php/myfamily';
                        }
                    });
                    break;

                case "deny":
                    module.ajax('deny', null, function(denyResponse){
                        var denyResponse = storage.getJSON(denyResponse.responseText);
                        if(denyResponse){
                            window.location = storage.baseurl+'index.php/first-page';
                        }
                    });
                    break;
            }
            return false;
        });
    });
}

JMBInvitateObject.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("invitate", "JMBInvitateClass", func, params, function(res){
				callback(res);
		})
	},
    getMsg:function(n){
        var module = this;
        var t = 'FTT_MOD_INVITATE_'+n.toUpperCase();
        if(typeof(module.msg[t]) != 'undefined'){
            return module.msg[t];
        }
        return '';
    },
    setMsg:function(msg){
        var module = this;
        for(var key in module.msg){
            if(typeof(msg[key]) != 'undefined'){
                module.msg[key] = msg[key];
            }
        }
        return true;
    }
}

