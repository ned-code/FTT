/**
 * Uniboard board controller
 **/
//= require <WebDoc/model/page>
//= require <WebDoc/model/item>
//= require <WebDoc/gui/page_view>
//= require <WebDoc/gui/item_view>
//= require <WebDoc/controllers/collaboration_controller>  

WebDoc.BoardController = $.klass({
  initialize: function(editable) {
    this.currentZoom = 1;
    this.selection = [];
    this.selectionListeners = [];
  },
  
  addSelectionListener: function(listener) {
    this.selectionListeners.push(listener);
  },
  
  fireSelectionChanged: function() {
    $.each(this.selectionListeners, function() {
      this.selectionChanged();
    });
  },
  
  setCurrentPage: function(page) {
    // remove previous page
    $("#board_container").empty();
    // add the new one
    this.pageView = new WebDoc.PageView(page);
    $("#board_container").append(this.pageView.domNode);
    
    // re-init internal working attributes
    $("#board_container").get(0).scrollTop = 0;
    $("#board_container").get(0).scrollLeft = 0;
    this.currentZoom = 1;
    this.selection = [];
    this.fireSelectionChanged();
    this.currentPage = page;
    
    this.initialHeight = $("#board").height();
    this.initialWidth = $("#board").width();
    
    $("#board").bind("mousedown", this, this.mouseDown.pBind(this));
    $("#board").bind("mousemove", this, this.mouseMove.pBind(this));
    $("#board").bind("mouseup", this, this.mouseUp.pBind(this));
    $("#board").bind("mouseout", this, this.mouseOut.pBind(this));
    $("#board").bind("click", this, this.mouseClick.pBind(this));
    
    // update data attribute of object
    $("object").each(function() {
      var relPath = $(this).attr("data");
      $(this).attr("data", relPath);
    });
    
    //update zoom to fit browser page
    
    heightFactor = ($("#board_container").height() - this.initialHeight) / this.initialHeight;
    widthFactor = ($("#board_container").width() - this.initialWidth) / this.initialWidth;
    
    if (heightFactor < widthFactor) {
      this.zoom(1 + heightFactor);
    }
    else {
      this.zoom(1 + widthFactor);
    }
  },
  
  setCurrentTool: function(tool) {
    console.log(tool);
    this.currentTool = tool;
    this.currentTool.selectTool();
    // this.unselectItemViews(this.selection);
  },
  
  mapToPageCoordinate: function(position) {
    var x, y;
    if (position.x) {
      x = position.x - $("#board_container").offset().left;
      y = position.y - $("#board_container").offset().top;
    }
    else {
      x = position.pageX - $("#board_container").offset().left;
      y = position.pageY - $("#board_container").offset().top;
    }
    
    var calcX = (x + $("#board_container").get(0).scrollLeft) * (1 / this.currentZoom);
    var calcY = (y + ($("#board_container").get(0).scrollTop)) * (1 / this.currentZoom);
    return {
      x: calcX,
      y: calcY
    };
  },
  
  
  zoomIn: function(e) {
    this.zoom(1.5);
  },
  
  zoomOut: function(e) {
    this.zoom(1 / 1.5);
  },
  
  selectItemViews: function(itemViews) {
    //deselect un-needed items
    ddd("select item in view");
    $.each(this.selection, function(index, itemToDeselect) {
      if (jQuery.inArray(itemToDeselect, itemViews) === -1) {
        this.unselectItemViews([itemToDeselect]);
      }
    }.pBind(this))
    
    //select wanted items
    $.each(itemViews, function(index, itemToSelect) {
      if (jQuery.inArray(itemToSelect, this.selection) == -1) {
        ddd("add item to selection");
        this.selection.push(itemToSelect);
      }
      itemToSelect.select();
    }.pBind(this));
    this.fireSelectionChanged();
  },
  
  unselectAll: function() {
    console.log("unselect all. selection size " + this.selection.length);
    this.unselectItemViews(this.selection);
    this.fireSelectionChanged();
  },
  
  unselectItemViews: function(itemViews) {
    ddd("unselect item views");
    var i = 0;
    for (; i < itemViews.length; i++) {
      var objectToUnSelect = itemViews[i];
      if (objectToUnSelect) {
        objectToUnSelect.unSelect();
        var index = this.selection.indexOf(objectToUnSelect);
        if (index > -1) {
          ddd("remove item from selection");
          this.selection.splice(index, 1);
        }
      }
    }
  },
  
  zoom: function(factor) {
    var previousZoom = this.currentZoom;
    this.currentZoom = this.currentZoom * factor;
    console.log("set zoom factor: " + this.currentZoom);
    var boardElement = $("#board");
    
    
    if (jQuery.browser.mozilla) {
      boardElement.css("MozTransformOrigin", "0px 0px");
      boardElement.css("MozTransform", "scaleX(" + this.currentZoom + ") scaleY(" + this.currentZoom + ")");
    }
    else 
      if (jQuery.browser.safari) {
        console.log("apply webkit transform");
        if (!this.initialSize) {
          this.initialSize = {
            width: parseFloat(boardElement.css("width").replace("px", "")) + 2,
            height: parseFloat(boardElement.css("height").replace("px", "")) + 2
          }
        }
        if (this.currentZoom > 1) {
          boardElement.css({
            width: this.initialSize.width * this.currentZoom,
            height: this.initialSize.height * this.currentZoom
          });
        }
        else {
          boardElement.css({
            width: this.initialSize.width,
            height: this.initialSize.height
          });          
        }
        boardElement.css("WebkitTransformOrigin", "0px 0px");
        boardElement.css("WebkitTransform", "scaleX(" + this.currentZoom + ") scaleY(" + this.currentZoom + ")");
      }
      else 
        if (jQuery.browser.msie) {
          console.log("apply ie transform " + this.currentZoom + " " + this.initialWidth * this.currentZoom + " " + this.initialHeight * this.currentZoom);
          if ((previousZoom >= 1 && factor > 1) || (this.currentZoom >= 1 && factor < 1)) {
            boardElement.css("width", this.initialWidth * this.currentZoom);
            boardElement.css("height", this.initialHeight * this.currentZoom);
          }
          boardElement.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11='" + this.currentZoom + "',M21='0', M12='0', M22='" + this.currentZoom + "', sizingmethod='autoexpand')");
        }
  },
  
  mouseDown: function(e) {
    e.preventDefault();
    if (!e.boardIgnore) {
      this.currentTool.mouseDown(e);
    }
  },
  
  mouseMove: function(e) {
    e.preventDefault();
    this.currentTool.mouseMove(e);
  },
  
  mouseOut: function(e) {
    e.preventDefault();
    this.currentTool.mouseOut(e);
  },
  
  mouseUp: function(e) {
    e.preventDefault();
    this.currentTool.mouseUp(e);
  },
  
  mouseClick: function(e) {
    e.preventDefault();
    this.currentTool.mouseClick(e);
  }
  
});
