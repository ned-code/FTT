$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {
        beforeSendRequest:function(){
            console.log(arguments);
        },
        afterSendRequest:function(){
            console.log(arguments);
        },
        sendRequest:function(facebook_id){
            FB.ui({
                method:'send',
                name: "Click here to Accept",
                link: $this.url('/index.php/invitation').base(),
                to: facebook_id,
                picture: $this.url('/images/ftt_invitation.png').template(),
                description:(function(){
                    return 'description';
                })()
            }, $fn.afterSendRequest);
        }
    }


    $this.render = function(){
        var selector = TDFriendSelector.newInstance({
            maxSelection             : 1,
            friendsPerPage           : 5,
            autoDeselection          : true,
            callbackSubmit: function(selectedFriendIds) {
                $fn.sendRequest(selectedFriendIds);
            }
        });
        selector.showFriendSelector();
    }
    TDFriendSelector.init({debug: false});
});
