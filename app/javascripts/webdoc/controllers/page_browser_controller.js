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
  CURRENT_CLASS: "current",
  PAGE_THUMB_CLASS: "page-thumb",
  PAGE_THUMB_SELECTOR: ".page-thumb",
  HIDE_THUMB_CLASS: "hide-thumbs",
  THUMB_STATE_BUTTON_SELECTOR: "a[href='#toggle-thumbs']",
  LEFT_BAR_BUTTON_SELECTOR: "a[href='#left-panel-toggle']",
    
  initialize: function() {
    ddd("[PageBrowserController] init");
    
    this.domNode = $("#left_bar");
    this._changedFromDrag = false;
    this._stateThumbs = false;
    
    // defined in CSS
    this._pagesPanelWidth = this.domNode.outerWidth();
    
    ddd("[PageBrowserController] Pages panel width: " + this._pagesPanelWidth);
    
    this.visible = false;
    this.pageMap = {};  
  },
  
  setDocument: function(document) {
    this.document = document;   
    this.document.addListener(this);
    this._initializePageBrowser(); 
  },
  
  toggleBrowser: function() {
    ddd("toggle browser");
    var pageBrowserButton = $(this.LEFT_BAR_BUTTON_SELECTOR);
    if (this.visible) {
      this.domNode.animate({
          marginLeft: - this._pagesPanelWidth
      }, {
          step: function(val){
              WebDoc.application.boardController.boardContainerNode.css({
                  left: this._pagesPanelWidth + val
              });
          }.pBind(this)
      });
     pageBrowserButton.removeClass(this.CURRENT_CLASS);
    }
    else {       
      this.domNode.animate({
          marginLeft: 0
      }, {
          step: function(val){
              WebDoc.application.boardController.boardContainerNode.css({
                  left: this._pagesPanelWidth + val
              });
          }.pBind(this)
      });
      pageBrowserButton.addClass(this.CURRENT_CLASS);      
    }
    this.visible = !this.visible;
  },

  _initializePageBrowser: function() {
    ddd('[PageBrowserController] Initialising Page Browser');
    
    var pageBrowserItems = this.domNode.find( this.PAGE_BROWSER_ITEM_SELECTOR ),
        l = this.document.pages.length,
        page, pageItem, pageItemNode, pageListNumber;
    
    this.domNodeBrowserItems = pageBrowserItems;
    
    while (l--) {
      page = this.document.pages[l];
      pageItem = new WebDoc.PageBrowserItemView(page);
      pageItemNode = pageItem.domNode;
      
      pageBrowserItems.prepend(pageItemNode);
      
      this.pageMap[ page.uuid() ] = pageItem;
      
      pageItemNode.data('webdoc', {
        page: page
      });
    }
    
    this.updateSelectedPage();
    this._updateIndexNumbers();
    this._updateThumbs();
    
    pageBrowserItems.sortable({
      axis: 'y',
      distance: 8,
      opacity: 0.8,
      containment: '.content',
      start:  this.dragStart.pBind(this),
      update: this.dragUpdate.pBind(this),
      change: function(e, ui){
        var list = jQuery( e.target );
            items = list.children().not( ui.item[0] );
        
        items
        .each(function(i){
          var number = ( this === ui.placeholder[0] ) ? ui.item.find('.number') : jQuery('.number', this) ;
          number.html(i+1);
        });
      }
    });
    
    this.bindEventHandlers();
    WebDoc.application.boardController.addCurrentPageListener(this);
  },
  
  bindEventHandlers: function() {
    // You can bind to any parent of this - .inspector might be a better choice
    var pageBrowserItems = this.domNodeBrowserItems;
    
    pageBrowserItems
    .bind('click', jQuery.delegate({
        '.cancel':          this.cancelEditTitle,
        'li':               this.selectCurrentPage
      }, this)
    )
    .bind('keydown', jQuery.delegate({
        'input[type=text]': this.keydownEditTitle
      }, this)
    )
    .bind('submit', jQuery.delegate({
        'form':             this.submitEditTitle 
      }, this)
    );
  },
  
  deletePageItems: function() {
    ddd("delete pages thumbs", this.pageMap);
    this.domNode.find("ul").unbind();
    
    for (var key in this.pageMap) {
      this.pageMap[key].destroy();
    }
    
    this.pageMap = {};
  },
  
  updateSelectedPage: function() {
    var page = WebDoc.application.pageEditor.currentPage;
    this._selectPageUI( page );
  },
  
  objectChanged: function(page) {
    
  },
  
  // Called when you or someone else has edited a new page
  
  pageAdded: function(page) {
    ddd("[pageBrowserController] pageAdded");
    var currentPageId = WebDoc.application.pageEditor.currentPage.uuid(),
        currentPageItem = this.pageMap[ currentPageId ],
        pageItem = new WebDoc.PageBrowserItemView(page),
        pos = page.data.position;
    
    this.pageMap[ page.uuid() ] = pageItem;
    
    if ( !this._stateThumbs ) {
      pageItem.thumbNode.css({
        height: 0
      });
    }
    
    pageItem.domNode.data('webdoc', {
      page: page
    });    
    // Then put it in the DOM
    if (pos) {
      this.domNodeBrowserItems.children().eq(pos-1).after( pageItem.domNode );
    }
    else {
      this.domNodeBrowserItems.prepend( pageItem.domNode );
    }
    
    this._updateIndexNumbers();
  },
  
  pageRemoved: function(page) {
    var id = page.uuid(),
        pageBrowserItem = this.pageMap[ page.uuid() ];
    
    ddd('[pageBrowserController] pageRemoved: '+id);
    
    pageBrowserItem.domNode.remove();
    this.pageMap[ page.uuid() ] = null;
  },

  pageMoved: function(page, newPosition, previousPosition) { 
    if(!this._changedFromDrag) { // Dragged from another session, must update GUI
      var itemsList = $('#page_browser_items > li');
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
    }
  },
  
  _updateIndexNumbers: function(){
    this.domNodeBrowserItems.children()
    .each(function(i){
      var number = jQuery('.number', this) ;
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
         pageToSave = WebDoc.application.pageEditor.currentDocument.movePage(dropPage.uuid(), dropPageIndex);
     
     // Define a flag to avoid rebuilding the page browser when items are dragged
     // However, if the document is opened in other sessions, updates must be done
     this._changedFromDrag = true;
     
     if (pageToSave) {
       pageToSave.save();
     }
     
     this._changedFromDrag = false;
  },

  selectCurrentPage: function(e) {
    var pageItem = $( e.delegateTarget || e.target ),
        data = pageItem.data('webdoc'),
        currentId = WebDoc.application.pageEditor.currentPage.uuid(),
        page = data && data.page,
        clickedId = page && page.uuid();
    
    // If not current page, then change it
    if( clickedId && clickedId !== currentId ) {
      this.selectPage( page );
    }
  },

   showPageInspector: function(event) {
     WebDoc.application.rightBarController.showPageInspector();
   },
  
  editPageTitle: function(page){
    ddd('[pageBrowserController] editPageTitle');
    var currentPageItem = this.pageMap[ page.uuid() ];
    
    currentPageItem.editTitle();
  },
  
  selectPage: function( page ) {
    WebDoc.application.pageEditor.loadPage( page );
  },

  _selectPageUI: function( page ) {
    var pageBrowserItem = this.pageMap[ page.uuid() ];
    
    this.domNodeBrowserItems.children().removeClass(this.CURRENT_CLASS);
    pageBrowserItem.domNode.addClass(this.CURRENT_CLASS);
  },
  
  // Titles ---------------------------------------------------------
  
  keydownEditTitle: function(e) {
    if (event.which === 27) { // Escape key
      this.cancelEditTitle(e);
    }
  },
  
  cancelEditTitle: function(e) {
    ddd('[WebDoc.pageBrowserController] cancelEditTitle');
    
    var input = $( e.target ),
        form = input.closest('form');
    
    return false;
  },
  
  submitEditTitle: function(e) {
    ddd('[WebDoc.pageBrowserController] submitEditTitle');
    
    var form = $( e.delegateTarget ),
        input = form.find( 'input:eq(0)' ),
        newTitle = input.val(),
        pageItem = form.closest('li'),
        data = pageItem.data('webdoc'),
        page = data && data.page;
    
    page.setTitle(newTitle);
    return false;
  },

  
  // Thumbnails -----------------------------------------------------
  
  _updateThumbs: function(){
    var browserNode = this.domNodeBrowserItems;
    
    if (this._stateThumbs) {
      browserNode.removeClass( hideThumbsClass );
      $( thumbStateButtonSelector ).addClass( activeClass );
    }
    else {
      browserNode.addClass( hideThumbsClass );
      $( thumbStateButtonSelector ).removeClass( activeClass );
    }
  },
  
  // Methods return current (boolean) state of thumbs
  
  toggleThumbs: function() {
    return this._stateThumbs ? this.hideThumbs() : this.showThumbs() ;
  },
  
  hideThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( this.PAGE_THUMB_SELECTOR );
    
    thumbs
    .animate({
      height: 0
    }, {
      duration: 200,
      complete: function(){
        browserNode.addClass( this.HIDE_THUMB_CLASS );
      }
    });
    
    $( thumbStateButtonSelector ).removeClass( activeClass );
    
    this._stateThumbs = false;
    return this._stateThumbs;
  },
  
  showThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( this.PAGE_THUMB_SELECTOR );
    
    browserNode.removeClass( this.HIDE_THUMB_CLASS );    
    thumbs
    .animate({
      height: 75
    }, {
      duration: 200
    });
    
    $( thumbStateButtonSelector ).addClass( activeClass );
    
    this._stateThumbs = true;
    return this._stateThumbs;
  }
});
