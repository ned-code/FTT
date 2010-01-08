/**
 * @author julien
 */
//= require <webdoc/model/document>
//= require <webdoc/model/page>
//= require <webdoc/gui/page_thumbnail_view>

WebDoc.PageBrowserController = $.klass({
  initialize: function() {
    ddd("init page browser");
    this.domNode = $("#left_bar");
    this.visible = false;
    this.pageThumbs = [];
    this.pageMap = {};    
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
      this.domNode.click(this.changeSelectedPage.pBind(this));             
      $("#page_browser").addClass("toggle_on_panel");
      this.refreshPages();      
    }
    this.visible = !this.visible;
  },
  
  changeSelectedPage: function(e) {
      var clickedThumb = $(e.target).closest(".page_thumb");
      if (clickedThumb && clickedThumb.length) {
        var pageId = clickedThumb.attr("id").substring(6);
        WebDoc.application.pageEditor.loadPageId(pageId);
      }
  },
  
  refreshPages: function() {   
    ddd("refresh all pages");
    this.domNode.find("ul").empty(); 
    this.deletePageThumbs();
    for (var i = 0; i < this.document.pages.length; i++) {
      var aPage = this.document.pages[i];
      var pageThumb = new WebDoc.PageThumbnailView(aPage);
      var pageListItem = $("<li>").html(pageThumb.domNode);
      this.domNode.find("ul:first").append(pageListItem);
      this.pageThumbs.push(pageThumb);
      this.pageMap[pageThumb.domNode.attr("id")] = pageThumb;
    }
    this.updateSelectedPage();
    var pageList = this.domNode.find("ul");
    pageList.unbind();    
    pageList.bind("dragstart", this.dragStart.pBind(this));    
    pageList.bind("dragenter", this, this.dragEnter.pBind(this));    
    pageList.bind("dragover", this, this.dragOver.pBind(this));
    pageList.bind("dragleave", this, this.dragLeave.pBind(this));    
    pageList.bind("drop", this, this.drop.pBind(this));    
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
    $(".page_thumb").removeClass("selected_thumb");
    var selectedPage = WebDoc.application.boardController.currentPage; 
    ddd("set selecte d page " + "#thumb_" + selectedPage.uuid());
    $("#thumb_" + selectedPage.uuid()).addClass("selected_thumb");
  },
  
  objectChanged: function(page) {
    
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
  
  dragStart: function(e) {
    ddd("start drag");
    var dragged_page_thumb = $(e.target).closest(".page_thumb");
    ddd("dragged page thumb", this.pageMap[dragged_page_thumb.attr("id")]);
    e.originalEvent.dataTransfer.effectAllowed = "copyMove";
    e.originalEvent.dataTransfer.setData('application/ub-page', $.toJSON({ page: this.pageMap[dragged_page_thumb.attr("id")].page.getData(true)}));  
    return true; 
  },

   dragOver: function(evt) {
     var isPage = $.inArray("application/ub-page", evt.originalEvent.dataTransfer.types);
     if (isPage != -1) {       
       evt.originalEvent.dataTransfer.effectAllowed = "copyMove";
       evt.preventDefault();
     }
     else {
       evt.originalEvent.dataTransfer.dropEffect = "none";     
     }
   },
   
   dragEnter: function(evt) {
     var isPage = $.inArray("application/ub-page", evt.originalEvent.dataTransfer.types);
     if (isPage != -1) {
       var droppedPageThumb = $(evt.target).closest(".page_thumb"); 
       evt.originalEvent.dataTransfer.effectAllowed = "copyMove";  
       evt.preventDefault();
       this.addInsertLine(droppedPageThumb);
     }
     else {
       evt.originalEvent.dataTransfer.dropEffect = "none";          
     }
   },
      
   dragLeave: function(evt) {
     this.removeInsertLine();
   },

   drop: function(evt) {
     ddd("drop"); 
     evt.preventDefault();
     var droppedPageThumb = $(evt.target).closest(".page_thumb"); 
     var droppedPage = this.pageMap[droppedPageThumb.attr("id")].page;
     var movedPageDescriptor = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/ub-page'));   
     ddd("moved page descriptor", movedPageDescriptor);   
     var movedPage = new WebDoc.Page(movedPageDescriptor, WebDoc.application.pageEditor.currentDocument);
     var droppedPagePosition = WebDoc.application.pageEditor.currentDocument.positionOfPage(droppedPage) - 1;
     ddd("drop document", droppedPage.data.document_id, "drag document", movedPage.data.document_id);
     if (droppedPage.data.document_id != movedPage.data.document_id || evt.originalEvent.dataTransfer.dropEffect == 'copy') {
       var copiedPage = movedPage.copy();
       ddd("exit copy", new Date());
       copiedPage.data.document_id = droppedPage.data.document_id;
       copiedPage.data.position = droppedPagePosition + 1;
       var importingMessage = $("<li>").html("importing...").addClass("page_thumb_importing");       
       droppedPageThumb.parent().after(importingMessage[0]);
       copiedPage.save(function(newObject, status)
       {
         WebDoc.application.pageEditor.currentDocument.addPage(copiedPage, true);
       });
     }
     else {
       var pageToSave = WebDoc.application.pageEditor.currentDocument.movePage(movedPage.uuid(), movedPage.data.position < droppedPagePosition? droppedPagePosition: droppedPagePosition+1);
       if (pageToSave) {
         pageToSave.save();
       }
     }
   },
   
   removeInsertLine: function() {
     $(".page_insert_line").remove();
   },
   
   addInsertLine: function(droppedPageThumb) {
     this.removeInsertLine();
     var insertLine = $("<li>").addClass("page_insert_line");
     droppedPageThumb.parent().after(insertLine);
   }
});

$.extend(WebDoc.PageBrowserController, {});
