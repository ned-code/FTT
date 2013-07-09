$FamilyTreeTop.create("trees", function($){
    'use strict';

    var $this = this,
        $default,
        $fn;

    $default = {
        offsetX: 10,
        offsetY: 10,
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
        getShift: function(user, pos){
            return [pos[0] + $default.node.width + $default.offsetX, pos[1]];
        },
        getCenter: function(pos){
            return [pos[0] + $default.node.width / 2, pos[1] + $default.node.height / 2];
        },
        getFamily: function(id, json){
            return json.families[id];
        },
        getContainer: function(canvas){
            return $(canvas.contextContainer.canvas).parent();
        },
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
            var positions = [0,0];
            var container = $fn.getContainer(canvas);
            $(map).each(function(count, id){
                var user = $this.mod('usertree').user(id);
                var center = $fn.getCenter(positions);
                var shift = $fn.getShift(user, positions);

                if((count + 1) != map.length){
                    var lineShift = $fn.getShift(user, center);
                    var line = $fn.renderLine([center[0], center[1], lineShift[0], lineShift[1]]);
                    canvas.add(line);
                }
                var box = $fn.renderBox(center);
                canvas.add(box);

                var div = $fn.renderDiv(user, positions);
                $(container).append(div);

                positions = shift;
            });
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