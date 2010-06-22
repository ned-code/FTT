/*
	@author Jonathan
*/
	
WebDoc.WebSearch = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
		$super(libraryId);
		
		ddd('[WebSearch] initialize')
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
		// Setup details view
    //this.setupDetailsView();
    
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
  }
});