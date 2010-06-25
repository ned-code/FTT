/*
	@author Jonathan
*/
	
WebDoc.WebSearchController = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
		$super(libraryId);
		this.domNode = $('#media-browser-web');
    this.createHandlers(this.domNode, 'click', this._webHandlers);
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
		this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);
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