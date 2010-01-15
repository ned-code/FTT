/**
 * @author julien
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>
//= require <webdoc/gui/page_browser_item_view>

WebDoc.PageBrowserController = $.klass({
  initialize: function() {
    ddd("init page browser");
    this.domNode = $("#left_bar");
    this.visible = false;
    this.pageThumbs = [];
    this.pageMap = {}; 
		try {
      $("#page_browser_control_bar").click(this.performAction.pBind(this));
    }
    catch (ex) {
      ddt();
    }   
  },

	performAction: function(e) {
    e.preventDefault();
    clickedButton = $(e.target).closest(".action_button");
    try {
      // first look if action is defined in the page browser controller. Otherwise try to delegate the action to the page editor
      if (this[clickedButton.attr("id")]) {
        this[clickedButton.attr("id")].apply(this, [e]);
      }
      else {
        WebDoc.application.pageEditor[clickedButton.attr("id")].apply(WebDoc.application.pageEditor, [e]);
      }
    }
    catch(ex) {
      ddd("unknown toolbar action: " + clickedButton.attr("id"));
      ddt();
    }    
  },

	addPage: function(e) {
		WebDoc.application.pageEditor.addPage(e);
	},
	
	copyPage: function(e) {
		WebDoc.application.pageEditor.copyPage(e);
	},
	
	removePage: function(e) {
		WebDoc.application.pageEditor.removePage(e);
	},
  
  setDocument: function(document) {
    this.document = document;    
  },
  
  toggleBrowser: function(callBack) {
    if (this.visible) {
      this.document.removeListener(this);
      WebDoc.application.boardController.removeCurrentPageListener(this);
      this.domNode.animate({
        width: "0px"
      }, function() {
            this.domNode.find("ul:first").empty();
            callBack.call(this); 
      }.pBind(this));
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginLeft: "0px"
        });
      }    
      this.domNode.unbind();  
      ddd("browser", $("#page_browser"));
      $("#page_browser").removeClass("toggle_on_panel"); 
      this.deletePageThumbs();
      this.domNode.find("ul").empty();          
    }
    else {
      this.document.addListener(this);
      WebDoc.application.boardController.addCurrentPageListener(this);      
      this.domNode.animate({
        width: "165px"
      }, callBack);
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginLeft: "170px"
        });
      }            
      $("#page_browser").addClass("toggle_on_panel");
      this.refreshPages();      
    }
    this.visible = !this.visible;
  },
  
  refreshPages: function() {   
    ddd("refresh all pages");
		this.domNode.find("ul.page_browser_numbered_list").empty();
    this.domNode.find("ul#page_browser_items").empty(); 
    this.deletePageThumbs();
    for (var i = 0; i < this.document.pages.length; i++) {
      var aPage = this.document.pages[i];
			var pageThumb = new WebDoc.PageBrowserItemView(aPage);
      var pageListItem = $("<li>").html(pageThumb.domNode);
			var pageListNumber = $("<li>"+(i+1)+"</li>");
      this.domNode.find("ul#page_browser_items").append(pageListItem);
			this.domNode.find("ul.page_browser_numbered_list").append(pageListNumber);
      this.pageThumbs.push(pageThumb);
      this.pageMap[pageThumb.domNode.attr("id")] = pageThumb;
    }
    this.updateSelectedPage();

		$("#page_browser_items").sortable({
			handle: '.page_browser_item_draggable_area',
			start:  this.dragStart.pBind(this),
			update: this.dragUpdate.pBind(this),
			containment: 'div#page_browser'
		});
		var divToHide = $('.page_browser_item_title_edition');
		$(divToHide).hide();
		$('.page_browser_item').bind('click', this.selectCurrentPage.pBind(this));
		$('.page_browser_item').bind('mouseover', this.changeCurrentHighlightedItem.pBind(this));
		$('.page_browser_item_information').bind('click', this.showPageInspector);
		$('.page_browser_item_title').dblclick(this.staticPanelAction.pBind(this));
		$('.page_browser_item_title_edition').dblclick(this.editPanelAction.pBind(this));
		$('.page_title_cancelButton').click(this.editPanelAction.pBind(this));
		$('.page_title_saveButton').click(this.saveButtonAction.pBind(this));
		$('.page_title_textbox').bind('keydown', this.titleBoxKeyDownAction.pBind(this));
  },
  
  deletePageThumbs: function() {
    ddd("delete pages thumbs", this.pageThumbs);
    this.domNode.find("ul").unbind();
    for (var i = 0; i < this.pageThumbs.length; i++) {
      this.pageThumbs[i].destroy();
    }
    this.pageThumbs = [];
    delete this.pageMap;
    this.pageMap = {};
  },
   
  updateSelectedPage: function() {
    var selectedPage = WebDoc.application.boardController.currentPage;
    var target = $("#browser_item_" + selectedPage.uuid());
    this.selectPageUI(target);
  },
  
  objectChanged: function(page) {
	  ddd('page_browser_controller: objectChanged');
  },
  
  pageAdded: function(page) {
    ddd("added page");
    this.refreshPages();
  } ,
  
  pageRemoved: function(page) {
    ddd("removed page");
    this.refreshPages();
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
     var droppedPageBrowserItem = $(ui.item).children('.page_browser_item');
     var droppedPage = this.pageMap[droppedPageBrowserItem.attr("id")].page;
     var droppedPagePosition = $('#page_browser_items > li').index(ui.item);
     var pageToSave = WebDoc.application.pageEditor.currentDocument.movePage(droppedPage.uuid(), droppedPagePosition);
     if (pageToSave) {
       pageToSave.save();
     }
   },

   selectCurrentPage: function(event) {
     var targetItem = $(event.target).closest('.page_browser_item');
     this.selectPage(targetItem).pBind(this);
   },

   changeCurrentHighlightedItem: function(event) {
     if(!$(event.target).hasClass('page_browser_item_highlighted')) {
       $('.page_browser_item').removeClass('page_browser_item_highlighted');
       $(event.target).closest('.page_browser_item').addClass('page_browser_item_highlighted');
     }
   },

   showPageInspector: function(event) {
     WebDoc.application.rightBarController.showPageInspector();
   },

   selectPage: function(target) {
     // Page browser UI selection
     this.selectPageUI(target);

     // Page editor selection
     var droppedPageId = target.attr("id");
     var droppedPage = this.pageMap[droppedPageId].page;
     WebDoc.application.pageEditor.loadPage(droppedPage);
   },

   selectPageUI: function(target) {
     if(!$(target).hasClass('page_browser_item_selected')) {
       $('.page_browser_item').removeClass('page_browser_item_selected');
       $(target).addClass('page_browser_item_selected');
     }
   },

   staticPanelAction: function(event) {
     this.showEditPanel(event.target);
   },

   editPanelAction: function(event) {
     this.showStaticPanel(event.target);
   },

   saveButtonAction: function(event) {
     this.saveTitle(event.target);
   },

   saveTitle: function(target) {
     var newTitle = $(target.parentNode).children('.page_title_textbox').val();
     var pageBrowserItem = $(target).closest('.page_browser_item');
     var page = this.pageMap[pageBrowserItem.attr("id")].page;
     page.setTitle(newTitle);

     this.showStaticPanel(target);
   },

   titleBoxKeyDownAction: function(event) {
     switch(event.keyCode){
       case 13: // Return key
         this.saveTitle(event.target);
         break;
       case 27: // Escape key
         this.showStaticPanel(event.target);
         break;
     }
   },

   showEditPanel: function(target) {
	   var textBox = $(target).next().children()[0];
     textBox.value = $(target).closest('.page_browser_item_title').text();
     $(target).closest('.page_browser_item_title').hide();
     $(target).closest('.page_browser_item_title').next().show();
     textBox.focus();
     textBox.select();
   },

   showStaticPanel: function(target) {
     $(target).closest('.page_browser_item_title_edition').hide();
     $(target).closest('.page_browser_item_title_edition').prev().show();
   }
});

$.extend(WebDoc.PageBrowserController, {});
