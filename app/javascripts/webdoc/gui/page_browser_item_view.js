/**
 * @author David / Stephen
 */
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/gui/item_thumbnail_view>

(function(){

var defaultClass = 'default',
    screenClass = 'screen layer',
    numberClass = 'number',
    cancelClass = 'cancel',
    popClass = 'pop';

WebDoc.PageBrowserItemView = $.klass({
  
  LOADING_ICON_CLASS: 'loading-icon',
  EDIT_ICON_CLASS: 'edit-icon mode-edit-show',
  THUMB_CLASS: 'thumb',
  DEFAULT_CLASS: 'default',
  
  initialize: function(page) {
    var self = this;
    
    this.page = page;
    
    try {
      var pageItem = $('<li/>', { draggable: "true" }),
          pageItemScreen = jQuery('<div/>', { 'class': "layer" }),
          pageItemNumber = $('<span/>').addClass(numberClass),
          pageItemLoading = $('<span/>').addClass( this.LOADING_ICON_CLASS ),
          pageItemThumb = $('<div/>').addClass( this.THUMB_CLASS + " " + page.document.styleClass() ),
          pageItemThumbView = new WebDoc.PageThumbnailView(page, 128, 128).domNode;
      
      this.domNode = pageItem;
      this.thumbNode = pageItemThumb;
      
      // Construct Item DOM tree
      pageItem
      .append(
        pageItemThumb
        .append( pageItemThumbView )
      )
      //.append( pageItemEdit )
      .append( pageItemScreen )
      .append( pageItemNumber )
      .append( pageItemLoading );

      page.document.addListener(this);
      page.addListener(this);
    }
    catch(e) {
      ddd("PageBrowserItemView: initialize: error: "+e);
    }
  },
  
  destroy: function() {
    ddd("destroy page browser item view", this);
    this.page.removeListener(this);
    this.page.document.removeListener(this);
    this.domNode.remove();
  },
  
  objectChanged: function(record, options) {
    ddd("[PageBrowserItemView] objectChanged", record);
    switch(record.className()) {
      case "page":
        //this.updateTitle(record);
        break;
      case "document":
        if (record._isAttributeModified(options, 'theme')) {
          var previousThemeClass = WebDoc.application.boardController.previousThemeClass,
              currentThemeClass = WebDoc.application.boardController.currentThemeClass;

          if (previousThemeClass) {
            this.thumbNode.removeClass(previousThemeClass);
          }
          this.thumbNode.addClass(currentThemeClass);
        }
        break;
    }
  },

  innerHtmlChanged: function() {
    ddd('innerHTMLChanged');
    //this.checkUpdateTitle();
  },

  itemAdded: function(addedItem) {
   // If page contains a single text item, it will be used to define the page title, so
   // add a listener to this item so it will notify its changes to the related browser node
   if(this.page.nbTextItems()===1 && addedItem.type() === "text") {
     addedItem.addListener(this);
   }
   //this.checkUpdateTitle();
  },

  itemRemoved: function(removedItem) {
   ddd('page_browser_item_view: itemRemoved');
   //this.checkUpdateTitle();
  },
  
});

})();