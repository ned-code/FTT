/**
 * viewer of webdoc.
 * 
 * @author Julien Bachmann
**/


// application singleton.
WebDoc.application = {};

WebDoc.WebdocViewer = $.klass(MTools.Application,{
    
  initialize: function($super, viewerNode) {
    $super();
    this._currentDocument = null;
    this._currentPage = null;
    this._currentPageView = null;
    this._viewerNode = viewerNode;
    this._containerNode = null;   

    viewerNode.data('object', this);
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
      this._currentPageView.eventCatcherNode.css("cursor", "pointer");
      this._containerNode.empty().append(this._currentPageView.domNode);
      this._currentPageView.viewDidLoad();
      var width = this._viewerNode.width();
      var height = this._viewerNode.height();
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
    var pageLayout = jQuery("<div/>").addClass("layer").css( {overflow: "hidden" }).append(jQuery("<div/>").addClass("center").append(jQuery("<div/>").addClass("center-cell").append(this._containerNode)));

    this._viewerNode.append(pageLayout);
  }
});

$.extend(WebDoc.WebdocViewer, {
  showViewers: function() {
    // change domain to be able to synch with apps
    var allDomainsParts = document.domain.split(".");
    if (allDomainsParts.length > 2) {
      document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    } 
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    var allViewerContainers = jQuery(".webdoc-viewer-container");
    for (var i = 0; i < allViewerContainers.length; i++) {
      var aViewerContainer = jQuery(allViewerContainers[i]);
      var viewer = new WebDoc.WebdocViewer(aViewerContainer);
      viewer.load(aViewerContainer.id());
    }
  }
});
