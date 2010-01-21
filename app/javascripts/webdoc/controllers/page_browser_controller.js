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
    pagesPanelWidth = 150;

WebDoc.PageBrowserController = $.klass({
  initialize: function() {
    ddd("init pages panel");
    
    boardPanel = $("#board_container");
    pagesPanel = $("#left_bar");
    pagesPanelWidth = pagesPanel.outerWidth();
    
    ddd("Pages panel width: " + pagesPanelWidth);
    
    this.domNode = pagesPanel;
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
  
  toggleBrowser: function() {
    var pageBroaserButton = $("#page-browser").find("a");
    if (this.visible) {
      this.document.removeListener(this);
      WebDoc.application.boardController.removeCurrentPageListener(this);
      
      pagesPanel.animate({
          marginLeft: -pagesPanelWidth
      }, {
          step: function(val){
              boardPanel.css({
                  left: pagesPanelWidth + val
              });
          }
      });
     pageBroaserButton.removeClass("current");
    }
    else {
      this.document.addListener(this);
      WebDoc.application.boardController.addCurrentPageListener(this);      
      
      pagesPanel.animate({
          marginLeft: 0
      }, {
          step: function(val){
              boardPanel.css({
                  left: pagesPanelWidth + val
              });
          }
      });
      pageBroaserButton.addClass("current");      
    }
    this.visible = !this.visible;
  },

  initializePageBrowser: function() {
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
      containment: 'div#page_browser_left'
    });
    this.bindPageBrowserItemsEvents();
  },

  bindPageBrowserItemsEvents: function() {
    this.unbindPageBrowserItemsEvents();
    $('.page_browser_item')
    .bind('click', this.selectCurrentPage.pBind(this))
    //.bind('mouseover', this.changeCurrentHighlightedItem.pBind(this)); // Provisory, maybe will be used later
    $('.page_browser_item_information').bind('click', this.showPageInspector);
    $('.page_browser_item_title').dblclick(this.staticPanelAction.pBind(this));
    $('.page_browser_item_title_edition').dblclick(this.editPanelAction.pBind(this));
    $('.page_title_cancelButton').click(this.editPanelAction.pBind(this));
    $('.page_title_saveButton').click(this.saveButtonAction.pBind(this));
    $('.page_title_textbox').bind('keydown', this.titleBoxKeyDownAction.pBind(this));
  },

  unbindPageBrowserItemsEvents: function() {
    $('.page_browser_item')
    .unbind('click')
    //.unbind('mouseover');
    $('.page_browser_item_information').unbind('click');
    $('.page_browser_item_title').unbind('dblclick');
    $('.page_browser_item_title_edition').unbind('dblclick');
    $('.page_title_cancelButton').unbind('click');
    $('.page_title_saveButton').unbind('click');
    $('.page_title_textbox').unbind('keydown');
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
    
  },
  
  pageAdded: function(page) {
     ddd("added page");
    var pageThumb = new WebDoc.PageBrowserItemView(page);
    pageThumb.addToBrowser();
    // Update arrays
    this.pageThumbs.push(pageThumb);
    this.pageMap[pageThumb.domNode.attr("id")] = pageThumb;

    this.bindPageBrowserItemsEvents();
  } ,
  
  pageRemoved: function(page) {
    // Deleted item in the browser is the one after the current selected
    var currentListItem = $('.page_browser_item.page_browser_item_selected').parent().next();
    var currentItemId = "browser_item_" + page.uuid();
    ddd("removed page: "+currentItemId);
    currentListItem.remove();
    // Remove item to numbered list
    lastItem = $('ul.page_browser_numbered_list > li:last');
    lastItem.remove();
    // Update arrays
    this.pageMap[currentItemId] = [];
    this.removeById(this.pageThumbs, currentItemId);
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
     this.selectPage(targetItem);
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
     switch(event.which){
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
     $(target).closest('.page_browser_item_title').hide().next().show();
     textBox.focus().select();
   },

   showStaticPanel: function(target) {
     $(target).closest('.page_browser_item_title_edition').hide().prev().show();
   },

   removeById: function(arrayName,arrayElementId) {
     for(var i=0; i<arrayName.length;i++ ) { 
       if(arrayName[i].domNode.attr("id") == arrayElementId) {
         arrayName.splice(i,1); 
       }
     } 
   }
});

$.extend(WebDoc.PageBrowserController, {});

})(jQuery);