// Canvas.js
// 0.6
// Stephen Band
// webdev.stephband.info/canvas/
// 
// Chaining borrowed from jQuery
// Copyright (c) 2009 John Resig
// Dual licensed under the MIT and GPL licenses.
// http://docs.jQuery.com/License

(function(window, undefined){

// Define a local copy of Canvas
var Canvas = function( selector ) {
		// The Canvas object is actually just the init constructor 'enhanced'
		return arguments.length === 0 ?
			rootCanvas :
			new Canvas.fn.init( selector );
	},

	// Map over Canvas in case of overwrite
	_Canvas = window.Canvas,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document;

Canvas.fn = Canvas.prototype = {
	init: function( selector ) {
		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
            selector = document.getElementsByTagName('canvas');
			this.elem = jQuery(selector);
		}

		// Handle $(DOMCanvasElement)
		if ( selector.nodeType && selector.getContext ) {
			this.elem = jQuery(selector);
			this.context = selector.getContext("2d");
			
			// Set width and height for 1:1 pixel relationship
			this.size();
		}
		
		return this;
	},

	// The current version of Canvas being used
	Canvas: "0.6",

	mount: function( callback ) {
		callback.apply( this.context );
		return this;
	}
};

// Give the init function the Canvas prototype for later instantiation
Canvas.fn.init.prototype = Canvas.fn;

// Give canvas plugin-like prowess from jQuery
Canvas.extend = Canvas.fn.extend = jQuery.extend;

// EXTENSIONS
Canvas.fn.extend({
    clear: function(min, max) {
        var d = this.dimensions,
            min = min || [0, 0],
            max = max || d;
        
        return this.mount(function(){
            this.clearRect(min[0], min[1], max[0], max[1]);
        });
    },
    
    size: function(options){
        var elem = this.elem,
            size = options || {
                width: elem.width(),
                height: elem.height()
            };
        this.dimensions = [size.width, size.height];
        this.elem.attr(size);
    },
    
    style: function(state){
        state.fillStyle = state.fillStyle || '';
        state.strokeStyle = state.strokeStyle || '';
        jQuery.extend(this.context, state);
        return this;
    },
    
    render: function(state, trans) {
        if (this._trFlag) {
            trans = (!trans) ? 1 : 2 ;
            var transFlag = this._trFlag;
            this._trFlag = 0;
        }
        this._pathFlag = false;
        
        return this.mount(function(){
            var fill = (state) ? state.fillStyle : this.fillStyle,
                stroke = (state) ? state.strokeStyle : this.strokeStyle;
            
            if (trans === 1) {
                while (transFlag--) {
                    console.log(transFlag);
                    console.log('x');
                    this.restore();
                }
            }
            
            if (state) {
                this.save();
                jQuery.extend(this, state);
            }
            if (fill) this.fill();
            if (stroke) {this.stroke();}
            if (state) {
                this.restore();
            }
            
            if (trans === 2) {
                while (transFlag--) {
                    console.log('x');
                    this.restore();
                }
            }
        });
    },
    
    transform: function(pos, state){
        this._trFlag = (this._trFlag) ? this._trFlag + 1 : 1;

        var o = normalise(state);
        
        return this.mount(function(){
            this.save();
            
            // Adjust drawing plane
            if (pos) this.translate(pos[0], pos[1]);
            if (o.rot) this.rotate(o.rot);
            if (o.sca) this.scale(o.sca[0], o.sca[1]);
            if (o.ori) this.translate(-o.ori[0], -o.ori[1]);
        });
    },
    
    draw: function(){
        // Decide if we're dealing with a single instruction
        // or an array of instructions and call plot accordingly
        if (!this._pathFlag) {
            this._pathFlag = true;
            this.context.beginPath();
        }
        
        plot.apply(this.context, arguments);
        
        return this;
    },
    
    plot: function draw(pos, shape, options){
        // shape                        - shape array OR string name of shape in canvas.shapes
        // options
        //   origin: [x, y]                - Origin of path (relative to unscaled size)
        //   scale: [x, y]                - Scale of path
        //   smin: [x, y]               - Min scale of path (positive number, can't be 0)
        //   smax: [x, y]               - Max scale of path
        //   rotate: 0-1                   - Rotation of path
        
        var o = normalise(options);
        
        if (typeof shape == "string")
            shape = Canvas.shapes[shape];
        
        if (!this._pathFlag) {
            this._pathFlag = true;
            this.context.beginPath();
        }
        
        return this.mount(function(){
            
            this.save();
            
            // Adjust drawing plane
            if (pos) this.translate(pos[0], pos[1]);
            if (o.rot) this.rotate(o.rot);
            if (o.sca) this.scale(o.sca[0], o.sca[1]);
            if (o.ori) this.translate(-o.ori[0], -o.ori[1]);
            
            this.moveTo(0, 0);
            
            // Plot shape
            if ( isArray(shape) ) {
                var i = 0,
                    l = shape.length;
                while (i < l) {
                    plot.apply(this, shape[i]);
                    i++;
                }
            }
            else {
                shape.call(this, options);
            }
            
            this.restore();
        });
    },
    gradient: function(coords, colors){
        // coords - array - 4 numbers for a linear gradient (x1,y1,x2,y2), 6 for a radial (x1,y1,r1,x2,y2,r2)
        // colors - object - {colorPosition: value} pairs, eg. {0: white, 1:"rgba(34, 34, 78, 0.8)"}
        // returns gradient object
        var gradient;
        if      (coords.length == 4) {gradient = this.createLinearGradient(coords[0], coords[1], coords[2], coords[3]);}
        else if (coords.length == 6) {gradient = this.createRadialGradient(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);}
        for (i in colors) {gradient.addColorStop(i, colors[i]);}
        return gradient;
    }
});

// Shapes should be either a set of canvas in a function
// or an array of arrays that can be given to plot()
Canvas.shapes = {
    arc: function(options){         
        var pi = Math.PI,
            rad = options.radius || 50,
            angle = (options.angle || 1) * 2 * pi,
            anti = options.anticlockwise || false,
            startAngle = -pi/2;
        
        this.moveTo(rad, rad);
        if (!(angle < 2*pi)) { this.moveTo(rad, 0); }
        this.arc(rad, rad, rad, startAngle, startAngle+angle, anti);
        if (angle < 2*pi)   { this.lineTo(rad, rad); }
    },
    roundedRectangle: function(options){
        //   size: [x, y]  - dimensions
        //   radius: >0    - radius of corners
        //   stretch: 0-1  - how 'stretched out' corners are
        //   random:       - adds that unexpected touch
        
        console.log(options);
        
        var o = options || {},
            width   = (o.size) ? options.size[0] : 240 ,
            height  = (o.size) ? options.size[1] : 240 ,
            radius  = (o.radius) ? options.radius : 20 ,
            random  = (o.random) ? options.random : false,
            stretch = (o.stretch !== undefined) ? options.stretch : 12 ,
            xstretch = 0,
            dig     = 10,
            start   = [0, 0];
        
        // Shall we draw the straight edges?
        var edge = {
            x:      (radius >= width /2) ? false: true,
            y:      (radius >= height/2) ? false: true
        };
        
        function ran() {
            return (random) ? (parseInt(dig*(Math.random() * 2 * random - random)))/dig : 0;
        };
        
        // Swap direction of rounded corner if they go in the way
        if (stretch < 0) {
          xstretch = stretch;
          stretch = 0;
        } 
        
        start = [ran(), ran()+radius];
        
        this.moveTo(start[0], start[1]);
        if (edge.y) this.lineTo(ran(),ran()+height-radius);
        this.bezierCurveTo( ran()-xstretch,              ran()+height-radius+stretch,  ran()+radius-stretch,       ran()+height+xstretch,        radius+ran(), ran()+height);
        if (edge.x) this.lineTo(ran()+width-radius,ran()+height);
        this.bezierCurveTo( ran()+width-radius+stretch,  ran()+height+xstretch,        ran()+width+xstretch,       ran()+height-radius+stretch,  ran()+width, ran()+height-radius);
        if (edge.y) this.lineTo(ran()+width,ran()+radius);
        this.bezierCurveTo( ran()+width+xstretch,        ran()+radius-stretch,         ran()+width-radius+stretch, ran()-xstretch,               ran()+width-radius, ran());
        if (edge.x) this.lineTo(ran()+radius,ran());
        this.bezierCurveTo( ran()+radius-stretch,        ran()-xstretch,               ran()-xstretch,             ran()+radius-stretch,         start[0], start[1]);
    },
    ellipse:      function(ctx, options){
        // radius: pixels
        // xscale: 0-1
        // yscale: 0-1
        // pinch: 0-1     - squares or flattens the corners, ie. no longer an ellipse
        
        var radius = (options.radius) ?  options.radius  :   100 ,
            xscale = (options.xscale) ?  options.xscale  :   1 ,
            yscale = (options.yscale) ?  options.yscale  :   1 ,
            pinch  = (options.pinch || options.pinch === 0) ? options.pinch : 0.552285 ,
            random = (options.random) ? options.random : false,
            bez = pinch*radius,
            x = [0, xscale*(radius-bez) ,xscale*radius, xscale*(radius+bez), xscale*2*radius],
            y = [0, yscale*(radius-bez) ,yscale*radius, yscale*(radius+bez), yscale*2*radius];
        
        function ran() {
          return (random) ? Math.random()*2*random - random : 0 ;
        };
        
        var start = [ran()+x[2],ran()+y[0]];
        
        this.moveTo(start[0], start[1]);
        this.bezierCurveTo(ran()+x[3], ran()+y[0],  ran()+x[4], ran()+y[1],  ran()+x[4], ran()+y[2]);
        this.bezierCurveTo(ran()+x[4], ran()+y[3],  ran()+x[3], ran()+y[4],  ran()+x[2], ran()+y[4]);
        this.bezierCurveTo(ran()+x[1], ran()+y[4],  ran()+x[0], ran()+y[3],  ran()+x[0], ran()+y[2]);
        this.bezierCurveTo(ran()+x[0], ran()+y[1],  ran()+x[1], ran()+y[0],  start[0],   start[1]);
    },
    growGrass:    function(ctx, options){
        // start:
        // end:
        // height:
        
        var start = (options.start) ? options.start : [0,0] ,
            height = (options.height) ? options.height : 300 ,
            bezi1 = cart([80, 0.4]),
            bezi2 = cart([568, 0.3]),
            point = (options.end) ? options.end : [300,300] ;
        
        this.moveTo(start[0], start[1]);
        this.bezierCurveTo(bezi1[0]-point[1]/2, bezi1[1]-point[0]/3, bezi2[0], bezi2[1], point[0], point[1]);                          
    }
};

// FUNCTIONS

function isArray(obj) {
    return toString.call(obj) === "[object Array]";
}

function vector(cart) {
    // Converts [x, y] coordinate to [distance, angle] vector,
    // normalised to upwards, clockwise, angle 0-1.
    
    var x = cart[0];
    var y = cart[1];
    var d = 0;
    var a = 0;
    
    // Flip y to normalise to upwards vector
    y = y * -1;
    
    // Detect quadrant and work out vector
    if (y == 0) {
        if (x < 0)  { a = 0.75; d = -x; } 
        else        { a = 0.25; d = x;  }
    }
    else if (y < 0) {
        if (x == 0) { a = 0.5;  d = -y; }
        else        { a = (Math.atan(x/y) / (2*Math.PI)) + 0.5; d = Math.sqrt(x*x + y*y); }
    }
    else if (y > 0) {
        if (x == 0) { a = 0;    d = y; }
        else        { a = (x > 0) ? Math.atan(x/y) / (2*Math.PI) : 1 + Math.atan(x/y) / (2*Math.PI) ; d = Math.sqrt(x*x + y*y); }
    }
    
    return [d, a];
}

function cartesian(vector) {
    // Converts [distance, angle] vector to cartesian coordinates,
    // normalised to upwards, clockwise, angle 0-1.
    
    var d = vector[0],
        a = vector[1],
        x = 0,
        y = 0;
    
    // Set angle into range 0-1
    if ( a<0 || a>=1 ) { a = a - Math.floor(a); }
    
    // Work out cartesian coordinates
    if      (a == 0)    { y = d; }
    else if (a == 0.25) { x = d; }
    else if (a == 0.5)  { y = -d; }
    else if (a == 0.75) { x = -d; }
    else {
        a = 2 * Math.PI * a;
        x = Math.sin(a) * d;
        y = Math.cos(a) * d;
    }
    
    // Flip y to normalise to downwards coords
    y = y * -1;
    
    return [x, y];
}
        
function normalise(state){
    var o = {
            ori: state.origin,
            sca: state.scale,
            rot: state.rotate * 2 * Math.PI,
            pos: state.position
        };
    
    if (state.sca) {
        var smin = state.minScale || [0.001, 0.001] ,
            smax = state.maxScale;
        
        // Limit scale.  Don't allow to scale to 0.
        for (i in state.sca) {
            o.sca[i] = (smin[i] > sca[i] && -smin[i] < sca[i]) ? smin[i] :
                (smax[i] < sca[i]) ? smax[i] :
                (-smax[i] > sca[i]) ? -smax[i] :
                state.scale[i] ;
        }
    }
    
    return o;
}

function plot(start, end, startCtrl, endCtrl){
    if (start)          { this.moveTo(start[0], start[1]); }
    if (endCtrl)        { this.bezierCurveTo(startCtrl[0], startCtrl[1], endCtrl[0], endCtrl[1], end[0], end[1]); }
    else if (startCtrl) { this.quadraticCurveTo(startCtrl[0], startCtrl[1], end[0], end[1]); }           
    else if (end)       { this.lineTo(end[0], end[1]); }
};

// Expose Canvas to the global object
window.Canvas = Canvas;

})(window);