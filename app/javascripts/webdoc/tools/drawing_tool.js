/**
* @author julien
*/
//= require "tool"

WebDoc.DrawingTool = $.klass(WebDoc.Tool, {
  drawing: false,
  penColor: "black",
  penSize: "1",
  themeColorsNode: jQuery('<ul/>', {'class': "ui-block spaceless icons-only thumbs colors-index index"}),
  
  initialize: function($super, selector, boardClass) {
    
    $super( selector, boardClass );
    
    this.colorsNode = jQuery("#colors");
    
    WebDoc.application.boardController.themeNode.bind( 'load', this.makeThemeColors.pBind(this) );
    
    jQuery('#draw-inspector').bind("click", jQuery.delegate({
        '.colors-index a':  function(e) {
                var link = $( e.target ).closest('a');
                    color = link.css("color");                
                
                ddd('[DrawingTool] Selected colour '+color);
                
                jQuery(".state-draw-color").removeClass('current');
                link.addClass('current');
                
                this.penColor = color;
                $(".draw-color").css({ backgroundColor: color });
                return false;
        }
      }, this)
    );
    
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
  
  _themeColorsState: false, // true when in the DOM
  
  makeThemeColors: function(){
    var themeColors = new WebDoc.ClassList( 'theme_color_', 'backgroundColor' ),
        previousThemeClass = WebDoc.application.boardController.previousThemeClass,
        currentThemeClass = WebDoc.application.boardController.currentThemeClass,
        html = '',
        state = this._themeColorsState,
        className;
    
    for ( className in themeColors.getClasses() ) {
      html += '<li><a href="#draw-color" class="state-draw-color '+className+'" title="Theme color"></a></li>';
    }
    
    if (previousThemeClass) {
      this.themeColorsNode.removeClass( previousThemeClass );
    }
    
    this.themeColorsNode.addClass( currentThemeClass );
    
    if ( html === '' ) {
      if (state) {
        this.themeColorsNode.remove();
        this._themeColorsState = false;
      }
    }
    else {
      this.themeColorsNode
      .html( html );
      if (!state) {
        this.themeColorsNode.insertAfter( this.colorsNode );
        this._themeColorsState = true;
      }
    }
  },
  
  selectTool: function($super) {
    $super();
    WebDoc.application.boardController.unselectAll();
    WebDoc.application.rightBarController.showItemInspector();
    WebDoc.application.inspectorController.selectInspector('DrawingInspectorGroup');
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
    var uuid = new WebDoc.UUID();
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
