function JMBNotifications(){
    this.ntPull = [];
    this.dialogBox = null;
}

JMBNotifications.prototype = {
	ajax:function(func, params, callback){
		host.callMethod("notifications", "JMBNotifications", func, params, function(req){
				callback(req);
		})
	},
    rem:function(index){
        var module = this;
        module.ntPull.splice(index, 1);
        return module.ntPull;
    },
    onAccept:function(i, object, json, cont){
        console.log('onAccept');
        /*
         var acceptClicked = false;
         jQuery(html).find('div#accept').click(function(){
         if(acceptClicked) return false;
         acceptClicked = true;
         jQuery.ajax({
         url:'index.php?option=com_manager&task=notifications&type=request&status=accept&id='+id,
         type:'GET',
         data:'data='+object.data,
         complete:function(req, err){
         if(!ntf.is_accepted){
         ntf.is_accepted = true;
         }
         delete ntf.not_confirmed[id];
         ntf.confirmed[id] = object;
         jQuery(dialog_box).dialog('close');
         var count = storage.notifications.getCount(ntf.not_confirmed);
         if(count == 0){
         jQuery('div.ftt_notifications_alert').remove();
         }
         alert('Approval message has been sent');
         }
         });
         });
         */
    },
    onDenied:function(i, object, json, cont){
        var module = this,
            sb = host.stringBuffer(),
            box = jQuery('<div></div>');
            cont;

        sb._('<div class="header"><span>The following message will be sent to ')._(json.me.name)._('. You may edit the section shown yellow.</span></div>');
        sb._('<div class="deny_content">');
            sb._('<div class="status"><div><span>Family TreeTop</span></div><div><span>Invition Request Status: <b>Denied</b></span></div></div>');
            sb._('<div class="text">');
                sb._('<div><span>Dear ')._(json.me.name)._(',</span></div>');
                sb._('<div><span>')._(json.target.name)._(' has denied your Family TreeTop invitation request.');
                    sb._(' He does not  believe that you are member of his family. If you still think thay you are related to ');
                    sb._(json.target.name.split(' ')[0])._(', please contact him directly to sort it out.');
                sb._('</span></div>');
            sb._('</div>');
            sb._('<div class="edit">');
                sb._('<div><span>')._(json.target.name.split(' ')[0])._(' Writes:</span></div>');
                sb._('<div><textarea name="message">')
                    sb._('Hi ')._(json.me.name.split(' ')[0])._(', \n\n');
                    sb._('I am not sure how we are related. Are you able to explain how you are connected to my family tree?\n\n');
                    sb._('Thanks,\n');
                    sb._(json.target.name);
                sb._('</textarea></div>');
             sb._('</div>');
        sb._('</div>');
        sb._('<div class="button"><span>Send Message</span></div>');

        cont = sb.result();
        jQuery(box).append(cont);
        jQuery(box).dialog({
            width:600,
            height:450,
            title: json.me.name+' Invition Request',
            resizable: false,
            draggable: false,
            position: "top",
            closeOnEscape: false,
            modal:true,
            close:function(){

            }
        });
        jQuery(box).parent().addClass('notifications_deny');
        jQuery(box).parent().css('top', '40px');

        var deniedClicked = false;
        jQuery(box).find('div.button').click(function(){
            if(deniedClicked) return false;
            var message = jQuery(cont).find('textarea').val();
            var args = '&id='+object.id+'&message='+encodeURIComponent(message)+'&data='+object.data;
            storage.progressbar.loading();
            module.ajax('onDenied', args, function(res){
                deniedClicked = true;
                if(module.rem(i).length == 0){
                    jQuery('div.ftt_notifications_alert').remove();
                }
                jQuery(box).dialog('close');
                deniedClicked = false;
                storage.progressbar.off();
            });
        });
    },
    manager:function(){
        var module = this,
            fn = {},
            dialogBox = jQuery('<div class="notifications_manager"></div>');

        fn.createContentBox = function(callback){
            var sb = host.stringBuffer();
            sb._('<table class="container">');
            sb._('<tr>');
            sb._('<td style="width:120px;" valign="top"><div class="menu">');
            sb._('<div id="not_confirmed"><span>Not Confirmed</span></div>');
            //sb._('<div id="confirmed"><span>Waiting for Link</span></div>');
            //sb._('<div id="denied"><span>Denied</span></div>');
            sb._('</div></td>');
            sb._('<td valign="top"><div class="data"></div></td>')
            sb._('</tr>');
            sb._('</table>');
            callback(jQuery(sb.result()));
        }

        fn.parse = function(arg){
            return (arg&&arg.data)?jQuery.parseJSON(arg.data):false;
        }

        fn.getPlaceString = function(args){
            var year = (args.b_year!='')?'<span class="year">'+args.b_year+'</span>':'';
            var place = (args.b_place!='')?'in <span class="place">'+args.b_place+'</span>':'';
            return [year,place].join(' ');
        }

        fn.addBox = function(json){
            return {
                user:function(){
                    var args = json.user_info;
                    var link = json.me.linl;
                    var facebook_id = json.me.id;
                    var sb = host.stringBuffer();
                    sb._('<div class="user_box">');
                        sb._('<table>');
                            sb._('<tr>');
                                sb._('<td valign="top">');
                                    sb._('<div class="avatar"><img width="80px" height="80px" src="http://graph.facebook.com/')._(facebook_id)._('/picture"></div>');
                                sb._('</td>');
                                sb._('<td>');
                                    sb._('<table>');
                                        sb._('<tr>');
                                            sb._('<td><div class="title"><span>Name:</span></div></td>');
                                            sb._('<td><div class="text"><span>')._(args.name)._('</span></div></td>');
                                        sb._('</tr>');
                                        sb._('<tr>');
                                            sb._('<td><div class="title"><span>Known as:</span></div></td>');
                                            sb._('<td><div class="text"><span>')._(args.nick)._('</span></div></td>');
                                        sb._('</tr>');
                                        sb._('<tr>');
                                            sb._('<td><div class="title"><span>Born:</span></div></td>');
                                            sb._('<td><div class="text"><span>')._(fn.getPlaceString(args))._('</span></div></td>');
                                        sb._('</tr>');
                                        sb._('<tr>');
                                            sb._('<td colspan="2"><div class="link"><a href="')._(link)._('">www.facebook.com/')._(args.name)._('</a></div></td>');
                                        sb._('</tr>');
                                    sb._('</table>');
                                sb._('</td>');
                            sb._('</tr>');
                        sb._('</table>');
                    sb._('</div>');
                    return sb.result();
                },
                parent:function(name){
                    var args = (name == "Father")?json.father_info:json.mother_info;
                    var sb = host.stringBuffer();
                    sb._('<div class="parent_box">');
                        sb._('<table>');
                            sb._('<tr>');
                                sb._('<td>')._(name)._(':</td>');
                                sb._('<td><div class="text"><span>')._(name)._('</span></div></td>');
                            sb._('</tr>');
                            sb._('<tr>');
                                sb._('<td>Born:</td>');
                                sb._('<td><div class="text">')._(fn.getPlaceString(args))._('</div></td>');
                            sb._('</tr>');
                        sb._('</table>');
                    sb._('</div>');
                    return sb.result();
                }
            }
        }

        fn.onClick = function(e, cont){
            jQuery(cont).find('div.data div.users').hide();
            jQuery(cont).find('div.menu').parent().hide();
            var html,
                id = jQuery(this).attr('id'),
                pull = module.ntPull,
                object = pull[id],
                sb = host.stringBuffer(),
                json = fn.parse(object),
                add = fn.addBox(json);

            sb._('<div class="status"><span class="title">Status:</span>&nbsp;<span class="value">Action Required</span></div>');
            sb._('<div class="prefix">')._(json.user_info.name)._(' is claiming to be your ')._(json.relation)._(' and would like to join your family tree.')._('</div>');
            sb._('<div class="info">');
                sb._('<table>');
                    sb._('<tr>');
                        sb._('<td>');
                            sb._(add.user());
                        sb._('</td>');
                        sb._('<td>');
                            sb._(add.parent('Father'));
                            sb._(add.parent('Mother'));
                        sb._('</td>');
                    sb._('</tr>');
                    sb._('<tr>');
                        sb._('<td colspan="2">');
                            sb._('<div class="message_title">')._(json.user_info.name)._(' writes:</div>');
                            sb._('<div class="message_text">')._(json.message)._('</div>');
                        sb._('</td>');
                    sb._('</tr>');
                sb._('</table>');
            sb._('</div>');
            sb._('<div class="click_items">');
                sb._('<div id="accept" class="button"><div>Accept</div><div>Add ')._(json.user_info.name)._(' to my Family Tree</div></div>');
                sb._('<div id="deny" class="button"><div>Deny</div><div>Do not add ')._(json.user_info.name)._(' to my Family Tree</div></div>');
            sb._('</div>');

            html = jQuery(sb.result());
            jQuery(cont).find('div.data').append(html);

            jQuery(html).find('div#accept').click(function(){
                jQuery(module.dialogBox).dialog('close');
                module.onAccept(id, object, json, cont);
            });
            jQuery(html).find('div#deny').click(function(){
                jQuery(module.dialogBox).dialog('close');
                module.onDenied(id, object, json, cont);
            });
        }

        fn.menu = function(cont){
            var pull = module.ntPull,
                sb = host.stringBuffer(),
                html;

            sb._('<div class="users">');
            for(var key in pull){
                var json = fn.parse(pull[key]);
                sb._('<div id="')._(key)._('" class="')._(json.me.gender)._('"><span>')._(json.me.name)._('</span>')._((json.user_info.b_year!=''?'('+json.user_info.b_year+')':''))._('</div>');
            }
            sb._('</div>');
            html = jQuery(sb.result());
            jQuery(html).find('div').click(function(e){
                fn.onClick.apply(this, [e, cont])
            });
            jQuery(cont).find('div.data').html('').append(html);
        }

        fn.onMenuClick = function(e, cont){
            if(jQuery(e.currentTarget).hasClass('active')) return false;
            var id = jQuery(e.currentTarget).attr('id');
            jQuery(cont).find('div.menu div').removeClass('active');
            jQuery(e.currentTarget).addClass('active');
            fn.menu(cont);
        };

        // create dialog manager
        jQuery(dialogBox).dialog({
            width:600,
            height:400,
            title: 'Invitation to Join Family Tree',
            resizable: false,
            draggable: false,
            position: "top",
            closeOnEscape: false,
            modal:true,
            close:function(){

            }
        });
        jQuery(dialogBox).parent().addClass('notifications');
        jQuery(dialogBox).parent().css('top', '20px');
        module.dialogBox = dialogBox;

        fn.createContentBox(function(cont){
            jQuery(dialogBox).append(cont);
            jQuery(cont).find('div.menu div').click(function(e){
                fn.onMenuClick.apply(this, [e, cont]);
            });
            jQuery(cont).find('div.menu div#not_confirmed').click();
        });
     },
    init:function(notifications){
        var module = this, fn = {};
        fn.sort = function(callback){
            var pull = storage.notifications;
            for(var key in pull){
                var el = pull[key];
                if(el.status == 0){
                    module.ntPull.push(el);
                }
            }
            callback(module.ntPull);
        }
        fn.createMessageBox = function(){
            var html, sb = host.stringBuffer();
            sb._('<div class="ftt_notifications_alert">');
            sb._('<div class="message"><div>You have Invitation Request</div><div class="button">Click here to view it</div></div>');
            sb._('</div>');
            html = jQuery(sb.result());
            jQuery(html).find('div.button').click(function(){
                module.manager();
            });
            jQuery('div.main').append(html);
        }
        fn.sort(function(pull){
            if(pull.length != 0){
                fn.createMessageBox();
            }
        });
    }
}