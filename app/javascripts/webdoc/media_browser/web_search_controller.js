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
  
  dragStart: function(event) {		
    // we take parent and then search down the img because safari and firefox have not the same target.
    // on firefox target is the a tag but in safarai target is the img.
    var draggingImg = $(event.target).parent().find('img');
    var properties = draggingImg.data("properties");
    var dt = event.originalEvent.dataTransfer;
    var imageUrl = properties.default_url ? properties.default_url : properties.url;
    dt.setData("application/wd-image", $.toJSON({url:imageUrl,id:properties.id}));
    
    //Drag "feedback"
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("image", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 60, 60 );
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