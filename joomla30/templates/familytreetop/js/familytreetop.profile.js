$FamilyTreeTop.create("profile", function($){
    'use strict';
    var $this = this, $fn, $box;

    $box = $('#profile');

    $this.render = function(args){
        var parent = $($box).clone(), object = args.object;

        $(parent).find('#profileLabel').text(object.shortname());
        console.log(args);

        $(parent).modal();
    }

});