
//= require <webdoc/model/page>
//= require <webdoc/model/item>
//= require <webdoc/gui/page_view>
//= require <webdoc/gui/item_view>
//= require <webdoc/gui/drawing_view>
//= require <webdoc/gui/image_view>
//= require <webdoc/gui/text_view>
//= require <webdoc/gui/widget_view>
//= require <webdoc/controllers/drag_and_drop_controller>

/**
 * Uniboard board controller.
 **/
WebDoc.BoardController = $.klass({
  
  // private Class attributes
  _boardWrapHTML:'<div class="push-scroll layer">'+
                  '<div class="show-scroll layer">'+
                    '<div class="centering layer">'+
                      '<div></div>'+
                    '</div>'+
                  '</div>'+
                '</div>',
  _screen: jQuery('<div/>').addClass('screen layer'),
             
  // Constructor     
  initialize: function(editable, autoFit) {
    this._editable = editable;
    this._autoFit = autoFit;
    this._currentZoom = 1; 
    this._selection = [];
    this._editingItem = null;
    this._selectionListeners = [];
    this._currentPageListeners = [];
    this._currentPage = null;
    this._currentPageView = null;
    this._isInteraction = false;
    
    // used to keep trak of original board size. As WebKit doesnt autoatically resize a div when it has a scale transform
    // we resize manually the div and we need to know what was the original size to define the new size.
    this._initialSize = null;  
  },
  
  selection: function() {
    return this._selection;  
  },
  
  isEditable: function() {
    return this._editable;  
  },
  
  editingItem: function() {
    return this._editingItem;
  },
  
  addSelectionListener: function(listener) {
    this._selectionListeners.push(listener);
  },
  
  removeSelectionListener: function(listener) {
    var index = $.inArray(listener, this._selectionListeners);
    if (index > -1) {
      this._selectionListeners.splice(index, 1);
    }
  },
  
  addCurrentPageListener: function(listener) {
    this._currentPageListeners.push(listener);
  },
  
  removeCurrentPageListener: function(listener) {
    var index = $.inArray(listener, this._currentPageListeners);
    if (index > -1) {
      this._currentPageListeners.splice(index, 1);
    }
  },
  
  setCurrentPage: function(page) {
    var boardContainer = $("#board_container"),
        pageView = new WebDoc.PageView(page),
        board = pageView.domNode;
    
    $("#board").unbind();
    $(document).unbind("keydown");
    
    // Set properties
    this._currentPageView = pageView;
    this._currentZoom = 1;
    this._selection = [];
    this._currentPage = page;
    
    boardContainer
    .empty()
    .append( board )
    .wrapInner( this._boardWrapHTML )
    .prepend( this._screen );
    
    this._fireSelectionChanged();
    this._bindMouseEvent();
    
    $(document).bind("keydown", this, this._keyDown.pBind(this));
    
    this.zoom(1);
    this.setInterationMode(this._isInteraction || !this._editable);
    
    // Autofit
    if (this._autoFit && board.css("height") != "100%") {
      //update zoom to fit browser page    
      var initialHeight = board.height();
      var initialWidth = board.width();      
      var heightFactor = ($("#board_container").height() - initialHeight) / initialHeight;
      var widthFactor = ($("#board_container").width() - initialWidth) / initialWidth;      
      if (heightFactor < widthFactor) {
        this.zoom(1 + heightFactor);
      }
      else {
        this.zoom(1 + widthFactor);
      }
    }
    
    this._fireCurrentPageChanged();
    $("#current_page").html(WebDoc.application.pageEditor.currentDocument.positionOfPage(this._currentPage));
    $("#total_page").html(WebDoc.application.pageEditor.currentDocument.pages.length);
    this._currentPageView.domNode.css("display", "");
  },
  
  isInteractionMode: function() {
    return this._isInteraction;  
  },
  
  setInterationMode: function(state) {
    this._isInteraction = state;
    if (state) {
      // go to interaction mode
      this.unselectAll();
      $("#board")
      .unbind("dragenter")
      .unbind("dragover")
      .unbind("drop");
      
      this.setCurrentTool(WebDoc.application.arrowTool);
      $(".preview_hidden").hide();
      $(".item-layer").hide();
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
      $(".item-layer").show();
      $(".preview_hidden").show();
      
      $("#tb_1_utilities_preview a").text("QUICK PREVIEW");        
    }
    // TODO for FF .5 we put svg backward because pointer event is not implemented
    if (MTools.Browser.Gecko && (parseFloat(/Firefox[\/\s](\d+\.\d+)/.exec(navigator.userAgent)[1])) < 3.6) {
      ddd("FF 3.5. drawing !");
      $("#board svg").css("zIndex", this._isInteraction ? "-1" : "1000000");
    }
  },
  
  
  toggleInteractionMode: function() {  
    if (!this._isInteraction) {
      this.previousRightBarState = WebDoc.application.rightBarController.visible ? true : false;
    }
    this.setInterationMode(!this._isInteraction);
    if (!this._isInteraction && this.previousRightBarState) {
      WebDoc.application.rightBarController.showRightBar();
    }  
  },
  
  setCurrentTool: function(tool) {
    ddd(tool);
    this.currentTool = tool;
    if (this.currentTool) {
      this.currentTool.selectTool();
    }
  },
  
  moveSelectionToBack: function() {
    var item = this.selection()[0].item;
    
    this._currentPage.moveBack(item);
    item.save();
    
    return false;    
  },
  
  moveSelectionToFront: function() {
    var item = this.selection()[0].item;
    
    this._currentPage.moveFront(item);
    item.save();
    
    return false;    
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

    var calcX = (x) * (1 / this._currentZoom);
    var calcY = (y) * (1 / this._currentZoom);
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
    if (this._editingItem) {
      this._editingItem.stopEditing();
      WebDoc.application.arrowTool.enableHilight();
      jQuery('#board_container').trigger('hide-screen');
      this._editingItem = null;
    }
    
    // do nothing if new selection is equal to old selection
    if(itemViews.length == this._selection.length) {
      var selectionIsEqual = true;
      for (var i = 0; i < itemViews.length; i++) {
        if (itemViews[i] != this._selection[i]) {
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
    $.each(this._selection, function(index, itemToDeselect) {
      if (jQuery.inArray(itemToDeselect, itemViews) === -1) {
        this.unselectItemViews([itemToDeselect]);
      }
    }.pBind(this));
    
    //select wanted items
    $.each(itemViews, function(index, itemToSelect) {
      if (jQuery.inArray(itemToSelect, this._selection) == -1) {
        ddd("add item to selection");
        this._selection.push(itemToSelect);
      }
      itemToSelect.select();
    }.pBind(this));
    this._fireSelectionChanged();
  },
  
  unselectAll: function() {
    ddd("unselect all. selection size " + this._selection.length);
    this.selectItemViews([]);
  },
  
  unselectItemViews: function(itemViews) {
    ddd("unselect item views");
    var i = 0;
    for (; i < itemViews.length; i++) {
      var objectToUnSelect = itemViews[i];
      if (objectToUnSelect) {
        objectToUnSelect.unSelect();
        var index = this._selection.indexOf(objectToUnSelect);
        if (index > -1) {
          ddd("remove item from selection");
          this._selection.splice(index, 1);
        }
      }
    }
    this._fireSelectionChanged();    
  },
  
  editItemView: function(itemViewToEdit) {
    if (itemViewToEdit && itemViewToEdit.canEdit()) { 
      var node = itemViewToEdit.domNode,
          nodePos = node.position(),
          nodeWidth = node.width(),
          nodeHeight = node.height(),
          board = this._currentPageView.domNode,
          boardWidth = board.width(),
          boardHeight = board.height(),
          nodeLeft = nodePos.left,
          nodeTop = nodePos.top,
          nodeBottom = boardHeight - nodeTop - nodeHeight,
          screens = this._currentPageView.boardScreenNodes,
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
      
      this._editingItem = itemViewToEdit;  
      itemViewToEdit.edit();
                
      WebDoc.application.arrowTool.disableHilight();
      jQuery('#board').trigger('show-screen');
      return true;     
    }
    return false;
  },
  
  insertItems: function(items) {
    $.each(items, function(index, item) {           
      this._currentPage.addItem(item);
      if (!item.data.position) {
        this._currentPage.moveFront(item);  
      }
      item.isNew = true;
      item.save();
    }.pBind(this));
    
    WebDoc.application.undoManager.registerUndo(function() {
      this.removeItems(items);
    }.pBind(this));
  },
  
  removeItems: function(items) {
    $.each(items, function(index, item) {
      this._currentPage.removeItem(item);
      item.destroy();
    }.pBind(this));
    
    WebDoc.application.undoManager.registerUndo(function() {
      this.insertItems(items);
    }.pBind(this));
  },
    
  deleteSelection: function(e) {
    var deletedItems = [];
    $.each(this._selection, function(index, itemView) {
      deletedItems.push(itemView.item);
    }.pBind(this));
    this.removeItems(deletedItems);
    this._selection = [];
    this._fireSelectionChanged();
    if (e && deletedItems.length > 0) {
      e.preventDefault(); //stop keydown event
    }
  },
  
  zoom: function(factor) {
    
    var boardElement = $("#board");
    var previousZoom = this._currentZoom;
    
    this._currentZoom = this._currentZoom * factor;
    ddd("set zoom factor: " + this._currentZoom);
    
    if (jQuery.browser.mozilla) {
      boardElement.css("MozTransformOrigin", "0px 0px");
      boardElement.css("MozTransform", "scale(" + this._currentZoom + ")");
      // Directly remove the transform property so that windowed items are displayed
      if (this._currentZoom == 1) {
	      boardElement.css("MozTransformOrigin", "");
	      boardElement.css("MozTransform", "");
	    }
    }
    else 
      if (jQuery.browser.safari) {
        ddd("apply webkit transform");
        if (!this._initialSize) {
          this._initialSize = {
            width: parseFloat(boardElement.css("width").replace("px", "")) + 2,
            height: parseFloat(boardElement.css("height").replace("px", "")) + 2
          };
        }
        if (this._currentZoom > 1) {
          boardElement.css({
            width: this._initialSize.width * this._currentZoom,
            height: this._initialSize.height * this._currentZoom
          });
        }
        else {
          boardElement.css({
            width: this._initialSize.width,
            height: this._initialSize.height
          });
        }
        boardElement.css("WebkitTransformOrigin", "0px 0px");
        if (this._currentZoom == 1) {
          boardElement.css("WebkitTransform", "");
        }
        else {
          boardElement.css("WebkitTransform", "scale(" + this._currentZoom + ")");
        }
      }
  },
  
  // Private methods
    
  _mouseDown: function(e) {
    $(document).unbind("mousemove").unbind("mouseup");
    if (window.document.activeElement) {
      window.document.activeElement.blur();
    }
    if (!e.boardIgnore) {
      $(document).bind("mousemove", this, this._mouseMove.pBind(this));
      $(document).bind("mouseup", this, this._mouseUp.pBind(this));
      this.currentTool.mouseDown(e);
    }
  },
  
  _mouseMove: function(e) {
    if (!this._isInteraction) {
      e.preventDefault();
    }
    this.currentTool.mouseMove(e);
  },
  
  _mouseUp: function(e) {
    $(document).unbind("mousemove");
    $(document).unbind("mouseup");
    this.currentTool.mouseUp(e);
  },
  
  _mouseClick: function(e) {
    this.currentTool.mouseClick(e);
  },
  
  _keyDown: function(e) {
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
  
  _mouseDblClick: function(e) {
    this.currentTool.mouseDblClick(e);    
  },
  
  _mouseOver: function(e) {
    this.currentTool.mouseOver(e);    
  },

  _mouseOut: function(e) {
    this.currentTool.mouseOut(e);    
  },   
  
  _fireSelectionChanged: function() {
    $.each(this._selectionListeners, function() {
      this.selectionChanged();
    });
  },
  
  _fireCurrentPageChanged: function() {
    $.each(this._currentPageListeners, function() {
      this.currentPageChanged();
    });
  },
  
  _bindMouseEvent: function() {
    $("#board").bind("mousedown", this, this._mouseDown.pBind(this));
    $("#board").bind("click", this, this._mouseClick.pBind(this));
    $("#board").bind("dblclick", this, this._mouseDblClick.pBind(this));
    $("#board").bind("mouseover", this, this._mouseOver.pBind(this));    
    $("#board").bind("mouseout", this, this._mouseOut.pBind(this));
  }
    
  
});