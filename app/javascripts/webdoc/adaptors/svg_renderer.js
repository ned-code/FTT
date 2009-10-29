/**
 * SVG implementation of polyline adaptor. Polyline adaptor allow to to decouplate the drawing of polylines from the tehnology that display the polylines.
 * This implementation use SVG to draw the polyline.
 **/
WebDoc.SvgRenderer = $.klass(
{
  initialize: function(initialDrawing) {
    // TODO set this as class attribute
    this.svgNS = "http://www.w3.org/2000/svg";
  },
  
  /**
   * Return the dom  node in wich polylines will be added
   * @param {Object} width
   * @param {Object} height
   */
  createSurface: function(width, height) {
    var surface = document.createElementNS(this.svgNS, "svg");
    if (!width) {
      width = "100%";
    }
    if (!height) {
      height = "100%";
    }
    surface.setAttribute("style", "position: relative; top:0x; left:0px; width:" + width + "; height:" + height);
    var defs = document.createElementNS(this.svgNS, "defs");
    var marker = document.createElementNS(this.svgNS, "marker");
    marker.setAttribute("id", "myMarker");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerUnits", "userSpaceOnUse");
    marker.setAttribute("orient", "0");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    
    
    var rect = document.createElementNS(this.svgNS, "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "10");
    rect.setAttribute("height", "10");
    rect.setAttribute("fill", "red");
    $(defs).append(marker);
    $(marker).append(rect);
    $(surface).append(defs);
    return surface;
  },
  
  /**
   * Clear the drawing surface. All polylines are removed
   * @param {Object} surface
   */
  clearSurface: function(surface) {
    ddd(surface);
    while (surface.firstChild) {
      var element = surface.firstChild;
      surface.removeChild(element);
    }
  },
  
  /**
   * Create the dom element that correspond to item. DOM element is <b>not</b> added to a surface. 
   * @param {Object} item polyline item
   */
  createPolyline: function(item) {
    var result = document.createElementNS(this.svgNS, "polyline");
    item.data.data.tag = "polyline";
    
    result.setAttribute("id", item.uuid());
    $(result).css(item.data.data.css);
    result.setAttribute("fill", "none");
    result.setAttribute("stroke", item.data.data.stroke);
    result.setAttribute("stroke-width", item.data.data.strokeWidth);
    result.setAttribute("transform", item.data.data.transform);
    if (item.data.data.points) {
      result.setAttribute("points", item.data.data.points);
    }
    item.domNode = $(result);
    return result;
  },
  
  /**
   * Update a polyline DOM element with vaue from the polyline item.
   * @param {Object} line
   * @param {Object} properties
   */
  updatePolyline: function(line, properties) {

    if (properties.points) {
      line.setAttribute("points", properties.points);
    }
    if (properties.id) {
      line.setAttribute("id", properties.id);
    }
    if (properties.color) {
      result.setAttribute("stroke", item.data.data.stroke);
    }
    if (properties.width) {
      result.setAttribute("stroke-width", item.data.data.strokeWidth);
    }
  }
});
