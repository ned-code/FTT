function JMBInvitation(){
    var module = this;
    module.path = "components/com_manager/modules/invitation/images/";
    module.transportation = false;
    module.dialogBox = false;
    module.msg = {
        FTT_MOD_INVITATION_HEADER: "Send Invitation",
        FTT_MOD_INVITATION_NAME: "Name",
        FTT_MOD_INVITATION_BORN: "Born",
        FTT_MOD_INVITATION_RELATION: "Relation",
        FTT_MOD_INVITATION_SELECT_FACEBOOK_FRIEND: "Facebook Friend",
        FTT_MOD_INVITATION_SELECT_FROM_FACEBOOK_FRIENDS:"Select from Facebook friends",
        FTT_MOD_INVITATION_OR: "or",
        FTT_MOD_INVITATION_SEND_EMAIL: "Send Email",
        FTT_MOD_INVITATION_SEND_BUTTON: "Send",
        FTT_MOD_INVITATION_CONFIRM_LIKE_TO_INVITE: "Would to like to invite %% to join your family tree",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_FAILED: "Invitation has failed.",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_BEEN_SENT: "An invitation has been sent.",
        FTT_MOD_INVITATION_ALERT_MESSAGE_DELIVERY_FAILED:"Message delivery failed...",
        FTT_MOD_INVITATION_ALERT_MESSAGE_SUCCESSFULLY_SENT:"Message successfully sent!",
        FTT_MOD_INVITATION_ALERT_SORRY_USER_ALREADY_A_MEMBER:"Sorry, but %% is already a member of Family TreeTop.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_FACEBOOK_USER_HAS_BEEN_SENT:"Invitation to this facebook user has been already sent.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_MAIL_HAS_BEEN_SENT : "Invitation in this mail has been already sent.",
        FTT_MOD_INVITATION_ALERT_THIS_USER_WAITING_CONFIRMATION:"This user is waiting for confirmation of the request to invitation."
    }
    module.response = false;

}

JMBInvitation.prototype = {
	ajax:function(func, params, callback){
        storage.callMethod("invitation", "JMBInvitation", func, params, function(res){
				callback(res);
		})
	},
	ajaxForm:function(settings){
        var validate_options = (settings.validate)?settings.validate:{};
        jQuery(settings.target).validate(validate_options);
		jQuery(settings.target).ajaxForm({
			url:[storage.baseurl,'/components/com_manager/php/ajax.php'].join(''),
			type:"POST",
			data: { "module":"invitation","class":"JMBInvitation", "method":settings.method, "args": settings.args },
			dataType:"json",
			target:jQuery(storage.iframe).attr('name'),
			beforeSubmit:function(){
				return settings.beforeSubmit();
			},
			success:function(data){
				settings.success(data);
			}
		});
	},
    init:function(){
        var module = this;
        jQuery.ajax({
            url: storage.baseurl+storage.url+'php/ajax.php',
            type: "POST",
            data: 'module=invitation&class=JMBInvitation&method=get&args=',
            dataType: "html",
            complete : function (req, err) {
                module.response = storage.getJSON(req.responseText);
                module.setMsg(module.response.msg);
            }
        });
    },
    getMsg:function(n){
        var module = this;
        var t = 'FTT_MOD_INVITATION_'+n.toUpperCase();
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
    },
	sendRequestToInviteFacebookFriend:function(facebook_id, callback){
      		FB.ui({method: 'apprequests',
                message: 'To view this request, please log into Family TreeTop. Link: '+storage.baseurl,
      			to: facebook_id
      		}, callback);
    },
    avatar:function(object){
        return storage.usertree.avatar.get({
            object:object,
            width:81,
            height:90
        });
	},
    get:function(object){
		var 	user = object.user;
		return {
			_month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
			gedcom_id:user.gedcom_id,
			relation:(user.relation!=null)?user.relation:false,
			full_name:(function(){
				var	first_name = user.first_name,
					middle_name = user.middle_name,
					last_name = user.last_name;
					
				return [first_name, middle_name, last_name].join(' ');
			})(),
			date:function(event){
				var 	event = user[event],
					date = (event!=null)?event.date:null,
					day, month, year;
				if(date!=null){
					day = date[0];
					month = this._month[date[1]-1];
					year = date[2];
					return [day,month,year].join(' ');
				}
				return '';
			}
		}
	},
    createDiv:function(object){
		var	module = this, 
			sb = host.stringBuffer(),
			get = module.get(object),
			relation = get.relation;

        sb._('<div class="jmb-dialog-invition"><form id="jmb:send-invitation" method="post" target="iframe-profile">');
			sb._('<div class="jmb-dialog-invition-header">')._(module.getMsg('header'))._('</div>');
			sb._('<div class="jmb-profile-mini-info">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="jmb-profile-mini-photo"><div>')._(module.avatar(object))._('</div></td>');
						sb._('<td class="jmb-profile-mini-info-body">');
							sb._('<div><span>')._(module.getMsg('name'))._(':</span> ')._(get.full_name)._('</div>');
							sb._('<div><span>')._(module.getMsg('born'))._(':</span> ')._(get.date('birth'))._('</div>');
							if(relation) sb._('<div><span>')._(module.getMsg('relation'))._(':</span> ')._(relation)._('</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-fields">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td><span class="title">')._(module.getMsg('select_from_facebook_friends'))._(':</span></td>');
						sb._('<td>');
							sb._('<div id="jmb_facebook_friends">');
							sb._('</div>');
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr><td></td><td><div style="text-align:center;">')._(module.getMsg('or'))._('</div></td></tr>');
					sb._('<tr><td><span class="title">')._(module.getMsg('send_email'))._(':</span></td><td><input name="send_email" placeholder="Enter Email address"></td></tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-send"><input type="submit" value="')._(module.getMsg('send_button'))._('"></div>');
		sb._('</form></div>');
		return jQuery(sb.result());
	},
	render:function(json){
		var module = this,
            v = {
                elementDiv:false,
                elementForm:false,
                gedcom_id:false,
                friendsList:false,
                select:false,
                option:{
                    id:false,
                    name:false
                }
            },
            f = {
                create:{
                    dialogWindow:function(el){
                        jQuery(el).dialog({
                            width:450,
                            height:300,
                            //title: 'Family TreeTop',
                            resizable: false,
                            draggable: false,
                            position: "top",
                            closeOnEscape: false,
                            modal:true,
                            close:function(){

                            }
                        });
                    },
                    select:function(el){
                        var parent = jQuery(el).find('#jmb_facebook_friends');
                        var select = jQuery('<select name="friends"><option value="default">'+module.getMsg('select_facebook_friend')+'</option></select>');
                        jQuery(parent).append(select);

                        var data = v.friendsList.data;
                        data.sort(function(a,b){
                            var x = a.name.split(' ').pop().toLowerCase();
                            var y = b.name.split(' ').pop().toLowerCase();
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        });
                        jQuery(data).each(function(i, friend){
                            if(!storage.usertree.users || parseInt(friend.id) in storage.usertree.users ) return true;
                            jQuery(select).append('<option value="' + friend.id + '">' + friend.name + '</option>');
                        });
                        return select;
                    }
                },
                set:{
                    ajaxForm:function(f){
                        module.send(f, json);
                    },
                    dialogBox:function(el){
                        module.dialogBox = el;
                    },
                    friendsList:function(){
                        v.friendsList = storage.usertree.friends;
                    }
                },
                get:{
                    elementDiv:function(j){
                        return module.createDiv(j);
                    },
                    elementForm:function(el){
                        return jQuery(el).find('form');
                    },
                    gedcomId:function(j){
                        return j.user.gedcom_id;
                    }
                },
                event:{
                    confirm:{
                        invite:function(){
                            if(confirm(module.getMsg('confirm_like_to_invite').replace('%%', v.option.name)+'?')){
                                storage.progressbar.loading();
                                module.transportation = true;
                                f.send.checkFacebookIdOnUse();
                            } else {
                                f.event.select.defaultSelect();
                            }
                        }
                    },
                    select:{
                        off:function(){
                            f.event.select.defaultSelect();
                            storage.progressbar.off();
                            module.transportation = false;
                        },
                        defaultSelect:function(){
                            jQuery(v.select).find('option[value="default"]').attr("selected", "selected");
                        },
                        change:function(){
                            jQuery(v.select).change(function(){
                                var option = jQuery(this).find(':selected');
                                v.option.id = jQuery(option).val();
                                v.option.name = jQuery(option).text();
                                if(!module.transportation){
                                    f.event.confirm.invite();
                                } else {
                                    f.event.select.defaultSelect();
                                }
                            });
                        }
                    }
                },
                send:{
                    checkFacebookIdOnUse:function(){
                        module.ajax('checkFacebookIdOnUse', v.option.id, function(res){
                            var json = storage.getJSON(res.responseText);
                            if(typeof(json.success) != 'undefined'){
                                if(json.success){
                                    f.send.requestToInviteFacebookFriend();
                                } else {
                                    storage.alert(module.getMsg(json.message).replace('%%', name));
                                    f.event.select.off();
                                }
                            } else {
                                f.event.select.off();
                            }
                        });
                    },
                    requestToInviteFacebookFriend:function(){
                        module.sendRequestToInviteFacebookFriend(v.option.id, function (r) {
                            if(r == null) {
                                f.event.select.off();
                                storage.alert(module.getMsg('alert_invitation_has_failed'));
                                return false;
                            }
                            f.send.inviteFacebookFriend();
                        });
                    },
                    inviteFacebookFriend:function(){
                        module.ajax('inviteFacebookFriend', v.option.id + ';' + v.gedcom_id, function (res) {
                            var json = storage.getJSON(res.responseText);
                            if (typeof(json.success) !== 'undefined') {
                                storage.alert(module.getMsg('alert_invitation_has_been_sent'));
                            } else {
                                storage.alert(module.getMsg(json.message));
                            }
                            f.event.select.off();
                            jQuery(module.dialogBox).dialog('close');
                        });
                    }
                }
            };

        if(!module.response){
            setTimeout(function(){
                module.render(json);
            }, 1000);
        }

        storage.tooltip.cleaner();

        v.gedcom_id = f.get.gedcomId(json);
        v.elementDiv = f.get.elementDiv(json);
        v.elementForm = f.get.elementForm(v.elementDiv);

        f.set.dialogBox(v.elementDiv);
        f.set.ajaxForm(v.elementForm);
        f.set.friendsList();

        f.create.dialogWindow(v.elementDiv);

        if(typeof(v.friendsList) != 'undefined' && v.friendsList != null){
            v.select = f.create.select(v.elementDiv);
            f.event.select.change();
        }


	},
	send:function(form, json){
		var	module = this;
        module.ajaxForm({
            target:form,
            method: 'sendInvitation',
            args: json.user.gedcom_id,
            validate:{
                rules:{
                    send_email:{
                        required: true,
                        email: true
                    }
                },
                messages:{
                    send_email:""
                }
            },
            beforeSubmit:function(){
                if(module.transportation) return false;
                storage.progressbar.loading();
                module.transportation = true;
            },
            success:function(json){
                if(typeof(json.success) != 'undefined'){
                    storage.alert(module.getMsg(json.message));
                    if(json.success){
                        jQuery(module.dialogBox).dialog('close');
                    }
                    storage.progressbar.off();
                    module.transportation = false;
                }


            }
        });
	}
}
