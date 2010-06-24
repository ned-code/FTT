/**
 * Static page
 *
 * @author noe
 **/

WebDoc.application = {};

WebDoc.StaticPage = $.klass(WebDoc.Application,{

  initialize: function($super, documentUuid, pageUuid, secureToken) {
    $super();

    this.documentUuid = documentUuid;
    this.pageUuid     = pageUuid;
    this.secureToken  = secureToken;

    this.domNode = $('#static_page_content');

    WebDoc.application.staticPage = this;
  },

  start: function() {
    ddd("[static page] start");

    // change domain to be able to synch with apps
    var allDomainsParts = document.domain.split(".");
    if (allDomainsParts.length > 2) {
      document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    }

    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();

    WebDoc.Application.initializeSingletons([WebDoc.ThemeManager], function() {
      this._loadDocument();
    }.pBind(this));
  },

  _loadDocument: function() {
    ddd("[static page] load document");

    this.domNode.html('');
    this.domNode.addClass('loading');

    WebDoc.ServerManager.request('/documents/'+this.documentUuid+'/pages/'+this.pageUuid+'.json', function(data) {
      this._createView(data);
      this.domNode.removeClass('loading');
    }.pBind(this), 'GET', this._createAjaxParams());
  },

   _createAjaxParams: function() {
    return {
      secure_token: this.secureToken
    };
  },

  _createView: function(page) {
    ddd("[static page] create view with documents");

    WebDoc.ServerManager.getRecords(WebDoc.Document, this.documentUuid, function(data) {
      // new WebDoc.Document();
      var wdPage = new WebDoc.Page(page, data[0]);

      var div = $('<div/>').attr('class', 'webdoc-viewer-container').attr('css', 'background-color: black; font-size: 133.333%; height: 288px; margin-bottom: 0.8333em; overflow: hidden; position: relative; width: 100%;');
      this.domNode.append(div);

      var viewer = new WebDoc.WebdocViewer(this.domNode);
      viewer.loadPage(wdPage);
    }.pBind(this));
  }

});
