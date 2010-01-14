/**
 * @author Zeno Crivelli
**/

//= require "videos_library/web_videos_search"

WebDoc.VideosLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
    
    // Setup web images
    this.webVideosSearch = new WebDoc.WebVideosSearch('web_videos_search_field', this);
    // Setup my images
    this.setupMyVideos();
    // Setup details view
    this.setupDetailsView();
    
    // Observe video-rows clicks (with event delegation) for all current and future video-rows
    $("#"+libraryId+" .rows ul li a").live("click", function (event) {
      var properties = $(event.target).data("properties");
      this.prepareDetailsView(properties);
      this.showDetailsView.click();
      event.preventDefault();
    }.pBind(this));
    
    // Observe end of page transition
    this.element.bind('pageAnimationEnd', function(event, info){
      if (this.currentViewId() === this.detailsView.attr("id")) {
        this.detailsViewDidAppear();
      }
    }.pBind(this));
  },
  setupMyVideos: function() {
    // this.myImagesPage = 1;
    // this.myImagesContainer = $(this.tabContainers[0]);
    // 
    // // Setup thumbnails drag n' drop
    // this.myImagesContainer.find(".thumbnails").bind("dragstart", this.dragStart.pBind(this));
    // 
    // // Next/Previous page links
    // this.paginationWrap = $("<div class='pagination' style='display:none'>");
    // this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
    // this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
    // this.previousPageLink.click(function(event){
    //   this.loadMyImages(-1);
    //   event.preventDefault();
    // }.pBind(this)).appendTo(this.paginationWrap).hide();
    // this.nextPageLink.click(function(event){
    //   this.loadMyImages(+1);
    //   event.preventDefault();
    // }.pBind(this)).appendTo(this.paginationWrap).hide();
    // this.myImagesContainer.append(this.paginationWrap);
  },
  setupDetailsView: function() {
    
    // Setup drag n' drop
    var dragHandle = this.detailsView.find('.drag_handle');
    dragHandle.attr({ draggable: "true" });
    dragHandle.bind("dragstart", this.dragStart.pBind(this));
    
    // Handle title of Show video page action
    var showVideoPageEl = $("#show_video_page_action");
    showVideoPageEl.data("originalText", showVideoPageEl.text());
    
    this.detailsVideoContainer = this.detailsView.find('.single_video');
    
    // handle possible actions 
    $("#video_details .actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsVideoContainer.data("properties"); //properties of the currenlty displayed video are store in this element
      
      var link = $(event.target);
      var li = link.parent(); 
      var info = $("<span>").text("...");
      
      switch (link.attr("id")) {
        case "show_video_page_action":
          ddd("show_video_page_action");
          window.open(properties.url, '_blank');
          break;
          
        case "add_to_my_videos_action":
          link.hide();
          li.append(info);
          
          //TODO
          // var railsParams = {};
          // MTools.Record.convertToRailsJSon({ properties : properties }, railsParams, "image");
          // $.ajax({
          //   type: "POST",
          //   url: this.imagesUploader.uploadUrl,
          //   data: railsParams,
          //   dataType: "json",
          //   success: function(serverData) {
          //     info.text("Done!");
          //     setTimeout(function(){ info.fadeOut(500); }, 500);
          //     this.refreshMyImages([serverData.image]);
          //   }.pBind(this),
          //   complete: function() {
          //     setTimeout(function(){ li.hide(); info.remove(); link.show();  }, 1000);
          //   }.pBind(this)
          // });
          break;
          
        case "delete_from_my_videos_action":
          if (confirm ("Are you sure?")) {
            link.hide();
            li.append(info);
            
            //TODO
            // $.ajax({
            //   type: "DELETE",
            //   url: "/images/"+properties.uuid,
            //   success: function(serverData) {
            //     info.text("Done!");
            //     setTimeout(function(){ info.fadeOut(500); }, 500);
            //     this.refreshMyImages();
            //   }.pBind(this),
            //   complete: function() {
            //     var delay = setTimeout(function(){ li.hide(); info.remove(); link.show(); }, 1000);
            //     if (link.attr("id") === "delete_image_action") { // Go back
            //       //in this case we need to immediately rehestablish the UI, in case the user will quickly reselects another thumbnail just after deleting this one
            //       clearTimeout(delay); li.hide(); info.remove(); link.show();
            //       this.detailsView.find(".toolbar .back").click();
            //     }
            //   }.pBind(this)
            // });
          }
          break; 
      }
    }.pBind(this));
  },
  dragStart: function(event) {
    var target = $(event.target)
    if (!target.hasClass('drag_handle')) return;
    
    var properties = this.detailsVideoContainer.data("properties");
    var dt = event.originalEvent.dataTransfer;
    dt.setData("application/ub-video", properties);
    
    var dragImage = new Image();
    dragImage.src = properties.thumb_url;
    // dt.setDragImage( $('#video_details .toolbar .back')[0], 60, 36);
    dt.setDragImage( dragImage, 60, 40 );
  },
  // 
  // showSpinner: function($super, container) {
  //   $super(container);
  //   if (this.hasPagination) this.paginationWrap.hide();
  // },
  // hideSpinner: function($super, container) {
  //   $super(container);
  //   if (this.hasPagination) this.paginationWrap.show();
  // },
  // didClickOnTab: function($super, tab) {
  //   $super(tab);
  //   if (tab == this.tabContainers[0].id) { // My Images tab
  //     this.loadMyImages(0);
  //   }
  // },
  // loadMyImages: function(pageIncrement) {
  //   var thumbsWrap = this.myImagesContainer.find(".thumbnails");
  //   
  //   this.myImagesPage += pageIncrement;
  //   if (this.myImagesPage < 1) this.myImagesPage = 1;
  //   
  //   if (pageIncrement !== 0 || !thumbsWrap.data('loaded')) { //load only if we are paginating, or if the images have never been loaded before
  //     thumbsWrap.html('');
  //     
  //     this.showSpinner(thumbsWrap);
  //     
  //     MTools.ServerManager.getRecords(WebDoc.Image, null, function(data) {
  //       if (data.images.length === 0) {
  //         var noImages = $("<span>").addClass('no_items').text('No Images');
  //         thumbsWrap.append(noImages);
  //       }
  //       else {
  //         var myImagesList = $("<ul>");
  //         thumbsWrap.append(myImagesList);
  //         
  //         $.each(data.images, function(i,webDocImage){
  //           
  //           myImagesList.append(this.buildThumbnail(webDocImage.uuid(), webDocImage.data.properties));
  //           
  //         }.pBind(this));
  //       }
  //       this.refreshMyImagesPagination(data.pagination);
  //       thumbsWrap.data('loaded', true);
  //       this.hideSpinner(thumbsWrap);
  //     }.pBind(this), { ajaxParams: { page:this.myImagesPage }});
  //   }
  // },
  // refreshMyImages: function(newImages) {
  //   // Note: do not pass the newImages arg to force reloading the whole section
  //   
  //   //if we are in first page, don't reload the whole thing, just add the newly uploaded images to the top of the list 
  //   var myImagesList = this.myImagesContainer.find('.thumbnails ul');
  //   if (newImages && this.myImagesPage === 1 && myImagesList.length > 0) {
  //     
  //      $.each(newImages, function(i,image) {
  //        
  //        myImagesList.prepend(this.buildThumbnail(image.uuid, image.properties));
  //         
  //       }.pBind(this));
  //   }
  //   else { // If not (or if no newImages are passed) reload the 1st page
  //     this.myImagesContainer.find(".thumbnails").data('loaded', false);
  //     this.myImagesPage = 1;
  //     this.loadMyImages(0);
  //   }
  // },
  // buildThumbnail: function(uuid, properties, myImagesList) {
  //   var thumb = $("<img>").attr({
  //     src : properties.thumb_url,
  //     alt : ""
  //   })
  //   .data("properties", jQuery.extend({type:"my_image", uuid:uuid}, properties));
  //   
  //   var liWrap = $("<li>");
  //   if (properties.type) liWrap.addClass(properties.type);
  //   var aWrap = $("<a href='' title=''></a>");
  //   aWrap.append(thumb);
  //   aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
  //   liWrap.append(aWrap);
  // 
  //   return liWrap;
  // },
  // refreshMyImagesPagination: function(pagination) {
  //   this.hasPagination = pagination.total_pages > 1 ? true : false;
  //   if (this.hasPagination) {
  //     this.paginationWrap.show();
  //     if (pagination.previous_page > 0) this.previousPageLink.show();
  //     else this.previousPageLink.hide();
  //     if (pagination.next_page > 0) this.nextPageLink.show();
  //     else this.nextPageLink.hide();
  //   }
  //   else {
  //     this.paginationWrap.hide();
  //   }
  // },
  prepareDetailsView: function($super, properties) { // type: youtube, vimeo
    $super(properties);
    
    // Set class in Titlebar ("youtube" or "vimeo")
    this.detailsView.attr({'class':"view details_view "+properties.type});
    
    // Embed video
    this.detailsVideoContainer.find('object').remove();
    this.detailsVideoContainer.append(this.webVideosSearch.youtubeSearch.buildEmbeddedVideo(properties));
    
    // Store the current properties in detailsVideoContainer
    this.detailsVideoContainer.data("properties", properties);
    
    // Title
    var name = "";
    if (properties.name) name = properties.name;
    this.detailsView.find('.video_name').text(name);
    
    // View count
    var viewCountEl = this.detailsView.find('.view_count span');
    if (properties.view_count)
      viewCountEl.text(new VideoUtils().numberWithThousandsSeparator(properties.view_count,"'"));
    else
      viewCountEl.text('');
    
    // Description
    var desc = properties.description || "";
    var descEl = this.detailsView.find('.video_description');
    descEl.text(desc);
    
    // Actions
    var showVideoPageEl = $("#show_video_page_action");
    var serviceName = properties.type === "youtube" ? "YouTube" : "Vimeo";
    showVideoPageEl.text(showVideoPageEl.data("originalText").replace("*", serviceName));
    // If Details view is loaded from the My Videos section, we won't need this action...
    if (this.element.find('div.selected')[0] === this.tabContainers[1]) {
      $("#add_to_my_videos_action").parent().hide();
    }
    else {
      $("#delete_from_my_videos_action").parent().hide();
    }
  },
  detailsViewDidAppear: function() {
    // this.detailsView.find('.loading').remove();
  }
});
