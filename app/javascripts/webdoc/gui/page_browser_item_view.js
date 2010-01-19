/**
 * @author david
 */
//= require <mtools/record>
//= require <webdoc/model/item>
//= require <webdoc/gui/item_thumbnail_view>


WebDoc.PageBrowserItemView = $.klass({
  initialize: function(page) {
    this.page = page;

		try {
			this.domNode = $('<div>').attr({
				id: "browser_item_" + page.uuid()
			}).addClass("page_browser_item");
		
			this.draggableAreaNode = $('<div>').addClass('page_browser_item_draggable_area');
			this.titleContainerNode = $('<div>').addClass('page_browser_item_title_container');
		
			this.titleStaticNode = $('<div>').addClass('page_browser_item_title');
			var pageTitle = this.getPageTitle(this.page);
			$(this.titleStaticNode).get(0).innerHTML = pageTitle.title;
			if(pageTitle.defaultBehavior) {
				if(this.page.nbTextItems() > 0 ) this.page.getFirstTextItem().addListener(this);
				$(this.titleStaticNode).addClass('page_browser_item_title_default'); 
		  }
		
			this.titleEditionNode = $('<div>').addClass('page_browser_item_title_edition');
			this.titleEditionNode.append($('<input>').attr({
				type: "textbox",
				size: "12",
				value: $(this.titleStaticNode).text() != "enter a title"? $(this.titleStaticNode).text() : "this is my title"
			}).addClass('page_title_textbox'));
			this.titleEditionNode.append($('<input>').attr({
				type: "button",
				value: "Save"
			}).addClass('page_title_saveButton'));
			this.titleEditionNode.append($('<a>').attr({
				href: "#",
				innerHTML: "cancel"
			}).addClass('page_title_cancelButton'));
			this.titleEditionNode.hide();
		
			this.titleContainerNode.append(this.titleStaticNode);
			this.titleContainerNode.append(this.titleEditionNode);
		
			this.showInformationInspectorNode = $('<div>').addClass('page_browser_item_information');
		
			page.addListener(this);
			this.domNode.append(this.draggableAreaNode);
			this.domNode.append(this.titleContainerNode);
			this.domNode.append(this.showInformationInspectorNode);
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
    var targetItem = $("#browser_item_" + page.uuid());
    var panelTitle = $('.page_browser_item_title', targetItem);
    var currentTitle = $(panelTitle).get(0).innerHTML;
    var newTitle = this.getPageTitle(page).title;
    if(currentTitle != newTitle) {
      $(panelTitle).get(0).innerHTML = this.getPageTitle(page).title;
    }
		if(removeDefaultClass) {
      if($(panelTitle).hasClass('page_browser_item_title_default')) {
        $(panelTitle).removeClass('page_browser_item_title_default');
      }
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
            return { title: "enter a title", defaultBehavior: true};
          }
	      }
	    }
	    return { title: "enter a title", defaultBehavior: true};
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
    var titleMaxLength = 30;
    if(title.length > titleMaxLength) {
      return title.substr(0, titleMaxLength)+"...";
    }
    else {
	     return title;
    }
  }
});
