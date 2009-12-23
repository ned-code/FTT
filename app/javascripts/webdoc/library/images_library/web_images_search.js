/**
 * @author Zeno Crivelli
**/

WebDoc.WebImagesSearch = $.klass({
  initialize: function(searchFieldId, imagesLibrary) {
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    
    this.flickrImagesSearch = new WebDoc.FlickrImagesSearch();
    this.googleImagesSearch = new WebDoc.GoogleImagesSearch();
    
    // Set callback to the ImageLibrary
    this.imagesLibrary = imagesLibrary;
    
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.flickrImagesSearch.initialSearch(query);
      this.googleImagesSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup thumbnails drag n' drop
    $("#web_images .thumbnails").bind("dragstart", this.imagesLibrary.dragStart.pBind(this.imagesLibrary));
  }
});


// Generic class to be used as parent class for Flickr, Google Images or other web images services implementations.
// Do not instanciate this directly (use one of its subclasses)
WebDoc.ServiceImagesSearch = $.klass({
  initialize: function(containerId) {
    this.container = $('#'+containerId);
    this.container.hide();
    this.resultsCount = this.container.find('.results_number');
    
    this.imagesContainer = $('<ul>');
    this.container.append(this.imagesContainer);
  },
  initialSearch: function() {
    this.resultsCount.text('0');
    this.imagesContainer.empty();
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
  buildThumbnail: function(type, url, thumbUrl, name, imageLink, size) {
    var properties = { type:type, url:url, thumb_url:thumbUrl, name:name, image_link:imageLink };
    if (size) jQuery.extend(properties, { width:size.width, height:size.height });
    
    var thumb = $("<img>").attr({
      src : thumbUrl,
      alt : ""
    }).data("properties", properties);
    
    var liWrap = $("<li>").addClass(type);
    var aWrap = $("<a href=\""+imageLink+"\" title=\""+name+"\"></a>");
    aWrap.append(thumb);
    // aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
    liWrap.append(aWrap);
    
    return liWrap;
  }
});

WebDoc.FlickrImagesSearch = $.klass(WebDoc.ServiceImagesSearch, {
  initialize: function($super) {
    $super('flickr_images');
    
    this.flickrApiKey = '17877450af95abebef121754b8a8fe81';
    this.flickrPhotosSearchBaseUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search";
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.container).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
  },
  performSearch: function() {
    // http://www.flickr.com/services/api/flickr.photos.search.html
    // http://www.flickr.com/services/api/misc.urls.html
    var flickrUrl = this.flickrPhotosSearchBaseUrl+
    "&text=" + encodeURIComponent(this.query) +
    "&per_page="+ this.perPage +
    "&page=" + this.page +
    "&content_type=1&api_key=" + this.flickrApiKey + "&format=json&jsoncallback=?";
    $.getJSON(flickrUrl,
      function(data){
        //ddd(data);
        this.resultsCount.text(data.photos.total);
        this.page = parseInt(data.photos.page,10);
        this.perPage = data.photos.perpage;
        
        $.each(data.photos.photo, function(i,photo){
          var photoSourceUrl = "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
          var thumbSourceUrl = photoSourceUrl.replace('.jpg','_s.jpg');
          var photoPageLink = "http://www.flickr.com/photos/"+photo.owner+"/"+photo.id;
          
          this.imagesContainer.append(this.buildThumbnail("flickr", photoSourceUrl, thumbSourceUrl, photo.title, photoPageLink, null));
          
        }.pBind(this));
        
        this.container.find('.loading').remove();
        
        if ( parseInt(data.photos.pages,10) > this.page ) {
          this.loadMoreLink.show();
        }
        else {
          this.loadMoreLink.hide();
        }
      }.pBind(this)
    );
  },
  initialSearch: function($super, query) {
    if (query.replace(/\s/g,'') !== "") {
      $super();
      this.query = query;
      this.page = 1;
      this.perPage = 9;

      this.performSearch();
    }
  },
  loadMore: function($super) {
    $super();
    this.page += 1; 
    this.performSearch();
  }
});

WebDoc.GoogleImagesSearch = $.klass(WebDoc.ServiceImagesSearch, {
  initialize: function($super) {
    $super('google_images');

    this.googleApiKey = 'ABQIAAAApQVNSQ3vVhagmaEB0elu7BTPrwtLmcDxRofti2tV-VsxVMfrRRTawoNcxVFL3Hajl6ZPExg6uL8XGg';
    // This key is good for all URLs in this directory: http://webdoc.com
    // (Key created with info@jilion.com account)
    
    this.googleImagesSearchBaseUrl = "http://ajax.googleapis.com/ajax/services/search/images";
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.container).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
  },
  performSearch: function() {
    // http://code.google.com/apis/ajaxsearch/documentation/reference.html

    var googleUrl = this.googleImagesSearchBaseUrl +
    "?q=" + encodeURIComponent(this.query) +
    "&rsz=large" + //asks for 8 images (max value)
    "&start=" + this.startParam +
    "&key=" + this.googleApiKey +
    "&v=1.0&callback=?";

    $.getJSON(googleUrl,
      function(data){
        ddd(data);
        var cursor = data.responseData.cursor;
        this.resultsCount.text(cursor.estimatedResultCount);

        if (data.responseData.results && data.responseData.results.length > 0) {
          var results = data.responseData.results;
          
          $.each(results, function(i, gImage) {
            
            this.imagesContainer.append(this.buildThumbnail("google", gImage.url, gImage.tbUrl, gImage.titleNoFormatting, gImage.url, {width:gImage.width,height:gImage.height}));
            
          }.pBind(this));
        
          this.container.find('.loading').remove();
        
          if ( cursor.pages && cursor.pages.length > 1 ) {
            var nextPage = cursor.pages[cursor.currentPageIndex + 1];
            if (nextPage) {
              this.startParam = nextPage.start;
              ddd("new start param:"+this.startParam);
              this.loadMoreLink.show();
            }
          }
          else {
            this.loadMoreLink.hide();
          }
        }
      }.pBind(this)
    );
  },
  initialSearch: function($super, query) {
    if (query.replace(/\s/g,'') !== "") {
      $super();
      this.query = query;
      this.startParam = 0;

      this.performSearch();
    }
  },
  loadMore: function($super) {
    $super();
    // new start param should have already been updated
    this.performSearch();
  }
});