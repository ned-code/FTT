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
            this.domNode.find("ul").empty(); 
      }.pBind(this));
      $("#board_container").animate({
        marginLeft: "0px"
      }, callBack);    
      $("#left_bar").unbind();      
    }
    else {
      this.document.addListener(this);
      WebDoc.application.boardController.addCurrentPageListener(this);      
      this.refreshPages();
      this.domNode.animate({
        width: "215px"
      });
      $("#board_container").animate({
        marginLeft: "220px"
      }, callBack);
      ddd($("#page_browser"));
      $("#left_bar").click(this.changeSelectedPage.pBind(this));
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
    for (var i = 0; i < this.document.pages.length; i++) {
      var aPage = this.document.pages[i];
      var pageThumb = new WebDoc.PageThumbnailView(aPage).domNode;
      
      var pageListItem = $("<li>").append(pageThumb);
      this.domNode.find("ul:first").append(pageListItem);
    }
    this.updateSelectedPage();
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
  }
});

$.extend(WebDoc.PageBrowserController, {});
