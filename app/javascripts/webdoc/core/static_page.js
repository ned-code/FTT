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
      this.domNode.html('');
      this.domNode.addClass('loading');
      this._createView();
      this.domNode.removeClass('loading');
    }.pBind(this));
  },
  
   _createAjaxParams: function() {
    return {
      secure_token: this.secureToken
    };
  },

  _createView: function() {
    ddd("[static page] create view with documents");

    var viewer = new WebDoc.WebdocViewer(this.domNode);
    viewer.load(this.documentUuid);
    viewer.loadPageId(this.pageUuid);
  }

});
