/**
 * @author Zeno Crivelli
**/

//= require "sha1"

WebDoc.WebVideosSearch = $.klass({
  initialize: function(searchFieldId, videosLibrary) {
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    
    this.youtubeSearch = new WebDoc.YoutubeSearch();
    this.vimeoSearch = new WebDoc.VimeoSearch();
    
    // Set callback to the VideosLibrary
    this.videosLibrary = videosLibrary;
    
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.youtubeSearch.initialSearch(query);
      this.vimeoSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup video rows drag n' drop
    //$("#web_videos .rows").bind("dragstart", this.videosLibrary.prepareRowDrag.pBind(this.videosLibrary));
  }
});

// Generic class to be used as parent class for YouTube, Vimeo or other web videos services implementations.
// Do not instanciate this directly (use one of its subclasses)
WebDoc.ServiceVideosSearch = $.klass({
  initialize: function(containerId) {
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
    this.container.show();
  },
  loadMore: function() {
    this.showSpinner();
  },
  showSpinner: function() {
    this.container.find('.load_more').hide();
    this.videosContainerWrapper.append($('<div class="loading">Loading</div>'));
  },
  buildVideoRow: function(type, videoId, url, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height) {
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
      height: height              //vimeo
    };
    
    var thumb = $("<img>").attr({
      src : thumbUrl,
      alt : ""
    })
    .data("properties", properties);
    
    var thumbWrap = $("<span>").attr({'class':'wrap'});
    thumbWrap.append(thumb);
    
    var titleEl = $("<strong>").addClass("title").text(name);
    var viewCountEl = $("<span>").addClass("view_count").text(this.libraryUtils.numberWithThousandsSeparator(viewCount,"'")+" views");
    var durationEl = $("<span>").addClass("duration").text(this.libraryUtils.timeFromSeconds(duration));
    var liWrap = $("<li>").addClass("video_row").addClass(type);
    var aWrap = $("<a href=\"\"></a>");
    if (isHd === "1") thumbWrap.append($("<span>").addClass("hd_icon_overlay"));
    aWrap.append(thumbWrap).append(titleEl).append(durationEl).append(viewCountEl).append($("<span>").attr({'class':'spacer'}));
    
    liWrap.append(aWrap);
    return liWrap;
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
  buildEmbeddedVideo: function(properties) {
    // var src = "http://www.youtube.com/v/PZf8MRYasss&hl=en_US&fs=1&";
    
    var url = properties.embed_url + "&fs=1&hd=1&showinfo=0";
    var width = 320;
    var height = properties.aspect_ratio === "widescreen" ? 200 : 265;
    
    var object = $("<object>").attr({
      width: width,
      height: height
    })
    .append($("<param>").attr({ name: "movie", value: url }))
    .append($("<param>").attr({ name: "allowFullScreen", value: "true" }))
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
  performSearch: function() {
    // http://code.google.com/apis/youtube/2.0/developers_guide_protocol.html
    
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
        // ddd(data)
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
              this.buildVideoRow("youtube", videoId, "http://www.youtube.com/watch?v="+videoId, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, "", "", "")
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
    this.performSearch();
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
  buildEmbeddedVideo: function() {
    
    var url = properties.embed_url;
    var width = 320;
    var height = parseInt(width * (properties.height / properties.width), 10);
    
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
  performSearch: function() {
    // http://vimeo.proxy.app-base.com/api/docs/oauth
    // http://vimeo.com/api/docs/methods/vimeo.videos.search
    
    var timeStamp = parseInt(new Date().getTime() / 1000, 10); // seconds elapsed since Jan 1, 1970
    /////
    // ddd("TIME STAMP: "+timeStamp);
    /////
    
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
    
    /////
    // ddd("BASE STRING: "+baseString);
    /////
    
    var key = this.consumerSecret + "&";
    
    var b64Signature = b64_hmac_sha1(key, baseString); // I use the sha1.js lib from jshash-2.2.zip (http://pajhome.org.uk/crypt/md5/instructions.html)
    
    /////
    // ddd("B64 SIGNATURE: "+b64Signature);
    /////
    
    var signature = encodeURIComponent(b64Signature+"=");
    
    /////
    // ddd("PERCENT-ENCODED SIGNATURE: "+signature);
    /////
    
    var vimeoUrl = this.baseUrl + "?" +
    requestParameterStringForUrl +
    "&oauth_signature=" + signature;
    
    /////
    // ddd("FINAL URL: "+vimeoUrl);
    /////
    
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
    // ddd(data)
    // this.resultsCount.text('0');
    var totResults = parseInt(data.videos.total,10);
    
    this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(totResults,"'"));
    
    if (data.videos.video && data.videos.video.length > 0) {
      
      this.page = parseInt(data.videos.page,10);
      this.perPage =  parseInt(data.videos.perpage,10);
      
      var results = data.videos.video;
      $.each(results, function(i, video) {
        // ddd(video)
        
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
          this.buildVideoRow("vimeo", videoId, "http://vimeo.com/"+videoId, thumbUrl, name, duration, viewCount, description, embedUrl, embedType, aspectRatio, isHd, width, height)
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
    
    this.container.find('.loading').remove();
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
    this.performSearch();
  }
});
