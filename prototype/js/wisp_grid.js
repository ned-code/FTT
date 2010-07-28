// CanvasAPI

(function(undefined){
  
  var styles = {
        fillStyle: true,
        shadowOffsetX: true,
        shadowOffsetY: true,
        shadowBlur: true,
        shadowColor: true
      },
      prototype = {
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
    style: function( options ){
      var ctx = this.ctx;
      
      this.ctx.save();
      this.saveLevel++;
      
      for (key in options) {
        ctx[key] = options[key];
      }
      
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
var shapes = {
    1: [
        { method: 'moveTo', data: [0,0] },
        { method: 'lineTo', data: [50,0] },
        { method: 'lineTo', data: [50,50] },
        { method: 'lineTo', data: [0,50] }
      ],
    2: [
        { method: 'moveTo', data: [0,0] },
        { method: 'lineTo', data: [-50,0] },
        { method: 'lineTo', data: [-50,50] },
        { method: 'lineTo', data: [0,50] }
      ],
    3: [
        { method: 'moveTo', data: [0,0] },
        { method: 'lineTo', data: [-50,0] },
        { method: 'lineTo', data: [-50,-50] },
        { method: 'lineTo', data: [0,-50] }
      ],
    4: [
        { method: 'moveTo', data: [0,0] },
        { method: 'lineTo', data: [50,0] },
        { method: 'lineTo', data: [50,-50] },
        { method: 'lineTo', data: [0,-50] }
      ],
    5: [
        { method: 'moveTo', data: [50,0] },
        { method: 'lineTo', data: [100,0] },
        { method: 'lineTo', data: [100,50] },
        { method: 'lineTo', data: [50,50] }
      ],
    6: [
        { method: 'moveTo', data: [50,50] },
        { method: 'lineTo', data: [100,50] },
        { method: 'lineTo', data: [100,100] },
        { method: 'lineTo', data: [50,100] }
      ],
    7: [
        { method: 'moveTo', data: [0,50] },
        { method: 'lineTo', data: [50,50] },
        { method: 'lineTo', data: [50,100] },
        { method: 'lineTo', data: [0,100] }
      ],
    8: [
        { method: 'moveTo', data: [-50,50] },
        { method: 'lineTo', data: [0,50] },
        { method: 'lineTo', data: [0,100] },
        { method: 'lineTo', data: [-50,100] }
      ],
    9: [
        { method: 'moveTo', data: [-100,50] },
        { method: 'lineTo', data: [-50,50] },
        { method: 'lineTo', data: [-50,100] },
        { method: 'lineTo', data: [-100,100] }
      ],
    10: [
        { method: 'moveTo', data: [-100,0] },
        { method: 'lineTo', data: [-50,0] },
        { method: 'lineTo', data: [-50,50] },
        { method: 'lineTo', data: [-100,50] }
      ],
    11: [
        { method: 'moveTo', data: [-100,-50] },
        { method: 'lineTo', data: [-50,-50] },
        { method: 'lineTo', data: [-50,0] },
        { method: 'lineTo', data: [-100,0] }
      ],
    12: [
        { method: 'moveTo', data: [-100,-100] },
        { method: 'lineTo', data: [-50,-100] },
        { method: 'lineTo', data: [-50,-50] },
        { method: 'lineTo', data: [-100,-50] }
      ],
    13: [
        { method: 'moveTo', data: [-50,-100] },
        { method: 'lineTo', data: [0,-100] },
        { method: 'lineTo', data: [0,-50] },
        { method: 'lineTo', data: [-50,-50] }
      ],
    14: [
        { method: 'moveTo', data: [0,-100] },
        { method: 'lineTo', data: [50,-100] },
        { method: 'lineTo', data: [50,-50] },
        { method: 'lineTo', data: [0,-50] }
      ],
    15: [
        { method: 'moveTo', data: [50,-100] },
        { method: 'lineTo', data: [100,-100] },
        { method: 'lineTo', data: [100,-50] },
        { method: 'lineTo', data: [50,-50] }
      ],
    16: [
        { method: 'moveTo', data: [50,-50] },
        { method: 'lineTo', data: [100,-50] },
        { method: 'lineTo', data: [100,0] },
        { method: 'lineTo', data: [50,0] }
      ]
    };

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

// Loop over data

function processPath( path, fn ){
  var i = -1,
      l = path.length,
      out = [];
  
  while ( ++i < l ) {
    out[i] = fn( i, path[i] );
  }
  
  return out;
}

// Translate to vectors

function calcVectorData( data ){
  var output = [],
      i = data.length - 1;
  
  while ( i > 0 ) {
    
    vect(data[i-1], data[i], function(a, d){
      output[i-1] = a;
      output[i] = d;
    });
    
    i = i-2;
  }
  
  return output;
}

function calcCartData( data ){
  var i = data.length - 1;
  
  while ( i > 0 ) {
    
    cart(data[i-1], data[i], function(x, y){
      data[i-1] = x;
      data[i] = y;
    });
    
    i = i-2;
  }
  
  return data;
}

// TEST

vect( 100, 100, function(a, b){
  console.log(a+', '+b);
});

cart( 0.375, 10, function(x, y){
  console.log(x+', '+y);
});

// RUN

var distance = 800,
    r = 100,
    shape,
    vectorShapes = {},
    sphereShapes = {},
    pi = Math.PI,
    sin = Math.sin,
    cos = Math.cos;

for (l in shapes) {
  processPath( shapes[l], function( i, obj ){
    var vectorData = calcVectorData( obj.data ),
        d = vectorData[1],
        dx = r * cos(d/r),
        dm = r * sin(d/r);
    
    console.log(vectorData[0]+', '+vectorData[1]);
    
    vectorData[1] = (dm*distance) / (distance-dx);
    
    console.log(vectorData[0]+', '+vectorData[1]);
    
    cart( vectorData[0], vectorData[1], function(x, y){
      shapes[l][i].data = [x, y];
    } );
    
    console.log(shapes[l][i].data);
  });
}

console.log(shapes);







var grid = CanvasAPI(240, 240);

grid
.clear()
.translate(120, 120)
.style({
  fillStyle: "rgba(0,0,0,0.2)"
})
.draw([
  { method: 'arc', data: [0,0,r,0,Math.PI*2,true] }
])
.style({
  fillStyle: "rgb(150,50,50)",
})
.draw(shapes[1])
.style({
  fillStyle: "rgb(200,50,0)"
})
.draw(shapes[2])
.style({
  fillStyle: "rgb(200,100,0)"
})
.draw(shapes[3])
.style({
  fillStyle: "rgb(150,150,0)"
})
.draw(shapes[4])
.style({
  fillStyle: "rgb(100,150,0)"
})
.draw(shapes[5])
.style({
  fillStyle: "rgb(50,150,0)"
})
.draw(shapes[6])
.style({
  fillStyle: "rgb(200,50,0)"
})
.draw(shapes[7])
.style({
  fillStyle: "rgb(200,100,0)"
})
.draw(shapes[8])
.style({
  fillStyle: "rgb(150,150,0)"
})
.draw(shapes[9])
.style({
  fillStyle: "rgb(100,150,0)"
})
.draw(shapes[10])
.style({
  fillStyle: "rgb(50,150,0)"
})
.draw(shapes[11])
.style({
  fillStyle: "rgb(200,50,0)"
})
.draw(shapes[12])
.style({
  fillStyle: "rgb(200,100,0)"
})
.draw(shapes[13])
.style({
  fillStyle: "rgb(150,150,0)"
})
.draw(shapes[14])
.style({
  fillStyle: "rgb(100,150,0)"
})
.draw(shapes[15])
.style({
  fillStyle: "rgb(50,150,0)"
})
.draw(shapes[16]);

// READY

jQuery(document).ready(function(){
  
  jQuery('body').prepend(grid.node);
  
});
