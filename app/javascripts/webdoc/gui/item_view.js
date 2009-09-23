
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.ItemView = $.klass(
{
  item: null,
  pageView: null,
  initialize: function(item, pageView) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      this.pageView = WebDoc.application.boardController.pageView;
    }
	this.pageView.itemViews.push(this);
    this.item = item;
    
    if (this.item.data.media_type == "drawing") {
      var newLine = WebDoc.application.svgRenderer.createPolyline(item);
      this.domNode = $(newLine);
      this.pageView.drawingDomNode.append(newLine);
    }
    else {
      this.domNode = $("<" + item.data.data.tag + "/>");
      this.domNode.css(
      {
        position: "absolute"
      })
      for (var key in item.data.data) {
        if (key == 'css') {
          this.domNode.css(item.data.data.css);
        }
        else {
          if (key == 'uuid' || key == 'ubItemType') {
            // just ignore uuid
          }
          else {
            if (key == 'innerHtml') {
              this.domNode.html(item.data.data[key]);
            }
            else {
              if (key != 'tag') {
                this.domNode.attr(key, item.data.data[key]);
              }
            }
          }
        }
      }
      this.pageView.itemDomNode.append(this.domNode.get(0));
    }
    // internal size and position are top, left width and height as float. Because in the css those values are string with px unit
    // and we need float values to marix transform.
    this.recomputeInternalSizeAndPosition();
    item.addListener(this);
  },
  
  coverPoint: function(point) {
  
    if (this.item.type() != "drawing") {
      var pointMatrix = $M([[point.x - this.position.left], [point.y - this.position.top], [1]]);
      var mat_str = this.domNode.css("-moz-transform");
      var converted_point = {};
      converted_point.x = point.x;
      converted_point.y = point.y;
      if (mat_str && mat_str != "" && mat_str.indexOf("matrix") >= 0) {
        var matrixPointsString = mat_str.substr(mat_str.indexOf("(") + 1, mat_str.length - (mat_str.indexOf("(") + 2));
        var matrixPoints = matrixPointsString.split(", ");
        var matrix = $M([[matrixPoints[0], matrixPoints[2], matrixPoints[4].replace("px", "")], [matrixPoints[1], matrixPoints[3], matrixPoints[5].replace("px", "")], [0, 0, 1]]);
        
        var convertedPointMatrix = matrix.inv().x(pointMatrix);
        
        converted_point.x = convertedPointMatrix.elements[0][0] + this.position.left;
        converted_point.y = convertedPointMatrix.elements[1][0] + this.position.top;
      }
      if (this.position.left < converted_point.x && this.position.left + this.size.width > converted_point.x) {
        if (this.position.top < converted_point.y && this.position.top + this.size.height > converted_point.y) {
          return true;
        }
      }
    }
    return false;
  },
  
  recomputeInternalSizeAndPosition: function() {
    if (this.item.data.data.css.top) {
      this.position = 
      {
        top: parseFloat(this.item.data.data.css.top.replace("px", "")),
        left: parseFloat(this.item.data.data.css.left.replace("px", ""))
      };
      this.size = 
      {
        width: parseFloat(this.item.data.data.css.width.replace("px", "")),
        height: parseFloat(this.item.data.data.css.height.replace("px", ""))
      };
    }
  },
  
  
  objectChanged: function(item) {
    this.recomputeInternalSizeAndPosition();
    this.domNode.animate(item.data.data.css, 'fast');
    if (item.data.media_type == "drawing") {
      WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), 
      {
        points: item.data.data.points
      });
    }
  },
  
  shift: function(x, y) {
    this.position.left = this.position.left + x;
    this.position.top = this.position.top + y;
    this.item.data.data.css.left = this.position.left + "px";
    this.item.data.data.css.top = this.position.top + "px";
	this.domNode.css({ top: this.item.data.data.css.top, left: this.item.data.data.css.left});
  },
  
  select: function() {
    this.domNode.addClass("wb-selected-object");
    if (!this.domNode.attr("ub:zIndex")) {
      this.domNode.attr("ub:zIndex", this.domNode.css("zIndex"));
    }
    console.log("type " + this.type());
    if (this.type() == "widget") {
      this.domNode.css(
      {
        zIndex: 2000000
      });
      if (this.domNode.attr("type") == "application/x-shockwave-flash") {
        console.log(this.domNode.id);
        var player = document.getElementById(this.domNode.id);
        player.sendEvent('PLAY');
      }
    }
  },
  
  unSelect: function() {
    this.domNode.removeClass("wb-selected-object");
    console.log("reset zindex");
    this.domNode.css("zIndex", this.domNode.attr("ub:zIndex"));
  }
  
});
