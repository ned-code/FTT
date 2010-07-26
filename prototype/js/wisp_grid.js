// CanvasAPI

(function(undefined){

  var prototype = {
    init: function( width, height ){
      var node = document.createElement('canvas');
      
      node.setAttribute('width', width);
      node.setAttribute('height', height);
      
      this.saveLevel = 0;
      this.node = node;
      this.width = width;
      this.height = height;
      this.ctx = node.getContext('2d');
      
      return this;
    },
    clear: function(){
      var ctx = this.ctx;

      while (this.saveLevel) {
        ctx.restore();
        this.saveLevel--;
      }
      ctx.clearRect( 0, 0, this.width, this.height );
      
      return this;
    },
    style: function(){
      var ctx = this.ctx;
      
      this.ctx.save();
      this.saveLevel++;
      // Convert this to get style from options
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      
      ctx.translate(32, 32);
      ctx.scale(2, 2);
      
      return this;
    },
    translate: function(x, y){
      this.ctx.save();
      this.saveLevel++;
      this.ctx.translate(x, y);
      return this;
    },
    scale: function(x, y){
      this.ctx.save();
      this.saveLevel++;
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
  }
  
  window.CanvasAPI = function(width, height){
  	return Object.create(prototype).init(width, height);
  };

})();
    
    
// VAR

// Wisp body
var shape = [
      { method: 'moveTo', data: [0,0] },
      { method: 'lineTo', data: [50,0] },
      { method: 'lineTo', data: [50,50] },
      { method: 'lineTo', data: [0,50] }
    ];

// Functions for handling vectors and cartesian coordinates.

function vect(x, y, fn) {
  // Converts [x, y] coordinate to [distance, angle] vector,
  // normalised to upwards, clockwise, angle 0-1.
  
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
  
  return fn(a, d);
}

function cart(a, d, fn) {
  // Converts [distance, angle] vector to [x, y] coordinates,
  // normalised to upwards, clockwise, angle 0-1.
  
  var x = 0;
  var y = 0;
  
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
  
  return fn(x, y);
}

// RUN

var grid = CanvasAPI(240, 240);

grid
.clear()
.style()
.draw(shape);

// READY

jQuery(document).ready(function(){
  
  jQuery('body').prepend(grid.node);
  
  
});
