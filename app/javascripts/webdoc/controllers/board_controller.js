
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
    this.boardContainerNode = $("#board_container");
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
    this._isMovingSelection = false;
    
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
    var pageView = new WebDoc.PageView(page),
        board = pageView.domNode;
    
    $("#board").unbind();
    $(document).unbind("keydown", this._keyDown);
    $(document).unbind("keypress", this._keyPress);
    $(document).unbind("keyup", this._keyUp);
    
    // Set properties
    if (this._currentPageView) {
      this._currentPageView.destroy();
    }
    this._currentPageView = pageView;
    this._currentZoom = 1;
    this._selection = [];
    this._currentPage = page;
    
    this.boardContainerNode
    .empty()
    .append( board )
    .wrapInner( this._boardWrapHTML )
    .prepend( this._screen );
    
    this._fireSelectionChanged();
    this._bindMouseEvent();
    
    $(document).bind("keypress", this, jQuery.proxy(this, "_keyPress"));
    $(document).bind("keydown", this, jQuery.proxy(this, "_keyDown"));
    $(document).bind("keyup", this, jQuery.proxy(this, "_keyUp"));    
    
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
    
    //if (WebDoc.application.) {
      this._fireCurrentPageChanged();
    //}
    
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
    var selectionLength = this.selection().length;    
    for (var i = 0; i < selectionLength; i++) {
      var anItem = this.selection()[i].item; 
      var previousPosition = anItem.positionZ();     
      this._currentPage.moveBack(anItem);
      anItem.save();
      WebDoc.application.undoManager.registerUndo(function() {
        this._setItemPositionZ(anItem, previousPosition);
      }.pBind(this));
    }
  },
  
  moveSelectionToFront: function() {
    var selectionLength = this.selection().length;
    for (var i = 0; i < selectionLength; i++) {
      var anItem = this.selection()[i].item; 
      var previousPosition = anItem.positionZ();     
      this._currentPage.moveFront(anItem);
      anItem.save();
      WebDoc.application.undoManager.registerUndo(function() {
        this._setItemPositionZ(anItem, previousPosition);
      }.pBind(this));      
    }    
  },
  
  copySelection: function() {
    var selectionLength = this.selection().length;
    var itemsDataArray = [];    
    for (var i=0; i < selectionLength; i++) {
      var anItem = this.selection()[i].item;
      itemsDataArray.push(anItem.getData());
    }    
    WebDoc.application.pasteBoardManager.putIntoPasboard("application/ub-item", $.toJSON(itemsDataArray));
  },
  
  paste: function() {
    if (!WebDoc.application.pasteBoardManager.isEmpty()) {
      var itemsString = WebDoc.application.pasteBoardManager.getFromPasteBoard("application/ub-item");
      var newItems = [];
      if (itemsString) {
        var items = $.evalJSON(itemsString);
        for (var i = 0; i < items.length; i++) {
          var anItem = new WebDoc.Item({
            item: items[i]
          });
          var newItem = anItem.copy();
          newItems.push(newItem);
        }
        this.insertItems(newItems);
      }
    }
  },
  
  activateEventCatcher: function(active) {
    if (this._currentPageView) {
      if (active) {
        this._currentPageView.eventCatcherNode.show();
      }
      else {
        this._currentPageView.eventCatcherNode.hide();
      }
    }
  },
  
  mapToPageCoordinate: function(position) {
    var x, y, board = $("#board");
    
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
      // This doesn't work with a pen, as you can't change the registration point
      // of the cursor.
      y += this.currentTool.getCursorHeight();
    }

    var calcX = (x) * (1 / this._currentZoom);
    var calcY = (y) * (1 / this._currentZoom);
    return {
      x: calcX,
      y: calcY
    };
  },
  
  getBoardCenterPoint: function() {
    var x, y, board = $("#board");
    
    x = board.width() / 2;
    y = board.height() / 2;
    
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
  
  moveSelection: function(direction, scale) {
    var max = this._selection.length;
    var offsetSize = scale == "big"? 15 : 1;
    for (var i = 0; i < max; i++) {
      var item = this._selection[i].item;
      var offset = { top: 0, left: 0};
      switch (direction) {
        case "left":
          offset.left -= offsetSize;
          break;
        case "right":
          offset.left += offsetSize;
          break;
        case "up":
          offset.top -= offsetSize;
          break;
        case "down":
          offset.top += offsetSize;
          break;                              
      }
      if (!this._isMovingSelection) {
        var currentPosition = {top: item.data.data.css.top, left: item.data.data.css.left};
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restorePosition(item, currentPosition);
        });
      }      
      item.shiftBy(offset);      
    }
    this._isMovingSelection = true;
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
          nodeLeft = nodePos.left,
          nodeTop = nodePos.top,
          nodeWidth = node.width(),
          nodeHeight = node.height(),
          board = this._currentPageView.domNode,
          boardWidth = board.width(),
          boardHeight = board.height(),
          screens = this._currentPageView.boardScreenNodes,
          screenTop = screens.eq(0),
          screenBottom = screens.eq(1),
          screenLeft = screens.eq(2),
          screenRight = screens.eq(3);
      
      // Adjust the dimensions of the four screens surrounding the edited block
      screenTop.css({
          height: nodeTop
      });
      screenBottom.css({
          top: nodeTop + nodeHeight,
          height: boardHeight - nodeTop - nodeHeight
      });
      screenLeft.css({
          width: nodeLeft,
          top: nodeTop,
          height: nodeHeight
      });
      screenRight.css({
          left: nodeLeft + nodeWidth,
          width: boardWidth - nodeLeft - nodeWidth,
          top: nodeTop,
          height: nodeHeight
      });
      
      this._editingItem = itemViewToEdit;  
      itemViewToEdit.edit();
                
      WebDoc.application.arrowTool.disableHilight();
      jQuery('#board').trigger('show-screen');
      return true;     
    }
    return false;
  },
  
  insertImage: function(imageUrl, position) {
    var image = document.createElement('img'); /* Preload image in order to have width and height parameters available */
    $(image).bind("load", position, this._createImageItemAfterLoad); /* WebDoc.Item creation will occur after image load*/
    image.src = imageUrl;
  },
  
  insertWidget: function(widgetData, position) {
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);

    if (widgetData.properties.width) {
      width = widgetData.properties.width;
      height = widgetData.properties.height;
    }
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.media_id = widgetData.id;
    newItem.data.data.tag = "iframe";
    newItem.data.data.src = widgetData.properties.index_url;
    newItem.data.data.properties = {
      inspector_url: widgetData.properties.inspector_url
    };
    if(!position) { position = this.getBoardCenterPoint();}
    x = position.x - (width / 2);
    y = position.y - (height / 2);
    if (x < 0) { x = 0;}
    if (y < 0) { y = 0;}            
    newItem.data.data.css = {
      top: y + "px",
      left: x + "px",
      width: width + "px",
      height: height + "px"
    };
    this.insertItems([newItem]);
  },
  
  insertVideo: function(videoProperties, position) {
    var videoWidget;
    switch (videoProperties.type) {
      case 'youtube' :
        videoWidget = WebDoc.application.widgetManager.getYoutubeWidget();
        break;
      case 'vimeo' :
        videoWidget = WebDoc.application.widgetManager.getVimeoWidget();
        break;
      }
    newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    if (videoWidget.data.properties.width) {
      width = parseFloat(videoWidget.data.properties.width);
      height = parseFloat(videoWidget.data.properties.height);
    }
    if(!position) { position = this.getBoardCenterPoint();}
    x = position.x - (width / 2);
    y = position.y - (height / 2);
    if (x < 0) { x = 0;}
    if (y < 0) { y = 0;}
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.media_id = videoWidget.data.id;
    newItem.data.data.tag = "iframe";
    newItem.data.data.src = videoWidget.data.properties.index_url;
    newItem.data.data.properties = {
      inspector_url: videoWidget.data.properties.inspector_url
    };
    newItem.data.data.css = {
      top: y + "px",
      left: x + "px",
      width: width + "px",
      height: height + "px"
    };
    newItem.data.data.preference.url = videoProperties.video_id;
    this.insertItems([newItem]);
  },
  
  insertHtml: function(html, position) {
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.data.tag = "div";
    newItem.data.data.innerHTML = html;
    newItem.data.data.css = {
      top: position.y + "px",
      left: position.x + "px",
      width: "0px",
      height: "0px"
    };
    this.insertItems([newItem]);
  },
  
  insertItems: function(items) {
    $.each(items, function(index, item) {           
      this._currentPage.addItem(item);
      if (!item.data.position && item.data.media_type !== WebDoc.ITEM_TYPE_DRAWING) {
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
    $(document).unbind("mousemove", this._mouseMove).unbind("mouseup", this._mouseUp);
    if (window.document.activeElement) {
      window.document.activeElement.blur();
    }

    $(document).bind("mousemove", this, jQuery.proxy(this, "_mouseMove"));
    $(document).bind("mouseup", this, jQuery.proxy(this, "_mouseUp"));
    this.currentTool.mouseDown(e);

  },
  
  _mouseMove: function(e) {
    if (!this._isInteraction) {
      e.preventDefault();
    }
    this.currentTool.mouseMove(e);
  },
  
  _mouseUp: function(e) {
    $(document).unbind("mousemove", this._mouseMove).unbind("mouseup", this._mouseUp);
    this.currentTool.mouseUp(e);
  },
  
  _mouseClick: function(e) {
    this.currentTool.mouseClick(e);
  },
 
  
  _keyUp: function(e) {
   var el = $(e.target);
    if (el.is('input') || el.is('textarea')) { 
      return;
    }
    switch (e.keyCode) {
      case 37:
      case 38:       
      case 39:
      case 40:
        this._isMovingSelection = false;
        for (var i = 0; i < this._selection.length; i++) {
          this._selection[i].item.save();
        }
        break;
    }        
  },
  
  
  _keyPress: function(e) {
    var el = $(e.target);
    if (el.is('input') || el.is('textarea')) { 
      return;
    }
    ddd("key press", e);
    switch (e.keyCode) {
      case 37:
        if (!this._isInteraction) {
          this.moveSelection("left", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;
      case 38:
        if (!this._isInteraction) {
          this.moveSelection("up", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;          
      case 39:
        if (!this._isInteraction) {
          this.moveSelection("right", e.shiftKey?"big" : "small");            
        }        
        e.preventDefault();           
        break;
      case 40:
        if (!this._isInteraction) {
          this.moveSelection("down", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;          
    }    
  },
  
  _keyDown: function(e) {
    var el = $(e.target);
    if (el.is('input') || el.is('textarea')) { 
      return;
    }
    if (!e.ctrlKey && !e.metaKey) {
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
     case 37:
        if (this._isInteraction) {
          WebDoc.application.pageEditor.prevPage(); 
        }
        else {
          this.moveSelection("left", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;
      case 38:
        if (!this._isInteraction) {
          this.moveSelection("up", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;          
      case 39:
        if (this._isInteraction) {
          WebDoc.application.pageEditor.nextPage();
        }
        else {
          this.moveSelection("right", e.shiftKey?"big" : "small");            
        }        
        e.preventDefault();           
        break;
      case 40:
        if (!this._isInteraction) {
          this.moveSelection("down", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;                       
      }      
    }
    else {
      switch (e.which) {
        case 67:
            this.copySelection();
            e.preventDefault();
            e.stopPropagation();
          break;
        case 86:
            this.paste();
            e.preventDefault();
          break;
      }
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
  },
  
  _setItemPositionZ: function(item, position) {
    ddd("set item pos", item, position);
    var previousPosition = item.positionZ();
    item.setPositionZ(position);
    item.save();
    WebDoc.application.undoManager.registerUndo(function() {
      this._setItemPositionZ(item, previousPosition);
    }.pBind(this));    
  },
  
  _createImageItemAfterLoad: function(e) {
    var position = e.data;
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_IMAGE;
    if(!position) { position = WebDoc.application.boardController.getBoardCenterPoint();}
    var x = position.x - (this.width / 2);
    var y = position.y - (this.height / 2);
    if (x < 0) { x = 0;}
    if (y < 0) { y = 0;}
    newItem.data.data.tag = "img";
    newItem.data.data.src = this.src;
    newItem.data.data.css = {
      overflow: "hidden",
      top: y + "px",
      left: x + "px",
      width: this.width + "px",
      height: this.height + "px"
    };
    WebDoc.application.boardController.insertItems([newItem]);
  }
});