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
    this._currentPageView = null;
    this._viewerNode = viewerNode;
    this._containerNode = null;   
    WebDoc.application.pageEditor = this;

    viewerNode.data('object', this);
        
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
      // Clean previous page view
      if (this._currentPageView) {
        this._currentPageView.destroy();
      }
      this._currentPage = page;  
      this._currentPageView = new WebDoc.PageView(page,this._containerNode);
      this._currentPageView.eventCatcherNode.show();
      this._currentPageView.eventCatcherNode.css("cursor", "move");
      this._containerNode.empty().append(this._currentPageView.domNode);
      var width = this._viewerNode.width();
      var height = this._viewerNode.height() - this.TOOL_BAR_HEIGHT; 
      ddd("fit page view to ", width, height);   
      this._currentPageView.fitInContainer(width, height);
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
