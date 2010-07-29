/**
 * @author Zeno Crivelli
**/

//= require "sha1"

WebDoc.WebVideosSearch = $.klass({
  initialize: function(searchFieldId, parentController) {
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    this.libraryUtils = new LibraryUtils();
    this.youtubeSearch = new WebDoc.YoutubeSearch();
    this.vimeoSearch = new WebDoc.VimeoSearch();
    
    this.parentController = parentController;
    this.detailsView = $('#media-browser-web-video-details');
    this.setupDetailsView();
   
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.youtubeSearch.initialSearch(query);
      this.vimeoSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup video rows drag n' drop
    $("#web-videos .rows").bind("dragstart", this.prepareRowDrag.pBind(this));
    
    //setup click listening
    $("#web-videos .rows ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      event.preventDefault();
      this.showDetailsView(properties);
      
    }.pBind(this));

  },

  prepareRowDrag: function(event) {
    // Started dragging a video "row" from the web search results
    var target = $(event.target);
    var properties;
    
    
    if(target.is('img')){
      properties = target.data('properties');
    }
    //if ($.isEmptyObject(target.closest('.video_row'))) { av in jQuery v1.4
    else if (target.closest('.video_row').length === 0 || target.find('img').length === 0) {
      event.preventDefault();
      return;
    }
    else{
       properties = target.find('img').data("properties");
    }
    
    this.dragStart(event, properties);
  },

  dragStart: function(event, properties) {
    var dt = event.originalEvent.dataTransfer;
    dt.setData("application/wd-video", $.toJSON(properties));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.parentController.buildMediaDragFeedbackElement("video", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },

  setupDetailsView: function(){
    this.detailsView.find('.drag_handle').attr({ draggable: "true" })
    .bind("dragstart", this.prepareVideoDrag.pBind(this));
    
    var showVideoPageEl = $("#show_video_page_action");
    showVideoPageEl.data("originalText", showVideoPageEl.text());
    
    this.detailsVideoContainer = this.detailsView.find('.single_video');
    
    // handle possible actions 
    $("#media-browser-web-video-details .actions").click(function(event){
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
          
        case "show_web_video_page_action" :
          window.open(properties.url, '_blank');
          break;
          
        case "add_video_to_favorites" :
          link.hide();
          li.append(info);
          
          var video = new WebDoc.Video;
          video.data.properties = properties;
          video.data.favorites = 1;
          video.save(function(persitedVideo){
            info.text("Done!");
            if($('#media-browser-my-favorites').length){
              WebDoc.application.mediaBrowserController.myContentsController.insertVideo(persitedVideo.data.properties, persitedVideo.uuid());
            }
          }.pBind(this));
          break;
      }
    }.pBind(this));
  },

  showDetailsView: function(properties){
    // Set class in Titlebar ("youtube" or "vimeo")
    this.detailsView.attr({'class':"view details_view web-search-tab "+properties.type});
    
    // Embed video
    this.detailsVideoContainer.find('object').remove();
    this.detailsVideoContainer.prepend(this.buildEmbeddedVideo(properties));
    
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
    var showVideoPageEl = $("#show_web_video_page_action");
    showVideoPageEl.text('Show video on ' + serviceName);

    //setup the favorites links
    if( $('#media-browser-web-video-details #add_video_to_favorites').length){
      $('#media-browser-web-video-details #add_video_to_favorites').parent().remove(); 
      liFavorites = $('<li>').append($("<a href='' id='add_video_to_favorites'>Add to favorites</a>"));
      $("#media-browser-web-video-details .actions ul").append(liFavorites);
    }
    
    this.parentController.hideAll();
    $('#media-browser-web-video-details').show();
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

  buildEmbeddedVideo: function(properties) {		
    var url,width,height;
    
    switch (properties.type) {
      case 'youtube':
        url = properties.embed_url + "&fs=1&hd=1&showinfo=0";
        width = "100%";
        height = "auto";//properties.aspect_ratio === "widescreen" ? 200 : 265;
        break;
      case 'vimeo' :
        url = properties.embed_url;
        width = "100%";
        height = "auto";//parseInt(width * (properties.height / properties.width), 10);
        break;
    }
    
    var object = $("<object>").attr({
      width: width,
      height: height
    })
    .append($("<param>").attr({ name: "movie", value: url }))
    .append($("<param>").attr({ name: "allowfullscreen", value: "true" }))
    .append($("<param>").attr({ name: "allowscriptaccess", value: "always" }))
    .append($("<embed>").attr({ 
      src: url,
      type: properties.embed_type,
      allowscriptaccess: "always",
      allowfullscreen: "true",
      width: width,
      height: height
    }));
    
    return object;
  },

  buildVideoRow: function(type, videoId, url, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height, uuid) {
      var properties = { 
        type: type,
        video_id: videoId,
        url: url,
        thumb_url: thumbUrl,
        name: name,
        duration: duration,
        view_count: viewCount,
        description: description,
        embed_url: embedUrl,
        embed_type: embedType,
        aspect_ratio: aspectRatio,  //yt
        is_hd: isHd,                //vimeo
        width: width,               //vimeo
        height: height,              //vimeo
        uuid: uuid
      };
  
      var thumb = $("<img>").attr({
        src : thumbUrl,
        style: '-webkit-user-drag:element;-khtml-user-drag: element;',
        draggable: true
      })
      .data("properties", properties);
  
      var thumbWrap = $("<span>").attr({'class':'wrap'});
      thumbWrap.append(thumb);
  
      var titleEl = $("<strong>").addClass("title").text(name);
      var viewCountEl = $("<span>").addClass("view_count").text(this.libraryUtils.numberWithThousandsSeparator(viewCount,"'")+" views");
      var durationEl = $("<span>").addClass("duration").text(this.libraryUtils.timeFromSeconds(duration));
      var liWrap = $("<li id='" + uuid +"'>").addClass("video_row").addClass(type);
      var aWrap = $("<a/>").attr({
          href: '',
          draggable:true
        });
      if (isHd === "1") thumbWrap.append($("<span>").addClass("hd_icon_overlay"));
      aWrap.append(thumbWrap).append(titleEl).append(durationEl).append(viewCountEl).append($("<span>").attr({'class':'spacer'}));
  
      liWrap.append(aWrap);
      return liWrap;
    } 

});

// Generic class to be used as parent class for YouTube, Vimeo or other web videos services implementations.
// Do not instanciate this directly (use one of its subclasses)
WebDoc.ServiceVideosSearch = $.klass({
  initialize: function(containerId) {
    this.containerId = containerId;
    this.container = $('#'+containerId);
    this.container.hide();
    this.resultsCount = this.container.find('.results_number');
    
    this.videosContainer = $('<ul>');
    this.videosContainerWrapper = $('<div>'); // contains the ul (list) and load_more link
    this.videosContainerWrapper.append(this.videosContainer);
    this.container.append(this.videosContainerWrapper);
    
    this.container.find(".service_bar").bind("click", this.toggleResultsSection.pBind(this));
    
    this.libraryUtils = new LibraryUtils();
  },
  toggleResultsSection: function(event) {
    // collapse/expand results section
    event.preventDefault();
    if ($(event.target).hasClass('.service_bar')) { //incase we'll add something clickable inside the service_bar
      this.videosContainerWrapper.toggle();
    }
  },
  initialSearch: function() {
    this.resultsCount.text('0');
    this.videosContainer.empty();
    this.showSpinner();
    var checkbox = $(".filters>input[name='"+this.containerId+"']");
    if(checkbox.attr('name') == this.containerId && checkbox.is(':checked')){
      this.container.show();
    }
  },
  loadMore: function() {
    this.showSpinner();
  },
  showSpinner: function() {
    this.container.find('.load_more').hide();
    this.videosContainerWrapper.append($('<div class="loading">Loading</div>'));
  }
});

WebDoc.YoutubeSearch = $.klass(WebDoc.ServiceVideosSearch, {
  initialize: function($super) {
    $super('youtube_videos');
    
    this.ytDeveloperKey = 'AI39si6fd7tjaNilK9lvAyc_Cn3Zctu_YhigxG4PezdmBb6CkF5HcDoAGd5bCnTN8qFM1D-j5RHLQf0wm6RjyI8zdPFbQeSI6w';
    // This key has been created with info@jilion.com account on http://code.google.com/apis/youtube/dashboard/
    // TODO: ask Mnemis to register and create a new key
    
    this.ytSearchBaseUrl = "http://gdata.youtube.com/feeds/api/videos";
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.videosContainerWrapper).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
  },

  performSearch: function(scroll) {
    // http://code.google.com/apis/youtube/2.0/developers_guide_protocol.html
    $('#web_images_search_field').val(this.query);
    var youtubeUrl = this.ytSearchBaseUrl +
    "?q=" + encodeURIComponent(this.query) +
    "&start-index=" + this.startIndex +
    // "&orderby=viewCount" +
    "&max-results=" + this.perPage +
    "&format=5" +
    "&key=" + this.ytDeveloperKey +
    "&alt=json-in-script" +
    "&v=2&callback=?";
    
    $.getJSON(youtubeUrl,
      function(data){
        var totResults = data.feed.openSearch$totalResults.$t;
        
        this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(totResults,"'"));
        
        if (data.feed.entry && data.feed.entry.length > 0) {
          // ddd(data.feed.entry)
          var results = data.feed.entry;
          $.each(results, function(i, video) {
            var videoMediaGroup = video.media$group;
            
            var name = video.title.$t;
            var duration = videoMediaGroup.yt$duration.seconds;
            var description = videoMediaGroup.media$description.$t;
            var thumbUrl = videoMediaGroup.media$thumbnail[0].url;
            var aspectRatio = videoMediaGroup.yt$aspectRatio ? videoMediaGroup.yt$aspectRatio.$t : "normal";
            var viewCount = video.yt$statistics ? video.yt$statistics.viewCount : "";
            var embedUrl = video.content.src;
            var embedType = video.content.type;
            var videoId = videoMediaGroup.yt$videoid.$t;
            
            this.videosContainer.append(
              WebDoc.application.mediaBrowserController.webSearchController.webVideosSearch.buildVideoRow("youtube", videoId, "http://www.youtube.com/watch?v="+videoId, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, "", "", "","")
            );
            
          }.pBind(this));

          // Refresh loadMoreLink
          if ( totResults > this.startIndex + this.perPage ) {
            this.startIndex += this.perPage;
            this.loadMoreLink.show();
          }
          else {
            this.loadMoreLink.hide();
          }
        }
        this.container.find('.loading').remove();
        if(scroll){
          this.container[0].scrollIntoView(false);
        }
      }.pBind(this)
    );
  },
  initialSearch: function($super, query) {
    if (query.replace(/\s/g,'') !== "") {
      $super();
      this.query = query;
      this.startIndex = 1;
      this.perPage = 5;
      
      this.performSearch();
    }
  },
  loadMore: function($super) {
    $super();
    // new startIndex param should have already been updated
    this.performSearch(true);
  }
});

WebDoc.VimeoSearch = $.klass(WebDoc.ServiceVideosSearch, {
  initialize: function($super) {
    $super('vimeo_videos');
    
    this.baseUrl = "http://vimeo.com/api/rest/v2";
    this.callbackName = "WebDoc.application.mediaBrowserController.webSearchController.webVideosSearch.vimeoSearch.jsonpCallback";
    this.consumerKey = "cc9ca0fe8447041900d2ea1c9e13164d";
    this.consumerSecret = "8a74a52d90254c5";
    // This key has been created by me (vimeo user "zeno") on http://www.vimeo.com/api/applications/new
    // TODO: ask Mnemis to register and create a new application/key
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.videosContainerWrapper).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
  },

  performSearch: function(scroll) {
    // http://vimeo.proxy.app-base.com/api/docs/oauth
    // http://vimeo.com/api/docs/methods/vimeo.videos.search
    
    var timeStamp = parseInt(new Date().getTime() / 1000, 10); // seconds elapsed since Jan 1, 1970
    
    // Note: params order in this string will be ESSENTIAL (MUST be alphab. order)
    var requestParameterStringForSignature = 
    "callback=" + this.callbackName +
    "&format=jsonp" +
    "&full_response=true" +
    "&method=vimeo.videos.search" + 
    "&oauth_consumer_key=" + this.consumerKey + 
    "&oauth_nonce=" + timeStamp +
    "&oauth_signature_method=HMAC-SHA1" + 
    "&oauth_timestamp=" + timeStamp +
    "&oauth_token=" +
    "&oauth_version=1.0" +
    "&page=" + this.page +
    "&per_page=" + this.perPage +
    "&query=" + this.query;
    
    // Note: params order in this string is not important
    var requestParameterStringForUrl =
    "callback=" + this.callbackName +
    "&format=jsonp" +
    "&full_response=true" +
    "&method=vimeo.videos.search" + 
    "&oauth_consumer_key=" + this.consumerKey + 
    "&oauth_nonce=" + timeStamp +
    "&oauth_signature_method=HMAC-SHA1" + 
    "&oauth_timestamp=" + timeStamp +
    "&oauth_token=" +
    "&oauth_version=1.0" +
    "&page=" + this.page +
    "&per_page=" + this.perPage +
    "&query=" + encodeURIComponent(this.query);
    
    var baseString = "GET"+ "&" +
      encodeURIComponent(this.baseUrl) + "&" +
      encodeURIComponent(requestParameterStringForSignature);
    
    var key = this.consumerSecret + "&";
    
    var b64Signature = b64_hmac_sha1(key, baseString); // I use the sha1.js lib from jshash-2.2.zip (http://pajhome.org.uk/crypt/md5/instructions.html)
    
    var signature = encodeURIComponent(b64Signature+"=");
    
    var vimeoUrl = this.baseUrl + "?" +
    requestParameterStringForUrl +
    "&oauth_signature=" + signature;
    
    // ABSOLUTELY ESSENTIAL DISCOVERY:
    // in this case I can't simply use $.getJSON as I do for youtube, 
    // in fact I can't let jQuery handle automatically the callback name,
    // because the callback name is something that I need in order to create 
    // the oauth signature. 
    // That's why I'll use the following custom method I implemented...
    this.jsonpExecuteCall(vimeoUrl);
    //TODO: make it work with $.ajax:
    // $.ajax({
    //   url: vimeoUrl,
    //   dataType: "jsonp",
    //   jsonpCallback: this.callbackName
    // });
    // 
  },
  jsonpExecuteCall: function(url) {
    var script = $('<script>').attr({ src: url, type: "text/javascript", id:"jsonp_script" });
    document.body.appendChild(script[0]);
  },
  jsonpCallback: function(data) {
    $("#jsonp_script").remove(); //remove script element created by jsonpExecuteCall
    ddd(data)
    // this.resultsCount.text('0');
    if(data.videos){
      var totResults = parseInt(data.videos.total,10);
      
      this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(totResults,"'"));
      
      if (data.videos.video && data.videos.video.length > 0) {
        
        this.page = parseInt(data.videos.page,10);
        this.perPage =  parseInt(data.videos.perpage,10);
        
        var results = data.videos.video;
        $.each(results, function(i, video) {
          
          var name = video.title;
          var duration = video.duration;
          var description = video.description;
          var thumbUrl = video.thumbnails.thumbnail[1]._content; //200x150
          var viewCount = video.number_of_plays;
          var aspectRatio = ""; //yt
          var videoId = video.id;
          var embedUrl = "http://vimeo.com/moogaloop.swf?clip_id="+videoId+"&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1";
          var embedType = "application/x-shockwave-flash";
          var isHd = video.is_hd;
          var width = parseInt(video.width,10);
          var height = parseInt(video.height,10);
          
          this.videosContainer.append(
            WebDoc.application.mediaBrowserController.webSearchController.webVideosSearch.buildVideoRow("vimeo", videoId, "http://vimeo.com/"+videoId, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height, "")
          );
        }.pBind(this));
        
        if ( totResults > this.page * this.perPage ) {
          this.page += 1;
          this.loadMoreLink.show();
        }
        else {
          this.loadMoreLink.hide();
        }
      }
    }
    else{
      this.resultsCount.text('0');
    }
    this.container.find('.loading').remove();
    if(scroll){
      this.container[0].scrollIntoView(false);
    }
  },

  initialSearch: function($super, query) {
    if (query.replace(/\s/g,'') !== "") {
      $super();
      this.query = query;
      this.page = 1;
      this.perPage = 5;
      
      this.performSearch();
    }
  },

  loadMore: function($super) {
    $super();
    this.performSearch(true);
  }
});
