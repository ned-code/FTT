$FamilyTreeTop.create("trees", function($){
    'use strict';

    var $this = this,
        $fn;

    $fn = {
        init: function(object){
            var objectCanvas = $('<canvas width="500" height="300"></canvas>');
            $(object).append(objectCanvas);
            return new fabric.StaticCanvas(objectCanvas[0]);
        }
    }

    $this.init = $fn.init;
});