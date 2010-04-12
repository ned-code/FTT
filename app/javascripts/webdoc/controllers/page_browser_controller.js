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
  PANEL_GHOST_SELECTOR: '#left-panel-ghost',

  initialize: function() {
    ddd("[PageBrowserController] init");
    
    this.domNode = $("#left_bar");
    this.panelGhostNode = $( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    this._changedFromDrag = false;
    this._stateThumbs = false;
    this._document = null;
    
    // defined in CSS
    this._pagesPanelWidth = this.domNode.outerWidth();
    
    ddd("[PageBrowserController] Pages panel width: " + this._pagesPanelWidth);
    this.visible = false;
    this.pageMap = {};    
  },
  
  setDocument: function(document) {
    this._document = document;   
    this._document.addListener(this);
    this._initializePageBrowser(); 
  },

  _initializePageBrowser: function() {
    ddd('[PageBrowserController] Initialising Page Browser');
    
    var pageBrowserItems = this.domNode.find( this.PAGE_BROWSER_ITEM_SELECTOR ),
        l = this._document.pages.length,
        page, pageItem, pageItemNode, pageListNumber;
    
    this.domNodeBrowserItems = pageBrowserItems;
    
    while (l--) {
      page = this._document.pages[l];
      pageItem = new WebDoc.PageBrowserItemView(page);
      pageItemNode = pageItem.domNode;
      
      pageBrowserItems.prepend(pageItemNode);

      pageItem.truncateTitleWithActualTitle();

      this.pageMap[ page.uuid() ] = pageItem;
      
      pageItemNode.data('webdoc', {
        page: page
      });
    }
    
    this.updateSelectedPage();
    this._updateIndexNumbers();
    this._updateThumbs();
    
    if (WebDoc.application.boardController.isEditable()) {
      pageBrowserItems.sortable({
        axis: 'y',
        distance: 8,
        opacity: 0.8,
        containment: '.content',
        start:  this.dragStart.pBind(this),
        update: this.dragUpdate.pBind(this),
        change: function(e, ui){
          var list = jQuery( e.target ),
              items = list.children().not( ui.item[0] ),
              numberSelector = this.NUMBER_SELECTOR,
              self = this;
          
          items
          .each(function(i){
            var number = ( this === ui.placeholder[0] ) ? ui.item.find(numberSelector) : jQuery(numberSelector, this) ;
            
            number.html( i+1 );
            
            // Update current page number
            if ( $(this).hasClass( self.CURRENT_CLASS ) ) {
              $( self.PAGE_NUMBER_SELECTOR ).html( i+1 );
            }
            
          });
        }.pBind(this)
      });
    }
    this.bindEventHandlers();
    WebDoc.application.boardController.addCurrentPageListener(this);
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

  dragStart: function(event, ui) {
    ddd('Drag start');	
  },

  dragUpdate: function(event, ui) {
     ddd('Drag update');
     var dropItem = $(ui.item),
         dropData = dropItem.data('webdoc'),
         dropPage = dropData && dropData.page,
         dropPageIndex = this.domNodeBrowserItems.children('li').index(ui.item),
         pageToSave = null;
     // Define a flag to avoid rebuilding the page browser when items are dragged
     // However, if the document is opened in other sessions, updates must be done
     this._changedFromDrag = true;     
     pageToSave = WebDoc.application.pageEditor.currentDocument.movePage(dropPage.uuid(), dropPageIndex);
     
     if (pageToSave) {
       pageToSave.save();
     }
     
     this._changedFromDrag = false;
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
  
  editPageTitle: function(page){
    ddd('[pageBrowserController] editPageTitle');
    var currentPageItem = this.pageMap[ page.uuid() ];
    
    currentPageItem.editTitle();
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
    var pageBrowserButton = $(this.LEFT_BAR_BUTTON_SELECTOR),
        panelWidth = this._pagesPanelWidth,
        outerGhost = this.panelGhostNode,
        innerGhost = this.innerGhostNode,
        bothGhosts = outerGhost.add(innerGhost);
    
    innerGhost.show();
    
    this.domNode.animate({
        marginLeft: 0
    }, {
        step: function(val){
            bothGhosts.css({
              width: panelWidth + val
            })
        }.pBind(this)
    });
    
    pageBrowserButton.addClass(this.ACTIVE_CLASS);
    
    return true;
  },
  
  _hide: function( margin ){
    var pageBrowserButton = $(this.LEFT_BAR_BUTTON_SELECTOR),
        panelWidth = this._pagesPanelWidth,
        outerGhost = this.panelGhostNode,
        innerGhost = this.innerGhostNode,
        bothGhosts = outerGhost.add(innerGhost);
    
    this.domNode.animate({
        marginLeft: - this._pagesPanelWidth - ( margin || 0 )
    }, {
        step: function(val){
            bothGhosts.css({
              width: panelWidth + val
            })
        }.pBind(this),
        complete: function(){
            innerGhost.hide();
        }
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
