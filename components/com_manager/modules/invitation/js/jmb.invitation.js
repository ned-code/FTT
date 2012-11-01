function JMBInvitation(){
    var module = this;
    module.msg = {
        FTT_MOD_INVITATION_DEAR_MALE:"Dear",
        FTT_MOD_INVITATION_DEAR_FEMALE:"Dear",
        FTT_MOD_INVITATION_YOUR:"Your",
        FTT_MOD_INVITATION_HAS_INVITED:"has invited you to join your family tree on Family TreeTop. This is a private space that can only be seen by members of your family",
        FTT_MOD_INVITATION_CLICK_HERE_TO_ACCEPT:"Click here to view this invitation",
        FTT_MOD_INVITATION_CLICK:"Click",
        FTT_MOD_INVITATION_HERE:"here",
        FTT_MOD_INVITATION_TO_VIEW_PROFILE:"to view Facebook profile for",
        FTT_MOD_INVITATION_IF_YOU_WISH_TO_CONTACT:"If you wish to contact",
        FTT_MOD_INVITATION_YOU_MAY_EMAIL_HIM_AT:"you may email him at",
        FTT_MOD_INVITATION_THIS_IS_AUTOMATED_MESSAGE:"This is automated message from Family TreeTop. Please do not respond to this email",
        FTT_MOD_INVITATION_REGARS:"Regards",
        FTT_MOD_INVITATION_THE_FAMILY_TREETOP_TEAM:"The Family TreeTop Team",
        FTT_MOD_INVITATION_HEADER:"Send Invitation",
        FTT_MOD_INVITATION_NAME:"Name",
        FTT_MOD_INVITATION_BORN:"Born",
        FTT_MOD_INVITATION_RELATION:"Relation",
        FTT_MOD_INVITATION_SELECT_FACEBOOK_FRIEND:"Facebook Friend",
        FTT_MOD_INVITATION_SELECT_FROM_FACEBOOK_FRIENDS:"Select from Facebook friends",
        FTT_MOD_INVITATION_OR:"or",
        FTT_MOD_INVITATION_SEND_EMAIL:"Send Email",
        FTT_MOD_INVITATION_SEND_BUTTON:"Send",
        FTT_MOD_INVITATION_CONFIRM_LIKE_TO_INVITE:"Would to like to invite %% to join your family tree",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_FAILED:"Invitation has failed.",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_BEEN_SENT:"An invitation has been sent.",
        FTT_MOD_INVITATION_ALERT_MESSAGE_DELIVERY_FAILED:"Message delivery failed...",
        FTT_MOD_INVITATION_ALERT_MESSAGE_SUCCESSFULLY_SENT:"Message successfully sent!",
        FTT_MOD_INVITATION_ALERT_SORRY_USER_ALREADY_A_MEMBER:"Sorry, but %% is already a member of Family TreeTop.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_FACEBOOK_USER_HAS_BEEN_SENT:"Invitation to this facebook user has been already sent.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_MAIL_HAS_BEEN_SENT:"Invitation in this mail has been already sent.",
        FTT_MOD_INVITATION_ALERT_THIS_USER_WAITING_CONFIRMATION:"This user is waiting for confirmation of the request to invitation.",
        FTT_MOD_INVITATION_PROCESSING_INVITATION:"Processing invitation",
        FTT_MOD_INVITATION_TD_SELECT_YOUR_FRIENDS:"Select your friends",
        FTT_MOD_INVITATION_TD_INVITE_TO_APP:"Then you can invite them to join you in the app",
        FTT_MOD_INVITATION_TD_FRIENDS_SELECTED:"friends selected",
        FTT_MOD_INVITATION_TD_PREVIOUS:"Previous",
        FTT_MOD_INVITATION_TD_NEXT:"Next",
        FTT_MOD_INVITATION_TD_PAGE:"Page",
        FTT_MOD_INVITATION_TD_OK:"OK"
    }
    module.tdCont = false;
    module.data = false;
    module.initData = false;

    return {
        ajax:function (func, params, callback) {
            storage.callMethod("invitation", "JMBInvitation", func, params, function(res) {
                var response = storage.getJSON(res.responseText);
                callback(response);
            })
        },
        setMsg:function(msg){
            for(var key in module.msg){
                if(typeof(msg[key]) != 'undefined'){
                    module.msg[key] = msg[key];
                }
            }
            return true;
        },
        getMsg:function(n){
            var t = 'FTT_MOD_INVITATION_'+n.toUpperCase();
            if(typeof(module.msg[t]) != 'undefined'){
                return module.msg[t];
            }
            return '';
        },
        createTDFriendSelector:function(){
            var mod = this;
            var sb = storage.stringBuffer();
            sb._('<div id="TDFriendSelector">');
                sb._('<div class="TDFriendSelector_dialog">');
                    sb._('<a href="#" id="TDFriendSelector_buttonClose">x</a>');
                    sb._('<div class="TDFriendSelector_form">');
                        sb._('<div class="TDFriendSelector_header">');
                            sb._('<p>')._(mod.getMsg('TD_SELECT_YOUR_FRIENDS'))._('</p>');
                        sb._('</div>');
                        sb._('<div class="TDFriendSelector_content">');
                            sb._('<p>')._(mod.getMsg('TD_INVITE_TO_APP'))._('.</p>');
                            sb._('<div class="TDFriendSelector_searchContainer TDFriendSelector_clearfix">');
                                sb._('<div class="TDFriendSelector_selectedCountContainer"><span class="TDFriendSelector_selectedCount">0</span> / <span class="TDFriendSelector_selectedCountMax">0</span> ')._(mod.getMsg('TD_FRIENDS_SELECTED'))._('</div>');
                                sb._('<input type="text" placeholder="Search friends" id="TDFriendSelector_searchField" />');
                            sb._('</div>');
                            sb._('<div class="TDFriendSelector_friendsContainer"></div>');
                        sb._('</div>');
                        sb._('<div class="TDFriendSelector_footer TDFriendSelector_clearfix">');
                            sb._('<a href="#" id="TDFriendSelector_pagePrev" class="TDFriendSelector_disabled">')._(mod.getMsg('TD_PREVIOUS'))._('</a>');
                            sb._('<a href="#" id="TDFriendSelector_pageNext">')._(mod.getMsg('TD_NEXT'))._('</a>');
                            sb._('<div class="TDFriendSelector_pageNumberContainer">');
                                sb._(mod.getMsg('TD_PAGE'))._(' <span id="TDFriendSelector_pageNumber">1</span> / <span id="TDFriendSelector_pageNumberTotal">1</span>');
                            sb._('</div>');
                            sb._('<a href="#" id="TDFriendSelector_buttonOK">')._(mod.getMsg('TD_OK'))._('</a>');
                        sb._('</div>');
                    sb._('</div>');
                sb._('</div>');
            sb._('</div>');
            return jQuery(sb.result());
        },
        sendInvite:function(facebook_id, callback){
            var mod = this;
            if(module.data && module.data.user && module.data.user.gedcom_id){
                var gedcom_id = module.data.user.gedcom_id;
                mod.ajax('check', [facebook_id, gedcom_id].join(';'), function(res){
                    if(res.success){
                        FB.ui({
                            method:'send',
                            name: mod.getMsg('CLICK_HERE_TO_ACCEPT'),
                            link: storage.baseurl + 'index.php/invitation',
                            to: facebook_id,
                            picture: storage.baseurl + 'components/com_manager/modules/invitation/images/ftt_invitation.png',
                            description:(function(){
                                var sb = storage.stringBuffer();
                                var object = storage.usertree.pull[storage.usertree.gedcom_id];
                                var parse = storage.usertree.parse(object);
                                if (res.relation) {
                                    sb._(mod.getMsg('your'))._(' ')._(res.relation)._(', ');
                                }
                                sb._(parse.name)._(', ');
                                sb._(mod.getMsg('HAS_INVITED'));
                                return sb.result();
                            })()
                        }, callback);
                    } else {
                        console.log(res);
                        console.log(module.msg);
                        storage.alert(mod.getMsg(res.message), function(){
                            callback(res);
                        });
                    }
                });
            } else {
                callback({success:false});
            }
        },
        init:function(){
            var mod = this;
            if(jQuery('#TDFriendSelector').length == 0){
                module.tdCont = mod.createTDFriendSelector();
                jQuery(document.body).append(module.tdCont);
            }
            jQuery.ajax({
                url:storage.baseurl + storage.url + 'php/ajax.php',
                type:"POST",
                data:'module=invitation&class=JMBInvitation&method=get&args=',
                dataType:"html",
                complete:function (req, err) {
                    module.initData = storage.getJSON(req.responseText);
                    mod.setMsg(module.initData.msg);
                }
            });
        },
        invite:function(facebook_id, callback){
            var mod = this;
            if(module.data && module.data.user && module.data.user.gedcom_id){
                var gedcom_id = module.data.user.gedcom_id;
                mod.ajax('add', [facebook_id, gedcom_id].join(';'), function(res){
                    if(res.success){
                        return true;
                    } else {
                        storage.alert(mod.getMsg(res.message), function(){
                            callback();
                        });
                    }
                });
            }
        },
        render:function(json){
            var mod = this;
            module.data = json;
            TDFriendSelector.init();
            var selector = TDFriendSelector.newInstance({
                maxSelection             : 1,
                friendsPerPage           : 5,
                autoDeselection          : true,
                callbackSubmit: function(selectedFriendIds) {
                    mod.sendInvite(selectedFriendIds, function(res){
                        if(res != null && res.success){
                            mod.invite(selectedFriendIds, function(){
                                selector.showFriendSelector();
                            });
                        } else {
                            selector.showFriendSelector();
                        }

                    });
                }
            });
            storage.tooltip.close();
            selector.showFriendSelector();
        }
    }
}

/*
function JMBInvitation() {
    var module = this;
    module.path = "components/com_manager/modules/invitation/images/";
    module.transportation = false;
    module.dialogBox = false;
    module.progress = module.getProgressBar();
    module.msg = {
        FTT_MOD_INVITATION_DEAR_MALE:"Dear",
        FTT_MOD_INVITATION_DEAR_FEMALE:"Dear",
        FTT_MOD_INVITATION_YOUR:"Your",
        FTT_MOD_INVITATION_HAS_INVITED:"has invited you to join your family tree on Family TreeTop. This is a private space that can only be seen by members of your family",
        FTT_MOD_INVITATION_CLICK_HERE_TO_ACCEPT:"Click here to view this invitation",
        FTT_MOD_INVITATION_CLICK:"Click",
        FTT_MOD_INVITATION_HERE:"here",
        FTT_MOD_INVITATION_TO_VIEW_PROFILE:"to view Facebook profile for",
        FTT_MOD_INVITATION_IF_YOU_WISH_TO_CONTACT:"If you wish to contact",
        FTT_MOD_INVITATION_YOU_MAY_EMAIL_HIM_AT:"you may email him at",
        FTT_MOD_INVITATION_THIS_IS_AUTOMATED_MESSAGE:"This is automated message from Family TreeTop. Please do not respond to this email",
        FTT_MOD_INVITATION_REGARS:"Regards",
        FTT_MOD_INVITATION_THE_FAMILY_TREETOP_TEAM:"The Family TreeTop Team",
        FTT_MOD_INVITATION_HEADER:"Send Invitation",
        FTT_MOD_INVITATION_NAME:"Name",
        FTT_MOD_INVITATION_BORN:"Born",
        FTT_MOD_INVITATION_RELATION:"Relation",
        FTT_MOD_INVITATION_SELECT_FACEBOOK_FRIEND:"Facebook Friend",
        FTT_MOD_INVITATION_SELECT_FROM_FACEBOOK_FRIENDS:"Select from Facebook friends",
        FTT_MOD_INVITATION_OR:"or",
        FTT_MOD_INVITATION_SEND_EMAIL:"Send Email",
        FTT_MOD_INVITATION_SEND_BUTTON:"Send",
        FTT_MOD_INVITATION_CONFIRM_LIKE_TO_INVITE:"Would to like to invite %% to join your family tree",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_FAILED:"Invitation has failed.",
        FTT_MOD_INVITATION_ALERT_INVITATION_HAS_BEEN_SENT:"An invitation has been sent.",
        FTT_MOD_INVITATION_ALERT_MESSAGE_DELIVERY_FAILED:"Message delivery failed...",
        FTT_MOD_INVITATION_ALERT_MESSAGE_SUCCESSFULLY_SENT:"Message successfully sent!",
        FTT_MOD_INVITATION_ALERT_SORRY_USER_ALREADY_A_MEMBER:"Sorry, but %% is already a member of Family TreeTop.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_FACEBOOK_USER_HAS_BEEN_SENT:"Invitation to this facebook user has been already sent.",
        FTT_MOD_INVITATION_ALERT_INVITATION_TO_THIS_MAIL_HAS_BEEN_SENT:"Invitation in this mail has been already sent.",
        FTT_MOD_INVITATION_ALERT_THIS_USER_WAITING_CONFIRMATION:"This user is waiting for confirmation of the request to invitation.",
        FTT_MOD_INVITATION_PROCESSING_INVITATION:"Processing invitation"
    }
    module.response = false;
    module.divObject = null;
}

JMBInvitation.prototype = {
    ajax:function (func, params, callback) {
        storage.callMethod("invitation", "JMBInvitation", func, params, function (res) {
            callback(res);
        })
    },
    getProgressBar:function () {
        var module = this,
            div = false;
        return {
            init:function () {
                div = jQuery('<div class="ftt-invitation-progressbar"><div><span>' + module.getMsg('PROCESSING_INVITATION') + '</span></div></div>');
            },
            on:function () {
                if (!div) return false;
                var h = jQuery(module.divObject).height() + 10;
                var w = jQuery(module.divObject).width() + 10;
                jQuery(module.divObject).append(div);
                jQuery(div).css('height', h + 'px').css('width', w + 'px');
            },
            off:function () {
                if (!div) return false;
                jQuery(div).remove();
            }
        }
    },
    ajaxForm:function (settings) {
        var validate_options = (settings.validate) ? settings.validate : {};
        jQuery(settings.target).validate(validate_options);
        jQuery(settings.target).ajaxForm({
            url:[storage.baseurl, '/components/com_manager/php/ajax.php'].join(''),
            type:"POST",
            data:{ "module":"invitation", "class":"JMBInvitation", "method":settings.method, "args":settings.args },
            dataType:"json",
            target:jQuery(storage.iframe).attr('name'),
            beforeSubmit:function () {
                return settings.beforeSubmit();
            },
            success:function (data) {
                settings.success(data);
            }
        });
    },
    init:function () {
        var module = this;
        jQuery.ajax({
            url:storage.baseurl + storage.url + 'php/ajax.php',
            type:"POST",
            data:'module=invitation&class=JMBInvitation&method=get&args=',
            dataType:"html",
            complete:function (req, err) {
                module.response = storage.getJSON(req.responseText);
                module.setMsg(module.response.msg);
            }
        });
    },
    getMsg:function (n) {
        var module = this;
        var t = 'FTT_MOD_INVITATION_' + n.toUpperCase();
        if (typeof(module.msg[t]) != 'undefined') {
            return module.msg[t];
        }
        return '';
    },
    setMsg:function (msg) {
        var module = this;
        for (var key in module.msg) {
            if (typeof(msg[key]) != 'undefined') {
                module.msg[key] = msg[key];
            }
        }
        return true;
    },
    sendRequestToInviteFacebookFriend:function (facebook_id, rel, callback) {
        var module = this;
        FB.ui({
            method:'send',
            name:getName(),
            link:getLink(),
            to:getTo(),
            picture:getPicture(),
            description:getDescription()
        }, callback);
        return true;
        function getName() {
            return module.getMsg('CLICK_HERE_TO_ACCEPT');
        }

        function getTo() {
            return facebook_id;
        }

        function getLink() {
            return storage.baseurl + 'index.php/invitation';
        }

        function getPicture() {
            return storage.baseurl + 'components/com_manager/modules/invitation/images/ftt_invitation.png';
        }

        function getDescription() {
            var sb = storage.stringBuffer();
            var object = storage.usertree.pull[storage.usertree.gedcom_id];
            var parse = storage.usertree.parse(object);
            if (rel) {
                sb._(module.getMsg('your'))._(' ')._(rel)._(', ');
            }
            sb._(parse.name)._(', ');
            sb._(module.getMsg('HAS_INVITED'));
            return sb.result();
        }
    },
    avatar:function (object) {
        return storage.usertree.avatar.get({
            object:object,
            width:81,
            height:90
        });
    },
    get:function (object) {
        var user = object.user;
        return {
            _month:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            gedcom_id:user.gedcom_id,
            relation:(user.relation != null) ? user.relation : false,
            full_name:(function () {
                var first_name = user.first_name,
                    middle_name = user.middle_name,
                    last_name = user.last_name;

                return [first_name, middle_name, last_name].join(' ');
            })(),
            date:function (event) {
                var event = user[event],
                    date = (event != null) ? event.date : null,
                    day, month, year;
                if (date != null) {
                    day = date[0];
                    month = this._month[date[1] - 1];
                    year = date[2];
                    return [day, month, year].join(' ');
                }
                return '';
            }
        }
    },
    createDiv:function (object) {
        var module = this,
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
        if (relation) sb._('<div><span>')._(module.getMsg('relation'))._(':</span> ')._(relation)._('</div>');
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
    render:function (json) {
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
                    dialogWindow:function (el) {
                        jQuery(el).dialog({
                            width:450,
                            height:300,
                            //title: 'Family TreeTop',
                            resizable:false,
                            draggable:false,
                            position:"top",
                            closeOnEscape:false,
                            modal:true,
                            close:function () {

                            }
                        });
                    },
                    select:function (el) {
                        var parent = jQuery(el).find('#jmb_facebook_friends');
                        var select = jQuery('<select name="friends"><option value="default">' + module.getMsg('select_facebook_friend') + '</option></select>');
                        jQuery(parent).append(select);

                        var data = v.friendsList.data;
                        data.sort(function (a, b) {
                            var x = a.name.split(' ').pop().toLowerCase();
                            var y = b.name.split(' ').pop().toLowerCase();
                            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                        });
                        jQuery(data).each(function (i, friend) {
                            if (!storage.usertree.users || parseInt(friend.id) in storage.usertree.users) return true;
                            jQuery(select).append('<option value="' + friend.id + '">' + friend.name + '</option>');
                        });
                        return select;
                    }
                },
                set:{
                    ajaxForm:function (f) {
                        module.send(f, json);
                    },
                    dialogBox:function (el) {
                        module.dialogBox = el;
                    },
                    friendsList:function () {
                        v.friendsList = storage.usertree.friends;
                    }
                },
                get:{
                    elementDiv:function (j) {
                        return module.createDiv(j);
                    },
                    elementForm:function (el) {
                        return jQuery(el).find('form');
                    },
                    gedcomId:function (j) {
                        return j.user.gedcom_id;
                    }
                },
                event:{
                    confirm:{
                        invite:function () {
                            if (confirm(module.getMsg('confirm_like_to_invite').replace('%%', v.option.name) + '?')) {
                                //storage.progressbar.loading();
                                module.progress.on();
                                module.transportation = true;
                                f.send.checkFacebookIdOnUse();
                            } else {
                                f.event.select.defaultSelect();
                            }
                        }
                    },
                    select:{
                        off:function () {
                            f.event.select.defaultSelect();
                            //storage.progressbar.off();
                            module.progress.off()
                            module.transportation = false;
                        },
                        defaultSelect:function () {
                            jQuery(v.select).find('option[value="default"]').attr("selected", "selected");
                        },
                        change:function () {
                            jQuery(v.select).change(function () {
                                var option = jQuery(this).find(':selected');
                                v.option.id = jQuery(option).val();
                                v.option.name = jQuery(option).text();
                                if (!module.transportation) {
                                    f.event.confirm.invite();
                                } else {
                                    f.event.select.defaultSelect();
                                }
                            });
                        }
                    }
                },
                send:{
                    checkFacebookIdOnUse:function () {
                        module.ajax('checkFacebookIdOnUse', v.option.id + ';' + v.gedcom_id, function (res) {
                            var json = storage.getJSON(res.responseText);
                            if (typeof(json.success) != 'undefined') {
                                if (json.success) {
                                    f.send.requestToInviteFacebookFriend(json.relation);
                                } else {
                                    storage.alert(module.getMsg(json.message).replace('%%', v.option.name));
                                    f.event.select.off();
                                }
                            } else {
                                f.event.select.off();
                            }
                        });
                    },
                    requestToInviteFacebookFriend:function (rel) {
                        module.sendRequestToInviteFacebookFriend(v.option.id, rel, function (r) {
                            if (r == null) {
                                f.event.select.off();
                                storage.alert(module.getMsg('alert_invitation_has_failed'));
                                return false;
                            }
                            f.send.inviteFacebookFriend();
                        });
                    },
                    inviteFacebookFriend:function () {
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

        if (!module.response) {
            setTimeout(function () {
                module.render(json);
            }, 1000);
        }

        module.progress.init();
        storage.tooltip.cleaner();

        v.gedcom_id = f.get.gedcomId(json);
        v.elementDiv = f.get.elementDiv(json);
        v.elementForm = f.get.elementForm(v.elementDiv);

        f.set.dialogBox(v.elementDiv);
        f.set.ajaxForm(v.elementForm);
        f.set.friendsList();

        f.create.dialogWindow(v.elementDiv);

        if (typeof(v.friendsList) != 'undefined' && v.friendsList != null) {
            v.select = f.create.select(v.elementDiv);
            f.event.select.change();
        }

        module.divObject = v.elementDiv;
    },
    send:function (form, json) {
        var module = this;
        module.ajaxForm({
            target:form,
            method:'sendInvitation',
            args:json.user.gedcom_id,
            validate:{
                rules:{
                    send_email:{
                        required:true,
                        email:true
                    }
                },
                messages:{
                    send_email:""
                }
            },
            beforeSubmit:function () {
                if (module.transportation) return false;
                //storage.progressbar.loading();
                module.progress.on();
                module.transportation = true;
            },
            success:function (resp) {
                if (typeof(resp.success) != 'undefined') {
                    var user = storage.usertree.parse(json);
                    storage.alert(module.getMsg(resp.message).replace('%%', user.name), function () {
                        if (resp.success) {
                            jQuery(module.dialogBox).dialog('close');
                        }
                    });
                    //storage.progressbar.off();
                    module.progress.off();
                    module.transportation = false;
                }


            }
        });
    }
}
*/

