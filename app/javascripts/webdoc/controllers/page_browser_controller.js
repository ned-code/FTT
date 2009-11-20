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
        width: "215px"
      }, callBack);
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginLeft: "220px"
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
      var pageListItem = $("<li>").append(pageThumb.domNode);
      this.domNode.find("ul:first").append(pageListItem);
      this.pageThumbs.push(pageThumb);
      this.pageMap[pageThumb.domNode.attr("id")] = pageThumb;
    }
    this.updateSelectedPage();
    this.domNode.find("ul").bind("mousedown", function(){ddd("down")});    
    this.domNode.find("ul").bind("dragstart", this.dragStart.pBind(this));    
    this.domNode.find("ul").bind("dragover", this, this.dragOver.pBind(this));
    this.domNode.find("ul").bind("drop", this, this.drop.pBind(this));    
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
    e.originalEvent.dataTransfer.setData('application/ub-page', $.toJSON(this.pageMap[dragged_page_thumb.attr("id")].page.data));  
    //e.originalEvent.dataTransfer.setDragImage($("#page_d_d_image")[0],0,0);     
    //e.originalEvent.dataTransfer.effectAllowed = "move";     
  },

   dragOver: function(evt) {
    var isPage = evt.originalEvent.dataTransfer.types.contains("application/ub-page");
    if (isPage) {
      evt.preventDefault();
    }
   },

   drop: function(evt) {
     ddd("drop"); 
     evt.preventDefault();
     var droppedPageThumb = $(evt.target).closest(".page_thumb"); 
     var droppedPage = this.pageMap[droppedPageThumb.attr("id")].page;
     var movedPage = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/ub-page')); 
     ddd("droppedPage", droppedPage, "movedPage", movedPage);
     WebDoc.application.pageEditor.currentDocument.movePage(movedPage.uuid, WebDoc.application.pageEditor.currentDocument.positionOfPage(droppedPage)-1);
   }
});

$.extend(WebDoc.PageBrowserController, {});
