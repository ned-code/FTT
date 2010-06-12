/**
 * @author julien
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>
//= require <webdoc/gui/page_browser_item_view>

WebDoc.PageBrowserController = $.klass({
  
  PAGE_BROWSER_ITEM_SELECTOR: ".page_browser_items",
  PAGE_BROWSER_NUMBER_SELECTOR: ".page_browser_numbered_list",
  PAGE_NUMBER_SELECTOR: ".webdoc-page-number",
  ACTIVE_CLASS: "active",
  CURRENT_CLASS: "current",
  LOADING_CLASS: "loading",
  PAGE_THUMB_CLASS: "page-thumb",
  PAGE_THUMB_SELECTOR: ".page-thumb",
  HIDE_THUMB_CLASS: "hide-thumbs",
  THUMB_STATE_BUTTONS_SELECTOR: '.state-pages-thumbs',
  THUMB_STATE_TOGGLE_SELECTOR: "a[href='#toggle-thumbs']",
  THUMB_STATE_SHOW_SELECTOR: "a[href='#show-thumbs']",
  THUMB_STATE_HIDE_SELECTOR: "a[href='#hide-thumbs']",
  LEFT_BAR_BUTTON_SELECTOR: "a[href='#left-panel-toggle']",
  NUMBER_SELECTOR: '.number',
  THUMB_SELECTOR: '.thumb',

  initialize: function() {
    ddd("[PageBrowserController] init");
    
    var that = this;
    
    this.domNode = $("#left_bar");
    
    this._changedFromDrag = false;
    this._stateThumbs = true;
    this._document = null;
    
    // defined in CSS
    //this._pagesPanelWidth = this.domNode.outerWidth();
    this._panelHeight = this.domNode.outerHeight();
    
    ddd("[PageBrowserController] Pages panel width: " + this._pagesPanelWidth);
    ddd("[PageBrowserController] panel height: " + this._panelHeight);
    
    this.visible = true;
    this.pageMap = {};
    
    this.domNode
    .bind('mouseenter', function(e){
      that.show();
    })
    .bind('mouseleave', function(e){
      that.hide();
    });
  },
  
  setDocument: function(document) {
    this._document = document;   
    this._document.addListener(this);
    this._initializePageBrowser(); 
  },

  _initializePageBrowser: function() {
    ddd('[PageBrowserController] Initialising Page Browser');
    
    var that = this,
        pageBrowserItems = this.domNode.find( this.PAGE_BROWSER_ITEM_SELECTOR ),
        l = this._document.pages.length,
        page, pageItem, pageItemNode, pageListNumber;
    
    this.domNodeBrowserItems = pageBrowserItems;
    
    while (l--) {
      page = this._document.pages[l];
      pageItem = new WebDoc.PageBrowserItemView(page);
      pageItemNode = pageItem.domNode;
      
      pageBrowserItems.prepend(pageItemNode);

      //pageItem.truncateTitleWithActualTitle();

      this.pageMap[ page.uuid() ] = pageItem;
      
      pageItemNode.data('webdoc', {
        page: page
      });
    }
    
    this.updateSelectedPage();
    this._updateIndexNumbers();
    this._updateThumbs();
    
    if (WebDoc.application.boardController.isEditable()) {
      
      // DRAG TO SORT -----------------------------------------------------------------------------------------
      
      // TODO: we gotta consider whether we extract the following
      // drag-to-sort functionality. It could be reusable if we put
      // it in it's own object, or made it a jQuery plugin. All we
      // need to keep are the callbacks.
      
      var itemsList = pageBrowserItems;
      var divide = 0.55;
      var dragTarget;
      var startState;
      var changedFlag = false;
      
      itemsList.delegate('li', 'dragstart', function(e){
        //console.log('EVENT '+e.type, e);
        
        var eOrig = e.originalEvent;
        
        dragTarget = jQuery(this).addClass('ghost');
        startState = itemsList.children();
        
        // Quick hack to stop number being displayed in dragged thumb
        dragTarget.find('.number').hide();
        
        eOrig.dataTransfer.setDragImage(this, 64, 64);
        
        // Quick hack to stop number being displayed in dragged thumb
        var t = setTimeout(function(){
          dragTarget.find('.number').show();
        }, 0);
        
        that._dragStartCallback.call(that, e, dragTarget);
      })
      .delegate('li', 'dragenter dragover', function(e){
        //console.log('EVENT '+e.type, e);
        
        var item, mouse, width, height, offset;
        
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = "move";
        
        if (!dragTarget) {
        	// drag is coming from outside so create dragTarget for this DOM
        	
        	dragTarget = jQuery('<li/>', {'class': 'ghost', text: 'What? from another document? Are you nuts?'})
        }
        
        if (dragTarget[0] === this) {
        	// Don't react to drags over the original dragTarget
        	
        	//console.log('This is the bloody dragTarget, numb nuts.');
        	return;
        }
        
        // Interrogate position to find out how far down the item we are
        // dragging and move the dragTarget into position accordingly.
        // Obviously, it's going to depend on whether the list is horizontal
        // or vertical as to whother you test width or height.
        
        item = jQuery(this),
        mouse = {
          top: e.pageY,
          left: e.pageX
        },
        //height = item.outerHeight(),
        width = item.outerWidth(),
        offset = item.offset();
        
        //if ( (mouse.top - offset.top) < (divide * height) ) {
        if ( (mouse.left - offset.left) < (divide * width) ) {
        	item.before(dragTarget);
        }
        else {
        	item.after(dragTarget);
        }
        
        that._dragUpdateCallback.call(that, e, dragTarget);
        changedFlag = true;
        
        return false;
      })
      .bind('dragleave', function(e){
      	//console.log('EVENT '+e.type, e);
      	
      	var container = jQuery(this),
      			mouse, size;
      	
      	// In WebKit the dragleave event does not have a relatedTarget so
      	// we need to detect by coordinates when elvis has left the building.
      	// Note this is not going to work well when complex objects overhang
      	// this container.
      	
      	mouse = {
      	  left: e.pageX,
      	  top: e.pageY
      	};
      	
      	// In WebKit, dragleave is fired and mouse is reported as 0, 0 when
      	// dragTarget is dropped on this container.  Mitigate.
      	
      	if ( this === e.target && (mouse.left + mouse.top) === 0 ) {
      		return;
      	} 
      	
      	size = container.offset();
      	
      	size.width = container.outerWidth();
      	size.height = container.outerHeight();
      	size.bottom = size.top + size.height;
      	size.right = size.left + size.width;
      	
      	if ( mouse.left > size.left && mouse.left < size.right &&
      	  	 mouse.top > size.top && mouse.top < size.bottom ) {
      	  
      	  // If we get here, we're still inside this container, so don't
      	  // do anything.
      	  
      	  return;
      	}
      	
      	// Put the list back to its initial state.
      	
      	if ( startState ) {
      		container.html( startState );
      	}
      	else {
      		dragTarget.remove();
      	}
      	
      	that._dragUpdateCallback.call(that, e, dragTarget);
      	changedFlag = false;
      })
      .delegate('li', 'drop', function(e){
      	//console.log('EVENT '+e.type, e);
      	e.preventDefault();
      })
      .delegate('li', 'dragend', function(e){
      	//console.log('EVENT '+e.type, e);
      	
      	e.preventDefault();
      	
      	dragTarget.removeClass('ghost');
      	
      	if (changedFlag) {
          that._dragChangeCallback.call(that, e, dragTarget);
          changedFlag = false;
      	}
      	
      	dragTarget = undefined;
      });
      // ----------------------------------------------------------------------------------------------------
    }
    this.bindEventHandlers();
    WebDoc.application.boardController.addCurrentPageListener(this);
    
  },
  
  _dragStartCallback: function(e, dragTarget){
    var dataTransfer = e.originalEvent.dataTransfer;
    
    dataTransfer.setData("Text", 'Page title');
    dataTransfer.setData("URL", window.location+' Add the page hash here!!!' );
    dataTransfer.setData("application/webdoc-page", "Put some JSON here");
  },
  
  _dragUpdateCallback: function(e, dragTarget){
    var list = this.domNodeBrowserItems,
        items = list.children(),
        numberSelector = this.NUMBER_SELECTOR,
        that = this;
    
    // Update page numbers in the page browser
    items.each(function(i){
      var number = jQuery(numberSelector, this);
      
      number.html( i+1 );
      
      // Update current page number across entire interface
      if ( jQuery(this).hasClass( that.CURRENT_CLASS ) ) {
        jQuery( that.PAGE_NUMBER_SELECTOR ).html( i+1 );
      }
    });
  },
  
  _dragChangeCallback: function(e, dragTarget){
    var dataTransfer = e.originalEvent.dataTransfer,
        dropData = 
          //dataTransfer.getData("application/webdoc-page") ?               // Enable this lot to get drag working between windows - once you have the JSON organised...
          //JSON.parse( dataTransfer.getData("application/webdoc-page") ) :
          dragTarget.data("webdoc").page ,
        dropPageIndex = dragTarget.index(),
        pageToSave;
    
    // Define a flag to avoid rebuilding the page browser when items are dragged
    // However, if the document is opened in other sessions, updates must be done
    this._changedFromDrag = true;     
    pageToSave = WebDoc.application.pageEditor.currentDocument.movePage(dropData.uuid(), dropPageIndex);
    
    if (pageToSave) {
      pageToSave.save();
    }
    
    this._changedFromDrag = false;
  },
  
  bindEventHandlers: function() {
    // You can bind to any parent of this - .inspector might be a better choice
    var pageBrowserItems = this.domNodeBrowserItems;
    
    pageBrowserItems
    .bind('click', jQuery.delegate({
        'li':               this.selectCurrentPage
      }, this)
    );
  },

  updateSelectedPage: function() {
    var page = WebDoc.application.pageEditor.currentPage;
    if (page) {
      this._selectPageUI( page );
    }
  },
  
  objectChanged: function(page) {
    
  },
  
  // Called when you or someone else has edited a new page
  
  pageAdded: function(page) {
    ddd("[pageBrowserController] pageAdded");
    var pageItem = new WebDoc.PageBrowserItemView(page),
        pageNode = pageItem.domNode,
        pos = page.data.position;
    
    this.pageMap[ page.uuid() ] = pageItem;
    
    // Then put it in the DOM
    if (pos) {
      this.domNodeBrowserItems.children().eq(pos-1).after( pageNode );
    }
    else {
      this.domNodeBrowserItems.prepend( pageNode );
    }
    
    pageNode.data('webdoc', {
      page: page
    });
    
    this._updateIndexNumbers();
    //pageItem.truncateTitleWithActualTitle();
  },
  
  pageRemoved: function(page) {
    var id = page.uuid(),
        pageBrowserItem = this.pageMap[ page.uuid() ];
    
    ddd('[pageBrowserController] pageRemoved: '+id);
    pageBrowserItem.destroy();
    delete this.pageMap[ page.uuid() ];
    this._updateIndexNumbers();
  },

  pageMoved: function(page, newPosition, previousPosition) { 
    if(!this._changedFromDrag) { // Dragged from another session, must update GUI
      var itemsList = this.domNodeBrowserItems.children();
      var baseItem = itemsList.eq(previousPosition);
      var itemCopy = baseItem.clone(true);
      var itemDest = itemsList.eq(newPosition);

      if(newPosition > previousPosition) {
        itemDest.after(itemCopy);
      }
      else {
        itemDest.before(itemCopy);
      }
      baseItem.remove();
      this._updateIndexNumbers();      
    }
  },
  
  _updateIndexNumbers: function(){
    var numberSelector = this.NUMBER_SELECTOR;
    this.domNodeBrowserItems.children()
    .each(function(i){
      var number = jQuery(numberSelector, this) ;
      number.html(i+1);
    });
  },
  
  currentPageChanged: function() {
    ddd("update selected page in page browser");
    this.updateSelectedPage();
  },

  selectCurrentPage: function(e) {
    var pageNode = $( e.delegateTarget || e.target ),
        data = pageNode.data('webdoc'),
        currentId = WebDoc.application.pageEditor.currentPage.uuid(),
        page = data && data.page,
        clickedId = page && page.uuid();
    
    // If not current page, then change it
    if( clickedId && clickedId !== currentId ) {
      pageNode.addClass( this.LOADING_CLASS );
      this.selectPage( page );
    }
  },
  
  addPageUrl: function(){
    ddd('[pageBrowserController] editPageUrl');
    var currentPageItem = this.pageMap[ page.uuid() ];
    
    currentPageItem.editUrl();
  },
  
  selectPage: function( page ) {
    ddd('[pageBrowserController] selectPage');
    WebDoc.application.pageEditor.loadPage( page );
  },

  _selectPageUI: function( page ) {
    var pageBrowserItem = this.pageMap[ page.uuid() ],
        items = this.domNodeBrowserItems.children();
    
    items
    .removeClass(this.CURRENT_CLASS);
    
    pageBrowserItem.domNode
    .removeClass(this.LOADING_CLASS)
    .addClass(this.CURRENT_CLASS);
    
    // Update current page number
    $( this.PAGE_NUMBER_SELECTOR ).html( items.index( pageBrowserItem.domNode[0] ) + 1 );
  },
  
  // Show / hide browser --------------------------------------------
  
  _show: function(){
    var pageBrowserButton = $(this.LEFT_BAR_BUTTON_SELECTOR);
    
    this.domNode
    .stop()
    .animate({
      marginBottom: 0
    }, {
      duration: 360,
      easing: 'webdocBounce'
    });
    
    pageBrowserButton.addClass(this.ACTIVE_CLASS);
    
    return true;
  },
  
  _hide: function( margin ){
    var pageBrowserButton = $(this.LEFT_BAR_BUTTON_SELECTOR);
    
    this.domNode
    .stop()
    .animate({
      marginBottom: - this._panelHeight
    }, {
      duration: 540
    });
    
    pageBrowserButton.removeClass(this.ACTIVE_CLASS);
    
    return false;
  },
  
  show: function() {
    this.visible = (this.visible) ? this.visible : this._show() ;
  },
  
  hide: function() {
    this.visible = (this.visible) ? this._hide() : this.visible ;
  },
  
  toggle: function() {
    this.visible = (this.visible) ? this._hide() : this._show() ;
  },
  
  conceal: function() {
    return this._hide( 36 );
  },
  
  reveal: function() {
    return (this.visible) ? this._show() : this._hide() ;
  },
  
  // Thumbnails -----------------------------------------------------
  
  _updateThumbs: function(){
    var browserNode = this.domNodeBrowserItems;
    if (this._stateThumbs) {
      browserNode.removeClass( this.HIDE_THUMB_CLASS );
      
      // This could be improved - really we want the browserNode to be
      // the entire .inspector inside the pane.  And then we can search 
      // thumb state button inside this inspector only...
      // requires a bit of refactoring...
      
      $( this.THUMB_STATE_BUTTON_SELECTOR ).addClass( this.ACTIVE_CLASS );
    }
    else {
      browserNode.addClass( this.HIDE_THUMB_CLASS );      
      $( this.THUMB_STATE_BUTTON_SELECTOR ).removeClass( this.ACTIVE_CLASS );      
    }
  },
  
  _showThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( this.THUMB_SELECTOR ),
        thumbToggles = $( this.THUMB_STATE_BUTTONS_SELECTOR );
    
    browserNode.removeClass( this.HIDE_THUMB_CLASS );    
    thumbs
    .css({
      height: 0,
      marginBottom: 0,
      borderBottomWidth: 0
    })
    .animate({
      height: 75,
      marginBottom: 14,
      borderBottomWidth: 6
    }, {
    //.css({
    //  height: 0
    //})
    //.animate({
    //  height: 104
    //}, {
      duration: 200
    });
    
    thumbToggles
    .removeClass( this.CURRENT_CLASS )
    .filter( this.THUMB_STATE_SHOW_SELECTOR )
    .addClass( this.CURRENT_CLASS );
    
    this._stateThumbs = true;
    
    return this._stateThumbs;
  },
  
  _hideThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( this.THUMB_SELECTOR ),
        hideThumbClass = this.HIDE_THUMB_CLASS,
        hideThumbFlag = true,
        thumbToggles = $( this.THUMB_STATE_BUTTONS_SELECTOR );
    
    thumbs
    .animate({
      height: 0,
      marginBottom: 0,
      borderBottomWidth: 0
    }, {
    //.animate({
    //  height: 0
    //}, {
      duration: 200,
      complete: function(){
        // complete fires for every item in the list
        // We only want to set this class once
        if ( hideThumbFlag ) {
          browserNode.addClass( hideThumbClass );
        }
        hideThumbFlag = false;
      }
    });
    
    thumbToggles
    .removeClass( this.CURRENT_CLASS )
    .filter( this.THUMB_STATE_HIDE_SELECTOR )
    .addClass( this.CURRENT_CLASS );
    
    this._stateThumbs = false;
    
    return this._stateThumbs;
  },
  
  // Exposed methods return current (boolean) state of thumbs
  
  showThumbs: function() {
    return ( !this._stateThumbs ) ? this._showThumbs() : this._stateThumbs ;
  },

  hideThumbs: function() {
    return ( this._stateThumbs ) ? this._hideThumbs() : this._stateThumbs ;
  },
  
  toggleThumbs: function() {
    return this._stateThumbs ? this._hideThumbs() : this._showThumbs() ;
  }

});
