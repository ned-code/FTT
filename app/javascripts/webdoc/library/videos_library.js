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
      // properties are stored in the img/thumbnail element of the video row
      var properties = $(event.target).parent().find('img').data("properties");
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
    
    // An option...
    this.backToMyVideosListAfterRemoval = true;
  },
  setupMyVideos: function() {
    this.myVideosId = "my_videos";
    
    this.myVideosPage = 1;
    this.myVideosContainer = $('#'+this.myVideosId);
    this.libraryUtils = new LibraryUtils();
    
    // Setup video rows drag n' drop
    this.myVideosContainer.find(".rows").bind("dragstart", this.prepareRowDrag.pBind(this));
    
    // Next/Previous page links
    this.paginationWrap = $("<div class='pagination' style='display:none'>");
    this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
    this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
    this.previousPageLink.click(function(event){
      this.loadMyVideos(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.nextPageLink.click(function(event){
      this.loadMyVideos(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.myVideosContainer.append(this.paginationWrap);
  },
  setupDetailsView: function() {
    
    // Setup drag n' drop
    this.detailsView.find('.drag_handle').attr({ draggable: "true" })
    .bind("dragstart", this.prepareVideoDrag.pBind(this))
    .css({ "-webkit-user-drag":"element" });  // this is the equivalent of the HTML5 "draggable" attribute 
                                              // for current version of safari (v4.0.4)) (but future webkit
                                              // version will support "draggable" and at that point we'll 
                                              // be able to remove this line)
    $(document.body).append(this.buildMediaDragFeedbackElement("video", "")); // just to preload the icon (so that it'll be immediately available at the first drag)
    
    
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
        case "add_video_to_page_action":
          ddd("add_video_to_page_action");
          var properties = this.detailsVideoContainer.data("properties");
          WebDoc.application.boardController.insertVideo(properties);
          break;
          
        case "show_video_page_action":
          ddd("show_video_page_action");
          window.open(properties.url, '_blank');
          break;
          
        case "add_to_my_videos_action":
          link.hide();
          li.append(info);
          
          var railsParams = {};
          WebDoc.Record.convertToRailsJSon({ properties : properties }, railsParams, "video");
          $.ajax({
            type: "POST",
            url: "/videos.json",
            data: railsParams,
            dataType: "json",
            success: function(serverData) {
              info.text("Done!");
              setTimeout(function(){ info.fadeOut(500); }, 500);
              this.refreshMyVideos([serverData.video]);
            }.pBind(this),
            complete: function() {
              setTimeout(function(){ li.hide(); info.remove(); link.show();  }, 1000);
            }.pBind(this)
          });
          break;
          
        case "delete_from_my_videos_action":
          if (confirm ("Are you sure?")) {
            link.hide();
            li.append(info);
            
            $.ajax({
              type: "DELETE",
              url: "/videos/"+properties.uuid,
              success: function(serverData) {
                info.text("Done!");
                setTimeout(function(){ info.fadeOut(500); }, 500);
                this.refreshMyVideos();
              }.pBind(this),
              complete: function() {
                var delay = setTimeout(function(){ li.hide(); info.remove(); link.show(); }, 1000);
                if (this.backToMyVideosListAfterRemoval) { // Go back
                  //in this case we need to immediately rehestablish the UI, in case the user will quickly reselects another thumbnail just after deleting this one
                  clearTimeout(delay); li.hide(); info.remove(); link.show();
                  this.detailsView.find(".toolbar .back").click();
                }
              }.pBind(this)
            });
          }
          break; 
      }
    }.pBind(this));
  },
  prepareRowDrag: function(event) {
    // Started dragging a video "row" from the web search results or My Videos lists
    
    var target = $(event.target);
    // if ($.isEmptyObject(target.closest('.video_row'))) { av in jQuery v1.4
    if (target.closest('.video_row').length === 0 || target.find('img').length === 0) {
      event.preventDefault();
      return;
    }
    
    var properties = target.find('img').data("properties");
    this.dragStart(event, properties);
  },
  prepareVideoDrag: function(event) {
    // Started dragging a video from the details view (by grabbing its drag handle)
    
    var target = $(event.target);
    if (!target.hasClass('drag_handle')) {
      event.preventDefault();
      return;
    }
    
    var properties = this.detailsVideoContainer.data("properties");
    this.dragStart(event, properties);
  },
  dragStart: function(event, properties) {
    var dt = event.originalEvent.dataTransfer;
    dt.setData("application/wd-video", $.toJSON(properties));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("video", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
    // old:
    // var dragImage = new Image();
    // dragImage.src = properties.thumb_url;
    // dt.setDragImage( dragImage, 60, 40 );
  },
  showSpinner: function($super, container) {
    $super(container);
    if (this.hasPagination) this.paginationWrap.hide();
  },
  hideSpinner: function($super, container) {
    $super(container);
    if (this.hasPagination) this.paginationWrap.show();
  },
  didClickOnTab: function($super, tab) {
    $super(tab);
    if (tab === this.myVideosId) {
      this.loadMyVideos(0);
    }
  },
  loadMyVideos: function(pageIncrement) {
    var videoRowsWrap = this.myVideosContainer.find(".rows");
    
    this.myVideosPage += pageIncrement;
    if (this.myVideosPage < 1) this.myVideosPage = 1;
    
    if (pageIncrement !== 0 || !videoRowsWrap.data('loaded')) { //load only if we are paginating, or if the videos have never been loaded before
      videoRowsWrap.html('');
      
      this.showSpinner(videoRowsWrap);
      
      WebDoc.ServerManager.getRecords(WebDoc.Video, null, function(data) {
        if (data.videos.length === 0) {
          var noVideos = $("<span>").addClass('no_items').text('No Videos');
          videoRowsWrap.append(noVideos);
        }
        else {
          var myVideosList = $("<ul>");
          
          $.each(data.videos, function(i, webDocVideo) {
            
            myVideosList.append(this.buildVideoRow(webDocVideo.uuid(), webDocVideo.data.properties));
            
          }.pBind(this));
          
          videoRowsWrap.append(myVideosList);
        }
        this.refreshMyVideosPagination(data.pagination);
        videoRowsWrap.data('loaded', true);
        this.hideSpinner(videoRowsWrap);
      }.pBind(this), { ajaxParams: { page:this.myVideosPage }});
    }
  },
  refreshMyVideos: function(newVideos) {
    // Note: do not pass the newVideos arg to force reloading the whole section
    
    //if we are in first page, don't reload the whole thing, just add the newly uploaded images to the top of the list 
    var myVideosList = this.myVideosContainer.find('.rows ul');
    if (newVideos && this.myVideosPage === 1 && myVideosList.length > 0) {
      // ddd('**************************REFRESH WITH NO RELOAD')
       $.each(newVideos, function(i,video) {
         
         myVideosList.prepend(this.buildVideoRow(video.uuid, video.properties));
          
       }.pBind(this));
    }
    else { // If not (or if no newVideos are passed) reload the 1st page
      // ddd('**************************REFRESH WITH RELOAD')
      
      this.myVideosContainer.find(".rows").data('loaded', false);
      this.myVideosPage = 1;
      this.loadMyVideos(0);
    }
  },
  buildVideoRow: function(uuid, properties) {
    
    var thumb = $("<img>").attr({
      src : properties.thumb_url,
      alt : ""
    })
    .data("properties", jQuery.extend({type:"my_video", uuid:uuid}, properties));
    
    var thumbWrap = $("<span>").attr({'class':'wrap'});
    thumbWrap.append(thumb);
    
    var titleEl = $("<strong>").addClass("title").text(properties.name);
    var viewCountEl = $("<span>").addClass("view_count").text(this.libraryUtils.numberWithThousandsSeparator(properties.view_count,"'")+" views");
    var durationEl = $("<span>").addClass("duration").text(this.libraryUtils.timeFromSeconds(properties.duration));
    
    var liWrap = $("<li>").addClass("video_row").addClass(properties.type);
    var aWrap = $("<a href=\"\"></a>");
    thumbWrap.append($("<span>").addClass("icon_overlay")); //youtube/vimeo mini icon
    
    if (properties.is_hd === "1") thumbWrap.append($("<span>").addClass("hd_icon_overlay"));
    aWrap.append(thumbWrap).append(titleEl).append(durationEl).append(viewCountEl).append($("<span>").attr({'class':'spacer'}));
    liWrap.append(aWrap);
    return liWrap;
  },
  refreshMyVideosPagination: function(pagination) {
    this.hasPagination = pagination.total_pages > 1 ? true : false;
    if (this.hasPagination) {
      this.paginationWrap.show();
      if (pagination.previous_page > 0) this.previousPageLink.show();
      else this.previousPageLink.hide();
      if (pagination.next_page > 0) this.nextPageLink.show();
      else this.nextPageLink.hide();
    }
    else {
      this.paginationWrap.hide();
    }
  },
  prepareDetailsView: function($super, properties) { // type: youtube, vimeo
    $super(properties);
    
    // Set class in Titlebar ("youtube" or "vimeo")
    this.detailsView.attr({'class':"view details_view "+properties.type});
    
    // Embed video
    this.detailsVideoContainer.find('object').remove();
    this.detailsVideoContainer.prepend(this.webVideosSearch.youtubeSearch.buildEmbeddedVideo(properties));
    
    // Store the current properties in detailsVideoContainer
    this.detailsVideoContainer.data("properties", properties);
    
    // Title
    var name = "";
    if (properties.name) name = properties.name;
    this.detailsView.find('.video_name').text(name);
    
    // View count
    var viewCountEl = this.detailsView.find('.view_count span');
    if (properties.view_count)
      viewCountEl.text(this.libraryUtils.numberWithThousandsSeparator(properties.view_count,"'"));
    else
      viewCountEl.text('');
    
    // Description
    var desc = properties.description || "";
    var descEl = this.detailsView.find('.video_description');
    descEl.text(desc);
    
    // Actions
    var serviceName = properties.type === "youtube" ? "YouTube" : "Vimeo";
    var showVideoPageEl = $("#show_video_page_action");
    showVideoPageEl.text(showVideoPageEl.data("originalText").replace("*", serviceName));
    
    // If Details view is loaded from the My Videos section, we won't need this action...
    $("#video_details .actions li").show();
    if (this.element.find('div.selected').attr('id') === this.myVideosId) {
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
