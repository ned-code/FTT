/**
 * viewer of webdoc.
 * 
 * @author Julien Bachmann
**/


// application singleton.
WebDoc.application = {};

WebDoc.WebdocViewer = $.klass(MTools.Application,{
  
  TOOL_BAR_HEIGHT: 30,
  
  initialize: function($super, viewerNode) {
    $super();
    this._currentDocument = null;
    this._currentPage = null;
    this._viewerNode = viewerNode;
    this._containerNode = null;   
    WebDoc.application.pageEditor = this;
        
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    this._createViewerGUI();
  },

  load: function(documentId) {
    ddd("[Viewer] load " + documentId);              
    MTools.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
    {
      this._currentDocument = data[0];
      this.loadPageId("1");      
    }.pBind(this));
  },

  loadPageId: function(pageId) {
    ddd('[Viewer] loadPageId', pageId);
    if (!pageId) {
      pageId = "1";
    }
    
    var pageToLoad = this._currentDocument.findPageWithUuidOrPosition(pageId);
    ddd("found page", pageToLoad);
    if(pageToLoad) {
      this.loadPage(pageToLoad);
    }
  },
  
  loadPage: function(page) {
    if(!this._currentPage || this._currentPage.uuid() !== page.uuid()) {
      this._currentPage = page;  
      var pageView = new WebDoc.PageView(page,this._containerNode);      
      this._containerNode.empty().append(pageView.domNode);
      var width = this._viewerNode.width();
      var height = this._viewerNode.height() - this.TOOL_BAR_HEIGHT; 
      ddd("fit page view to ", width, height);   
      pageView.fitInContainer(width, height);
    }
  },
  
  prevPage: function() {
    var previousPage = this._currentDocument.previousPage(this._currentPage);
    if (previousPage) {
      this.loadPage(previousPage);
    }
  },
  
  nextPage: function() {
    var nextPage = this._currentDocument.nextPage(this._currentPage);
    if (nextPage) {
      this.loadPage(nextPage);
    }
  },
  
  open: function() {
    window.location.href = "/documents/" + this._currentDocument.uuid()
  },
  
  _createViewerGUI: function() {
    var tb = jQuery("<ul/>").addClass("wd-viewer-toolbar toolbar-panel tools pages-tools thumbs index icons-only").css({
      height: this.TOOL_BAR_HEIGHT,
      width: "100%",
      position: "absolute",
      top: "0px",
      zIndex: 10
    });
    var previous = jQuery('<li/>').append(jQuery('<a/>').attr("href", "#prev-page").click(jQuery.proxy(this,'prevPage')));
    var next = jQuery('<li/>').append(jQuery('<a/>').attr("href", "#next-page").click(jQuery.proxy(this,'nextPage')));
    var open = jQuery('<li/>').append(jQuery('<a/>').attr("href", "#open").text('open').click(jQuery.proxy(this,'open')));
    tb.append(previous).append(next).append(open);
    this._viewerNode.append(tb);
    this._containerNode = jQuery('<div/>').css({
      overflow: "hidden"  
    }).addClass("center-box");    
    var pageLayout = jQuery("<div/>").addClass("layer").css( {paddingTop: this.TOOL_BAR_HEIGHT, overflow: "hidden" }).append(jQuery("<div/>").addClass("center").append(jQuery("<div/>").addClass("center-cell").append(this._containerNode)));

    this._viewerNode.append(pageLayout);
  }
});

$.extend(WebDoc.WebdocViewer, {
  showViewers: function() {
    var allViewerContainers = jQuery(".webdoc-viewer-container");
    for (var i = 0; i < allViewerContainers.length; i++) {
      var aViewerContainer = jQuery(allViewerContainers[i]);
      var viewer = new WebDoc.WebdocViewer(aViewerContainer);
      viewer.load(aViewerContainer.id());
    }
  }
});
