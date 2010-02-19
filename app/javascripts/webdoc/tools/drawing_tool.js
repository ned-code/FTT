
/**
* @author julien
*/
//= require "tool"

WebDoc.DrawingTool = $.klass(WebDoc.Tool, {
  drawing: false,
  penColor: "black",
  penSize: "1",
  initialize: function($super, selector, boardClass) {
    
    $super( selector, boardClass );
    
    $("#colors").bind("click", jQuery.delegate({
        'a':  function(e) {
                var link = $( e.delegateTarget || e.currentTarget );
                    color = link.css("backgroundColor");
                
                ddd('[DrawingTool] Selected colour '+color);
                
                $(".state-draw-color").find("a").removeClass('current').css({
                    WebkitBoxShadow: 'none',
                    MozBoxShadow:    'none',
                    BoxShadow:       'none'
                });
                
                link
                .addClass('current')
                .css({
                    WebkitBoxShadow: '0 0 16px '+color,
                    MozBoxShadow:    '0 0 16px '+color,
                    BoxShadow:       '0 0 16px '+color
                });
                
                this.penColor = color;
                $(".draw-color").css({ backgroundColor: color });
                return false;
        }
      }, this)
    )
    
    var self = this,
        port = $('<div/>').addClass('draw-port'),
        thumb = $('<div/>').addClass('draw-color draw-size'),
        value = $('.size-slider-value');
    
    $(".size-slider")
    .slider({
      value: 2,
      min: 1,
      max: 24,
      step: 1,
      start: function(){
        //cache all instances of draw-size on slide start
        thumb = $(".draw-size");
      },
      slide: function(event, ui) {
        var handle = $(ui.handle),
            demival = ui.value/2;
        
        value.val(ui.value+'px');
        self.penSize = ui.value;
        
        thumb
        .css({
          marginLeft: -demival,
          marginTop: -demival,
          WebkitBorderRadius: demival,
          MozBorderRadius: demival,
          borderRadius: demival,
          width: ui.value,
          height: ui.value
        })
      }
    })
    .find('.ui-slider-handle')
    .append(
      port.append(
        thumb
      )
    )
    .append(
      value
    );
    
    value.val( $(".size-slider").slider("value")+'px' );
    
    $("#sizes").bind("click", function(event) {
      var link = $(event.target).closest('a')[0];
      if (link) {
        event.preventDefault();
        this.penSize = $(link).attr("href");
      }
    }.pBind(this));    
  },

  selectTool: function($super) {
    $super();
    WebDoc.application.boardController.unselectAll();
    WebDoc.application.rightBarController.showItemInspector();
    WebDoc.application.inspectorController.selectPalette(2);
  },
  
  mouseDown: function(e) {
    e.preventDefault();
    this.drawing = true;
    this.beginDraw(e);
  },

  mouseMove: function(e) {
    e.preventDefault();
    if (this.drawing) {
      this.draw(e);
    }
  },

  mouseUp: function(e) 
  {
    e.preventDefault();
    this.drawing = false;
    this.endDraw(e);
  },

  beginDraw: function(e) {
    var uuid = new MTools.UUID();
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    ddd("begin draw at point " + mappedPoint.x + ":" + mappedPoint.y);

    this.currentDrawObject = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    this.currentDrawObject.data.media_type = WebDoc.ITEM_TYPE_DRAWING;
    this.currentDrawObject.data.data.css = {
      zIndex: 2000
    };
    this.currentDrawObject.data.data.stroke = this.penColor;
    this.currentDrawObject.data.data.strokeWidth = this.penSize;
    this.currentDrawObject.data.data.points = mappedPoint.x + "," + mappedPoint.y;
    WebDoc.application.pageEditor.currentPage.addItem(this.currentDrawObject);

    var drawObjectToUndo = this.currentDrawObject;
    var that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._removePolyLine(drawObjectToUndo);
    });
  },

  endDraw: function(e) {
    this.currentDrawObject.save();
  },

  draw: function(e) {
    var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
    this.currentDrawObject.setPoints(this.currentDrawObject.data.data.points += " " + mappedPoint.x + "," + mappedPoint.y);
  },

  _removePolyLine: function(drawObject) {
    WebDoc.application.pageEditor.currentPage.removeItem(drawObject);    
    that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._addPolyLine(drawObject);
    });
    drawObject.destroy();
  },

  _addPolyLine: function(drawObject) {
    WebDoc.application.pageEditor.currentPage.addItem(drawObject);
    drawObject.isNew = true;
    that = this;
    WebDoc.application.undoManager.registerUndo(function() {
      that._removePolyLine(drawObject);
    });
    drawObject.save();
  }
});
