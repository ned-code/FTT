$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {
        beforeSendRequest:function(selectedFriendIds, gedcom_id){
            if(selectedFriendIds.length > 0){
                /*
                $fn.addInvitation(selectedFriendIds[0], gedcom_id, function(){
                    $fn.sendRequest(selectedFriendIds[0]);
                });
                */
            } else {
                $this.render();
            }
        },
        addInvitation:function(facebook_id, gedcom_id, callback){
            $this.ajax('invite.addInvitation', {facebook_id:facebook_id, gedcom_id: gedcom_id}, function(response){
                console.log(response)
            });
        },
        sendRequest:function(facebook_id){
            var iframe = $(".fb_dialog_content.fb_dialog_iframe")[0];
            console.log(iframe);
            FB.ui({
                method:'send',
                name: "Click here to Accept",
                link: $this.url().app(),
                to: facebook_id,
                description:(function(){
                    return 'description';
                })()
            }, $fn.afterSendRequest);
        },
        afterSendRequest:function(){
            console.log(arguments);
        }
    }


    $this.render = function(gedcom_id){
        var selector = TDFriendSelector.newInstance({
            maxSelection             : 1,
            friendsPerPage           : 5,
            autoDeselection          : true,
            callbackSubmit: function(selectedFriendIds) {
               $fn.beforeSendRequest(selectedFriendIds, gedcom_id);
            }
        });
        selector.showFriendSelector();
    }
    TDFriendSelector.init({debug: false});
});
