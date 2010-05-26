/**
 * The explore application
 * 
 * @author noe
 **/

WebDoc.application = {};

WebDoc.Explore = $.klass(WebDoc.Application,{

  initialize: function($super) {
    $super();

    this.currentListingPageId = 1;

    this.domNode = jQuery('<ul/>').attr('id', 'webdoc').addClass('webdoc-viewer-index').addClass('index');
    $('#explorer_content').html(this.domNode);

    this.mainFilterDomNode = jQuery('#wd-main-filter');
    this.categoryFilterDomNode = jQuery('#wd-category-filter');
    this.searchDomNode = jQuery('#wb-explore-search');

    WebDoc.application.explore = this;
  },

  start: function() {
    ddd("[explore] start");

    this._refreshViewers();

    jQuery(document)
    .delegate('a[href="#prev-page"]', 'click', function(e){
      $("#"+$(this).attr('data-webdoc-document-id')).data('object').prevPage();
      e.preventDefault();
    })
    .delegate('a[href="#next-page"]', 'click', function(e){
      $("#"+$(this).attr('data-webdoc-document-id')).data('object').nextPage();
      e.preventDefault();
    })
    .delegate('.webdoc-viewer-container', 'click', function(e){
      $("#"+$(this).attr('data-webdoc-document-id')).data('object').open();
    });

    this.mainFilterDomNode.bind('change', this._refreshViewers.pBind(this));
    this.categoryFilterDomNode.bind('change', this._refreshViewers.pBind(this));
    this.searchDomNode.bind('keyup', this._refreshViewers.pBind(this));
  },
  
  _incrementPageId: function(pageIncrement) {
    this.currentListingPageId += pageIncrement;
    if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
  },

  _refreshViewers: function() {
    ddd("[explore] refresh viewers");
    this._loadDocuments(1);
  },

  _loadDocuments: function(pageIncrement) {

    this._incrementPageId(1);
    
    WebDoc.ServerManager.request('/documents/explore.json', function(data) {
      this._createViewWithDocuments(data.documents, data.pagination);
    }.pBind(this), 'GET',this._createAjaxParams());
  },  

   _createAjaxParams: function() {
    return {
      main_filter: this.mainFilterDomNode.val(),
      category_filter: this.categoryFilterDomNode.val(),
      query: this.searchDomNode.val(),
      // page: this.currentListingPageId
      page: 1
    };
  },

  _createViewWithDocuments: function(documents, pagination) {
    ddd("[explore] create view with documents");
    this.domNode.html('');

    var i = documents.length;
    while(i--) {
      var document = documents[i];
      this._createViewForDocument(document);
    }

    jQuery('.webdoc-viewer-title h4').truncate();
    WebDoc.WebdocViewer.showViewers();
  },

  _createViewForDocument: function(document) {
    var documentDomNode = jQuery('<li />');

    var viewerControlsDomNode = jQuery('<ul />').addClass('viewer-controls-index').addClass('index');
    var buttonGroupDomNode = jQuery('<li />').addClass('button-group');
    var previousButton = jQuery('<a />')
    .attr('href', '#prev-page')
    .addClass('button')
    .attr('data-webdoc-document-id', document.uuid)
    .attr('title', 'previous page')
    .html('&lt;');
    buttonGroupDomNode.append(previousButton);
    var nextButton = jQuery('<a />')
    .attr('href', '#next-page')
    .addClass('button')
    .attr('data-webdoc-document-id', document.uuid)
    .attr('title', 'next page')
    .html('&gt;');
    buttonGroupDomNode.append(nextButton);
    var titleDomNode = jQuery('<li />');
    var titleLinkDomNode = $('<a />')
    .addClass('webdoc-viewer-title')
    .attr('href', '/documents/'+document.uuid)
    .append($('<h4 />').html(document.title));
    titleDomNode.append(titleLinkDomNode);
    viewerControlsDomNode.append(buttonGroupDomNode);
    viewerControlsDomNode.append(titleDomNode);

    var viewerContainerDomNode = $('<div />')
    .addClass('webdoc-viewer-container')
    .attr('data-webdoc-document-id', document.uuid)
    .attr('id', document.uuid);


    var viewerDetailsDomNode = $('<p />')
    .addClass('webdoc-viewer-details')
    .append('Created by '+document.creator_first_name+' '+document.relative_created_at+' and viewed '+document.views_count+' times');

    if(this.categoryFilterDomNode.val() === 'all' && document.category_name) {
      ddd('ici');
      viewerDetailsDomNode
      .append(' ( ')
      .append(
        $('<a />')
        .attr('href', '#')
        .text(document.category_name)
        .attr('data-wd-category-id', document.category_id)
        .bind('click', function(e) {
          var category_id = e.currentTarget.getAttribute('data-wd-category-id');
          this.categoryFilterDomNode.val(category_id);
          this._refreshViewers();
        }.pBind(this))
      )
      .append(' )');
    }

    documentDomNode.append(viewerControlsDomNode);
    documentDomNode.append(viewerContainerDomNode);
    documentDomNode.append(viewerDetailsDomNode);

    this.domNode.append(documentDomNode);
  }

});





