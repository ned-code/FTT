/**
 * @author julien
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>
//= require <webdoc/gui/page_browser_item_view>

(function(jQuery, undefined){

// Default settings
var boardPanel,
    pagesPanel,
    pagesPanelWidth = 150,
    changedFromDrag = false,
    defaultThumbState = false,
    pageBrowserItemsSelector = ".page_browser_items",
    pageBrowserNumbersSelector = ".page_browser_numbered_list",
    currentClass = "current",
    pageThumbClass = "page-thumb",
    pageThumbSelector = ".page-thumb",
    hideThumbsClass = "hide-thumbs",
    thumbStateButtonSelector = "a[href='#toggle-thumbs']";

function preventDefault(e) {
  // If this input is already selected, don't do nothing to it
  if ( $( e.delegateTarget ).attr('selected') ) {
    // Let it pass
  }
  else {
    e.preventDefault();
  }
}

WebDoc.PageBrowserController = $.klass({
  initialize: function() {
    ddd("init pages panel");
    
    boardPanel = $("#board_container");
    pagesPanel = $("#left_bar");
    
    // defined in CSS
    pagesPanelWidth = pagesPanel.outerWidth();
    
    ddd("Pages panel width: " + pagesPanelWidth);
    
    this.domNode = pagesPanel;
    this.visible = false;
    this.pageMap = {};
    
    try {
      $("#page_browser_control_bar").click(this.performAction.pBind(this));
    }
    catch (ex) {
      ddt();
    }   
    
  },
  
  performAction: function(e) {
    //e.preventDefault();
    //clickedButton = $(e.target).closest(".action_button");
    //try {
    //  // first look if action is defined in the page browser controller. Otherwise try to delegate the action to the page editor
    //  if (this[clickedButton.attr("id")]) {
    //    this[clickedButton.attr("id")].apply(this, [e]);
    //  }
    //  else {
    //    WebDoc.application.pageEditor[clickedButton.attr("id")].apply(WebDoc.application.pageEditor, [e]);
    //  }
    //}
    //catch(ex) {
    //  ddd("unknown toolbar action: " + clickedButton.attr("id"));
    //  ddt();
    //}    
  },

  //addPage: function(e) {
  //    WebDoc.application.pageEditor.addPage(e);
  //},
  //
  //copyPage: function(e) {
  //    WebDoc.application.pageEditor.copyPage(e);
  //},
  //
  //removePage: function(e) {
  //    WebDoc.application.pageEditor.removePage(e);
  //},
  
  setDocument: function(document) {
    this.document = document;   
    this.document.addListener(this); 
  },
  
  toggleBrowser: function() {
    var pageBroaserButton = $("a[href='#left-panel-toggle']");
    if (this.visible) {
      pagesPanel.animate({
          marginLeft: -pagesPanelWidth
      }, {
          step: function(val){
              boardPanel.css({
                  left: pagesPanelWidth + val
              });
          }
      });
     pageBroaserButton.removeClass(currentClass);
    }
    else {       
      pagesPanel.animate({
          marginLeft: 0
      }, {
          step: function(val){
              boardPanel.css({
                  left: pagesPanelWidth + val
              });
          }
      });
      pageBroaserButton.addClass(currentClass);      
    }
    this.visible = !this.visible;
  },

  initializePageBrowser: function() {
    ddd('[WebDoc.pageBrowserController] Initialising Page Browser');
    
    var pageBrowserItems = this.domNode.find( pageBrowserItemsSelector ),
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
    
    this.bindPageBrowserEvents();
    WebDoc.application.boardController.addCurrentPageListener(this);
  },

  bindPageBrowserEvents: function() {
    // You can bind to any parent of this - .inspector might be a better choice
    var pageBrowserItems = this.domNodeBrowserItems;
    
    pageBrowserItems
    .bind('click', jQuery.delegate({
        '.cancel':            this.cancelEditTitle.pBind(this),
        'li':                 this.selectCurrentPage.pBind(this)
      })
    )
    .bind('keydown', jQuery.delegate({
        'input[type=text]':   this.keydownEditTitle.pBind(this)
      })
    )
    .bind('submit', jQuery.delegate({
        'form':               this.submitEditTitle.pBind(this) 
      })
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
    this.selectPageUI( page );
  },
  
  objectChanged: function(page) {
    
  },
  
  pageAdded: function(page) {
    ddd("[pageBrowserController] pageAdded");
    var currentPageId = WebDoc.application.pageEditor.currentPage.uuid(),
        currentPageItem = this.pageMap[ currentPageId ],
        pageItem = new WebDoc.PageBrowserItemView(page);
    
    this.pageMap[ page.uuid() ] = pageItem;
    
    if ( !this._stateThumbs ) {
      pageItem.thumbNode.css({
        height: 0
      });
    }
    
    // Then put it in the DOM
    currentPageItem.domNode.after( pageItem.domNode );
    this._updateIndexNumbers();
    pageItem.editTitle();
  },
  
  pageRemoved: function(page) {
    var id = page.uuid(),
        pageBrowserItem = this.pageMap[ page.uuid() ];
    
    ddd('[pageBrowserController] pageRemoved: '+id);
    
    pageBrowserItem.domNode.remove();
    this.pageMap[ page.uuid() ] = null;
  },

  pageMoved: function(page, newPosition, previousPosition) { 
    if(!changedFromDrag) { // Dragged from another session, must update GUI
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
     changedFromDrag = true;
     
     if (pageToSave) {
       pageToSave.save();
     }
     
     changedFromDrag = false;
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

  selectPage: function( page ) {
    // Page browser UI selection
    this.selectPageUI( page );
    WebDoc.application.pageEditor.loadPage( page );
  },

  selectPageUI: function( page ) {
    var currentPageId = WebDoc.application.pageEditor.currentPage.uuid(),
        newPageId = page.uuid(),
        pageBrowserItem = this.pageMap[ page.uuid() ];
    
//    if ( currentPageId !== newPageId ) {
      this.domNodeBrowserItems.children().removeClass(currentClass);
      pageBrowserItem.domNode.addClass(currentClass);
//    }
  },
  
  // Title handlers --------------------------------------------------
  
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
  
  _stateThumbs: defaultThumbState,
  
  // Methods return current state of thumbs
  
  toggleThumbs: function() {
    return this._stateThumbs ? this.hideThumbs() : this.showThumbs() ;
  },
  
  hideThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( pageThumbSelector );
    
    thumbs
    .animate({
      height: 0
    }, {
      duration: 200,
      complete: function(){
        browserNode.addClass( hideThumbsClass );
      }
    });
    
    $( thumbStateButtonSelector ).removeClass( currentClass );
    
    this._stateThumbs = false;
    return this._stateThumbs;
  },
  
  showThumbs: function() {
    var browserNode = this.domNodeBrowserItems,
        thumbs = browserNode.find( pageThumbSelector );
    
    browserNode.removeClass( hideThumbsClass );    
    thumbs
    .animate({
      height: 75
    }, {
      duration: 200
    });
    
    $( thumbStateButtonSelector ).addClass( currentClass );
    
    this._stateThumbs = true;
    return this._stateThumbs;
  }
});

})(jQuery);