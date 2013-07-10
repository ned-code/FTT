$FamilyTreeTop.create("trees", function($){
    'use strict';

    var $this = this,
        $default,
        $fn;

    $default = {
        node: {
            width: 150,
            height: 60,
            fill: 'gray'
        },
        line: {
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1,
            selectable: false
        }
    }

    $fn = {
        renderBox: function(pos){
            return new fabric.Rect({
                left: pos[0],
                top: pos[1],
                fill: $default.node.fill,
                width: $default.node.width,
                height: $default.node.height
            });
        },
        renderLine: function(coords){
            return new fabric.Line(coords, {
                fill: $default.line.fill,
                stroke: $default.line.stroke,
                strokeWidth: $default.line.strokeWidth,
                selectable: $default.line.selectable
            });
        },
        renderDiv: function(user, pos){
            var div = $('<div></div>');
            $(div).css('position', 'absolute');
            $(div).css('background', 'white');
            $(div).css('border', '1px solid #000');
            $(div).css('width', $default.node.width+'px');
            $(div).css('height', $default.node.height+'px');
            $(div).css('top', pos[1]+'px');
            $(div).css('left', pos[0]+'px');
            $(div).text(user.name());
            return div;
        },
        render: function(canvas, map){
            //console.log(canvas, map);
        },
        init: function(object){
            var div = $('<div style="position:relative;"></div>')
            var objectCanvas = $('<canvas width="'+$(object).width()+'" height="'+$(object).height()+'"></canvas>');
            $(div).append(objectCanvas);
            $(object).append(div);
            return new fabric.StaticCanvas(objectCanvas[0]);
        }
    }

    $this.init = $fn.init;
    $this.render = $fn.render;
});