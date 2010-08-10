// Path
// 
// 0.2
// 
// A wrapper, and library of methods for manipulating, paths.


(function(undefined){
	
	// VAR
	
	var debug = (window.console && console.log);
	
	var pi = Math.PI,
			pi2 = 2*pi,
			sin = Math.sin,
			cos = Math.cos;
			
	var svgTypeMap = {
				moveTo: 'M',
				lineTo: 'L',
				bezierCurveTo: 'C',
				closePath: 'z'
			}
	
	
	// FUNCTIONS
	
	function toPolar(cart) {
		// Converts cartesian [x, y] to polar [distance, angle] coordinates,
		// normalised to upwards, clockwise, angle 0 - 2pi.
		
		var x = cart[0],
				y = cart[1] * -1;
		
		// Detect quadrant and work out vector
		if (y === 0) 	{ return x === 0 ? [0, 0] : x > 0 ? [x, 0.5 * pi] : [-x, 1.5 * pi] ; }
		if (y < 0) 		{ return x === 0 ? [-y, pi] : [Math.sqrt(x*x + y*y), Math.atan(x/y) + pi] ; }
		if (y > 0) 		{ return x === 0 ? [y, 0] : [Math.sqrt(x*x + y*y), (x > 0) ? Math.atan(x/y) : pi2 + Math.atan(x/y)] ; }
	};
			
	function toCartesian(vect) {
		// Converts [distance, angle] vector to cartesian [x, y] coordinates.
		
		var d = vect[0],
				a = vect[1];
		
		// Work out cartesian coordinates
		return [ Math.sin(a) * d, - Math.cos(a) * d ]
	};
	
	
	// PROTOTYPE
	
	// Define the Path API as a prototype
	
	var pathPrototype = {
		
		// .addDeformPath() takes a name and path, and stores the
		// cartesian difference between that path and this one in the
		// .deformPaths property, using the name as the key. If the
		// number and type of lines in the deform path does not match
		// those in this path, it must throw a silent error.
		
		addDeform: function( name, deformPath ){
			var l = this.length,
					deform, deformData;
			
			if (!this.deforms) { this.deforms = {}; }
			
			deform = this.deforms[name] = {};
			
			// Check lengths match
			if (debug) {
			  if ( this.length !== deformPath.length ) {
			  	console.log('[Path] trying to addDeformPath, but lengths don\'t match', this.length, deformPath.length);
			  }
			}
			
			// Loop through path instructions
			while(l--){
				data = this[l].data,
				i = data.length,
				deformData = deformPath[l].data,
				outData = [];
				
				// Check types match
				if (debug) {
					if ( this[l].type !== deformPath[l].type ) {
						console.log('[Path] trying to addDeformPath, but types at point '+l+' don\'t match');
					}
				}
				
				// process data
				while(i--){
					outData[i] = deformData[i] - data[i];
				}
				
				deform[l] = outData;
			}
			
			return this;
		},
		
		// .removeDeformPath() removes the deform path of this name
		// from the deformPaths property. There is no real reason for
		// this method.
		
		removeDeform: function( name ){
			
			
			return this;
		},
		
		// .deform() takes an option object with keys that correspond
		// to named deformPaths and values that describe how much of
		// that deformPath to apply to this path, where 0 is none and
		// 1 is 100% of the deformPath. Values outside of the range
		// 0-1 are allowed.
		
		deform: function( options ){
			var path = Object.create(pathPrototype),
					l = this.length,
					deforms = this.deforms,
					deform, value;
					
			// Loop through path instructions
			while(l--){
				data = this[l].data,
				i = data.length,
				outData = [];
				
				// Process coordinates
				while(i--){
					value = data[i];
					
					// Process deforms
					for (key in options) {
						value = value + deforms[key][l][i] * options[key] ;
					}
					
					outData[i] = value;
				}
				
				path[l] = { type: this[l].type, data: outData };
			}
			
			path.length = this.length;
			return path;
		},
		
		// .displace() is a special form of deform, where all points
		// are displaced by the same amount along the x and y axes.
		
		displace: function( x, y ){
			var path = Object.create(pathPrototype),
					l = this.length;
					
			// Loop through path instructions
			while(l--){
				data = this[l].data,
				i = data.length,
				outData = [];
				
				// Split data into coordinate pairs and process
				while(i){
					
					outData[i-2] = data[i-2] + x;
					outData[i-1] = data[i-1] + y;
					
					i = i-2;
				}
				
				path[l] = { type: this[l].type, data: outData };
			}
			
			path.length = this.length;
			return path;
		},
		
		// Spherize wraps the 'flat' plane of points round a sphere,
		// where radius is the radius of the sphere as seen from
		// an infinite distance, and distance defines the amount of
		// perspective distortion applied to that projection.
		// [TODO: origin is not implemented]
		
		spherize: function( radius, distance, origin ){
			var r = radius || 100,
					z = distance || 800,
					l = this.length,
					path = Object.create(pathPrototype),
					data, i, dr, ds, polar, cart, outData;
			
			// Loop through path instructions
			while(l--){
				data = this[l].data,
				i = data.length,
				outData = [];
				
				// Split data into coordinate pairs and process
				while(i){
					polar = toPolar( data.slice(i-2, i) );
					
					dr = polar[0] / r;
					ds = ( z*r*sin(dr) ) / ( z-r*cos(dr) );
					cart = toCartesian( [ds, polar[1]] );
					
					outData[i-2] = cart[0];
					outData[i-1] = cart[1];
					
					i = i-2;
				}
				
				path[l] = { type: this[l].type, data: outData };
			}
			
			path.length = this.length;
			return path;
		},
		
		// [TODO] .union() takes another path object as an argument,
		// and calculates and returns the union of that path and the
		// current path as a new path.
		
		union: function( inPath ){
			var path = Object.create(pathPrototype);
			
			// Calculate the union of 'this' and 'path', populate and
			// return the resulting path.   
			
			path.length = this.length;
			return path;
		},
		
		
		// .toJSON() returns this data as a JSON Array
		
		toJSON: function(){
			var array = [],
					i = -1,
					l = this.length;
			
			while (++i < l) {
				array.push( this[i] );
			}
			
			return JSON.stringify( array );
		},
		
		// .toSVG() returns this path as an SVG DOMNode
		// [TODO] this is unfinished and untested
		
		toSVG: function(){
			var pathNode = document.createElement('path'),
					array = [],
					i = -1,
					l = this.length;
			
			while (++i < l) {
				array.push( svgTypeMap[ this[i].type ] + this[i].data.join(' ') );
			}
			
			pathNode.setAttribute( 'd', array.join(' ') );
			return pathNode;
		}
	}
	
	// Path() takes an object that defines a path, or a JSON string
	// that defines a path, or an SVGDOMNode that defines a path, and
	// constructs an array-like object with a chainable API.
	// [TODO] obj detection and construction of path from SVGNode
	
	function Path( obj ){
		var path = Object.create(pathPrototype),
				l = path.length = obj.length;
		
		if ( typeof obj === 'string' ) {
			obj = JSON.parse(obj);
		}
		
		// Copy array to object to make array-like object 
		while (l--){
			path[l] = obj[l];
		}
		
		return path;
	}
	
	window.Path = Path;
	
})();