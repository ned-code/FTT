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
        getMessage: function(gedcom_id){
            var text = $($box).find('[familytreetop="description"]').text();
            var owner = $this.mod('usertree').user($this.mod('usertree').usermap().gedcom_id);
            var user = $this.mod('usertree').user(gedcom_id);
            text = text.replace('%NAME%', owner.shortname());
            text = text.replace('%RELATION%', user.relation);
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
            var alert = $this.warning({title: "Check User Invitation...", timeout: false});
            $this.ajax('invite.checkUser', {gedcom_id: $data.gedcom_id, facebook_id: facebook_id}, function(response){
                $(alert).alert('close');
                if(response.success){
                    $fn.send($data.gedcom_id, facebook_id);
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
        send: function(gedcom_id, facebook_id){
            var message = $fn.getMessage(gedcom_id),
                token = $fn.getInviteToken();
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
                        $this.success({ title: "Request has been send"});
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