/**
 * @author David / Stephen
 */
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/gui/item_thumbnail_view>

(function(){

var defaultTitle = 'enter a title',
    defaultClass = 'default',
    screenClass = 'screen layer',
    numberClass = 'number',
    cancelClass = 'cancel',
    popClass = 'pop';

WebDoc.PageBrowserItemView = $.klass({
  
  TITLE_CLASS: 'page-title',
  LOADING_ICON_CLASS: 'loading-icon',
  EDIT_ICON_CLASS: 'edit-icon',
  THUMB_CLASS: 'thumb',
  DEFAULT_CLASS: 'default',
  
  initialize: function(page) {
    this.page = page;
    try {
      var titleObj = this.getPageTitle(page),
          pageItem = $('<li/>'),
          pageItemTitle = $('<div/>').addClass( this.TITLE_CLASS ),
          pageItemNumber = $('<span/>').addClass(numberClass),
          pageItemEdit = $('<a/>', {href: '#pop', target: 'pop', title: 'Click to edit'}).addClass( this.EDIT_ICON_CLASS ),
          pageItemLoading = $('<span/>').addClass( this.LOADING_ICON_CLASS ),
          pageItemThumb = $('<div/>').addClass( this.THUMB_CLASS ),
          pageItemThumbView = new WebDoc.PageThumbnailView(page, 120, 90).domNode,
          popForm = $('<form/>', { method: 'post', class: popClass }),
          popTitle = $('<input/>', { type: 'text', title: 'Page title' }),
          popSubmit = $('<input/>', { type: 'submit' }),
          popCancel = $('<a/>', { href: '#cancel', class: cancelClass });
      
      this.domNode = pageItem;
      this.thumbNode = pageItemThumb;
      this._titleNode = pageItemTitle;
      
      // If the title is default
      if(titleObj.defaultBehavior) {
        if( this.page.nbTextItems() > 0 ) {
          this.page.getFirstTextItem().addListener(this);
        }
        pageItemTitle.addClass( defaultClass );
      }
      
      // Construct Pop DOM Tree
      popForm
      .append( popTitle )
      .append( popCancel )
      .append( popSubmit );
      
      // Construct DOM tree
      pageItem
      .append(
        pageItemTitle
        .text( titleObj.title )
      )
      .append(
        pageItemThumb
        .append( pageItemThumbView )
      )
      .append( pageItemEdit )
      .append( pageItemNumber )
      .append( pageItemLoading );
      
      // Store pop form in data
      pageItemEdit.data('pop', {
        node: popForm,
        submit: this.updateTitle,
        cancel: undefined
      });
      
      page.addListener(this);
    }
    catch(e) {
      ddd("PageBrowserItemView: initialize: error: "+e);
    }
  },
  
  editTitle: function( str ) {
    if ( typeof str === 'undefined' ) {
      this.pageItemEdit.trigger('click');
    }
    else {
      // _changeTitle for string
    }
  },
  
  destroy: function() {
    ddd("destroy page browser item view", this);
    this.page.removeListener(this);
    this.domNode.remove();
  },

  updateTitle: function(page){
    ddd("[PageBrowserController] Update title");
    // Find item related to this page
    var newTitle = this.getPageTitle(page).title;
    
    if( newTitle ) {
        this._titleNode
        .text( newTitle )
        .removeClass( this.DEFAULT_CLASS );
    }
  },
  
  objectChanged: function(page) {
    ddd("[PageBrowserItemView] objectChanged", page);
    switch(page.className()) {
      case "page":
        this.updateTitle(page);
        break;
    }
  },

  innerHtmlChanged: function() {
    ddd('innerHTMLChanged');
    this.checkUpdateTitle();
  },

  itemAdded: function(addedItem) {
   // If page contains a single text item, it will be used to define the page title, so add a listener to this item so it will notifiy its changes to the related browser node
   if(this.page.nbTextItems()===1 && addedItem.type() === "text") {
     addedItem.addListener(this);
   }
   this.checkUpdateTitle();
  },

  itemRemoved: function(removedItem) {
   ddd('page_browser_item_view: itemRemoved');
   this.checkUpdateTitle();
  },

  // Iterates through the page items and if contains a text item, takes it as page title
  // Otherwise, returns a default name
  getPageTitle: function(page) {
    if(!page.data.title || page.data.title === "undefined") {
      if(page.data.data && page.data.data.externalPage) {
        return { title: this.cropTitleToFit(page.data.data.externalPageUrl), defaultBehavior: true} ;
      }
      else {
        for(var itemIndex in page.items) {
          if(page.items[itemIndex].type() == "text") {
            if(page.items[itemIndex].getInnerText() != "") {
              //console.log('getPageTitle - pageItem exists');
              return { title: this.cropTitleToFit(page.items[itemIndex].getInnerText()), defaultBehavior: true};
            }
            else {
              return { title: defaultTitle, defaultBehavior: true};
            }
          }
        }
        return { title: defaultTitle, defaultBehavior: true};
      }
    }
    else {
      return  { title: this.cropTitleToFit(page.data.title), defaultBehavior: false };
    }
  },

  checkUpdateTitle: function() {
    var title = this.getPageTitle(this.page),
        currentTitle = this._titleNode.text();
    
    if(title.title !== currentTitle) this._titleNode.text(title.title);
    
    if(title.defaultBehavior) {
      this._titleNode.addClass(defaultClass);
    }
    else {
      this._titleNode.removeClass(defaultClass);
    }
  },
  
  cropTitleToFit: function(title) {
    var titleMaxLength = 20;
    if(title.length > titleMaxLength) {
      return title.substr(0, titleMaxLength)+"...";
    }
    else {
      return title;
    }
  }
});

})();