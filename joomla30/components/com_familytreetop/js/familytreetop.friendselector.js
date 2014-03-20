$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $selector,
        $data = {
            gedcom_id: false,
            object: false
        },
        $box = $('#familytreetopFriendSelector'),
        $fn;

    $fn = {
        getMessage: function(gedcom_id, text){
            if("undefined"===typeof(text)){
                text = $($box).find('[familytreetop="description"]').text();
            }
            var owner = $this.mod('usertree').user($this.mod('usertree').usermap().gedcom_id);
            var user = $this.mod('usertree').user(gedcom_id);
            text = text.replace('%NAME%', owner.shortname());
            text = text.replace('%RELATION%', $this.mod('usertree').getOwnerRelationName(user));
            return text;
        },
        getTitle: function(){
            return $($box).find('[familytreetop="title"]').text();
        },
        getExludeIds: function(){
            var key, map, pull;
            map = $this.mod('usertree').usersmap();
            pull = [];
            for(key in map){
                if(!map.hasOwnProperty(key)) continue;
                if("undefined" !== typeof(map[key].facebook_id)){
                    pull.push(parseInt(map[key].facebook_id));
                }
            }
            return pull;
        },
        getFriendSelector: function(){
            return TDFriendSelector.newInstance({
                callbackFriendSelected   : $fn.onFriendSelected,
                callbackFriendUnselected : $fn.onFriendUnselected,
                callbackMaxSelection     : $fn.onMaxSelection,
                callbackSubmit           : $fn.onSubmit,
                maxSelection             : 1,
                friendsPerPage           : 5,
                autoDeselection          : true
            });
        },
        getInviteToken: function(){
            return $this.generateKey();
        },
        getInviteUrl: function(token){
            return $this.url(token).base();
        },
        setData: function(gedcom_id){
            $data.gedcom_id = gedcom_id;
            $data.object = $this.mod('usertree').user(gedcom_id);
        },
        onFriendSelected: function(){
            //console.log('callbackFriendSelected', arguments);
        },
        onFriendUnselected: function(){
            //console.log('callbackFriendUnselected', arguments);
        },
        onMaxSelection: function(){
            //console.log('callbackMaxSelection', arguments);
        },
        onSubmit: function(data){
            var facebook_id = data[0];
            var alert = $this.warning({title: "Preparing Invitation...", timeout: false});
            $this.ajax('invite.checkUser', {gedcom_id: $data.gedcom_id, facebook_id: facebook_id}, function(response){
                $(alert).alert('close');
                if(response.success){
                    $fn.options($data.gedcom_id, facebook_id);
                } else {
                    var alert = $this.error({title: response.message});
                }
            });
        },
        addInvitation:function(facebook_id, data, callback){
            $this.ajax('invite.addInvitation', {
                facebook_id: facebook_id,
                gedcom_id: data.gedcom_id,
                message: data.message,
                request_id : data.request_id,
                token : data.token
            }, function(response){
                callback.call(response);
            });
        },
        options: function(gedcom_id, facebook_id){
            var box = $('#TDFriendSelectorInvitationOptions').clone();
            setLeft();
            setData();
            $(document.body).append(box);
            $(box).find('input[name="send_facebook"]').click(function(){
                return false;
            });
            $(box).find('input[name="send_email"]').click(function(){
                if(this.checked){
                    $(box).find('li[familytreetop="notification"]').hide();
                    $(box).find('li[familytreetop="email"]').show();
                    $(box).find('[familytreetop="message"]').show();
                } else {
                    $(box).find('li[familytreetop="notification"]').show();
                    $(box).find('li[familytreetop="email"]').hide();
                    $(box).find('[familytreetop="message"]').hide();
                }
                return true;
                return false;
            });
            $(box).find('button[familytreetop="send"]').click(function(){
                var isSendNotification = $(box).find('li[familytreetop="send_notification"] input').is(':checked');
                var isSendEmail = $(box).find('li[familytreetop="send_email"] input').is(":checked");
                var token = $fn.getInviteToken();
                if(isSendEmail){
                    var text = $(box).find('[familytreetop="text"]').text();
                    if(text.length > 0){
                        var email = $(box).find('[familytreetop="email"] input').val();
                        if(validateEmail(email)){
                            $this.ajax('invite.sendEmail', {
                                gedcom_id : gedcom_id,
                                facebook_id : facebook_id,
                                email : email,
                                message : text,
                                token : token
                            }, function(response){
                                $(box).remove();
                                if(isSendNotification){
                                    $fn.send(gedcom_id, facebook_id, token);
                                }
                            })
                        } else {
                            var alert = $this.error({title: "Invalid Email"});
                        }
                    } else {
                        $this.warning({title: "Loading..."});
                    }
                } else {
                    $fn.send(gedcom_id, facebook_id, token);
                }
            });
            $(box).find('button[familytreetop="cancel"]').click(function(){
                $(box).remove();
            });
            $(box).find('select[name="languages"]').change(function(){
                var user = $this.mod('usertree').user(gedcom_id);
                var text = $(box).find('[familytreetop="text"]');
                var spinner = $fn.spinner(text);
                $(text).text('');
                $(text).append(spinner.el);
                $this.ajax('invite.getInviteText', {
                    relation_id: user.relationId,
                    gender:user.gender,
                    tag: $(this).find('option:selected').val()
                }, function(response){
                    $(spinner.el).remove();
                    if(response.success){
                        $(text).text($fn.getMessage(gedcom_id, response.message));
                    }
                });
            });
            return true;
            function setLeft(){
                $(box).css('left', (Math.floor($(window).width()/2)-300)+'px');
            }
            function setData(){
                var user = $this.mod('usertree').user(gedcom_id);
                var owner = $this.mod('usertree').user($this.mod('usertree').usermap().gedcom_id);
                var message = $fn.getMessage(gedcom_id);
                FB.api('/'+facebook_id, function(r){
                    $(box).find('[familytreetop="header_name"]').text(r.name);
                    $(box).find('[familytreetop="message_name"]').text(r.name);
                    var avatar = owner.avatar(["75","75"], "img-polaroid");
                    $(box).find('[familytreetop="avatar"]').append(avatar);
                    $(box).find('[familytreetop="text"]').text(message);
                });
            }
            function validateEmail(email) {
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        },
        spinner:function(target){
            var spinner = new Spinner({
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 8, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1.4, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left:'auto' // Left position relative to parent in px
            }).spin();
            var width = $(target).width();
            $(spinner.el).css('top', '50px').css('left', Math.ceil(width/2)+'px');
            return spinner;
        },
        send: function(gedcom_id, facebook_id, token){
            var message = $fn.getMessage(gedcom_id);
            FB.ui({
                to: facebook_id,
                method: 'apprequests',
                title: $fn.getTitle(),
                message: message,
                exclude_ids: $fn.getExludeIds(),
                filters: ['app_non_users'],
                data: $fn.getInviteUrl(token),
                max_recipients: 1
            }, function(response){
                if(response == null){
                    $this.warning({title: "Invitation Cancelled"});
                } else {
                    var alert = $this.warning({title: "Preparing invitation...", timeout: false});
                    $fn.addInvitation(response.to[0], { request_id: response.request, gedcom_id: gedcom_id, message: message, token : token }, function(){
                        $(alert).alert('close');
                        $this.success({ title: "Invitation has been sent."});
                    });
                }
            });
        }
    }

    $selector = $fn.getFriendSelector();
    $this.render = function(gedcom_id){
        $fn.setData(gedcom_id);
        $selector.showFriendSelector();
    }
});
