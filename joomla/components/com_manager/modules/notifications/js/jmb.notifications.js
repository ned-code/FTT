function JMBNotifications(){
    this.ntPull = [];
    this.dialogBox = null;
    this.acceptDialogBox = null;
    this.acceptJson = null;
    this.acceptId = null;
    this.acceptIndex = null;
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
    onDrop:function(object){
        var module = this,
            id = jQuery(object).parent().attr('id').split('-')[0],
            object = storage.usertree.pull[id],
            user = storage.usertree.parse(object),
            div = jQuery('<div></div>'),
            json = module.acceptJson,
            fn = {};

        if(!user.is_alive){
            storage.alert("This family member is deceased. Please select a living family member.", function(){});
            return false;
        }

        if(user.facebook_id != 0){
            storage.alert("This family member is registered. Please select another family member.", function(){});
            return false;
        }

        fn.getParentsString = function(t){
            var st = storage.usertree.pull[id].parents;
            if(st != null){
                var parents = null, parent = null;
                for(var key in st){
                    if(!st.hasOwnProperty(key)) continue;
                    parents = st[key];
                    break;
                }
                parent = parents[t];
                if(parent != null){
                    var parent_id = parent.gedcom_id;
                    var parent_object = storage.usertree.pull[parent_id];
                    var parse = storage.usertree.parse(parent_object);
                    return parse.full_name;
                }
            }
            return '';
        }

        fn.createUserBox = function(){
            var sb = host.stringBuffer();
            sb._('<div class="user-header">&nbsp;</div>');
            sb._('<div id="facebook" style="background: none repeat scroll 0 0 #E5E9F0;border: 1px solid #4C67A1;">')
                sb._('<div style="background: none repeat scroll 0 0 white;border: 1px solid #D2D9E7;margin: 10px;padding: 5px;">');
                    sb._('<div style="border: 1px solid #403E39;display: inline-block;margin: 5px;vertical-align: top;cursor:pointer;"><img width="50px" height="50px" src="http://graph.facebook.com/')._(json.me.id)._('/picture"></div>');
                    sb._('<div style="display: inline-block;">');
                        sb._(storage.form.dataTable('',{
                            "Name": { id:"name", value:json.user_info.name },
                            "Known As": { id:"knwon", value:json.user_info.nick },
                            "Mother": { id:"mother", value:json.mother_info.name },
                            "Father": { id:"father", value:json.father_info.name },
                            "Relation": { id:"relation", value: json.relation},
                            "Facebook": { id:"facebook", value: "<a href='"+json.me.link+"'>Click here to see Facebook profile</a>" }
                        }));
                    sb._('</div>');
                sb._('</div>');
            sb._('</div>');
            return sb.result();
        }

        fn.createMemberBox = function(){
            var sb = host.stringBuffer();
            sb._('<div id="target" style="background: none repeat scroll 0 0 #E7E7E7;border: 1px solid #787878;margin-top: 5px;">')
                sb._('<div style="background: none repeat scroll 0 0 white;border: 1px solid #d9d9d9;margin: 10px;padding: 5px;">');
                    sb._('<div style="border: 1px solid #403E39;display: inline-block;margin: 5px;vertical-align: top;cursor:pointer;">');
                        sb._(storage.usertree.avatar.get({
                            object:object,
                            width:50,
                            height:50
                        }));
                    sb._('</div>');
                    sb._('<div style="display: inline-block;">');
                        sb._(storage.form.dataTable('',{
                            "Name": { id:"name", value:user.full_name },
                            "Known As": { id:"knwon", value:user.nick },
                            "Mother": { id:"mother", value:fn.getParentsString('mother') },
                            "Father": { id:"father", value:fn.getParentsString('father') },
                            "Relation": { id:"relation", value: user.relation}
                        }));
                    sb._('</div>');
                sb._('</div>');
            sb._('</div>');
            return sb.result();
        }

        fn.onMatchData = function(div){
            var fTr = jQuery(div).find('div#facebook table tr');
            var tTr = jQuery(div).find('div#target table tr');
            for(var i = 0; i < 5 ; i++){
                var fText = jQuery(fTr[i]).find('div.text span');
                var tText = jQuery(tTr[i]).find('div.text span');
                if(jQuery(fText).text() != jQuery(tText).text()){
                    jQuery(fText).css({"background":"#fbced0"});
                    jQuery(tText).css({"background":"#fbced0"});
                } else {
                    jQuery(fText).css({"background":"#cefbd1"});
                    jQuery(tText).css({"background":"#cefbd1"});
                }
            }
        }

        jQuery(div).append(fn.createUserBox());
        jQuery(div).append('<div class="link-arrow">&nbsp;</div>');
        jQuery(div).append(fn.createMemberBox());
        fn.onMatchData(div);

        var linked = false;
        jQuery(div).dialog({
            width:500,
            minHeight:70,
            title: 'Please review your selection',
            resizable: false,
            draggable: false,
            position: "top",
            closeOnEscape: false,
            modal:true,
            buttons:{
                "Link this profile":function(){
                    if(linked) return false;
                    linked = true;
                    var args = JSON.stringify({id:module.acceptId,object:object,json:json});
                    module.ajax('onLinked', args, function(res){
                        if(module.rem(module.acceptIndex).length == 0){
                            jQuery('div.ftt_notifications_alert').remove();
                        }
                        jQuery(module.dialogBox).dialog('close');
                        jQuery(module.acceptDialogBox).dialog('close');
                        jQuery(div).dialog('close');
                        linked = false;
                        storage.usertree.pull[id].user.facebook_id = json.me.id;
                    });
                },
                "Cancel":function(){
                    jQuery(this).dialog("close");
                }
            }
        });
        jQuery(div).parent().addClass('notifications_link');
        jQuery(div).parent().css('top', '0');

    },
    onAccept:function(i, object, json, cont){
        var module = this,
            fn = {},
            html;

        module.acceptJson = json;
        module.acceptId = object.id;
        module.acceptIndex = i;

        fn.createUserBox = function(){
            var sb = host.stringBuffer();
            sb._('<div class="user-header">&nbsp;</div>');
            sb._('<div style="background: none repeat scroll 0 0 #E5E9F0;border: 1px solid #4C67A1;">')
                sb._('<div style="background: none repeat scroll 0 0 white;border: 1px solid #D2D9E7;margin: 10px;padding: 5px;">');
                    sb._('<div style="border: 1px solid #403E39;display: inline-block;margin: 5px;vertical-align: top;cursor:pointer;"><img width="50px" height="50px" src="http://graph.facebook.com/')._(json.me.id)._('/picture"></div>');
                    sb._('<div style="display: inline-block;">');
                        sb._(storage.form.dataTable('',{
                            "Name": { id:"name", value:json.user_info.name },
                            "Known As": { id:"knwon", value:json.user_info.nick },
                            "Mother": { id:"mother", value:json.father_info.name },
                            "Father": { id:"father", value:json.mother_info.name },
                            "Relation": { id:"relation", value: json.relation},
                            "Facebook": { id:"facebook", value: "<a href='"+json.me.link+"'>Click here to see Facebook profile</a>" }
                        }));
                    sb._('</div>');
                sb._('</div>');
            sb._('</div>');
            return sb.result();
        }

        fn.createMessageBox = function(){
            var sb = host.stringBuffer();
            sb._('<div style="background: none repeat scroll 0 0 #ED1C24;border-radius: 3px 3px 3px 3px;color: white;height: 100%;margin: 5px;padding: 10px;width: 350px;">');
                sb._('<p style="">');
                    sb._('Before ')._(json.user_info.name)._(' can join your family tree, you must first identify ')._(json.user_info.gender=='m'?'him':'her')._(' profile in your family tree.');
                sb._('</p>');
                sb._('<ul style="list-style: none outside none;margin: 10px;">');
                    sb._('<li>');
                        sb._('<div>1. In the window below, use the blue navigation arrows to find ')._(json.user_info.name)._(' family. If ')._(json.user_info.name)._(' does not have a profile, you must create one.</div>');
                    sb._('</li>');
                    sb._('<li style="margin-top: 5px;">');
                        sb._('<div>2. Drag ')._(json.user_info.name)._(' Facebook picture(shown right) onto ')._(json.user_info.name)._(' profile picture(located below).</div>')
                    sb._('</li>');
                sb._('</ul>');
            sb._('</div>');
            return sb.result();
        }

        fn.createFamiliesBox = function(){
            return '<div class="familiesList"></div>';
        }

        fn.createDialogBox = function(){
            var sb = host.stringBuffer();
            sb._('<div>');
                sb._('<table>');
                    sb._('<tr>');
                        sb._('<td style="width: 350px;">');
                            sb._(fn.createMessageBox());
                        sb._('</td>');
                        sb._('<td>');
                            sb._(fn.createUserBox());
                        sb._('</td>');
                    sb._('</tr>');
                    sb._('<tr>');
                        sb._('<td colspan="2">');
                            sb._(fn.createFamiliesBox());
                        sb._('</td>');
                    sb._('</tr>');
                sb._('</table>');
            sb._('</div>');
            return jQuery(sb.result());
        }

        html = fn.createDialogBox();
        module.acceptDialogBox = html;
        jQuery(html).dialog({
            width:750,
            height:600,
            title: json.me.name+' Invition Request',
            resizable: false,
            draggable: false,
            position: "top",
            closeOnEscape: false,
            modal:true,
            close:function(){
            }
        });
        jQuery(html).parent().addClass('notifications_accept');
        jQuery(html).parent().css('top', '0');
        jQuery(html).css('height', 'auto');
        core.renderPage(jQuery(html).find('div.familiesList'), storage.pages[2], true);
        jQuery(html).find('img').draggable({
            zIndex:9999,
            scroll:false,
            helper:'clone'
        });
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
                    if(json.message.length != 0){
                        sb._('<tr>');
                            sb._('<td colspan="2">');
                                sb._('<div class="message_title">')._(json.user_info.name)._(' writes:</div>');
                                sb._('<div class="message_text">')._(json.message)._('</div>');
                            sb._('</td>');
                        sb._('</tr>');
                    }
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