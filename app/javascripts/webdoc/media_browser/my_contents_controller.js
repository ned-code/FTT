WebDoc.MyContentsController = $.klass(WebDoc.Library,{
      
  initialize: function($super) {
    $super('my-content');
    this.imageDetailsView = jQuery('#my-images-details #image-details');
    this.videoDetailsView = jQuery('#my-favorites-videos-details #video-details');
    this.setupImageDetailsView();
    this.domNode = jQuery('#my-content');
    this._setupClickEvent();
    this.libraryUtils = new LibraryUtils();
    
    this.imagePage = 1;
    this.videosFavoritePage = 1;
    this.imagesFavoritePage = 1;
    this.myImagesContainer = $('#my-images');
    
    this._loadMyImages();  
    this.imagesUploader = new WebDoc.ImagesUploader('upload_control', this);
    
    $("#my-images-library").bind("dragstart", this.dragStart.pBind(this));
    
  },
  
  _setupClickEvent: function(){
    jQuery('#image-detail-back, #video_detail_back, #upload_back').click(function(event){
      event.preventDefault();
      if(jQuery(event.target).attr('href') == '#my-favorites'){
        this.showFavorites(); 
      }
      else{
        this.showMyImages();
      }
    }.pBind(this));
    jQuery('#my_images').click(function(event){
      event.preventDefault();
      this.showMyImages();
    }.pBind(this));
    jQuery('#favorites').click(function(event){
      event.preventDefault();
      this.showFavorites(); 
    }.pBind(this));
    jQuery('#add_image').click(function(event){
      event.preventDefault();
      this.showUploader();
    }.pBind(this));
  },
  
  showMyImages: function(){
    this._hideAll();
    $('#my-images').show();
  },
  
  showFavorites: function(){
    this._hideAll();
    if($('#my-favorites').length){
      $('#my-favorites').show();
    }
    else{
      this._loadMyFavorites();
      $('#my-favorites').show();
    }
  },
  
  showUploader: function(){
    this._hideAll();
    $('#upload-images').show();
    this.imagesUploader.loadSWFUpload();
  },
  
  setupImageDetailsView: function(){
    // handle possible actions 
    $("#my-images-details .actions").click(function(event){
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
          page.setBackground(page.getBackgroundColor(),"url("+imgUrl+")", "no-repeat", "center center");
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
              complete: function() {
              }.pBind(this)
            });
          }
          break;
      }

    }.pBind(this));
  },
  
  showDetailsView: function(properties, isFavorites){
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
    var removeFavoritesLink = $('#my-images-details #remove_image_from_favorites');
    var deleteImageLink = $('#my-images-details #delete_image_action');
        
    if(isFavorites){
      if( !removeFavoritesLink.length ){
        liDelete = $('<li>').append($("<a href='' id='remove_image_from_favorites'>Remove from favorites </a>"));
        $("#my-images-details #image-details .actions ul").append(liDelete);

        if( deleteImageLink.length ){
          deleteImageLink.parent().remove();
        }
      }
    }
    else{
      if( !deleteImageLink.length ){
        liDelete = $('<li>').append($("<a href='' id='delete_image_action'>Delete </a>"));
        $("#my-images-details #image-details .actions ul").append(liDelete);

        if( removeFavoritesLink.length ){
          removeFavoritesLink.parent().remove();
        }
      }
    }
    
    //setup back button
    if(isFavorites){
      $('#image-detail-back').attr({href: '#my-favorites'});
    }
    else{
      $('#image-detail-back').attr({href: '#my-images'});
    }
    
      $('#my-images-details').show();
  },

  setupVideoDetailsView: function(){
    this.detailsVideoContainer = this.videoDetailsView.find('.single_video');
    this.videoDetailsView.find('.drag_handle').attr({ draggable: "true" })
    .bind("dragstart", this.prepareVideoDrag.pBind(this));

    $("#my-favorites-videos-details #video-details .actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsVideoContainer.data("properties"); //properties of the currenlty displayed video are store in this element
      
      var link = $(event.target);
      var li = link.parent(); 
      var info = $("<span>").text("...");
      
      switch (link.attr("id")) {
        case "add_video_to_page_action":
          var properties = this.detailsVideoContainer.data("properties");
          WebDoc.application.boardController.insertVideo(properties);
          break;
          
        case "show_video_page_action" :
          window.open(properties.url, '_blank');
          break;
        case "remove_video_from_favorites" :
          if (confirm ("Are you sure?")) {
            link.hide();
            li.append(info);
        
            $.ajax({
              type: "DELETE",
              url: "/videos/"+properties.uuid,
              success: function(serverData) {
                li.remove();
                //remove the video from the list
                $('#' + properties.uuid).remove();
                this.showFavorites();
              }.pBind(this),
              complete: function() {
              }.pBind(this)
            });
          }
          break;
      }
    }.pBind(this));
  },
  
  showVideoDetailsView: function(properties){
    this.videoDetailsView.attr({'class':"view details_view my-content-tab "+properties.type});
    
    // Embed video
    this.detailsVideoContainer.find('object').remove();
    this.detailsVideoContainer.prepend( this.libraryUtils.buildEmbeddedVideo(properties));
    
    // Store the current properties in detailsVideoContainer
    this.detailsVideoContainer.data("properties", properties);
    
    // Title
    var name = "";
    if (properties.name) name = properties.name;
    this.videoDetailsView.find('.video_name').text(name);
    
    // View count
    var viewCountEl = this.videoDetailsView.find('.view_count span');
    if (properties.view_count)
      viewCountEl.text(this.libraryUtils.numberWithThousandsSeparator(properties.view_count,"'"));
    else
      viewCountEl.text('');
    
    // Description
    var desc = properties.description || "";
    var descEl = this.videoDetailsView.find('.video_description');
    descEl.text(desc);
    
    // Actions
    var serviceName = properties.type === "youtube" ? "YouTube" : "Vimeo";
    var showVideoPageEl = $("#show_video_page_action");
    var showText = showVideoPageEl.text();
    showText = showText.replace('*', serviceName);
    showVideoPageEl.text(showText);

    var removeVideoFromFavoritesLink = $('#my-favorites-videos-details #remove_video_from_favorites');
    if( !removeVideoFromFavoritesLink.length ){
      liDelete = $('<li>').append($("<a href='' id='remove_video_from_favorites'>Remove from favorites</a>"));
      $("#my-favorites-videos-details #video-details .actions ul").append(liDelete);
    }
    
    this._hideAll();
    $('#my-favorites-videos-details').show();
    $('#my-favorites-videos-details #video-details').show();
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
  insertImage: function(data, uuid, domNode){
    var liWrap = this.buildThumbnail(data, uuid);
    var ulWrap = $('#'+domNode).find('ul');
    if( ulWrap.length < 1){
      ulWrap = $('<ul>');
      $('#' + domNode ).append(ulWrap);
    }
    
    if($('#' + domNode +' .no_items').length ){
      $('#' + domNode +' .no_items').remove();
    }
    ulWrap.prepend(liWrap);
    $(".thumbnails").bind("dragstart", this.dragStart.pBind(this));
    
  },
  
  buildThumbnail: function(data, uuid) {
    var properties = {
      url: data.properties.url,
      thumb_url: data.properties.thumb_url,
      image_link: data.properties.default_url,
      type: 'application/wd-image',
      uuid: uuid,
      favorites: data.favorites,
      media_id: data.uuid,
      title: data.title
    };
    
    var thumb = $("<img>").attr({
      src : data.properties.thumb_url,
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
    
    if($('#my-favorites-videos .no_items').length ){
      $('#my-favorites-videos .no_items').remove();
    }
    
    if(!$('#my-favorites-videos ul').length){
      $('#my-favorites-videos').append($('<ul>'));
    }
        
     var videosContainer = $('#my-favorites-videos ul');
     videosContainer.prepend(
        this.libraryUtils.buildVideoRow(videoType, videoId, videoUrl, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height,uuid)
      );
    
   },
  
  dragStart: function(event) {      
    var draggingImg = $(event.target).parent().find('img');

    var properties = draggingImg.data("properties");

    var dt = event.originalEvent.dataTransfer;
    var imageUrl = properties.default_url ? properties.default_url : properties.url;
    ddd(properties.media_id);
    dt.setData("application/wd-image", $.toJSON({url:imageUrl,id:properties.id, favorites:properties.favorites, media_id:properties.media_id, title: properties.title }));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.libraryUtils.buildMediaDragFeedbackElement("image", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 60, 60 );
  },

  prepareRowDrag: function(event) {
    // prepare Draging for video...
    var target = $(event.target);
    if (target.closest('.video_row').length === 0 || target.find('img').length === 0) {
      event.preventDefault();
      return;
    }
    
    var properties = target.find('img').data("properties");
    this.videoDragStart(event, properties);
  },

  videoDragStart: function(event, properties) {
    var dt = event.originalEvent.dataTransfer;
    dt.setData("application/wd-video", $.toJSON(properties));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.libraryUtils.buildMediaDragFeedbackElement("video", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },

  prepareVideoDrag: function(event) {    
    var target = $(event.target);
    if (!target.hasClass('drag_handle')) {
      event.preventDefault();
      return;
    }
    
    var properties = this.detailsVideoContainer.data("properties");
    this.videoDragStart(event, properties);
  },
  
  _hideAll: function(){
    $('.my-content-tab').hide();
    // this.imagesUploader.unloadSWFUpload();
  },

  _loadMyImages: function(){
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
          myImagesList.append(this.buildThumbnail(webDocImage.data, webDocImage.data.uuid));
        }.pBind(this));
      }
      
      //previous and next link
      if(data.pagination.previous_page){
        var previousElement= $("<a href='#'>Previous</a>");
        var that = this;
        previousElement.click(function(e){
          e.preventDefault;
          that._previousMyImagePage();
        });
        thumbsWrap.append(previousElement).append("&nbsp;");
      }
      if(data.pagination.next_page){
        var nextElement = $("<a href='#'>Next</a>");
        var that = this;
        nextElement.click(function(e){
          e.preventDefault;
          that._nextMyImagePage();
        });
        
        thumbsWrap.append(nextElement);
      }
      
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { page:this.imagePage, favorites: 0 }});
    
    $("#my-images-library ul li a").live("click", function (event) {
      event.preventDefault();
      var properties = $(event.target).parent().find('img').data("properties");
      this.showDetailsView(properties,false);
    }.pBind(this));
    
  },
  
  _nextMyImagePage: function(){
    this.imagePage += 1;
    this._loadMyImages();
    this._clearMyImages();
  },
  
  _previousMyImagePage: function(){
    this.imagePage -= 1;
    this._loadMyImages();
    this._clearMyImages();
  },
  
  _clearMyImages: function(){
    var thumbsWrap = this.myImagesContainer.find(".thumbnails");
    thumbsWrap.empty();
  },
  
  _loadMyFavorites: function(){
    var container = $("<div id='my-favorites' class='my-content-tab'>");
    container.append($("<div id='my-favorites-images' class='thumbnails'>"));
    container.append($("<div id='my-favorites-videos' class='thumbnails'>"));
    this.domNode.append(container);
    
    this.imagesFavoritesContainer = $('#my-favorites-images');
    this.videosFavoritesContainer = $('#my-favorites-videos');
    
    this._loadFavoritesImages();
    this._loadFavoritesVideos();
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
          myImagesList.append(this.buildThumbnail(webDocImage.data, webDocImage.data.uuid));
        }.pBind(this));
      }
      
      //previous and next link
      if(data.pagination.previous_page){
        var previousElement= $("<a href='#'>Previous</a>");
        var that = this;
        previousElement.click(function(e){
          e.preventDefault;
          that._previousFavoriteImagePage();
        });
        thumbsWrap.append(previousElement).append("&nbsp;");
      }
      if(data.pagination.next_page){
        var nextElement = $("<a href='#'>Next</a>");
        var that = this;
        nextElement.click(function(e){
          e.preventDefault;
          that._nextFavoriteImagePage();
        });
        thumbsWrap.append(nextElement);
      }
        
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { page:this.imagesFavoritePage, favorites: 1 }});
    
    $("#my-favorites-images ul li a").live("click", function (event) {
      event.preventDefault();
      var properties = $(event.target).parent().find('img').data("properties");
      this.showDetailsView(properties,true);
    }.pBind(this));
    $("#my-favorites-images").bind("dragstart", this.dragStart.pBind(this));
  },
  
  _previousFavoriteImagePage: function(){
    this.imagesFavoritesContainer.empty();
    this.imagesFavoritePage -= 1;
    this._loadFavoritesImages();
  },
  
  _nextFavoriteImagePage: function(){
    this.imagesFavoritesContainer.empty();
    this.imagesFavoritePage += 1;
    this._loadFavoritesImages();
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
      
      //previous and next link
      if(data.pagination.previous_page){
        var previousElement= $("<a href='#'>Previous</a>");
        var that = this;
        previousElement.click(function(e){
          e.preventDefault;
          that._previousFavoriteVideoPage();
        });
        thumbsWrap.append(previousElement).append("&nbsp;");
      }
      if(data.pagination.next_page){
        var nextElement = $("<a href='#'>Next</a>");
        var that = this;
        nextElement.click(function(e){
          e.preventDefault;
          that._nextFavoriteVideoPage();
        });
        thumbsWrap.append(nextElement);
      }
      
      thumbsWrap.data('loaded', true);
      this.hideSpinner(thumbsWrap);
    }.pBind(this), { ajaxParams: { page: this.videosFavoritePage, favorites: 1 }});
    
    $("#my-favorites-videos ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      event.preventDefault();
      this.showVideoDetailsView(properties,true);
    }.pBind(this));

    $("#my-favorites-videos").bind("dragstart", this.prepareRowDrag.pBind(this));
    //this.createHandlers(this.domNode, 'click', {'my-favorites':  function(e){ WebDoc.application.mediaBrowserController.myContentsController.showFavorites(); }});
    this.setupVideoDetailsView();
  },
  
  _previousFavoriteVideoPage: function(){
    this.videosFavoritesContainer.empty();
    this.videosFavoritePage -= 1;
    this._loadFavoritesVideos();
  },
  
  _nextFavoriteVideoPage: function(){
    this.videosFavoritesContainer.empty();
    this.videosFavoritePage += 1;
    this._loadFavoritesVideos();
  },
});