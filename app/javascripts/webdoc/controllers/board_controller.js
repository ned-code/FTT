/**
 * Uniboard board controller.
 **/
WebDoc.BoardController = jQuery.klass({
  
  // Constructor     
  initialize: function(editable, autoFit) {
    this.boardCageNode = jQuery("#webdoc");
    this.boardContainerNode = jQuery("#board-container");
    this.screenUnderlayNode = jQuery("#underlay");
    this.screenNodes = this.boardCageNode.find('.board-screen');
    this.themeNode = jQuery('#theme');
    
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
    this._previousInspector = null;
  },
  
  currentPageView: function() {
    return this._currentPageView; 
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
    var index = jQuery.inArray(listener, this._selectionListeners);
    if (index > -1) {
      this._selectionListeners.splice(index, 1);
    }
  },
  
  addCurrentPageListener: function(listener) {
    this._currentPageListeners.push(listener);
  },
  
  removeCurrentPageListener: function(listener) {
    var index = jQuery.inArray(listener, this._currentPageListeners);
    if (index > -1) {
      this._currentPageListeners.splice(index, 1);
    }
  },
  
  setCurrentPage: function(page) {
    ddd('[board_controller] SetCurrentPage');
    this.stopEditing();
    // Clean previous page view
    if (this._currentPageView) {
      this._currentPageView.destroy();
    }
    var pageView = new WebDoc.PageView(page, this.boardContainerNode),
        board = pageView.domNode,
        defaultZoom = 1;
    
    board.unbind();
    
    jQuery(document).unbind("keydown", this._keyDown);
    jQuery(document).unbind("keypress", this._keyPress);
    jQuery(document).unbind("keyup", this._keyUp);
    

    this._currentPageView = pageView;
    this._currentZoom = 1;
    this._selection = [];
    this._currentPage = page;
    this._editingItem = null;
    
    // Construct DOM tree
    this.boardContainerNode
    .empty()
    .append(board)
    .append(this.screenNodes);
    
    this._fireSelectionChanged();
    this._bindMouseEvent();
    
    jQuery(document).bind("keypress", this, jQuery.proxy(this, "_keyPress"));
    jQuery(document).bind("keydown", this, jQuery.proxy(this, "_keyDown"));
    jQuery(document).bind("keyup", this, jQuery.proxy(this, "_keyUp"));    
    
    if (this._autoFit && this.boardContainerNode.css("width").match(/px/) && this.boardContainerNode.css("height").match(/px/)) {
      //update zoom to fit browser page    
      var heightFactor = $("#webdoc").parent().height() / $("#board-container").height();
      var widthFactor = $("#webdoc").parent().width() / $("#board-container").width();      
      if (heightFactor < widthFactor) {
        defaultZoom =  heightFactor;
      }
      else {
        defaultZoom =  widthFactor;
      }
    }
    this.zoom(defaultZoom);
    this.setMode(!jQuery("body").hasClass('mode-edit'));
    
    this._fireCurrentPageChanged();
    
    jQuery(".webdoc-page-total").html(WebDoc.application.pageEditor.currentDocument.pages.length);
    this._currentPageView.domNode.css("display", "");
    pageView.viewDidLoad();
  },
  
  isInteractionMode: function() {
    return this._isInteraction;  
  },
  
  _setModeEdit: function() {
    this.currentPageView().domNode
    .bind("dragenter", this, WebDoc.DrageAndDropController.dragEnter)
    .bind("dragover", this, WebDoc.DrageAndDropController.dragOver)
    .bind("drop", this, WebDoc.DrageAndDropController.drop);      
    
    if (!this.currentTool) {
      this.setCurrentTool(WebDoc.application.arrowTool);
    }
    
    jQuery("body")
    .removeClass('mode-preview')
    .addClass("mode-edit");
    
    jQuery(".item-layer").show();
    
    jQuery(".state-mode")
    .removeClass("current")
    .filter("[href='#mode-edit']")
    .addClass("current");
    
    //WebDoc.application.pageBrowserController.reveal();
    //WebDoc.application.rightBarController.reveal();
    if (this._previousInspector) {
      WebDoc.application.rightBarController.selectInspector(this._previousInspector);      
    }
    this._isInteraction = false;
    return this._isInteraction;
  },
  
  _setModePreview: function() {
    this.unselectAll();
    this.currentPageView().domNode
    .unbind("dragenter")
    .unbind("dragover")
    .unbind("drop");
    
    this.setCurrentTool(WebDoc.application.arrowTool);
    jQuery(".item-layer").hide();
    
    jQuery("body")
    .removeClass("mode-edit")
    .addClass("mode-preview");
    
    jQuery(".state-mode")
    .removeClass("current")
    .filter("[href='#mode-preview']")
    .addClass("current");
    
    if(!this._editable) {
      jQuery(".mode-tools").hide(); 
    }
    
    //WebDoc.application.pageBrowserController.conceal();
    //WebDoc.application.rightBarController.conceal();
    if(WebDoc.application.rightBarController.getSelectedInspector() !== WebDoc.RightBarInspectorType.SOCIAL) {
      this._previousInspector = WebDoc.application.rightBarController.getSelectedInspector();
    }
    WebDoc.application.rightBarController.selectInspector(WebDoc.RightBarInspectorType.SOCIAL);
    this._isInteraction = true;
    return this._isInteraction;
  },
  
  // Mode -----------------------------------------
  
  setMode: function(state) {
    if (state) {
      this._setModePreview();
    }
    else {
      this._setModeEdit();
    }
    
    // TODO for FF .5 we put svg backward because pointer event is not implemented
    if (WebDoc.Browser.Gecko && (parseFloat(/Firefox[\/\s](\d+\.\d+)/.exec(navigator.userAgent)[1])) < 3.6) {
      ddd("FF 3.5. drawing !");
      this.currentPageView().domNode.find("svg").css("zIndex", this._isInteraction ? "-1" : "1000000");
    }
  },
  
  toggleMode: function() {
    return this.setMode(!this._isInteraction);
  },
  
  // Theme ----------------------------------------
  
  applyDocumentTheme: function() {
    var stylesheetUrl = WebDoc.application.pageEditor.currentDocument.styleUrl() ||WebDoc.ThemeManager.getInstance().getDefaultTheme().getStyleUrl(),
        currentClass = this._themeClass || 'theme_default',
        newClass = WebDoc.application.pageEditor.currentDocument.styleClass() || 'theme_default',
        themeNode = this.themeNode;
    
    themeNode[0].href = stylesheetUrl;
    
    // There's no load event on the link tag.  This is a problem.
    // Simulate with setTimeout until we think of a better way.
    var t = setTimeout(function(){
      themeNode.trigger('load');
    }, 1800);
    
    jQuery("." + currentClass).removeClass(currentClass).addClass(newClass);
    this.boardContainerNode.addClass(newClass);
    // Store the class so we know what to remove on the next setTheme
    this._themeClass = newClass;
  },
  
  // Tool -----------------------------------------
  
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
    WebDoc.application.pasteBoardManager.putIntoPasboard("application/ub-item", jQuery.toJSON(itemsDataArray));
  },
  
  paste: function() {
    if (!WebDoc.application.pasteBoardManager.isEmpty()) {
      var itemsString = WebDoc.application.pasteBoardManager.getFromPasteBoard("application/ub-item");
      var newItems = [];
      if (itemsString) {
        var items = jQuery.evalJSON(itemsString);
        var itemsDataArray = [];
        for (var i = 0; i < items.length; i++) {
          var anItem = new WebDoc.Item({
            item: items[i]
          });
          var newItem = anItem.copy();

          if(anItem.data.page_id === this._currentPage.data.id) {
            newItem.data.data.css.left = (parseFloat(anItem.data.data.css.left)+15).toString()+"px";
            newItem.data.data.css.top = (parseFloat(anItem.data.data.css.top)+15).toString()+"px";
          }
          newItem.data.page_id = this._currentPage.data.id;

          newItems.push(newItem);
          itemsDataArray.push(newItem.getData());
        }

        this.insertItems(newItems);
        WebDoc.application.pasteBoardManager.putIntoPasboard("application/ub-item", jQuery.toJSON(itemsDataArray));
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
    var x, y, board = this.currentPageView().domNode;
    
    if (position.x) {
      x = position.x - board.offset().left;
      y = position.y - board.offset().top;
    }
    else {
      x = position.pageX - board.offset().left;
      y = position.pageY - board.offset().top;
    }   
    if (WebDoc.Browser.WebKit) { 
      // Correct mouse vertical position according to the cursor icon height
      // This doesn't work with a pen tablet, as you can't change the registration point
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
    var x, y, board = this.currentPageView().domNode;
    
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
  },
  
  stopEditing: function() {
    if (this._editingItem) {
      this._editingItem.stopEditing();
      WebDoc.application.arrowTool.enableHilight();
      this._hideScreens();
      this._editingItem = null;
    }    
  },
  
  selectItemViews: function(itemViews) {
    // exit edit mode for current editing item
    this.stopEditing();
    if (itemViews) {
      // do nothing if new selection is equal to old selection
      if(itemViews.length === this._selection.length) {
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
      jQuery.each(this._selection, function(index, itemToDeselect) {
        if (jQuery.inArray(itemToDeselect, itemViews) === -1) {
          this.unselectItemViews([itemToDeselect]);
        }
      }.pBind(this));
      
      //select wanted items
      jQuery.each(itemViews, function(index, itemToSelect) {
        if (jQuery.inArray(itemToSelect, this._selection) == -1) {
          ddd("add item to selection");
          this._selection.push(itemToSelect);
        }
        itemToSelect.select();
      }.pBind(this));
      this._fireSelectionChanged();
    }
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
      
      // Calculate position of node - we want browser values,
      // in px, so we can't use the item's data.css
      
      var node = itemViewToEdit.domNode;
      
      this._updateScreens( node );
      this._editingItem = itemViewToEdit;  
      itemViewToEdit.edit();
      
      WebDoc.application.arrowTool.disableHilight();
      this._showScreens();
      return true;     
    }
    return false;
  },
  
  _hideScreens: function() {
    this.screenNodes.animate({ opacity: 'hide' }, { duration: 200 });
  },

  _showScreens: function() {
    this.screenNodes.animate({ opacity: 'show' }, { duration: 200 });
  },
  
  _updateScreens: function( itemNode ) {
    
    // Calculate position of node - we want browser values,
    // in px, so we can't use the item's data.css
    
    var node = itemNode || jQuery('.item_edited'),
        zoom = this._currentZoom,
        size = 4096,
        nodePos = node.position(),
        nodeLeft = parseInt( nodePos.left ),
        nodeTop = parseInt( nodePos.top ),
        nodeWidth = parseInt( node.width() * zoom ),
        nodeHeight = parseInt( node.height() * zoom ),
        board = this.boardContainerNode,
        boardWidth = parseInt( board.width() * zoom ),
        boardHeight = parseInt( board.height() * zoom ),
        screens = this.screenNodes,
        screenTop = screens.eq(0),
        screenBottom = screens.eq(1),
        screenLeft = screens.eq(2),
        screenRight = screens.eq(3);
    
    // Adjust the dimensions of the four screens surrounding the edited block
    screenTop.css({
        height: size,
        top: nodeTop - size,
        left: - size,
        width: size * 2
    });
    screenBottom.css({
        top: nodeTop + nodeHeight,
        height: size,
        left: - size,
        width: size * 2
    });
    screenLeft.css({
        top: nodeTop,
        width: size,
        left: nodeLeft - size,
        height: nodeHeight
    });
    screenRight.css({
        top: nodeTop,
        left: nodeLeft + nodeWidth,
        width: size,
        height: nodeHeight
    });
  },
  
  insertImage: function(imageUrl, position) {
    var image = document.createElement('img'); /* Preload image in order to have width and height parameters available */
    jQuery(image).bind("load", position, this._createImageItemAfterLoad); /* WebDoc.Item creation will occur after image load*/
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
    jQuery.each(items, function(index, item) {           
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
    jQuery.each(items, function(index, item) {
      this._currentPage.removeItem(item);
      item.destroy();
    }.pBind(this));
    
    WebDoc.application.undoManager.registerUndo(function() {
      this.insertItems(items);
    }.pBind(this));
  },
    
  deleteSelection: function(e) {
    var deletedItems = [];
    jQuery.each(this._selection, function(index, itemView) {
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
    
    var boardNode = this.currentPageView().domNode,
        previousZoom = this._currentZoom,
        boardContainerCss = {},
        boardCss = {},
        editingItem = this.editingItem();
    
    this._currentZoom = this._currentZoom * factor;
    ddd("set zoom factor: " + this._currentZoom);
    
    // TODO: can we animate this?
    
    boardCss.WebkitTransformOrigin = "0px 0px";
    boardCss.WebkitTransform = this._currentZoom === 1 ? "" : "scale(" + this._currentZoom + ")" ;
    boardCss.MozTransformOrigin = this._currentZoom === 1 ? "" : "0px 0px" ;
    boardCss.MozTransform = boardCss.WebkitTransform;
    boardCss.width = 100/this._currentZoom + '%';
    boardCss.height = 100/this._currentZoom + '%';
    

    var initialSize = {
      width: parseFloat(this._currentPage.data.data.css.width),
      height: parseFloat(this._currentPage.data.data.css.height),
      widthFlag: this._currentPage.width().match(/px/)?"px":"%",
      heightFlag: this._currentPage.height().match(/px/)?"px":"%"
    };

    
    boardContainerCss = {
      width: (initialSize.width * this._currentZoom) + initialSize.widthFlag,
      height: (initialSize.height * this._currentZoom) + initialSize.heightFlag
    };
    
    ddd("new board size", boardContainerCss.width, boardContainerCss.height);

    boardNode.css( boardCss );
    this.boardContainerNode.css( boardContainerCss );
    
    // If item is being edited, reposition screens
    if ( editingItem ) { this._updateScreens( editingItem.domNode ); }
  },
  
  // Private methods
    
  _mouseDown: function(e) {
    jQuery(document).unbind("mousemove", this._mouseMove).unbind("mouseup", this._mouseUp);
    if (window.document.activeElement) {
      window.document.activeElement.blur();
    }

    jQuery(document).bind("mousemove", this, jQuery.proxy(this, "_mouseMove"));
    jQuery(document).bind("mouseup", this, jQuery.proxy(this, "_mouseUp"));
    this.currentTool.mouseDown(e);

  },
  
  _mouseMove: function(e) {
    if (!this._isInteraction) {
      e.preventDefault();
    }
    this.currentTool.mouseMove(e);
  },
  
  _mouseUp: function(e) {
    jQuery(document).unbind("mousemove", this._mouseMove).unbind("mouseup", this._mouseUp);
    this.currentTool.mouseUp(e);
  },
  
  _mouseClick: function(e) {
    this.currentTool.mouseClick(e);
  },
 
  
  _keyUp: function(e) {
   var el = jQuery(e.target);
    if (this._editingItem !== null && !(el.is('input') || el.is('textarea'))) {
      e.preventDefault();      
    }
    if (el.is('input') || el.is('textarea') || this._editingItem !== null) { 
      return true;
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
    var el = jQuery(e.target);
    if (this._editingItem !== null  && !(el.is('input') || el.is('textarea'))) {
      e.preventDefault();      
    }
    if (el.is('input') || el.is('textarea') || this._editingItem !== null) { 
      return true;
    }
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
    var el = jQuery(e.target);
    if (this._editingItem !== null  && !(el.is('input') || el.is('textarea'))) {
      e.preventDefault();
    }    
    if (el.is('input') || el.is('textarea') || this._editingItem !== null) { 
      return true;
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
        if (this._isInteraction || this._selection.length === 0) {
          WebDoc.application.pageEditor.prevPage();
        }
        else {
          this.moveSelection("left", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;
      case 38:
        if (this._isInteraction || this._selection.length === 0) {
          WebDoc.application.pageEditor.prevPage();
        }
        else {
          this.moveSelection("up", e.shiftKey?"big" : "small");
        }
        e.preventDefault();          
        break;          
      case 39:
        if (this._isInteraction || this._selection.length === 0) {
          WebDoc.application.pageEditor.nextPage();
        }
        else {
          this.moveSelection("right", e.shiftKey?"big" : "small");            
        }        
        e.preventDefault();           
        break;
      case 40:
        if (this._isInteraction || this._selection.length === 0) {
          WebDoc.application.pageEditor.nextPage();
        }
        else {
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
        case 90:
            if(e.shiftKey) {
              WebDoc.application.undoManager.redo(); 
            }
            else {
              WebDoc.application.undoManager.undo();
            }
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
    jQuery.each(this._selectionListeners, function() {
      this.selectionChanged();
    });
  },
  
  _fireCurrentPageChanged: function() {
    jQuery.each(this._currentPageListeners, function() {
      this.currentPageChanged();
    });
  },
  
  _bindMouseEvent: function() {
    this.currentPageView().domNode
    .bind("mousedown", this, this._mouseDown.pBind(this))
    .bind("click", this, this._mouseClick.pBind(this))
    .bind("dblclick", this, this._mouseDblClick.pBind(this))
    .bind("mouseover", this, this._mouseOver.pBind(this))
    .bind("mouseout", this, this._mouseOut.pBind(this));

    this.screenNodes
    .bind('mousedown', this._mouseDown.pBind(this) )
    .bind('mouseout', function(e){
      ddd(e);
    });
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