/**
 * The explore application
 * 
 * @author noe
 **/

WebDoc.application = {};

WebDoc.Explore = $.klass(WebDoc.Application,{

  initialize: function($super, mode) {
    $super();

    this.mode = mode;

    this.currentListingPageId = 1;

    this.listNode = jQuery('<ul/>').attr('id', 'webdoc').addClass('webdoc-viewer-index').addClass('index');
    this.paginationWrap = $("<div class='pagination'>");
    this.domNode = $('#explorer_content').append(this.listNode);
    this.domNode.append(this.paginationWrap);

    this.mainFilterDomNode = jQuery('#wd-main-filter');
    this.categoryFilterDomNode = jQuery('#wd-category-filter');
    this.searchDomNode = jQuery('#wb-explore-search');

    if(this.mode === 'explore') {
      this._setExploreFilterFromUrl(); // get value for filter from url
    }

    WebDoc.application.explore = this;
  },

  start: function() {
    ddd("[explore] start");
    // change domain to be able to synch with apps
    var allDomainsParts = document.domain.split(".");
    if (allDomainsParts.length > 2) {
      document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    }
    WebDoc.application.svgRenderer = new WebDoc.SvgRenderer();
    WebDoc.Application.initializeSingletons([WebDoc.ThemeManager], function() {  
      this._loadDocuments();
      var that = this;
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
        jQuery.cookie('document_back_url', document.location.href, { path: '/' });
        $("#"+$(this).attr('data-webdoc-document-id')).data('object').open();
      });
    
      if(this.mode === 'explore') {
        this.mainFilterDomNode.bind('change', this._loadDocuments.pBind(this));
        this.categoryFilterDomNode.bind('change', this._loadDocuments.pBind(this));
        this.searchDomNode.bind('keypress', function(e) {
          var code = (e.keyCode ? e.keyCode : e.which);
          if(code == 13) {
            this._loadDocuments();
          }
        }.pBind(this));  
      }
    }.pBind(this));
  },
  
  _incrementPageId: function(pageIncrement) {
    this.currentListingPageId += pageIncrement;
    if (this.currentListingPageId < 1) { this.currentListingPageId = 1; }
  },

  _loadDocuments: function(pageIncrement) {
    ddd("[explore] load documents");

    if(this.mode === 'explore') {
      this._setUrlWithExploreFilter();
    }

    if(pageIncrement) {
      this._incrementPageId(pageIncrement);
    } else {
      this.currentListingPageId = 1;
    }
    
    this.listNode.html('');
    this.domNode.addClass('loading');

    WebDoc.ServerManager.request('/'+this.mode+'.json', function(data) {
      this._createViewWithDocuments(data.documents);
      this._refreshPagination(data.pagination);
      this.domNode.removeClass('loading');
    }.pBind(this), 'GET',this._createAjaxParams());
  },  

   _createAjaxParams: function() {
    return {
      main_filter: this.mainFilterDomNode.val(),
      category_filter: this.categoryFilterDomNode.val(),
      query: this.searchDomNode.val(),
      page: this.currentListingPageId
    };
  },

  _createViewWithDocuments: function(documents, pagination) {
    ddd("[explore] create view with documents");

    for(i=0; i<documents.length; i+=1) {
      var document = new WebDoc.Document(documents[i]);
      this._createViewForDocument(document);
    }

    jQuery('.webdoc-viewer-title h4').truncate();
    WebDoc.WebdocViewer.showViewers(false);
  },

  _createViewForDocument: function(document) {
    var documentDomNode = jQuery('<li />');

    var viewerControlsDomNode = jQuery('<ul />').addClass('viewer-controls-index').addClass('index');
    var buttonGroupDomNode = jQuery('<li />').addClass('button-group');

    var previousButton = jQuery('<a />')
    .attr('href', '#prev-page')
    .addClass('button')
    .attr('data-webdoc-document-id', document.data.uuid)
    .attr('title', 'previous page')
    .html('&lt;');
    buttonGroupDomNode.append(previousButton);

    var nextButton = jQuery('<a />')
    .attr('href', '#next-page')
    .addClass('button')
    .attr('data-webdoc-document-id', document.data.uuid)
    .attr('title', 'next page')
    .html('&gt;');
    buttonGroupDomNode.append(nextButton);

    var titleDomNode = jQuery('<li />');
    var titleLinkDomNode = $('<a />')
    .addClass('webdoc-viewer-title')
    .attr('href', '/documents/'+document.data.uuid)
    .append($('<h4 />').html(document.data.title));
    titleDomNode.append(titleLinkDomNode);

    viewerControlsDomNode.append(buttonGroupDomNode);
    viewerControlsDomNode.append(titleDomNode);

    var viewerContainerDomNode = $('<div />')
    .addClass('webdoc-viewer-container')
    .attr('data-webdoc-document-id', document.data.uuid)
    .attr('id', document.data.uuid);

    var viewerDetailsDomNode = $('<p />')
    .addClass('webdoc-viewer-details')
    .append('Created by '
            +document.data.extra_attributes.creator_first_name+' '
            +document.data.extra_attributes.relative_created_at+' and viewed '
            +document.data.views_count+' times');

    if(this.categoryFilterDomNode.val() === 'all' && document.data.extra_attributes.category_name) {
      viewerDetailsDomNode
      .append(' ( ')
      .append(
        $('<a />')
        .attr('href', '#')
        .text(document.data.extra_attributes.category_name)
        .attr('data-wd-category-id', document.data.category_id)
        .bind('click', function(e) {
          var category_id = e.currentTarget.getAttribute('data-wd-category-id');
          this.categoryFilterDomNode.val(category_id);
          this._loadDocuments();
        }.pBind(this))
      )
      .append(' )');
    }

    documentDomNode.append(viewerControlsDomNode);
    documentDomNode.append(viewerContainerDomNode);
    documentDomNode.append(viewerDetailsDomNode);

    this.listNode.append(documentDomNode);
  },

  _refreshPagination: function(pagination) {
    this.paginationWrap.empty();
    if (pagination.total_pages > 1) {
      $('<span>').html("Page " + pagination.current_page + " of " + pagination.total_pages + " ").appendTo(this.paginationWrap);
      if (pagination.previous_page > 0) {
        var previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
        
        previousPageLink
        .click(function(event){
          this._loadDocuments(-1);
          event.preventDefault();
        }.pBind(this))
        .appendTo(this.paginationWrap);
      }
      
      if (pagination.next_page > 0) {
        if(pagination.previous_page > 0) { $("<span>").html(' | ').appendTo(this.paginationWrap); }
        var nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
        nextPageLink.click(function(event){
          this._loadDocuments(1);
          event.preventDefault();
        }.pBind(this)).appendTo(this.paginationWrap);
      }

    }
  },

  _setUrlWithExploreFilter: function () {
    document.location.replace("#?exploremainfilter=" + escape(this.mainFilterDomNode.val())
                             + "&explorecategoryfilter=" + escape(this.categoryFilterDomNode.val())
                             + "&exploresearch=" + escape(this.searchDomNode.val()));
  },

  _setExploreFilterFromUrl: function() {
    var hash = location.hash;
    hash = hash.slice(2, hash.length); // remove #?
    var blocs = hash.split("&");
    for(i=0; i<blocs.length; i++){
      var bloc = blocs[i].split("=");
      if(bloc[0] == 'exploremainfilter') {
        this.mainFilterDomNode.val(bloc[1]);
      }
      else if(bloc[0] == 'explorecategoryfilter') {
        this.categoryFilterDomNode.val(bloc[1]);
      }
      else if(bloc[0] == 'exploresearch') {
        this.searchDomNode.val(bloc[1]);
      }
    }
  }

});
