function JMBInvitateObject(obj){
    var module = this;
    var sb = host.stringBuffer();
    var user = storage.usertree.user;

    if(user.guest){
        FB.login(function(loginResponse){
            if(loginResponse.authResponse){
                window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=invitation';
            } else {
                alert('Login failed.')
            }
        }, {scope: "user_birthday,user_relationships,email"});
    } else {
        module.ajax('checkUser', null, function(res){
            var json = storage.getJSON(res.responseText);
            if(json.success){
                sb._('<div class="exist">');
                    sb._("You are currently logged into Facebook as " + user.name);
                    sb._(" This person is already registered in Family Tree Top.");
                    sb._(" Click <a id='logout' href='#'>here</a> to log into Facebbok with a different account.");
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
                            sb._('<div class="text"><span>Hello ')._(user.name)._('</span></div>');
                            sb._('<div class="text"><span>')._(json.sender)._(' has invited you to join this family tree.')._('</span></div>');
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
                            sb._('<div class="accept"><a id="accept" href="#">Accept Invitation</a></div>');
                        sb._('</td>');
                    sb._('</tr>');
                    sb._('<tr>');
                        sb._('<td>');
                            sb._('<div class="accept"><a id="deny" href="#">Deny Invitation</a></div>');
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
                            window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=logout&return=invitation';
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
}

JMBInvitateObject.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("invitate", "JMBInvitateClass", func, params, function(res){
				callback(res);
		})
	}
}

