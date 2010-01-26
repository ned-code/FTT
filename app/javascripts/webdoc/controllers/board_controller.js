/**
 * Uniboard board controller
 **/
//= require <webdoc/model/page>
//= require <webdoc/model/item>
//= require <webdoc/gui/page_view>
//= require <webdoc/gui/item_view>
//= require <webdoc/gui/drawing_view>
//= require <webdoc/gui/image_view>
//= require <webdoc/gui/text_view>
//= require <webdoc/gui/widget_view>
//= require <webdoc/controllers/drag_and_drop_controller>

(function(WebDoc, undefined){

// VAR

var boardWrapHTML = '<div class="push-scroll layer">'+
            '<div class="show-scroll layer">'+
                '<div class="centering layer">'+
                    '<div></div>'+
                '</div>'+
            '</div>'+
        '</div>',
    screen = jQuery('<div/>').addClass('screen layer');

// EXTEND

WebDoc.BoardController = $.klass({
  initialize: function(editable, autoFit) {
    this.editable = editable;
    this.autoFit = autoFit;
    this.currentZoom = 1; 
    this.selection = [];
    this.editingItem = null;
    this.selectionListeners = [];
    this.currentPageListeners = [];
  },
  
  addSelectionListener: function(listener) {
    this.selectionListeners.push(listener);
  },
  
  removeSelectionListener: function(listener) {
    var index = $.inArray(listener, this.selectionListeners);
    if (index > -1) {
      this.selectionListeners.splice(index, 1);
    }
  },
  
  fireSelectionChanged: function() {
    $.each(this.selectionListeners, function() {
      this.selectionChanged();
    });
  },
  
  addCurrentPageListener: function(listener) {
    this.currentPageListeners.push(listener);
  },
  
  removeCurrentPageListener: function(listener) {
    var index = $.inArray(listener, this.currentPageListeners);
    if (index > -1) {
      this.currentPageListeners.splice(index, 1);
    }
  },
  
  fireCurrentPageChanged: function() {
    $.each(this.currentPageListeners, function() {
      this.currentPageChanged();
    });
  },  
  
  setCurrentPage: function(page) {
    var boardContainer = $("#board_container"),
        pageView = new WebDoc.PageView(page),
        board = pageView.domNode;
    
    $("#board").unbind();
    $(document).unbind("keydown");
    
    // Set properties
    this.pageView = pageView;
    this.currentZoom = 1;
    this.selection = [];
    this.currentPage = page;
    
    boardContainer
    .empty()
    .append( board )
    .wrapInner( boardWrapHTML )
    .prepend( screen );
    
    this.initialHeight = board.height();
    this.initialWidth = board.width();
    this.fireSelectionChanged();
    this.bindMouseEvent();
    
    $(document).bind("keydown", this, this.keyDown.pBind(this));
    
    this.zoom(1);
    if (this.isInteraction || !this.editable) {
      this.setInterationMode(true);
    }    
    else {
      this.setInterationMode(false);
    }
    
    // Autofit
    if (this.autoFit && board.css("height") != "100%") {
      //update zoom to fit browser page    
      var heightFactor = ($("#board_container").height() - this.initialHeight) / this.initialHeight;
      var widthFactor = ($("#board_container").width() - this.initialWidth) / this.initialWidth;      
      if (heightFactor < widthFactor) {
        this.zoom(1 + heightFactor);
      }
      else {
        this.zoom(1 + widthFactor);
      }
    }
    
    this.fireCurrentPageChanged();
    $("#current_page").html(WebDoc.application.pageEditor.currentDocument.positionOfPage(this.currentPage));
    $("#total_page").html(WebDoc.application.pageEditor.currentDocument.pages.length);
    this.pageView.domNode.css("display", "");
  },
  
  bindMouseEvent: function() {
    $("#board").bind("mousedown", this, this.mouseDown.pBind(this));
    $("#board").bind("mouseout", this, this.mouseOut.pBind(this));
    $("#board").bind("click", this, this.mouseClick.pBind(this));
    $("#board").bind("dblclick", this, this.mouseDblClick.pBind(this));
    $("#board").bind("mouseover", this, this.mouseOver.pBind(this));    
    $("#board").bind("mouseout", this, this.mouseOut.pBind(this));
  },
  
  unbindMouseEvent: function() {
    $("#board").unbind();
  },  
  
  setInterationMode: function(state) {
    this.isInteraction = state;
    if (state) {
      // go to interaction mode
      this.unselectAll();
      $("#board")
      .unbind("dragenter")
      .unbind("dragover")
      .unbind("drop");
      
      this.setCurrentTool(WebDoc.application.arrowTool);
      $(".preview_hidden").hide();
      
      $("body").removeClass("edit-mode");
      
      $("#tb_1_utilities_preview a").text("EDIT MODE");
      WebDoc.application.rightBarController.hideRightBar();
    }
    else {
      // go to non interaction mode
      $("#board")
      .bind("dragenter", this, WebDoc.DrageAndDropController.dragEnter)
      .bind("dragover", this, WebDoc.DrageAndDropController.dragOver)
      .bind("drop", this, WebDoc.DrageAndDropController.drop);      
      
      if (!this.currentTool) {
        this.setCurrentTool(WebDoc.application.arrowTool);
      }
      
      $("body").addClass("edit-mode");
      
      $(".preview_hidden").show();
      
      $("#tb_1_utilities_preview a").text("QUICK PREVIEW");        
    }
    // TODO for FF .5 we put svg backward because pointer event is not implemented
    if (MTools.Browser.Gecko && (new Number(/Firefox[\/\s](\d+\.\d+)/.exec(navigator.userAgent)[1])) < 3.6) {
      ddd("FF 3.5. drawing !");
      $("#board svg").css("zIndex", this.isInteraction ? "-1" : "1000000");
    }
  },
  
  
  toggleInteractionMode: function() {  
    if (!this.isInteraction) {
      this.previousRightBarState = WebDoc.application.rightBarController.visible ? true : false;
    }
    this.setInterationMode(!this.isInteraction);
    if (!this.isInteraction && this.previousRightBarState) {
      WebDoc.application.rightBarController.showRightBar();
    }  
  },
  
  centerBoard: function() {

  },
  
  setCurrentTool: function(tool) {
    ddd(tool);
    this.currentTool = tool;
    if (this.currentTool) {
      this.currentTool.selectTool();
    }
    // this.unselectItemViews(this.selection);
  },
  
  mapToPageCoordinate: function(position) {
    var x, y, board = $("#board"), boardContainer = $("#board_container");
    
    if (position.x) {
      x = position.x - board.offset().left;
      y = position.y - board.offset().top;
    }
    else {
      x = position.pageX - board.offset().left;
      y = position.pageY - board.offset().top;
    }   
    if (MTools.Browser.WebKit) { 
      // Correct mouse vertical position according to the cursor icon height
      y += this.currentTool.getCursorHeight();
    }

    var calcX = (x) * (1 / this.currentZoom);
    var calcY = (y) * (1 / this.currentZoom);
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
    $("#board_container").get(0).scrollTop = 0;
    $("#board_container").get(0).scrollLeft = 0;
  },
  
  selectItemViews: function(itemViews) {
    // exit edit mode for current editing item
    if (this.editingItem) {
      this.editingItem.stopEditing();
      WebDoc.application.arrowTool.enableHilight();
      jQuery('#board_container').trigger('hide-screen');
      this.editingItem = null;
    }
    
    // do nothing if new selection is equal to old selection
    if(itemViews.length == this.selection.length) {
      var selectionIsEqual = true;
      for (var i = 0; i < itemViews.length; i++) {
        if (itemViews[i] != this.selection[i]) {
          selectionIsEqual = false;
          break;
        }
      }
      if (selectionIsEqual) {
        return;
      }
    }
    
    //deselect un-needed items
    ddd("select item in view");
    $.each(this.selection, function(index, itemToDeselect) {
      if (jQuery.inArray(itemToDeselect, itemViews) === -1) {
        this.unselectItemViews([itemToDeselect]);
      }
    }.pBind(this));
    
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
    ddd("unselect all. selection size " + this.selection.length);
    this.selectItemViews([]);
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
    this.fireSelectionChanged();    
  },
  
  editItemView: function(itemViewToEdit) {
    if (itemViewToEdit && itemViewToEdit.canEdit()) { 
      var node = itemViewToEdit.domNode,
          nodePos = node.position(),
          nodeWidth = node.width(),
          nodeHeight = node.height(),
          board = itemViewToEdit.pageView.domNode,
          boardWidth = board.width(),
          boardHeight = board.height(),
          nodeLeft = nodePos.left,
          nodeTop = nodePos.top,
          nodeBottom = boardHeight - nodeTop - nodeHeight,
          screens = itemViewToEdit.pageView.boardScreenNodes,
          screenTop = screens.eq(0),
          screenBottom = screens.eq(1),
          screenLeft = screens.eq(2),
          screenRight = screens.eq(3);
      
      // Adjust the dimensions of the four screens surrounding the edited block
      screenTop.css({
          bottom: boardHeight - nodeTop
      });
      screenBottom.css({
          top: nodeTop + nodeHeight
      });
      screenLeft.css({
          right: boardWidth - nodeLeft,
          top: nodeTop,
          bottom: nodeBottom
      });
      screenRight.css({
          left: nodeLeft + nodeWidth,
          top: nodeTop,
          bottom: nodeBottom
      });
      
      this.editingItem = itemViewToEdit;  
      itemViewToEdit.edit();
                
      WebDoc.application.arrowTool.disableHilight();
      jQuery('#board').trigger('show-screen');     
    }
  },
  
  deleteSelection: function(e) {
    var deletedItems = [];
    $.each(this.selection, function(index, itemView) {
      deletedItems.push(itemView.item);
    }.pBind(this));
    this.removeItems(deletedItems);
    this.selection = [];
    this.fireSelectionChanged();
    if (e && deletedItems.length > 0) {
      e.preventDefault(); //stop keydown event
    }
  },
  
  zoom: function(factor) {
  
    var previousZoom = this.currentZoom;
    this.currentZoom = this.currentZoom * factor;
    ddd("set zoom factor: " + this.currentZoom);
    var boardElement = $("#board");
    
    if (jQuery.browser.mozilla) {
      boardElement.css("MozTransformOrigin", "0px 0px");
      boardElement.css("MozTransform", "scale(" + this.currentZoom + ")");
      // Directly remove the transform property so that windowed items are displayed
      if (this.currentZoom == 1) {
	      boardElement.css("MozTransformOrigin", "");
	      boardElement.css("MozTransform", "");
	    }
    }
    else 
      if (jQuery.browser.safari) {
        ddd("apply webkit transform");
        if (!this.initialSize) {
          this.initialSize = {
            width: parseFloat(boardElement.css("width").replace("px", "")) + 2,
            height: parseFloat(boardElement.css("height").replace("px", "")) + 2
          };
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
        if (this.currentZoom == 1) {
          boardElement.css("WebkitTransform", "");
        }
        else {
          boardElement.css("WebkitTransform", "scale(" + this.currentZoom + ")");
        }
      }
      else 
        if (jQuery.browser.msie) {
          ddd("apply ie transform " + this.currentZoom + " " + this.initialWidth * this.currentZoom + " " + this.initialHeight * this.currentZoom);
          if ((previousZoom >= 1 && factor > 1) || (this.currentZoom >= 1 && factor < 1)) {
            boardElement.css("width", this.initialWidth * this.currentZoom);
            boardElement.css("height", this.initialHeight * this.currentZoom);
          }
          boardElement.css("filter", "progid:DXImageTransform.Microsoft.Matrix(M11='" + this.currentZoom + "',M21='0', M12='0', M22='" + this.currentZoom + "', sizingmethod='autoexpand')");
        }
  },
  
  mouseDown: function(e) {
    $(document).unbind("mousemove").unbind("mouseup");
    if (window.document.activeElement) {
      window.document.activeElement.blur();
    }
//    if (!this.isInteraction) {
//      e.preventDefault();
//    }
    if (!e.boardIgnore) {
      $(document).bind("mousemove", this, this.mouseMove.pBind(this));
      $(document).bind("mouseup", this, this.mouseUp.pBind(this));
      this.currentTool.mouseDown(e);
    }
  },
  
  mouseMove: function(e) {
    if (!this.isInteraction) {
      e.preventDefault();
    }
    this.currentTool.mouseMove(e);
  },
  
  mouseOut: function(e) {
    //e.preventDefault();
    this.currentTool.mouseOut(e);
  },
  
  mouseUp: function(e) {
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
//    if (!this.isInteraction) {
//      e.preventDefault();
//    }
    this.currentTool.mouseUp(e);
  },
  
  mouseClick: function(e) {
    this.currentTool.mouseClick(e);
  },
  
  keyDown: function(e) {
    var el = $(e.target);
    if (el.is('input') || el.is('textarea')) { 
      return;
    }
    switch (e.which) {
      case 8:
      case 46:
        this.deleteSelection(e);
        break;
      case 90:
        this.zoomIn();
        break;
      case 85:
        this.zoomOut();
        break;
      case 84:
        this.setCurrentTool(WebDoc.application.textTool);
        break;
      case 80:
        this.setCurrentTool(WebDoc.application.drawingTool);
        break;
      case 65:
        this.setCurrentTool(WebDoc.application.arrowTool);
        break;
    }
  },
  
  mouseDblClick: function(e) {
    this.currentTool.mouseDblClick(e);    
  },
  
  mouseOver: function(e) {
    this.currentTool.mouseOver(e);    
  },
  
  mouseOut: function(e) {
    this.currentTool.mouseOut(e);    
  },  
  
  insertItems: function(items) {
    $.each(items, function(index, item) {           
      this.currentPage.addItem(item);
      if (!item.data.position) {
        this.currentPage.moveFront(item);  
      }
      item.isNew = true;
      item.save();
    }.pBind(this));
    
    /*
    if (items.length > 0) {
      var itemViewToSelect = this.pageView.itemViews[items[0].uuid()];
      this.selectItemViews([itemViewToSelect]);
    }
    */
    
    WebDoc.application.undoManager.registerUndo(function() {
      this.removeItems(items);
    }.pBind(this));
  },
  
  removeItems: function(items) {
    $.each(items, function(index, item) {
      this.currentPage.removeItem(item);
      item.destroy();
    }
.pBind(this));
    
    WebDoc.application.undoManager.registerUndo(function() {
      this.insertItems(items);
    }
.pBind(this));
  }
  
});


})(WebDoc);