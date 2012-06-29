function JMBInvitateObject(obj){
    var module = this;
    var sb = host.stringBuffer();
    FB.api('/me', function(response){
        if(!response.error){
            module.ajax('checkUser', JSON.stringify( {id:response.id, token: module.getToken() }), function(res){
                //var json = jQuery.parseJSON(res.responseText);
                var json = storage.getJSON(res.responseText);
                if(json.success){
                    sb._('<div class="exist">');
                        sb._("You are currently logged into Facebook as " + response.name);
                        sb._(" This person is already registered in Family Tree Top.");
                        sb._(" Click <a id='logout' href='#'>here</a> to log into Facebbok with a different account.");
                    sb._('</div>');
                } else {
                    if(!json.sender){
                        alert('This invitation link is no longer valid.');
                        window.location.reload();
                        return false;
                    }
                    sb._('<table>');
                        sb._('<tr>');
                            sb._('<td>');
                                sb._('<div class="text"><span>Hello ')._(response.name)._('</span></div>');
                                sb._('<div class="text"><span>')._(json.sender)._(' has invited you to join this family tree.')._('</span></div>');
                            sb._('</td>');
                        sb._('</tr>');
                        sb._('<tr>');
                            sb._('<td>');
                                sb._('<div class="avatar">');
                                    sb._('<img src="http://graph.facebook.com/')._(response.id)._('/picture?type=large">');
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
                jQuery(htmlObject).find('a').click(function(){
                    var id = jQuery(this).attr('id');
                    switch(id){
                        case "logout":
                            FB.logout(function(){
                                window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=logout&return=invitation';
                            });
                        break;

                        case "accept":
                            var args =JSON.stringify( {object:response, token: module.getToken() });
                            module.ajax('accept', args, function(acceptResponse){
                                //var parseAcceptResponse = jQuery.parseJSON(acceptResponse.responseText);
                                var parseAcceptResponse = stirage.getJSON(acceptResponse.responseText);
                                if(parseAcceptResponse){
                                    window.location = storage.baseurl+'index.php/myfamily';
                                }
                            });
                        break;

                        case "deny":
                            var args =JSON.stringify( {object:response, token: module.getToken() });
                            module.ajax('deny', args, function(denyResponse){
                                //var denyResponse = jQuery.parseJSON(denyResponse.responseText);
                                var denyResponse = storage.getJSON(denyResponse.responseText);
                                if(denyResponse){
                                    window.location = storage.baseurl+'index.php/first-page';
                                }
                            });
                            break;
                    }
                    return false;
                });
                jQuery(obj).append(htmlObject);
            });
        } else {
            FB.login(function(loginResponse){
                if(loginResponse.authResponse){
                    window.location = storage.baseurl+'index.php?option=com_jfbconnect&task=loginFacebookUser&return=invitation';
                } else {
                    alert('Login failed.')
                }
            }, {scope: "user_birthday,user_relationships,email"});
        }
    });
}

JMBInvitateObject.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("invitate", "JMBInvitateClass", func, params, function(res){
				callback(res);
		})
	},
    getToken:function(){
        var cookie = document.cookie.split(';');
        for(var key in cookie){
            var c = cookie[key].split('=');
            if(c[0]=='token'){
                return c[1];
            }
        }
        return false;
    }
}

