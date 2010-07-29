// plotter.js
// 
// Wraps the Canvas 2D context API with a concise,
// chainable syntax. Also provides some helpers
// for manipulating coordinates.

(function(undefined){
	
	var pi = Math.PI,
			pi2 = pi * 2,
			sin = Math.sin,
			cos = Math.cos,
			tan = Math.tan,
			styles = {
				fillStyle: true,
				shadowOffsetX: true,
				shadowOffsetY: true,
				shadowBlur: true,
				shadowColor: true
			},
			saveLevel = 0,
			prototype = {
				init: function( width, height ){
					var node = document.createElement('canvas');
					
					node.setAttribute('width', width);
					node.setAttribute('height', height);
					
					this.node = node;
					this.width = width;
					this.height = height;
					this.ctx = node.getContext('2d');
					
					return this;
				},
				clear: function(){
					var ctx = this.ctx;
				
					while (saveLevel) {
						ctx.restore();
						saveLevel--;
					}
					ctx.clearRect( 0, 0, this.width, this.height );
					
					return this;
				},
				style: function( options ){
					var ctx = this.ctx;
					
					this.ctx.save();
					saveLevel++;
					
					for (var key in options) {
						ctx[key] = options[key];
					}
					
					return this;
				},
				translate: function(x, y){
					this.ctx.save();
					saveLevel++;
					this.ctx.translate(x, y);
					return this;
				},
				scale: function(x, y){
					this.ctx.save();
					saveLevel++;
					this.ctx.scale(x, y);
					return this;
				},
				plot: function( path ){
					var ctx = this.ctx,
							i = -1,
							l = path.length;
					
					while ( ++i < l ){
						ctx[ path[i].method ].apply( ctx, path[i].data );
					}
					
					return this;
				},
				draw: function( path, options ){
					var ctx = this.ctx ;
					
					ctx.beginPath();
					 this.plot( path );
					ctx.closePath();
					
					ctx.fill();
					
					return this;
				}
			};
	
	Plotter = function(width, height){
		return Object.create(prototype).init(width, height);
	};
	
	Plotter.toPolar = function(cart) {
	  // Converts [x, y] coordinate to [distance, angle] vector,
	  // normalised to upwards, clockwise, angle 0 - 2pi.
	  
	  var x = cart[0],
	  		y = cart[1] * -1;
	  
	  // Detect quadrant and work out vector
	  if (y === 0) 	{ return x === 0 ? [0, 0] : x > 0 ? [x, 0.5 * pi] : [-x, 1.5 * pi] ; }
	  if (y < 0) 		{ return x === 0 ? [-y, pi] : [Math.sqrt(x*x + y*y), Math.atan(x/y) + pi] ; }
	  if (y > 0) 		{ return x === 0 ? [y, 0] : [Math.sqrt(x*x + y*y), (x > 0) ? Math.atan(x/y) : pi2 + Math.atan(x/y)] ; }
	};
		
	Plotter.toCartesian = function(vect) {
	  // Converts [distance, angle] vector to [x, y] coordinates.
	  
	  var d = vect[0],
	  		a = vect[1];
	  
	  // Work out cartesian coordinates
	  return [ Math.sin(a) * d, - Math.cos(a) * d ]
	};

})();

// Test

//if (window.console && console.log) {
//	console.log('Plotter tests ----- ');
//	
//	console.log( Plotter.toPolar([0, 1])[1] === Math.PI );
//	console.log( Plotter.toPolar([1, 1])[1] === Math.PI*0.75 );
//	console.log( Plotter.toPolar([1, 0])[1] === Math.PI*0.5 );
//	console.log( Plotter.toPolar([-1, -1])[1] === Math.PI*1.75 );
//	
//	console.log( '[4.5, 80.4]:', Plotter.toCartesian( Plotter.toPolar([4.5, 80.4]) ) );
//	console.log( '[0, 0]:', Plotter.toCartesian( Plotter.toPolar([0, 0]) ));
//	
//	console.log( '[56, pi]:', Plotter.toPolar( Plotter.toCartesian([56, Math.PI]) ) );
//	console.log( '[1, 2.3]:', Plotter.toPolar( Plotter.toCartesian([1, 2.3]) ));
//	console.log( '[0, 0]:', Plotter.toPolar( Plotter.toCartesian([0, 0]) ));
//	
//	console.log('------------------- ');
//}