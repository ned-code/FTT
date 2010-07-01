/**
 * viewer of webdoc.
 * 
 * @author Julien Bachmann
**/


// application singleton.
WebDoc.application = {};

WebDoc.WebdocViewer = $.klass(WebDoc.Application,{
    
  initialize: function($super, viewerNode, statik) {
    $super();

    if(statik === undefined || statik === false) {
      this._static = false;
    }
    else {
      this._static = true;
    }

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
    WebDoc.ServerManager.getRecords(WebDoc.Document, documentId, function(data)
    {
      this._currentDocument = data[0];
      this.loadPageId("1");
      if(this._static === false) {
        var stylesheetUrl = this._currentDocument.styleUrl(),
          newClass = this._currentDocument.styleClass();

        //check if style is already loaded
        var styleElement = jQuery('#' + newClass);
        if (styleElement.length === 0) {
          jQuery('head').append('<link id="' + newClass + '" type="text/css" rel="stylesheet" media="all" href="' + stylesheetUrl + '">');
        }
        this._containerNode.addClass(newClass);
      }
   
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

    ddd('load page ');
    ddd(page);

    if(!this._currentPage || this._currentPage.uuid() !== page.uuid()) {


      this._currentPage = page;
      var width = this._viewerNode.width();
      var height = this._viewerNode.height();

      if(this._static === true) {

        // todo calc ratio
        var ratio = 0.75;
        height = width * ratio;  
        if( height > this._viewerNode.height() ) {
          width = this._viewerNode.width() * ratio;
          height = this._viewerNode.height();
        }


        var staticThumbDomNode = $('<div>', {'class': 'webdoc', id: 'page_' + page.uuid()}),
            staticThumb = $('<img/>', { 'src': page.getThumbnailUrl(), 'height': height, 'width': width });

        staticThumbDomNode.css("cursor", "pointer");
        staticThumbDomNode.append(staticThumb);

        this._currentPageView = staticThumbDomNode;
        this._containerNode.css('height', height);
        this._containerNode.css('width', width);
        this._containerNode.empty().append(this._currentPageView);
      }
      else {
        // Clean previous page view
        if (this._currentPageView) {
          this._currentPageView.destroy();
        }
        this._currentPageView = new WebDoc.PageView(page,this._containerNode, false);
        this._currentPageView.eventCatcherNode.show();
        this._currentPageView.eventCatcherNode.css("cursor", "pointer");
        this._containerNode.empty().append(this._currentPageView.domNode);
        this._currentPageView.viewDidLoad();


        ddd("fit page view to ", width, height);
        this._currentPageView.fitInContainer(width, height);

      }

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
    window.location.href = "/documents/" + this._currentDocument.uuid() + "#" + this._currentPage.uuid();
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
  showViewers: function(statik) {
    var allViewerContainers = jQuery(".webdoc-viewer-container");
    for (var i = 0; i < allViewerContainers.length; i++) {
      var aViewerContainer = jQuery(allViewerContainers[i]);
      var viewer = new WebDoc.WebdocViewer(aViewerContainer, statik);
      viewer.load(aViewerContainer.id());
    }
  }
});
