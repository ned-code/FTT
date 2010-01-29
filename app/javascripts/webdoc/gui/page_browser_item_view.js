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
    popClass = 'pop';

WebDoc.PageBrowserItemView = $.klass({
  initialize: function(page) {
    this.page = page;
    try {
      var titleObj = this.getPageTitle(this.page),
          pageItem = $('<li/>').height(80),
          pageForm = $('<form/>').attr({ method: 'post', class: popClass }),
          pageTitle = $('<input/>').attr({ type: 'text' }),
          pageSubmit = $('<input/>').attr({ type: 'submit' }),
          pageCancel = $('<a/>').attr({ href: '#cancel', class: 'cancel' }),
          pageFormScreen = $('<div/>').attr({ class: screenClass }),
          pageItemNumber = $('<span/>').attr({ class: numberClass }),
          pageItemHead = $('<div/>'),
          pageItemThumb = $('<div/>');
      
      this.domNode = pageItem;
      
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
	  this.checkUpdateTitle();
  },

	itemAdded: function(addedItem) {
   // If page contains a single text item, it will be used to define the page title, so add a listener to this item so it will notifiy its changes to the related browser node
   if(this.page.nbTextItems()==1 && addedItem.type() == "text") {
     addedItem.addListener(this);
   }
   this.checkUpdateTitle();
  },

	itemRemoved: function(removedItem) {
   ddd('page_browser_item_view: itemRemoved');
   this.checkUpdateTitle();
  },

  addToBrowser: function() {
    var currentSelectedItem = $('.page_browser_item.page_browser_item_selected').parent();
    var newBrowserItem = $("<li>").html(this.domNode);
    currentSelectedItem.after(newBrowserItem);

    // Add item to numbered list as well
    $('ul.page_browser_numbered_list').append($('<li>').html($('ul.page_browser_numbered_list > li').length+1));
  },

  // Iterates through the page items and if contains a text item, takes it as page title
	// Otherwise, returns a default name
  getPageTitle: function(page) {
	  if(!page.data.title || page.data.title == "undefined") {
	    for(var itemIndex in page.items) {
	      if(page.items[itemIndex].type() == "text") {
          if(page.items[itemIndex].getInnerText() != "") {
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
      return  { title: this.cropTitleToFit(page.data.title), defaultBehavior: false};
    }
  },

  checkUpdateTitle: function() {
    if(this.page.items.length > 0) {
      var title = this.getPageTitle(this.page);
			var currentTitle = $(this.titleStaticNode).text();
			if(title.title != currentTitle) $(this.titleStaticNode).get(0).innerHTML = title.title;
    }
    else {
      $(this.titleStaticNode).text(this.getPageTitle(this.page).title);
      if($(this.titleStaticNode).hasClass('page_browser_item_title_default')) {$(this.titleStaticNode).removeClass('$(this.titleStaticNode)') }
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