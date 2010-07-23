/**
 * @author Zeno Crivelli
**/

WebDoc.WebImagesSearch = $.klass({
  initialize: function(searchFieldId, parentController) {
    this.searchField = $('#'+searchFieldId);
    this.searchForm = this.searchField.parents('form');
    
    this.flickrImagesSearch = new WebDoc.FlickrImagesSearch();
    this.googleImagesSearch = new WebDoc.GoogleImagesSearch();
    
    // Set callback to the ImagesLibrary
    this.parentController= parentController;
    this.imageDetailsView = $('#media-browser-web-images-details #image-details');
    this.setupDetailsView();
    
    // Observe search submission
    this.searchForm.submit(function(event) {
      event.preventDefault();
      var query = this.searchField.val();
      
      this.googleImagesSearch.initialSearch(query);
      this.flickrImagesSearch.initialSearch(query);
      
    }.pBind(this));
    
    // Setup thumbnails drag n' drop
    $("#web-images .thumbnails").bind("dragstart", function(event){
      this.dragStart(event);
    }.pBind(this));
    
    //setup click listening
    $("#web-images .thumbnails ul li a").live("click", function (event) {
      var properties = $(event.target).parent().find('img').data("properties");
      this.showDetailsView(properties);
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
    dt.setData("application/wd-image", $.toJSON({url: imageUrl,id: properties.id, title: properties.title}));
    
    //Drag "feedback"
    var mediaDragFeedbackEl = this.parentController.buildMediaDragFeedbackElement("image", properties.thumb_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 60, 60 );
  },

  setupDetailsView: function(){
    // handle possible actions 
    $("#media-browser-web-images-details #image-details .actions").click(function(event){
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
        case 'add_image_to_favorite':
          ddd('add_image_to_favorite');
          link.hide();
          li.append(info);
          var image = new WebDoc.Image;
          image.data.remote_attachment_url = properties.url;
          image.data.favorites = 1;
          image.data.title = properties.title
          image.save(function(persitedImage){
            if(persitedImage.data.attachment_file_name){
              if($('#media-browser-my-favorites').length){
                WebDoc.application.mediaBrowserController.myContentsController.insertImage(persitedImage.data.properties, persitedImage.uuid(), 'my-favorites-images');
              }
              info.text("Done!");
            }
            else{
            	info.text("An error occurred during upload! ");
            }
          }.pBind(this));
          break;
      }

    }.pBind(this));
  },
  
  showDetailsView: function(properties){
    this.detailsViewImg = this.imageDetailsView.find('.single_image img');
    
    this.parentController.hideAll();
    
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
    
    //setup the favorites links
    if( $('#media-browser-web-images-details #add_image_to_favorite').length){
      $('#media-browser-web-images-details #add_image_to_favorite').parent().remove(); 
      liDelete = $('<li>').append($("<a href='' id='add_image_to_favorite'>Add to favorites</a>"));
      $("#media-browser-web-images-details #image-details .actions ul").append(liDelete);
    }

    $("#media-browser-web-images-details").show();
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
  }
});


// Generic class to be used as parent class for Flickr, Google Images or other web images services implementations.
// Do not instanciate this directly (use one of its subclasses)
WebDoc.ServiceImagesSearch = $.klass({
  initialize: function(containerId) {
    this.container = $('#'+containerId);
    this.container.hide();
    this.resultsCount = this.container.find('.results_number');
    this.resultsLabel = this.container.find('.results_label');
    
    this.container.find(".service_bar").bind("click", this.toggleResultsSection.pBind(this));
    
    this.imagesContainer = $('<ul>');
    this.imagesContainerWrapper = $('<div class="web_result_list">'); // contains the ul (list) and load_more link
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
  buildThumbnail: function(type, url, thumbUrl, name, imageLink, newProperties) {
    name = name.replace(/&#39;/g, "'");
    var properties = { type:type, url:url, thumb_url:thumbUrl, name:name, image_link:imageLink };
    var domSize = { width:"100%", height:"100%"}
    
    if (newProperties){
      jQuery.extend(properties, { title: newProperties.title });
      if(newProperties.width && newProperties.height){
        jQuery.extend(properties, { width:newProperties.width, height:newProperties.height });
        if(parseInt(properties.width) > parseInt(properties.height)){
          domSize.width = "auto";
        }else{
          domSize.height = "auto"
        }
      }
    }
        
    var thumb = $("<img>").attr({
      src : thumbUrl,
      alt : ""
    }).data("properties", properties);
    
    var liWrap = $("<li>").addClass(type);
    var aWrap = $("<a href=\""+imageLink+"\" title=\""+name+"\"></a>");
    thumb.width(domSize.width);
    thumb.height(domSize.height);
    aWrap.append(thumb);
    aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
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
    
    this.resultsLabel.after(licenseSelector);
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
        ddd('flickr data', data);
        this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(data.photos.total,"'"));
        this.page = parseInt(data.photos.page,10);
        this.perPage = data.photos.perpage;
        
        $.each(data.photos.photo, function(i,photo){
          var photoSourceUrl = "http://farm"+photo.farm+".static.flickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+".jpg";
          var thumbSourceUrl = photoSourceUrl.replace('.jpg','_s.jpg');
          var photoPageLink = "http://www.flickr.com/photos/"+photo.owner+"/"+photo.id;

          this.imagesContainer.append(this.buildThumbnail("flickr",
            photoSourceUrl,
            thumbSourceUrl,
            photo.title,
            photoPageLink, 
            { title: photo.title }));
          
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
        ddd('google', data);
        var cursor = data.responseData.cursor;
        this.resultsCount.text(this.libraryUtils.numberWithThousandsSeparator(cursor.estimatedResultCount,"'"));
        
        if (data.responseData.results && data.responseData.results.length > 0) {
          var results = data.responseData.results;
          
          $.each(results, function(i, gImage) {
            ddd(gImage.titleNoFormatting);
            this.imagesContainer.append(this.buildThumbnail("google", 
              gImage.url,
              gImage.tbUrl,
              gImage.titleNoFormatting,
              gImage.url,
              {width: gImage.width, height: gImage.height, title: gImage.titleNoFormatting}));
            
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