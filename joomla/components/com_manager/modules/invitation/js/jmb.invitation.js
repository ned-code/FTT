function JMBInvitation(){
	this.path = "components/com_manager/modules/invitation/images/";
    this.transportation = false;
    this.dialogBox = false;
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
			sb._('<div class="jmb-dialog-invition-header">Send Invitation</div>');
			sb._('<div class="jmb-profile-mini-info">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td class="jmb-profile-mini-photo"><div>')._(module.avatar(object))._('</div></td>');
						sb._('<td class="jmb-profile-mini-info-body">');
							sb._('<div><span>Name:</span> ')._(get.full_name)._('</div>');
							sb._('<div><span>Born:</span> ')._(get.date('birth'))._('</div>');
							if(relation) sb._('<div><span>Relation:</span> ')._(relation)._('</div>');
						sb._('</td>');
					sb._('</tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-fields">');
				sb._('<table>');
					sb._('<tr>');
						sb._('<td><span class="title">Select from Facebook friends:</span></td>');
						sb._('<td>');
							sb._('<div id="jmb_facebook_friends">');
							sb._('</div>');
						sb._('</td>');
					sb._('</tr>');
					sb._('<tr><td></td><td><div style="text-align:center;">or</div></td></tr>');
					sb._('<tr><td><span class="title">Send Email:</span></td><td><input name="send_email" placeholder="Enter Email address"></td></tr>');
				sb._('</table>');
			sb._('</div>');
			sb._('<div class="jmb-dialog-invition-send"><input type="submit" value="send"></div>');
		sb._('</form></div>');
		return jQuery(sb.result());
	},
	render:function(json){
		var	module = this,
			div = this.createDiv(json),
			form = jQuery(div).find('form'),
            gedcom_id = json.user.gedcom_id,
			friends_div,
			select,
			option,
			id,
			name;
			
		module.send(form, json);

		//storage.overlay.render({object:div, width:450, height:255});
		//storage.overlay.show();

        module.dialogBox = div;
        jQuery(div).dialog({
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
        jQuery(div).parent().css('top', '40px');

		FB.api('/me/friends', function(res) {
            if (!res.data) {
            } else {
                friends_div = jQuery(div).find('#jmb_facebook_friends');
                select = jQuery('<select name="friends"><option value="default">Facebook Friend</option></select>');
                jQuery(friends_div).append(select);
                jQuery(res.data).each(function (i, friend) {
                    if (!storage.usertree.users || parseInt(friend.id) in storage.usertree.users){
                        return true;
                    }
                    jQuery(select).append('<option value="' + friend.id + '">' + friend.name + '</option>');
                });
                jQuery(select).change(function () {
                    option = jQuery(this).find(':selected');
                    id = jQuery(option).val();
                    name = jQuery(option).text();
                    if(!module.transportation){
                        if (confirm('Would to like to invite '+ name +' to join your family tree?')) {
                            storage.progressbar.loading();
                            module.transportation = true;
                            module.ajax('checkFacebookIdOnUse', id, function(res){
                                var json = jQuery.parseJSON(res.responseText);
                                if(typeof(json.success) != 'undefined'){
                                    if(json.success){
                                        module.sendRequestToInviteFacebookFriend(id, function (r) {
                                            if(r == null) {
                                                jQuery(select).find('option[value="default"]').attr("selected", "selected");
                                                storage.progressbar.off();
                                                module.transportation = false;
                                                alert('Invitation has failed.')
                                                return false;
                                            }
                                            module.ajax('inviteFacebookFriend', id + ';' + gedcom_id, function (res) {
                                                var json = jQuery.parseJSON(res.responseText);
                                                if (typeof(json.success) !== 'undefined') {
                                                    //alert('An invitation has been sent.');
                                                } else {
                                                    alert(json.message);
                                                }
                                                jQuery(select).find('option[value="default"]').attr("selected", "selected");
                                                storage.progressbar.off();
                                                module.transportation = false;
                                                //storage.overlay.hide();
                                                jQuery(module.dialogBox).dialog('close');
                                            });
                                        });
                                    } else {
                                        alert(json.message.replace('%%', name));
                                        jQuery(select).find('option[value="default"]').attr("selected", "selected");
                                        storage.progressbar.off();
                                        module.transportation = false;
                                    }
                                } else {
                                    jQuery(select).find('option[value="default"]').attr("selected", "selected");
                                    storage.progressbar.off();
                                    module.transportation = false;
                                }
                            });
                        } else {
                            jQuery(select).find('option[value="default"]').attr("selected", "selected");
                        }
                    } else {
                        jQuery(select).find('option[value="default"]').attr("selected", "selected");
                    }
                });
            }
        });
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
                    alert(json.message);
                    if(json.success){
                        //storage.overlay.hide();
                        jQuery(module.dialogBox).dialog('close');
                    }
                    storage.progressbar.off();
                    module.transportation = false;
                }


            }
        });
	}
}
