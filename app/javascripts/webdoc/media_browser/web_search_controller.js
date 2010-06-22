/*
	@author Jonathan
*/
	
WebDoc.WebSearchController = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
		$super(libraryId);
		this.domNode = $('#media-browser-web');
    this._createHandlers('click', this._webHandlers);

		ddd('[WebSearch] initialize')
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
		this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);
		
		// Setup details view
    //this.setupDetailsView();
   

		//listening to images thumbnail
    // Observe thumb clicks (with event delegation) for all current and future thumbnails
    $("#web_images .thumbnails ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties"); // I do parent().find("img") in case other elements 
                                                                                // will be added in addition to the thumbnail 
      ddd('click on image. properties : ' + properties );                                                                         // image itself (like for "video rows") 
      //this.prepareDetailsView(properties);
      //this.showDetailsView.click();
      event.preventDefault();
    }.pBind(this));
  },

	_createHandlers: function(eventType, obj, context){
    ddd('create handler');    
    this.domNode
    .delegate('a', eventType, WebDoc.handlers._makeLinkHandler( obj, context ) );
    //NOTE: _makeLinkHandler( obj, context ) is supposed to be private, but it's an easy way to listen the link
  },
	
	_webHandlers: {
    'search_images':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showImagesSearch(); },
    'search_videos':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showVideosSearch(); },
  },
	
	showImagesSearch: function(){
		ddd('showImagesSearch');
		this._hideAll();
		$('#web-images').show();
	},
	
	showVideosSearch: function(){
		ddd('showVideosSearch');
		this._hideAll();
		$('#web-videos').show();
	},
	
	_hideAll: function(){
		$('.web-search-tab').hide();
	}
});