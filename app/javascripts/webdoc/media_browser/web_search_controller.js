/*
	@author Jonathan
*/
	
WebDoc.WebSearchController = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
		$super(libraryId);
		this.domNode = $('#media-browser-web');
    this._createHandlers('click', this._webHandlers);
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
		this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);
  },

	_createHandlers: function(eventType, obj, context){
    this.domNode
    .delegate('a', eventType, WebDoc.handlers._makeLinkHandler( obj, context ) );
    //NOTE: _makeLinkHandler( obj, context ) is supposed to be private, but it's an easy way to listen the link
  },
	
	_webHandlers: {
    'search_images':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showImagesSearch(); },
    'search_videos':  function(e){ WebDoc.application.mediaBrowserController.webSearchController.showVideosSearch(); },
  },
	
	showImagesSearch: function(){
		this.hideAll();
		$('#web-images').show();
	},
	
	showVideosSearch: function(){
		this.hideAll();
		$('#web-videos').show();
	},
	
	hideAll: function(){
		$('.web-search-tab').hide();
	}
});