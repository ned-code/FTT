// vectors.js
//
// Stephen Band
//
// Functions for handling vectors and cartesian coordinates.

// FUNCTIONS

function vect(coords) {
  // Converts [x, y] coordinate to [distance, angle] vector,
  // normalised to upwards, clockwise, angle 0-1.
  
  var x = coords[0];
  var y = coords[1];
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
  
  return [d, a]
}

function cart(vector) {
  // Converts [distance, angle] vector to [x, y] coordinates,
  // normalised to upwards, clockwise, angle 0-1.
  
  var d = vector[0];
  var a = vector[1];
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
  
  return [x, y];
}