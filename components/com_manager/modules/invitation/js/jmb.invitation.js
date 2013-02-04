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
        FTT_MOD_INVITATION_TD_SELECT_YOUR_FRIENDS:"Select this person...",
        FTT_MOD_INVITATION_TD_LOCATE:"Locate ",
        FTT_MOD_INVITATION_TD_INVITE_TO_APP:"Then you can invite %% to join your family tree",
        FTT_MOD_INVITATION_TD_HIM:" him ",
        FTT_MOD_INVITATION_TD_HER:" her ",
        FTT_MOD_INVITATION_TD_FRIENDS_SELECTED:"friends selected",
        FTT_MOD_INVITATION_TD_SEARCH_FRIEND:"Search friend",
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
                                //sb._('<div class="TDFriendSelector_selectedCountContainer"><span class="TDFriendSelector_selectedCount">0</span> / <span class="TDFriendSelector_selectedCountMax">0</span> ')._(mod.getMsg('TD_FRIENDS_SELECTED'))._('</div>');
                                sb._('<input type="text" placeholder="')._(mod.getMsg("TD_SEARCH_FRIEND"))._('" id="TDFriendSelector_searchField" />');
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
            var p = jQuery(module.tdCont).find(".TDFriendSelector_content p");
            jQuery(p).text(jQuery(p).text().replace("%%", mod.getMsg(json.user.gender=="M"?"TD_HIM":"TD_HER")));
            jQuery(module.tdCont).find(".TDFriendSelector_header").text(mod.getMsg("TD_LOCATE")+storage.usertree.parse(json).full_name);
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
            $FamilyTreeTop.fn.mod("tooltip").close();
            selector.showFriendSelector();
        }
    }
}


