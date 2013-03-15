$FamilyTreeTop.create("friendselector", function($){
    'use strict';
    var $this = this,
        $fn;

    $fn = {

    }


    $this.render = function(){
        var selector = TDFriendSelector.newInstance({
            maxSelection             : 1,
            friendsPerPage           : 5,
            autoDeselection          : true,
            callbackSubmit: function(selectedFriendIds) {
               console.log(selectedFriendIds);
            }
        });
        selector.showFriendSelector();
    }
    TDFriendSelector.init({debug: false});
});
