/**
 * @author Zeno Crivelli
**/

//= require "images_library/web_images_search"
//= require "images_library/images_uploader"

WebDoc.ImagesLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
    
    // slide animation finished
    this.element.bind('pageAnimationEnd', function(event, info){
      var currentTabContainer = this.element.find('div.selected');
      if (currentTabContainer[0] == this.tabContainers[0]) {
        this.loadMyImages(currentTabContainer);
      }
      else {
        this.loadWebImages();
      }
    }.pBind(this));
    
    // Setup web images
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    // Setup images uploader
    this.imagesUploader = new WebDoc.ImagesUploader('swfupload_control', this);
  },
  didClickOnTab: function($super, tab) {
    $super();
    if (tab == this.tabContainers[0].id) { // My Images tab
      this.loadMyImages($(this.tabContainers[0]));
    }
    else if (tab == this.tabContainers[1].id) { // Web Images tab
      this.loadWebImages();
    }
  },
  loadMyImages: function(container) {
    if (!container.data('loaded')) {
      
    }
  },
  loadWebImages: function() {
    // if (!container.data('loaded')) {
    // }
  },
  prepareDetailsView: function($super, data) {
    $super();
    // View title
    this.detailsView.find('.toolbar h1').attr({'class':'flickr'});
    
    // Image title
    this.detailsView.find('.image_title').text(data.title);
    
    // Image link
    this.detailsView.find('.single_image a').attr({"href":"http://www.flickr.com/photos/"+data.user_id+"/"+data.photo_id});
    
    // Image
    var imageContainer = this.detailsView.find('.single_image');
    imageContainer.hide();
    imageContainer.before($('<div class="loading">Loading</div>'));
    this.detailsView.find('.single_image img').attr({'src':data.source_url});
    this.preloadImage(data.source_url);
  },
  preloadImage: function(imageSrc) {
    var oImage = new Image();
    // set up event handlers for the Image object
    oImage.onload = this.preloadImageDidLoad.pBind(this);
    oImage.onerror = this.preloadImageError.pBind(this);
    oImage.src = imageSrc;
  },
  preloadImageDidLoad: function() {
    this.detailsView.find('.loading').remove();
    this.detailsView.find('.single_image').show();
  },
  preloadImageError: function() {
    this.detailsView.find('.loading').remove();
  }
});

