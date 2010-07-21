    
    // VAR
    
    // Wisp body
    var body = [
          { method: 'moveTo', 			 data: [0,72.65] },
          { method: 'bezierCurveTo', data: [50.8,75.11,85.62,55.25,85.62,25.42] },
          { method: 'bezierCurveTo', data: [85.62,11.38,74.23,0,60.19,0] },
          { method: 'bezierCurveTo', data: [46.42,0,37.02,11.11,34.51,25.42] },
          { method: 'bezierCurveTo', data: [30.42,48.78,26.47,69.74,0.2,68.47] },
          { method: 'bezierCurveTo', data: [-1.81,72.56,0,72.65,0,72.65] }
        ];
    
    // Eyes open
    var path = [
          { method: 'moveTo',   		 data: [0,4.11] },
          { method: 'bezierCurveTo', data: [-0.01,3.54,0.09,2.98,0.3,2.46] },
          { method: 'bezierCurveTo', data: [0.49,2.01,0.76,1.58,1.11,1.22] },
          { method: 'bezierCurveTo', data: [1.48,0.84,1.94,0.52,2.46,0.3] },
          { method: 'bezierCurveTo', data: [2.99,0.08,3.54,-0.01,4.07,0] },
          { method: 'bezierCurveTo', data: [4.57,0,5.07,0.11,5.53,0.3] },
          { method: 'bezierCurveTo', data: [6.01,0.5,6.46,0.8,6.84,1.18] },
          { method: 'bezierCurveTo', data: [7.19,1.54,7.49,1.97,7.69,2.46] },
          { method: 'bezierCurveTo', data: [7.89,2.96,7.99,3.47,8,3.97] },
          { method: 'bezierCurveTo', data: [8,4.51,7.89,5.04,7.69,5.53] },
          { method: 'bezierCurveTo', data: [7.48,6.04,7.15,6.52,6.74,6.91] },
          { method: 'bezierCurveTo', data: [6.39,7.23,5.99,7.5,5.53,7.69] },
          { method: 'bezierCurveTo', data: [5.03,7.89,4.52,7.99,4.02,8] },
          { method: 'bezierCurveTo', data: [3.48,8,2.95,7.89,2.46,7.69] },
          { method: 'bezierCurveTo', data: [2.01,7.5,1.6,7.24,1.24,6.9] },
          { method: 'bezierCurveTo', data: [0.84,6.52,0.52,6.06,0.3,5.53] },
          { method: 'bezierCurveTo', data: [0.11,5.06,0.01,4.58,0,4.11] },
          { method: 'moveTo',   		 data: [18,4.11] },
          { method: 'bezierCurveTo', data: [17.98,3.54,18.09,2.98,18.3,2.46] },
          { method: 'bezierCurveTo', data: [18.49,2.01,18.76,1.58,19.11,1.22] },
          { method: 'bezierCurveTo', data: [19.48,0.84,19.94,0.52,20.46,0.3] },
          { method: 'bezierCurveTo', data: [20.99,0.08,21.54,-0.01,22.07,0] },
          { method: 'bezierCurveTo', data: [22.57,0,23.07,0.11,23.53,0.3] },
          { method: 'bezierCurveTo', data: [24.01,0.5,24.46,0.8,24.84,1.18] },
          { method: 'bezierCurveTo', data: [25.19,1.54,25.49,1.97,25.69,2.46] },
          { method: 'bezierCurveTo', data: [25.89,2.96,25.99,3.47,26,3.97] },
          { method: 'bezierCurveTo', data: [26,4.51,25.89,5.04,25.69,5.53] },
          { method: 'bezierCurveTo', data: [25.48,6.04,25.15,6.52,24.74,6.91] },
          { method: 'bezierCurveTo', data: [24.39,7.23,23.99,7.5,23.53,7.69] },
          { method: 'bezierCurveTo', data: [23.03,7.89,22.52,7.99,22.02,8] },
          { method: 'bezierCurveTo', data: [21.48,8,20.95,7.89,20.46,7.69] },
          { method: 'bezierCurveTo', data: [20.01,7.5,19.6,7.24,19.24,6.9] },
          { method: 'bezierCurveTo', data: [18.84,6.52,18.52,6.06,18.3,5.53] },
          { method: 'bezierCurveTo', data: [18.11,5.06,18.01,4.58,18,4.11] }
        ];
    
    // Eyes shut
    var shut = [
          { method: 'moveTo', 			 data: [0,0.64] },
          { method: 'bezierCurveTo', data: [-0.03,0.07,0.12,-0.04,0.61,0] },
          { method: 'bezierCurveTo', data: [0.86,0.02,0.99,0.14,1.17,0.38] },
          { method: 'bezierCurveTo', data: [1.48,0.78,1.93,1.06,2.46,1.27] },
          { method: 'bezierCurveTo', data: [3.02,1.49,3.54,1.52,4.07,1.53] },
          { method: 'bezierCurveTo', data: [4.57,1.54,5.09,1.44,5.53,1.27] },
          { method: 'bezierCurveTo', data: [5.91,1.11,6.57,0.7,6.78,0.4] },
          { method: 'bezierCurveTo', data: [6.89,0.22,7.1,0.03,7.38,0] },
          { method: 'bezierCurveTo', data: [7.68,-0.03,8.02,0.17,8,0.51] },
          { method: 'bezierCurveTo', data: [7.98,0.67,7.8,0.93,7.69,1.06] },
          { method: 'bezierCurveTo', data: [7.47,1.3,7.09,1.72,6.74,1.94] },
          { method: 'bezierCurveTo', data: [6.39,2.16,5.91,2.41,5.53,2.47] },
          { method: 'bezierCurveTo', data: [5.17,2.53,4.52,2.56,4.02,2.56] },
          { method: 'bezierCurveTo', data: [3.48,2.56,2.98,2.58,2.46,2.47] },
          { method: 'bezierCurveTo', data: [2.01,2.38,1.55,2.17,1.24,1.99] },
          { method: 'bezierCurveTo', data: [0.86,1.76,0.56,1.52,0.3,1.21] },
          { method: 'bezierCurveTo', data: [0.14,1.03,0.01,0.83,0,0.64] },
          { method: 'moveTo', 			 data: [18,0.64] },
          { method: 'bezierCurveTo', data: [17.96,0.07,18.12,-0.04,18.61,0] },
          { method: 'bezierCurveTo', data: [18.86,0.02,18.99,0.14,19.17,0.38] },
          { method: 'bezierCurveTo', data: [19.48,0.78,19.93,1.06,20.46,1.27] },
          { method: 'bezierCurveTo', data: [21.02,1.49,21.54,1.52,22.07,1.53] },
          { method: 'bezierCurveTo', data: [22.57,1.54,23.09,1.44,23.53,1.27] },
          { method: 'bezierCurveTo', data: [23.91,1.11,24.57,0.7,24.78,0.4] },
          { method: 'bezierCurveTo', data: [24.89,0.22,25.1,0.03,25.38,0] },
          { method: 'bezierCurveTo', data: [25.68,-0.03,26.02,0.17,26,0.51] },
          { method: 'bezierCurveTo', data: [25.98,0.67,25.8,0.93,25.69,1.06] },
          { method: 'bezierCurveTo', data: [25.47,1.3,25.09,1.72,24.74,1.94] },
          { method: 'bezierCurveTo', data: [24.39,2.16,23.91,2.41,23.53,2.47] },
          { method: 'bezierCurveTo', data: [23.17,2.53,22.52,2.56,22.02,2.56] },
          { method: 'bezierCurveTo', data: [21.48,2.56,20.98,2.58,20.46,2.47] },
          { method: 'bezierCurveTo', data: [20.01,2.38,19.55,2.17,19.24,1.99] },
          { method: 'bezierCurveTo', data: [18.86,1.76,18.56,1.52,18.3,1.21] },
          { method: 'bezierCurveTo', data: [18.14,1.03,18.01,0.83,18,0.64] }
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
    
    // Process paths
    
    function calcDeformData( dataA, dataB ){
      var i = dataA.length,
          deformData = [];
      
      while ( i-- ) {
        
        // Catch datasets that don't match up
        if ( dataA[i] === undefined || dataB[i] === undefined ) {
          console.log('Datasets do not match');
          return;
        }
        
        deformData[i] = dataB[i] - dataA[i];
      }
      
      return deformData;
    }
    
    function calcDeformPath( pathA, pathB, fn ){
      var i = -1,
          l = pathA.length,
          deformPath = [];
      
      while ( ++i < l ) {
        
        // Catch paths that don't match up
        if ( pathA[i].method !== pathB[i].method ) {
          console.log('Points in path and deform path do not match');
          return;
        }
        
        calcDeformData( pathA[i].data, pathB[i].data, function( deformData ){
          deformPath[i] = deformData;
        });
      }
      
      fn( deformPath );
    }
    
    // Really just doing a forEach...
    
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


    function cartData( data, fn ){
      var i = data.length - 1;
      
      while ( i > 0 ) {
        
        cart(data[i-1], data[i], function(x, y){
          data[i-1] = x;
          data[i] = y;
        });
        
        i = i-2;
      }
      
      return fn( data );
    }
    
    function mergeData( dataA, dataB, factor, fn ){
      var output = [],
          i = dataA.length;
      
      while ( i-- ) {
        output[i] = dataA[i] + (factor * dataB[i]);
      }
      
      return fn( output );
    }
    
    
    // RUN
    
    var vectorPath = processPath( path, function( i, obj ){
      var vectorData = calcVectorData( obj.data );
      
      return vectorData;
    });
    
    var deformPath = processPath( shut, function( i, obj ){
      var vectorData = calcVectorData( obj.data );
      var deformData = calcDeformData( vectorPath[i], vectorData );
      
      return deformData;
    });
    
    var wisp = Object.create({
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
      clear: function(){
        while (this.saveLevel) {
          this.ctx.restore();
          this.saveLevel--;
        }
        this.ctx.clearRect( 0, 0, this.width, this.height );
        
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
        
        ctx.save();
        
        // Convert this to get style from options
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 20;
        ctx.shadowBlur = 16;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        
        ctx.translate(32, 32);
        ctx.scale(2, 2);
        
        ctx.beginPath();
				this.plot( path );
        ctx.closePath();
        
        ctx.fill();
        
        ctx.restore();
        
        return this;
      }
    });
    
    wisp.drawBody = function(){
      var ctx = this.ctx;
      
      ctx.save();
      
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 20;
      ctx.shadowBlur = 16;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      
      ctx.beginPath();
			this.plot(body);
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
      
      return this;
    };
    
    wisp.drawEyes = function( options ){
      var ctx = this.ctx,
          factor = options ? options.shut : 0 ;
      
      ctx.save();
      
      ctx.fillStyle = "rgb(255,255,255)";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'rgba(0,0,0,0)';
      
      ctx.translate(48, 20);
      
      ctx.beginPath();
      
      processPath( path, function( i, obj ){
        var vectorData = vectorPath[i],
            deformData = deformPath[i];
        
        mergeData( vectorData, deformData, factor, function(data){
          cartData(data, function(data){
            ctx[ path[i].method ].apply( ctx, data );
          });
        });
      });
      
      ctx.closePath();
      
      ctx.fill();
      ctx.restore();
      
      return this;
    };
    
    jQuery(document).ready(function(){
      
      wisp
      .init( 240, 240 )
      .translate(32, 32)
      .scale(2,2)
      .drawBody()
      .drawEyes();
      
      jQuery('body').append( wisp.node );
      
    });
