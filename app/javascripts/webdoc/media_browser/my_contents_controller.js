WebDoc.MyContentsController = $.klass(WebDoc.Library,{
      
  initialize: function($super, libraryId) {
		$super(libraryId);
		this.imageDetailsView = $('#media-browser-my-images-details #image-details');
		this.setupImageDetailsView();
		this.domNode = $('#media-browser-my-content');
		this.createHandlers(this.domNode, 'click', this._myContentHandlers);
    
    this.imagePage = 1;
    this.myImagesContainer = $('#media-browser-my-images');
		
    this.loadMyImages();  
    this.imagesUploader = new WebDoc.ImagesUploader('upload_control', this);
    
    $("#my-images-library").bind("dragstart", this.dragStart.pBind(this));
    
  },
  
  loadMyImages: function(){
    var thumbsWrap = this.myImagesContainer.find(".thumbnails");
    this.showSpinner(thumbsWrap);
          
    WebDoc.ServerManager.getRecords(WebDoc.Image, null, function(data) {
      if (data.images.length === 0) {
        var noImages = $("<span>").addClass('no_items').text('No Images');
        thumbsWrap.append(noImages);
      }
      else {
        var myImagesList = $("<ul>");
        thumbsWrap.append(myImagesList);
        
        $.each(data.images, function(i,webDocImage){
          myImagesList.append(this.buildThumbnail(webDocImage.data.properties, webDocImage.data.uuid));
        }.pBind(this));
      }
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { page:this.imagePage, favorites: 0 }});
    
    $("#media-browser-my-images .thumbnails ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      this.showDetailsView(properties,false);
      event.preventDefault();
    }.pBind(this));
    
  },
  
	loadMyFavorites: function(){
		var container = $("<div id='media-browser-my-favorites' class='my-content-tab>");
		container.append($("<div id='my-favorites-images' class='thumbnails'>"));
		container.append($("<div id='my-favorites-videos' class='thumbnails'>"));
		this.domNode.append(container);
		this.imagesFavoritesContainer = $('#my-favorites-images');
    this.videosFavoritesContainer = $('#my-favorites-videos');

    this._loadFavoritesImages();
		this._loadFavoritesVideos();
  },

  _myContentHandlers: {
    'my-images':  function(e){ WebDoc.application.mediaBrowserController.myContentsController.showMyImages(); },
    'favorites':  function(e){ WebDoc.application.mediaBrowserController.myContentsController.showFavorites(); },
    'upload-images': function(e){ WebDoc.application.mediaBrowserController.myContentsController.showUploader(); },
  },
  
  showMyImages: function(){
    this._hideAll();
		$('#media-browser-my-images').show();
  },
  
  showFavorites: function(){
    this._hideAll();
    if($('#media-browser-my-favorites').length){
			$('#media-browser-my-favorites').show();
		}
		else{
			this.loadMyFavorites();
		  $('#media-browser-my-favorites').show();
		}
  },
  
  showUploader: function(){
    this._hideAll();
    $('#media-browser-upload-images').show();
    this.imagesUploader.loadSWFUpload();
  },
  
  setupImageDetailsView: function(){
    // handle possible actions 
    $("#media-browser-my-images-details .actions").click(function(event){
      event.preventDefault();

      var properties = this.detailsViewImg.data("properties"); //properties of the currenlty displayed image are store in this element

      var link = $(event.target);
      var li = link.parent(); 
      var info = $("<span>").text("...");

      switch (link.attr("id")) {
        case "add_image_to_page_action":
          ddd("add (original) image to page action");
          var imageUrl = null;
          if(link.attr("id") == "add_original_image_to_page_action") {
            imageUrl = properties.url
          }
          else {
            imageUrl = properties.default_url ? properties.default_url : properties.url;
          }
          WebDoc.application.boardController.insertImage(imageUrl, undefined, properties.id);
          break;

        case "set_image_as_bg_action": 
          var page = WebDoc.application.pageEditor.currentPage;
          var imgUrl = this.detailsViewImg.attr("src");
          page.setBackgroundImage("url("+imgUrl+")");
          page.setBackgroundRepeatMode("no-repeat");
          page.setBackgroundPosition("center center");
          // Jump to page inspector, where you can set how the background image is displayed
          WebDoc.application.rightBarController.showPageInspector();
          break;

        case "delete_image_action": //delete an uploaded image from My Images
          if (confirm ("Are you sure?")) {
            link.hide();
            li.append(info);

            $.ajax({
              type: "DELETE",
              url: "/images/"+properties.uuid,
              success: function(serverData) {
                li.remove();
                //remove thumbnail from the my images' list
                $('#' + properties.uuid).remove();
                this.showMyImages();
              }.pBind(this),
              error: function(){
              },
              complete: function() {
              }.pBind(this)
            });
          }
          break;
				case "remove_image_from_favorites": //delete an uploaded image from My favorites
	        if (confirm ("Are you sure?")) {
	          link.hide();
	          li.append(info);
        
	          $.ajax({
	            type: "DELETE",
	            url: "/images/"+properties.uuid,
	            success: function(serverData) {
	              li.remove();
	              //remove thumbnail from the my images' list
	              $('#' + properties.uuid).remove();
	              this.showFavorites();
	            }.pBind(this),
	            error: function(){
	            },
	            complete: function() {
	            }.pBind(this)
	          });
	        }
	      	break;
      }

    }.pBind(this));
  },
  
  showDetailsView: function(properties, isFavorites){
		ddd('favorites' + isFavorites);
    this._hideAll();
    this.detailsViewImg = this.imageDetailsView.find('.single_image img');
    
    this.imageDetailsView.find('.single_image')
    .attr({ draggable: "true" })
    .bind("dragstart", this.dragStart.pBind(this));
    
    this.imageDetailsView.attr({'class':"view details_view "+properties.type});
    
    // Image name
    var name = "";
    if (properties.name){
      name = properties.name;
    }
    else if (properties.url.match(/([^\/\\]+)\.([a-z0-9]{3,4})$/i)) { // extract filename
      name = RegExp.$1 +"."+ RegExp.$2;
    }
    this.imageDetailsView.find('.image_name').text(name);
    
    // Image size
    var imageSizeEl = this.imageDetailsView.find('.image_size');
    if (properties.width && properties.height) {
      imageSizeEl.text(properties.width+" x "+properties.height);
    }
    else {
      imageSizeEl.text('');
    }
    
    // Image Link
    var imageLink = properties.image_link ? properties.image_link : properties.url;
    this.imageDetailsView.find('.single_image a').attr({"href":imageLink});
    
    // Image source (+ store the current properties in the img element)
    var imageContainer = this.imageDetailsView.find('.single_image');
    imageContainer.hide();
    imageContainer.before($('<div class="loading">Loading</div>'));
    this.detailsViewImg.attr({'src':properties.url}).data("properties", properties);
    this.preloadImage(properties.url);
    
    //setup the delete link of remove from favorites
		var removeFavoritesLink = $('#media-browser-my-images-details #remove_image_from_favorites');
		var deleteImageLink = $('#media-browser-my-images-details #delete_image_action');
		
		if(isFavorites){
			if( !removeFavoritesLink.length ){
    	  liDelete = $('<li>').append($("<a href='' id='remove_image_from_favorites'>Remove from favorites </a>"));
    	  $("#media-browser-my-images-details #image-details .actions ul").append(liDelete);

				if( deleteImageLink.length ){
					deleteImageLink.remove();
				}
    	}
		}
		else{
    	if( !deleteImageLink.length ){
    	  liDelete = $('<li>').append($("<a href='' id='delete_image_action'>Delete </a>"));
    	  $("#media-browser-my-images-details #image-details .actions ul").append(liDelete);

				if( removeFavoritesLink.length ){
					removeFavoritesLink.remove();
				}
    	}
		}
    
    $('#media-browser-my-images-details').show();
  },

	showVideoDetailsView: function(properties){
		ddd('showVideoDetailsView');
		
	},
  
  preloadImage: function(imageSrc) {
    var oImage = new Image();
    // set up event handlers for the Image object
    oImage.onload = this.preloadImageDidLoad.pBind(this);
    oImage.onerror = this.preloadImageError.pBind(this);
    oImage.src = imageSrc;
  },
  
  preloadImageDidLoad: function() {
    this.imageDetailsView.find('.loading').remove();
    this.imageDetailsView.find('.single_image').show();
  },
  
  preloadImageError: function() {
    this.imageDetailsView.find('.loading').remove();
  },
  
  //Used for insert uploaded image directy in the dom
  insertImage: function(properties, uuid, domNode){
    var liWrap = this.buildThumbnail(properties, uuid);
    var ulWrap = $('#'+domNode).find('ul');
    if( ulWrap.length < 1){
      ulWrap = $('<ul>');
      $('#my-images-library').append(ulWrap);
    }
    
    ulWrap.prepend(liWrap);
    $(".thumbnails").bind("dragstart", this.dragStart.pBind(this));
    
  },
  
  buildThumbnail: function(newProperties, uuid) {
    ddd('uuid : ' + uuid);
		
    var properties = {
      url: newProperties.url,
      thumb_url: newProperties.thumb_url,
      image_link: newProperties.default_url,
      type: 'application/wd-image',
      uuid: uuid
    };
    
    var thumb = $("<img>").attr({
      src : newProperties.thumb_url,
      alt : "",
      type:"my_image"
    })
    .data("properties", properties);
    
    var liWrap = $("<li>").attr({id: uuid});
    var aWrap = $("<a href='' title=''></a>");
    aWrap.append(thumb);
    //aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
    liWrap.append(aWrap);
  
    return liWrap;
  },

	insertVideo: function(newProperties, uuid){
		ddd('insertVideo');
		ddd('uuid ' + uuid);
		var name = newProperties.name;
		var duration = newProperties.duration;
		var description = newProperties.description;
		var thumbUrl = newProperties.thumb_url;
		var aspectRatio = newProperties.aspect_ratio;
		var viewCount = newProperties.viewCount;
		var embedUrl = newProperties.embed_url;
		var embedType = newProperties.embed_type;
		var videoId = newProperties.video_id;
		var videoUrl = newProperties.url;
		var videoType = newProperties.type;
		var isHd = newProperties.is_hd;
		var height = newProperties.height;
		var width = newProperties.width;

		if(!$('#my-favorites-videos ul').length){
			$('#my-favorites-videos').append($('<ul>'));
		}
		
		ddd('thumbUrl ' + thumbUrl); 
		
    var videosContainer = $('#my-favorites-videos ul');
    videosContainer.append(
       WebDoc.application.mediaBrowserController.webSearchController.webVideosSearch.buildVideoRow(videoType, videoId, videoUrl, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height)
     );

	},
  
  dragStart: function(event) {      
		ddd('dragStart chababababa');
    var draggingImg = $(event.target).parent().find('img');

    var properties = draggingImg.data("properties");

    var dt = event.originalEvent.dataTransfer;
    var imageUrl = properties.default_url ? properties.default_url : properties.url;
    dt.setData("application/wd-image", $.toJSON({url:imageUrl,id:properties.id}));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("image", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 60, 60 );
  },

	prepareRowDrag: function(event) {
    // prepare Draging for video...
		ddd('prepareRowDrag');
		var target = $(event.target);
    if (target.closest('.video_row').length === 0 || target.find('img').length === 0) {
      event.preventDefault();
      return;
    }
    
    var properties = target.find('img').data("properties");
    this.videoDragStart(event, properties);
  },

	videoDragStart: function(event, properties) {
		ddd('videoDragStart');
    var dt = event.originalEvent.dataTransfer;
    dt.setData("application/wd-video", $.toJSON(properties));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("video", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },
  
  _hideAll: function(){
    $('.my-content-tab').hide();
    // this.imagesUploader.unloadSWFUpload();
  },

	_loadFavoritesImages: function(){
		var thumbsWrap = this.imagesFavoritesContainer;
    this.showSpinner(thumbsWrap);
          
    WebDoc.ServerManager.getRecords(WebDoc.Image, null, function(data) {
      if (data.images.length === 0) {
        var noImages = $("<span>").addClass('no_items').text('No Images');
        thumbsWrap.append(noImages);
      }
      else {
        var myImagesList = $("<ul>");
        thumbsWrap.append(myImagesList);
        
        $.each(data.images, function(i,webDocImage){
          myImagesList.append(this.buildThumbnail(webDocImage.data.properties, webDocImage.data.uuid));
        }.pBind(this));
      }
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { page:this.imagePage, favorites: 1 }});
    
    $("#my-favorites-images ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      this.showDetailsView(properties,true);
      event.preventDefault();
    }.pBind(this));
		$("#my-favorites-images").bind("dragstart", this.dragStart.pBind(this));
	},
	
	_loadFavoritesVideos: function(){
		var thumbsWrap = this.videosFavoritesContainer;
    this.showSpinner(thumbsWrap);
          
    WebDoc.ServerManager.getRecords(WebDoc.Video, null, function(data) {
      if (data.videos.length === 0) {
        var noVideos = $("<span>").addClass('no_items').text('No Videos');
        thumbsWrap.append(noVideos);
      }
      else {
        var myVideosList = $("<ul>");
        thumbsWrap.append(myVideosList);
        
        $.each(data.videos, function(i,myVideo){
          myVideosList.append(this.insertVideo(myVideo.data.properties, myVideo.data.uuid));
        }.pBind(this));
      }
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { favorites: 1 }});
    
    $("#my-favorites-videos ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      this.showVideoDetailsView(properties,true);
      event.preventDefault();
    }.pBind(this));

		$("#my-favorites-videos").bind("dragstart", this.prepareRowDrag.pBind(this));
	}
});