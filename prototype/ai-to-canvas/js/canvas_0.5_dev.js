// canvas.js
//
// 0.5
//
// Stephen Band
// webdev.stephband.info/canvas
//
// Methods for working with canvases.

debug = true;

//

var canvas = {
      framerate:40,
      init:     function() {
                  // Makes sure canvases have an id and stores their contexts
                  jQuery('canvas').each(function(n){
                    var id = jQuery(this).attr("id");
                    if (!id) {
                      id = "canvas_"+n;
                      jQuery(this).attr({id: id});
                    }
                    if (this.getContext) canvas.elements[id] = {ctx: this.getContext("2d")};
                  });
                  // Set animation clock to trigger frame events
                  setInterval(function(){jQuery("canvas").trigger("frame");}, canvas.framerate);
                },
      resize:   function() {
                  // Stores dimensions of canvases and maintains aspect ratio of 1:1 by setting their grid dimensions to same
                  jQuery('canvas').each(function(){
                    var id = jQuery(this).attr("id");
                    var dimensions = {
                        width:    jQuery(this).width(),
                        height:   jQuery(this).height()
                    };
                    jQuery.extend(canvas.elements[id], dimensions);
                    jQuery(this).attr(dimensions);
                  });
                },
      clear:    function (id) {
                  // How do we get dimensions from ctx only, if we wanted to pass ctx not id?
                  ctx = canvas.elements[id].ctx;
                  ctx.clearRect(0, 0, canvas.elements[id].width, canvas.elements[id].height);
                },
      draw:     function draw(ctx, shape, options, style){

                  // ctx              - object drawing context OR string #id of canvas element
                  // shape            - reference to a shape OR string name of shape in canvas.shapes
                  // options          - object - all properties optional
                  //   pos: [x, y]    - Position on canvas
                  //   ori: [x, y]    - Origin of path (relative to unscaled size)
                  //   sca: [x, y]    - Scale of path
                  //   smin: [x, y]   - Min scale of path (positive number, can't be 0)
                  //   smax: [x, y]   - Max scale of path
                  //   rot: 0-1       - Rotation of path
                  //   plot: boolean  - Gradients and patterns transformed with shape
                  //   fill: boolean  -
                  //   stroke: boolean-
                  // style            - object
                  //   fillStyle:     - "rgba(255,165,0,1)", "#ffa300", "orange", gradient, pattern
                  //   strokeStyle:   - "rgba(255,165,0,1)", "#ffa300", "orange", gradient
                  //   lineWidth: >0
                  //   lineCap:       - "butt", "round", "square"
                  //   lineJoin:      - "round", "bevel", "miter"
                  //   miterLimit:    - value
                  
                  if (typeof ctx == "string") ctx = canvas.elements[ctx].ctx;
                  
                  var pos  = options.pos;
                  var ori  = options.ori;
                  var sca  = options.sca;
                  var smin = (options.smin) ? options.smin : [0.001, 0.001] ;
                  var smax = options.smax;
                  var rot  = options.rot * 2* Math.PI;
                  
                  // Limit scale.  Don't allow to scale to 0.
                  for (i in sca) {
                    if (smin[i] > sca[i] && -smin[i] < sca[i]) sca[i] = smin[i];
                    if (smax) {
                      if (smax[i] < sca[i]) sca[i] = smax[i];
                      if (-smax[i] > sca[i]) sca[i] = -smax[i];
                    }
                  }

                  ctx.save();
                  
                  // Adjust drawing plane
                  if (pos) ctx.translate(pos[0], pos[1]);
                  if (rot) ctx.rotate(rot);
                  if (sca) ctx.scale(sca[0],sca[1]);
                  if (ori) ctx.translate(-ori[0], -ori[1]);
                  
                  // Make path
                  if (typeof shape == "string") shape = canvas.shapes[shape];
                  shape(ctx, options);
                  
                  // Reset orientation before plot
                  if (!options.plot && ori) ctx.translate(ori[0], ori[1]);     // undo translate to reset gradient position
                  if (sca)                  ctx.scale(1/sca[0], 1/sca[1]);     // undo scale
                  if (!options.plot && rot) ctx.rotate(-1*rot);                // undo rotate (reset gradient orientation)
                  if (!options.plot && pos) ctx.translate(-pos[0], -pos[1]);   // undo translate (stop gradient travel with origin)
                  
                  // Plot path
                  canvas.plot(ctx, options.fill, options.stroke, style);
                  
                  ctx.restore();

                },
      gradient: function (ctx, coords, colors) {
                  // ctx    - either the drawing context OR the id of the canvas element
                  // coords - array - 4 numbers for a linear gradient (x1,y1,x2,y2), 6 for a radial (x1,y1,r1,x2,y2,r2)
                  // colors - object - {colorPosition: value} pairs, eg. {0: white, 1:"rgba(34, 34, 78, 0.8)"}
                  // returns gradient object
                  if (typeof ctx == "string") ctx = canvas.elements[ctx].ctx;
                  var gradient;
                  if      (coords.length == 4) {gradient = ctx.createLinearGradient(coords[0], coords[1], coords[2], coords[3]);}
                  else if (coords.length == 6) {gradient = ctx.createRadialGradient(coords[0], coords[1], coords[2], coords[3], coords[4], coords[5]);}
                  else if (debug)              {alert("Gradient not created: There's a problem with the number of values you're passing to canvas.gradient in coords.");}
                  for (i in colors) {gradient.addColorStop(i, colors[i]);}
                  return gradient;
                },
      plot:     function (ctx, fill, stroke, style) {
                  if (typeof ctx == "string") ctx = canvas.elements[ctx].ctx;
                  ctx.save();
                  if (typeof style == "object" && (fill || stroke)) jQuery.extend(ctx, style);
                  if (fill) ctx.fill();
                  if (stroke) ctx.stroke();
                  ctx.restore();
                },
      elements: {},
      shapes:{
          roundedRect:  function(ctx, options){
                          
                          // options
                          //   dim: [x, y]   - dimensions
                          //   radius: >0    - radius of corners
                          //   stretch: 0-1  - how 'stretched out' corners are
                          //   random:       - adds that unexpected touch
                          
                          var width   = (options.dim) ?  options.dim[0]   :   300 ;
                          var height  = (options.dim) ?  options.dim[1]   :   150 ;
                          var radius  = (options.radius) ? options.radius :   20 ;
                          var random  = (options.random) ? options.random : false;
                          var stretch = (options.stretch || options.stretch === 0) ? options.stretch : 12 ;
                          var xstretch = 0;
                          var dig     = 10;
                          var start   = [0, 0];
                          
                          // Shall we draw the straight edges?
                          var edge = {
                              x:      (radius >= width /2) ? false: true,
                              y:      (radius >= height/2) ? false: true
                          };
                          
                          function ran() {
                            if (random)  { return (parseInt(dig*(Math.random() * 2 * random - random)))/dig; }
                            else      { return 0; }
                          };
                          
                          // Swap direction of rounded corner if they go in the way
                          if (stretch < 0) {
                            xstretch = stretch;
                            stretch = 0;
                          } 
                          
                          start = [ran(), ran()+radius]
                          
                          ctx.beginPath();
                          ctx.moveTo(start[0], start[1]);
                          if (edge.y) ctx.lineTo(ran(),ran()+height-radius);
                          ctx.bezierCurveTo( ran()-xstretch,              ran()+height-radius+stretch,  ran()+radius-stretch,       ran()+height+xstretch,        radius+ran(), ran()+height);
                          if (edge.x) ctx.lineTo(ran()+width-radius,ran()+height);
                          ctx.bezierCurveTo( ran()+width-radius+stretch,  ran()+height+xstretch,        ran()+width+xstretch,       ran()+height-radius+stretch,  ran()+width, ran()+height-radius);
                          if (edge.y) ctx.lineTo(ran()+width,ran()+radius);
                          ctx.bezierCurveTo( ran()+width+xstretch,        ran()+radius-stretch,         ran()+width-radius+stretch, ran()-xstretch,               ran()+width-radius, ran());
                          if (edge.x) ctx.lineTo(ran()+radius,ran());
                          ctx.bezierCurveTo( ran()+radius-stretch,        ran()-xstretch,               ran()-xstretch,             ran()+radius-stretch,         start[0], start[1]);
                        },
          ellipse:      function(ctx, options){
                          
                          // radius: pixels
                          // xscale: 0-1
                          // yscale: 0-1
                          // pinch: 0-1     - squares or flattens the corners, ie. no longer an ellipse
                          
                          var radius = (options.radius) ?  options.radius  :   100 ;
                          var xscale = (options.xscale) ?  options.xscale  :   1 ;
                          var yscale = (options.yscale) ?  options.yscale  :   1 ;
                          var pinch  = (options.pinch || options.pinch === 0) ? options.pinch : 0.552285 ;
                          var random = (options.random) ? options.random : false;
                          var bez = pinch*radius;
                          var x = [0, xscale*(radius-bez) ,xscale*radius, xscale*(radius+bez), xscale*2*radius];
                          var y = [0, yscale*(radius-bez) ,yscale*radius, yscale*(radius+bez), yscale*2*radius];
                          
                          function ran() {
                            if (random)  { return Math.random()*2*random - random; }
                            else         { return 0; }
                          };
                          
                          var start = [ran()+x[2],ran()+y[0]];
                          
                          ctx.beginPath();
                          ctx.moveTo(start[0], start[1]);
                          ctx.bezierCurveTo(ran()+x[3], ran()+y[0],  ran()+x[4], ran()+y[1],  ran()+x[4], ran()+y[2]);
                          ctx.bezierCurveTo(ran()+x[4], ran()+y[3],  ran()+x[3], ran()+y[4],  ran()+x[2], ran()+y[4]);
                          ctx.bezierCurveTo(ran()+x[1], ran()+y[4],  ran()+x[0], ran()+y[3],  ran()+x[0], ran()+y[2]);
                          ctx.bezierCurveTo(ran()+x[0], ran()+y[1],  ran()+x[1], ran()+y[0],  start[0],   start[1]);
                                                  
                        },
          growGrass:    function(ctx, options){
          
                          // requires vectors.js
                          
                          // start:
                          // end:
                          
                          var start = (options.start) ? options.start : [0,0] ;
                          var height = (options.height) ? options.height : 300 ;
                          var bezi1 = cart([80, 0.4]);
                          var bezi2 = cart([568, 0.3]);
                          var point = (options.end) ? options.end : [300,300] ;
                          ctx.beginPath();
                          ctx.moveTo(start[0], start[1]);
                          ctx.bezierCurveTo(bezi1[0]-point[1]/2, bezi1[1]-point[0]/3, bezi2[0], bezi2[1], point[0], point[1]);                          
                        }
      },
      gradients: {
        //blackFade:      canvas.gradient(ctx, coords, colors),
      }
    };