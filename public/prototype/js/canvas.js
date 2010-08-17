// canvas.js
// 
// Wraps the Canvas 2D context API with a light, concise,
// chainable syntax. In other words, it's sugar.

(function(undefined){
	
	var pi = Math.PI,
			pi2 = pi * 2,
			sin = Math.sin,
			cos = Math.cos,
			tan = Math.tan,
			styles = {
				fillStyle: true,
				strokeStyle: true,
				lineWidth: true,
				shadowOffsetX: true,
				shadowOffsetY: true,
				shadowBlur: true,
				shadowColor: true
			},
			saveLevel = 0,
			prototype = {
				init: function( width, height, DOMNode ){
					var node = DOMNode || document.createElement('canvas');
					
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
						ctx[ path[i].type ].apply( ctx, path[i].data );
					}
					
					return this;
				},
				draw: function( path, options ){
					var ctx = this.ctx ;
					
					ctx.beginPath();
					 this.plot( path );
					ctx.closePath();
					
					ctx.fill();
					ctx.stroke();
					
					return this;
				},
				begin: function(){
					this.ctx.beginPath();
					return this;
				},
				close: function(){
					this.ctx.closePath();
					return this;
				},
				fill: function(){
					this.ctx.fill();
					return this;
				},
				stroke: function(){
					this.ctx.stroke();
					return this;
				}
			};
	
	Canvas = function(width, height, node){
		return Object.create(prototype).init(width, height, node);
	};

})();