function JMBInvitateObject(obj){
    var module = this,
        user = storage.usertree.usermap,
        fn = {};

    module.msg = {
        FTT_MOD_INVITATE_MESSAGE_YOU_LOGGED_INTO: "You are currently logged into Facebook as %%. This person is already registered in Family Tree Top.",
        FTT_MOD_INVITATE_MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK: "Click <a id='logout' href='#'>here</a> to log into Facebook with a different account.",
        FTT_MOD_INVITATE_HELLO: "Hello",
        FTT_MOD_INVITATE_HAS_INVITED_YOU: "has invited you to join this family tree.",
        FTT_MOD_INVITATE_ACCEPT: "Accept Invitation",
        FTT_MOD_INVITATE_DENY: "Deny Invitation",
        FTT_MOD_ALERT_INVITATION_LINK_NO_LONGER_VALID: "This invitation link is no longer valid."
    }

    fn.checkUser = function(c){
        module.ajax('checkUser', null, function(res){
            var json = storage.getJSON(res.responseText);
            module.setMsg(json.msg);
            c(json);
        });
    }

    fn.boxIfUserExist = function(json){
        var sb = storage.stringBuffer();
        sb._('<div class="exist">');
            sb._(module.getMsg('MESSAGE_YOU_LOGGED_INTO').replace('%%', user.name));
            sb._(module.getMsg('MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK'));
        sb._('</div>');
        return sb.result();
    }

    fn.getObjectbyId = function(data, id){
        for(var key in data){
            if(data.hasOwnProperty(key)){
                if(data[key].user.gedcom_id == id){
                    return data[key];
                }
            }
        }
    }

    fn.getTarget = function(json){
        var target_id = json.data.to;
        return fn.getObjectbyId(json.family, target_id);
    }

    fn.getSender = function(json){
        var target_id = json.data.from;
        return fn.getObjectbyId(json.family, target_id);
    }

    fn.getRelation = function(json){
        return json.data.relation;
    }

    fn.getName = function(object){
        return [object.user.first_name, object.user.last_name].join(' ');
    }

    fn.getFirstName = function(object){
        return object.user.first_name;
    }

    fn.getFacebookProfileLink = function(object, text){
        var sb = storage.stringBuffer();
        sb._('<a href="http://facebook.com/')._(object.user.facebook_id)._('">');
            sb._(text);
        sb._('</a>');
        return sb.result();
    }

    fn.getSenderEmail = function(json){
        var data = json.data;
        if(data.sender_data.length != 0){
            var s_data = data.sender_data[0];
            return s_data.email;
        }
    }

    fn.boxInvitation = function(json){
        var sb = storage.stringBuffer();
        var target = fn.getTarget(json);
        var sender = fn.getSender(json);

        sb._('<div class="ftt-invitate-header">');
            sb._('<div class="ftt-invitate-header-body">');
                sb._('<div class="ftt-invitate-hello">Hello <span style="font-weight: bold;">')._(fn.getFirstName(target))._('</span>!</div>');
                sb._('<div class="ftt-invitate-message">');
                    sb._('Your ')._(fn.getRelation(json))._(', ')._(fn.getName(sender))._(', has invited you to join your family tree on <span style="font-weight: bold;">Family TreeTop</span>. This is a private space that can only be seen by members of your family.');
                sb._('</div>');
                sb._('<div class="ftt-invitate-buttons">');
                    sb._('<div class="ftt-invitate-button accept">Accept Invitation</div>');
                    sb._('<div class="ftt-invitate-button deny">No, thanks</div>');
                sb._('</div>');
            sb._('</div>');
        sb._('</div>');
        sb._('<div class="ftt-invitate-content"></div>');
        sb._('<div class="ftt-invitate-footer">');
            sb._('<div class="ftt-invitate-footer-body">Not sure? Click ');
                sb._(fn.getFacebookProfileLink(sender, 'here'));
                sb._(' to view the Facebook profile for ');
                sb._(fn.getFirstName(sender));
                sb._('. If you wish to contact ');
                sb._(fn.getFirstName(sender));
                sb._(', you may email him at ');
                sb._(fn.getSenderEmail(json));
                sb._('</div>');
        sb._('</div>');
        return sb.result();
    }

    fn.boxFamily = function(json, object){
        var sb = storage.stringBuffer();
    }

    fn.handlerButtonClick = function(object){
        jQuery(object).find('.ftt-invitate-button.accept').click(function(){
            module.ajax('accept', null, function(acceptResponse){
                var parseAcceptResponse = storage.getJSON(acceptResponse.responseText);
                if(parseAcceptResponse){
                    window.location = storage.baseurl+'index.php/myfamily';
                }
            });
        });
        jQuery(object).find('.ftt-invitate-button.deny').click(function(){
            module.ajax('deny', null, function(denyResponse){
                var denyResponse = storage.getJSON(denyResponse.responseText);
                if(denyResponse){
                    window.location = storage.baseurl+'index.php/first-page';
                }
            });
        })
    }

    fn.checkUser(function(json){
        var cont, object;
        if(json.success){
             cont = fn.boxIfUserExist(json);
        } else {
            if(!json.sender){
                storage.alert(module.getMsg('ALERT_INVITATION_LINK_NO_LONGER_VALID'));
                window.location.href = storage.baseurl + 'index.php/first-page';
                return false;
            } else {
                cont = fn.boxInvitation(json);
            }
        }
        object = jQuery(cont);
        jQuery('.content').css('width', '100%').css('margin-top', '30px').css('max-width', 'none');
        jQuery(obj).append(object);
        fn.boxFamily(json, object);
        fn.handlerButtonClick(object)
        console.log(json);
    });

    /*
    var module = this;
    var sb = host.stringBuffer();
    var user = storage.usertree.usermap;

    module.msg = {
        FTT_MOD_INVITATE_MESSAGE_YOU_LOGGED_INTO: "You are currently logged into Facebook as %%. This person is already registered in Family Tree Top.",
        FTT_MOD_INVITATE_MESSAGE_CLICK_TO_LOG_INTO_FACEBOOK: "Click <a id='logout' href='#'>here</a> to log into Facebook with a different account.",
        FTT_MOD_INVITATE_HELLO: "Hello",
        FTT_MOD_INVITATE_HAS_INVITED_YOU: "has invited you to join this family tree.",
        FTT_MOD_INVITATE_ACCEPT: "Accept Invitation",
        FTT_MOD_INVITATE_DENY: "Deny Invitation",
        FTT_MOD_ALERT_INVITATION_LINK_NO_LONGER_VALID: "This invitation link is no longer valid."
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
                storage.alert(module.getMsg('ALERT_INVITATION_LINK_NO_LONGER_VALID'));
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
                        FB.login(function(response){
                            if (response.authResponse) {
                                jQuery.ajax({
                                    url: 'index.php?option=com_jfbconnect&task=logout&return=login',
                                    type: "POST",
                                    dataType: "json",
                                    complete : function(){
                                        window.location.reload();
                                    }
                                });
                            }
                        });
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
*/
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

