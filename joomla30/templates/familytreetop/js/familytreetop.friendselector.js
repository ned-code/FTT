$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $box = $('#familytreetopFriendSelector'),
        $fn;

    $fn = {
        getMessage: function(gedcom_id){
            var text = $($box).find('[familytreetop="description"]').text();
            var user = $this.mod('usertree').user(gedcom_id);
            text = text.replace('%NAME%', user.shortname());
            text = text.replace('%RELATION%', user.relation);
            return text;
        },
        getExludeIds: function(data){
            var key, map, pull;
            map = $this.mod('usertree').usersmap();
            pull = [];
            for(key in map){
                if(!map.hasOwnProperty(key)) continue;
                if("undefined" !== typeof(map[key].facebook_id)){
                    pull.push(parseInt(map[key].facebook_id));
                }
            }
            if(data != null){
                for(key in data){
                    if(!data.hasOwnProperty(key)) continue;
                    pull.push(parseInt(data[key]));
                }
            }
            return pull;
        },
        getTreeInvitations: function(tree_id, callback){
            $this.ajax('invite.getTreeInvitations', {tree_id:tree_id}, function(response){
                callback(response);
            });
        },
        addInvitation:function(facebook_id, gedcom_id, callback){
            $this.ajax('invite.addInvitation', {facebook_id:facebook_id, gedcom_id: gedcom_id}, function(response){
                callback.call(response);
            });
        },
        send: function(gedcom_id, data){
            FB.ui({
                method: 'apprequests',
                title: 'Send invite',
                message: $fn.getMessage(gedcom_id),
                exclude_ids: $fn.getExludeIds(data),
                filters: ['app_non_users'],
                max_recipients: 1
            }, function(response){
                if(response != null){
                    var alert = $this.warning({title: "Preparing invitation...", timeout: false});
                    $fn.addInvitation(response.to[0], gedcom_id, function(){
                        $(alert).alert('close');
                        if(this.success){
                            $this.success({ title: "Request has been send"});
                        } else {
                            $this.error({ title: this.message});
                        }
                    });
                }
            });
        }
    }

    $this.render = function(gedcom_id){
        var user = $this.mod('usertree').usermap();
        $fn.getTreeInvitations(user.tree_id, function(response){
            if(response.success){
                $fn.send(gedcom_id, response.data);
            }
        });
    }
});
