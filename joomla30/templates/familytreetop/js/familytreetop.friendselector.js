$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {
        beforeSendRequest:function(selector, selectedFriendIds, gedcom_id){
            if(selectedFriendIds.length > 0){
                var alert = $this.warning({title: "Invitation creating, wait...", timeout: false});
                $fn.addInvitation(selectedFriendIds[0], gedcom_id, function(){
                    $(alert).alert('close');
                    if(this.success){
                        $fn.sendRequest(selector, selectedFriendIds[0], this.token);
                    } else {

                    }
                });
            } else {
                $this.render();
            }
        },
        delInvitation:function(selector, token){
            var alert = $this.warning({title: "You abort send message, wait..."});
            $this.ajax('invite.delInvitation', {token:token}, function(r){
                $(alert).alert('close');
                selector.showFriendSelector();
            });
        },
        addInvitation:function(facebook_id, gedcom_id, callback){
            $this.ajax('invite.addInvitation', {facebook_id:facebook_id, gedcom_id: gedcom_id}, function(response){
                callback.call(response);
            });
        },
        sendRequest:function(selector, facebook_id, token){
            FB.ui({
                method:'send',
                name: "Click here to Accept",
                link: $this.url().app(),
                to: facebook_id,
                description:(function(){
                    return 'description';
                })()
            }, function(response){
                if("undefined" !== typeof(response) && response != null && response.success){
                    $fn.afterSendRequest(token);
                } else {
                    $fn.delInvitation(selector, token);
                }
            });
        },
        afterSendRequest:function(token){
            $this.success({
                title: "Request has been send"
            });
        }
    }


    $this.render = function(gedcom_id){
        var selector = TDFriendSelector.newInstance({
            maxSelection             : 1,
            friendsPerPage           : 5,
            autoDeselection          : true,
            callbackSubmit: function(selectedFriendIds) {
               $fn.beforeSendRequest(selector, selectedFriendIds, gedcom_id);
            }
        });
        selector.showFriendSelector();
    }
    TDFriendSelector.init({debug: false});
});
