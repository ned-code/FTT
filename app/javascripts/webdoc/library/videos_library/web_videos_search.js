/**
 * @author Zeno Crivelli
**/

WebDoc.WebVideosSearch = $.klass({
  initialize: function(searchFieldId, videosLibrary) {
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    
    this.youtubeSearch = new WebDoc.YoutubeSearch();
    // this.vimeoSearch = new WebDoc.VimeoSearch();
    
    // Set callback to the VideosLibrary
    this.videosLibrary = videosLibrary;
    
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.youtubeSearch.initialSearch(query);
      // this.vimeoSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup thumbnails drag n' drop
    // $("#web_images .thumbnails").bind("dragstart", this.imagesLibrary.dragStart.pBind(this.imagesLibrary));
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
    this.container.append(this.videosContainer);
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
    this.container.append($('<div class="loading">Loading</div>'));
  },
  timeFromSeconds: function(t) {
    var h = Math.floor(t / 3600);
    t %= 3600;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    
    h = h>0 ? ( h<10 ? '0'+h : h )+':' : '';
    m = m>0 ? ( m<10 ? '0'+m : m )+':' : '';
    s = s>0 ? ( s<10 ? '0'+s : s ) : '';
    return h+m+s;
  },
  numberWithThousandsSeparator: function(number, separator) {
    var separator = separator || ",";
    var regexp = /\d{1,3}(?=(\d{3})+(?!\d))/g;
    return (""+number).replace(regexp, "$1"+separator);
  },
  buildThumbnail: function(type, url, thumbUrl, name, imageLink, size) {
    // var properties = { type:type, url:url, thumb_url:thumbUrl, name:name, image_link:imageLink };
    // if (size) jQuery.extend(properties, { width:size.width, height:size.height });
    // 
    // var thumb = $("<img>").attr({
    //   src : thumbUrl,
    //   alt : ""
    // }).data("properties", properties);
    // 
    // var liWrap = $("<li>").addClass(type);
    // var aWrap = $("<a href=\""+imageLink+"\" title=\""+name+"\"></a>");
    // aWrap.append(thumb);
    // // aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
    // liWrap.append(aWrap);
    // 
    // return liWrap;
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
    }.pBind(this)).appendTo(this.container).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
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
        // this.resultsCount.text(data.feed.openSearch$itemsPerPage.$t);
        var totResults = data.feed.openSearch$totalResults.$t;
        this.resultsCount.text(data.feed.openSearch$totalResults.$t);
        if (data.feed.entry && data.feed.entry.length > 0) {
          ddd(data.feed.entry)
          var results = data.feed.entry;
          $.each(results, function(i, video) {
            
            var title = video.title.$t;
            var duration = video.media$group.yt$duration.seconds;
            var description = video.media$group.media$description.$t;
            var thumbUrl = video.media$group.media$thumbnail[0].url;
            var viewCount = video.yt$statistics.viewCount;
           
            // ---------------------------
            var type = "youtube";
            var name = title; 
            var properties = { type:type, url:"", thumb_url:thumbUrl, name:name, duration:duration };
            
            var thumb = $("<img>").attr({
              src : thumbUrl,
              alt : "",
              width: "120",
              height: "72"
            }).data("properties", properties);
            
            var titleEl = $("<h4>").addClass("title").text(name);
            var viewCountEl = $("<span>").addClass("view_count").text(this.numberWithThousandsSeparator(viewCount,"'")+" views");
            var durationEl = $("<span>").addClass("duration").text(this.timeFromSeconds(duration));
            
            var liWrap = $("<li>").addClass("video_row").addClass(type);
            var aWrap = $("<a href=\"\" title=\""+name+"\"></a>");
            aWrap.append(thumb).append(titleEl).append(durationEl).append(viewCountEl);
            
            // aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
            liWrap.append(aWrap);
            this.videosContainer.append(liWrap);
            
          }.pBind(this));
          
          if ( totResults > this.startIndex + this.perPage ) {
            this.startIndex += this.perPage;
            // ddd("new start param:"+this.startIndex);
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
      this.perPage = 9;
      
      this.performSearch();
    }
  },
  loadMore: function($super) {
    $super();
    // new startIndex param should have already been updated
    this.performSearch();
  }
});