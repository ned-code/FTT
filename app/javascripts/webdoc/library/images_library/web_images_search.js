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
      
    }.pBind(this));

    // Observe thumb clicks (with event delegation) for all current and future thumbnails
    $("#web_images .thumbnails ul li a").live("click", function (event) {
      var thumbData = $(event.target).data("thumbData");
      this.imagesLibrary.prepareDetailsView(thumbData.type, thumbData.webImageData);
      this.imagesLibrary.showDetailsView.click();
      event.preventDefault();
    }.pBind(this));
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
  initialSearch: function(query) {
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
        // ddd(data);
        this.resultsCount.text(data.photos.total);
        this.page = parseInt(data.photos.page);
        this.perPage = data.photos.perpage;
        
        $.each(data.photos.photo, function(i,photo){
          var photoSourceUrl = "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
          $("<img>").attr({
            "src" : photoSourceUrl.replace('.jpg','_s.jpg'), 
            "alt" : "" })
          .data("thumbData", {  
            "type" : "flickr",
            "webImageData" : { 'photo_id':photo.id, 'user_id':photo.owner, 'title':photo.title, 'source_url':photoSourceUrl }
          })
          .appendTo(this.imagesContainer)
          .wrap("<li><a href=\"http://www.flickr.com/photos/"+photo.owner+"/"+photo.id+"\" title=\""+ photo.title +"\"></a></li>");
        }.pBind(this));
        
        this.container.find('.loading').remove();
        
        if ( parseInt(data.photos.pages) > this.page ) {
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
  }
});