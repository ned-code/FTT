/**
 * @author david
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
    titleClass = 'title',
    popClass = 'pop';

WebDoc.PageBrowserItemView = $.klass({
  initialize: function(page) {
    this.page = page;
    try {
      var titleObj = this.getPageTitle(page),
          pageItem = $('<li/>'),
          pageForm = $('<form/>').attr({ method: 'post' }).addClass(popClass),
          pageTitle = $('<input/>').attr({ type: 'text' }),
          pageSubmit = $('<input/>').attr({ type: 'submit' }),
          pageCancel = $('<a/>').attr({ href: '#cancel' }).addClass(cancelClass),
          pageFormScreen = $('<div/>').addClass(screenClass),
          pageItemNumber = $('<span/>').addClass(numberClass),
          pageItemLoading = $('<span/>').addClass(numberClass),
          pageItemHead = $('<div/>').addClass(titleClass),
          pageItemThumb = new WebDoc.PageThumbnailView(page, 100, 75).domNode;
      
      this.domNode = pageItem;
      this.thumbNode = pageItemThumb;
      this._titleNode = pageTitle;
      this._popNode = pageForm;
      
      // If the title is default
      if(titleObj.defaultBehavior) {
        if( this.page.nbTextItems() > 0 ) {
          this.page.getFirstTextItem().addListener(this);
        }
        pageTitle.addClass( defaultClass );
      }
      
      // Construct DOM tree
      pageItem.append(
        pageItemHead.append(
          pageForm.append(
            pageTitle.val( titleObj.title )
          ).append(
            pageSubmit.val( 'Save' )
          ).append(
            pageCancel.text( 'Cancel' )
          ).append(
            pageFormScreen
          )
        )
      ).append(
        pageItemThumb
      ).append(
        pageItemNumber
      );
      
      page.addListener(this);
    }
    catch(e) {
      ddd("PageBrowserItemView: initialize: error: "+e);
    }
  },
  
  editTitle: function( str ) {
    //console.log('EDIT');
    if ( typeof str === 'undefined' ) {
      this._popNode.trigger('open');
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

  updateTitle: function(page, removeDefaultClass){
    // Find item related to this page
    var targetItem = $("#browser_item_" + page.uuid()),
        panelTitle = $(".page_browser_item_title", targetItem[0]),
        currentTitle = $(panelTitle).html(),
        newTitle = this.getPageTitle(page).title;
    
    if(currentTitle !== newTitle) {
        $(panelTitle).html( this.getPageTitle(page).title );
    }
    
    if(removeDefaultClass) {
        $(panelTitle).removeClass('page_browser_item_title_default');
    }
  },
  
  objectChanged: function(page) {
    switch(page.className()) {
      case "page":
        this.updateTitle(page, true);
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
     //console.log('itemAdded = text');
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
    else {
      return  { title: this.cropTitleToFit(page.data.title), defaultBehavior: false };
    }
  },

  checkUpdateTitle: function() {
    var title = this.getPageTitle(this.page),
        currentTitle = this._titleNode.val();
    
    if(title.title !== currentTitle) this._titleNode.val(title.title);
    
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