// Path
// 
// 0.1
// 
// A wrapper, and library of methods for manipulating, paths


(function(undefined){

// Define the Path API as a prototype of path

var pathPrototype = {
	
	// .addDeformPath() takes a name and path, and stores the
	// cartesian difference between that path and this one in the
	// .deformPaths property, using the name as the key. If the
	// number and type of lines in the deform path does not match
	// those in this path, it must throw a silent error.
	
	addDeformPath( name, path ){
		
		
		return this;
	},
	
	// .removeDeformPath() removes the deform path of this name
	// from the deformPaths property. There is no real reason for
	// function.
	
	removeDeformPath( name ){
		
		
		return this;
	},
	
	// .deform() takes an option object with keys that correspond
	// to named deformPaths and values that describe how much of
	// that deformPath to apply to this path, where 0 is none and
	// 1 is 100% of the deformPath. Values outside of the range
	// 0-1 are allowed.
	
	deform( options ){
		
		
		return Path( obj );
	},
	
	// .displace() is a special form of deform, where all points
	// are displaced along the x and y axes.
	
	displace( coords ){
		
		
		return Path( obj );
	},
	
	// Spherize wraps the 'flat' plane of points round a sphere,
	// where radius is the radius of the sphere as seen from
	// an infinite distance, and distance defines the amount of
	// perspective distortion experienced.
	
	spherize( radius, distance, origin ){
		
		
		return Path( obj );
	},
	
	// [TODO] .union() takes another path object as an argument,
	// and calculates and returns the union of that path and the
	// current path as a new path.
	
	union( path ){
		
		
		return Path( obj );
	},
	
	toJSON(){
		
		
		return JSON;
	},
	
	toSVG(){
		
		
		return SVGDOMNode;
	}
}

function Path( obj ){
	
//	// [TODO] Detect if object is an SVG DOM node, or a path definition
//	if ( obj instanceOf Object ){
//		
//		// obj is a path definition
//		
//	}
//	else ( obj is SVGDOMNode ) {
//		
//		// obj is an SVG DOM Node
//		// [TODO] Extract path definition from SVG DOM node
//		
//	}
	
	obj.prototype = pathPrototype;
	
	return obj;
}

})();