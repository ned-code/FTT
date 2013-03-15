$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {
        beforeSendRequest:function(facebook_id){
            $fn.sendRequest(facebook_id);
        },
        sendRequest:function(facebook_id){
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


    $this.render = function(){
        var selector = TDFriendSelector.newInstance({
            maxSelection             : 1,
            friendsPerPage           : 5,
            autoDeselection          : true,
            callbackSubmit: function(selectedFriendIds) {
               $fn.beforeSendRequest(selectedFriendIds);
            }
        });
        selector.showFriendSelector();
    }
    TDFriendSelector.init({debug: false});
});
