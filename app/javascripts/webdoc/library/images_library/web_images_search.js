/**
 * @author Zeno Crivelli
**/

WebDoc.WebImagesSearch = $.klass({
  initialize: function(searchFieldId, imagesLibrary) {
		ddd('[WebImagesSearch] initialize');
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    
    this.flickrImagesSearch = new WebDoc.FlickrImagesSearch();
    this.googleImagesSearch = new WebDoc.GoogleImagesSearch();
    
    // Set callback to the ImagesLibrary
    this.imagesLibrary = imagesLibrary;
    
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.googleImagesSearch.initialSearch(query);
      this.flickrImagesSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup thumbnails drag n' drop
    $("#web-images .thumbnails").bind("dragstart", function(event){
			ddd('drats sfdgdf');
			this.dragStart(event);
		}.pBind(this));
		
		//setup click listening
		$("#media-browser-web .thumbnails ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      ddd('click on an image');
			//this.showDetailsView(properties);
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
    var mediaDragFeedbackEl = this.imagesLibrary.buildMediaDragFeedbackElement("image", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 60, 60 );
  }
});


// Generic class to be used as parent class for Flickr, Google Images or other web images services implementations.
// Do not instanciate this directly (use one of its subclasses)
WebDoc.ServiceImagesSearch = $.klass({
  initialize: function(containerId) {
		ddd('[ServiceImagesSearch] initialize');
    this.container = $('#'+containerId);
    this.container.hide();
    this.resultsCount = this.container.find('.results_number');
    
    this.container.find(".service_bar").bind("click", this.toggleResultsSection.pBind(this));
    
    this.imagesContainer = $('<ul>');
    this.imagesContainerWrapper = $('<div>'); // contains the ul (list) and load_more link
    this.imagesContainerWrapper.append(this.imagesContainer);
    this.container.append(this.imagesContainerWrapper);
    
    this.libraryUtils = new LibraryUtils();
  },
  toggleResultsSection: function(event) {
    // collapse/expand results section
    event.preventDefault();
    if ($(event.target).hasClass('.service_bar')) {
      this.imagesContainerWrapper.toggle();
    }
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
    this.imagesContainerWrapper.append($('<div class="loading">Loading</div>'));
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
    aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
    liWrap.append(aWrap);
    
    return liWrap;
  }
});

WebDoc.FlickrImagesSearch = $.klass(WebDoc.ServiceImagesSearch, {
  initialize: function($super) {
		ddd('[FlickrImagesSearch] initialize');
    $super('flickr_images');
    
    this.flickrApiKey = '17877450af95abebef121754b8a8fe81';
    this.flickrPhotosSearchBaseUrl = "http://api.flickr.com/services/rest/?method=flickr.photos.search";
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.imagesContainerWrapper).wrap("<div class='load_more' style='display:none'>");
    this.loadMoreLink = this.container.find('.load_more');
    
    this.setupLicenseSelector();
  },
  setupLicenseSelector: function() {
    var licenses = { 
      "":  "No filter",                                    
      "3": "Reuse (non-commercial)",                       //CC-Attribution-NonCommercial-NoDerivs
      "2": "Reuse (non-commercial) with modification",     //CC-Attribution-NonCommercial
      "6": "Commercial reuse",                             //CC-Attribution-NoDerivs
      "4": "Commercial reuse with modification"            //CC-Attribution
      // "7": "No known copyright restrictions"
    };
    this.currentLicense = "";
    
    var licenseSelector = $("<select>").addClass("cc_selector");
    $.each(licenses, function(k,v){
      licenseSelector.append($("<option>").attr({ value:k }).text(v));
    }.pBind(this));
    
    licenseSelector.bind("change", function(event){
      this.currentLicense = licenseSelector.val();
      this.initialSearch(this.query);
    }.pBind(this));
    
    this.resultsCount.before(licenseSelector);
  },
  performSearch: function() {
    // http://www.flickr.com/services/api/flickr.photos.search.html
    // http://www.flickr.com/services/api/misc.urls.html
    var flickrUrl = this.flickrPhotosSearchBaseUrl+
    "&text=" + encodeURIComponent(this.query) +
    "&license=" + this.currentLicense +
    "&per_page="+ this.perPage +
    "&page=" + this.page +
    "&content_type=1&api_key=" + this.flickrApiKey + "&format=json&jsoncallback=?";
    $.getJSON(flickrUrl,
      function(data){
        //ddd(data);
        this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(data.photos.total,"'"));
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
		ddd('[GoogleImagesSearch] initialize');
    $super('google_images');
    
    this.googleApiKey = 'ABQIAAAApQVNSQ3vVhagmaEB0elu7BTPrwtLmcDxRofti2tV-VsxVMfrRRTawoNcxVFL3Hajl6ZPExg6uL8XGg';
    // This key is good for all URLs in this directory: http://webdoc.com
    // (Key created with info@jilion.com account)
    
    this.googleImagesSearchBaseUrl = "http://ajax.googleapis.com/ajax/services/search/images";
    
    //Load More link
    $("<a>").attr("href","").text("Load more").click(function(event){
      this.loadMore();
      event.preventDefault();
    }.pBind(this)).appendTo(this.imagesContainerWrapper).wrap("<div class='load_more' style='display:none'>");
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
        // ddd(data);
        var cursor = data.responseData.cursor;
        this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(cursor.estimatedResultCount,"'"));
        
        if (data.responseData.results && data.responseData.results.length > 0) {
          var results = data.responseData.results;
          
          $.each(results, function(i, gImage) {
            
            this.imagesContainer.append(this.buildThumbnail("google", gImage.url, gImage.tbUrl, gImage.titleNoFormatting, gImage.url, {width:gImage.width,height:gImage.height}));
            
          }.pBind(this));
          
          if ( cursor.pages && cursor.pages.length > 1 ) {
            var nextPage = cursor.pages[cursor.currentPageIndex + 1];
            if (nextPage) {
              this.startParam = nextPage.start;
              // ddd("new start param:"+this.startParam);
              this.loadMoreLink.show();
            }
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