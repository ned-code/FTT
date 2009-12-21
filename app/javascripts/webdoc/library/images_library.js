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
        this.loadMyImages(0);
      }
      else {
        this.loadWebImages();
      }
    }.pBind(this));
    
    // Setup my images
    this.setupMyImages();
    // Setup web images
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    // Setup images uploader
    this.imagesUploader = new WebDoc.ImagesUploader('swfupload_control', this);
  },
  setupMyImages: function() {
    this.myImagesPage = 1;
    this.myImagesContainer = $(this.tabContainers[0]);
    
    //Next/Previous page links
    var paginationWrap = $("<div class='pagination'>");
    $("<a>").attr({ href:"", 'class':"previous_page" }).text("Previous").click(function(event){
      this.loadMyImages(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(paginationWrap);//.hide();
    $("<a>").attr({ href:"", 'class':"next_page" }).text("Next").click(function(event){
      this.loadMyImages(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(paginationWrap);//.hide();
    this.myImagesContainer.append(paginationWrap);
  },
  didClickOnTab: function($super, tab) {
    $super();
    if (tab == this.tabContainers[0].id) { // My Images tab
      this.loadMyImages(0);
    }
    else if (tab == this.tabContainers[1].id) { // Web Images tab
      this.loadWebImages();
    }
  },
  loadMyImages: function(pageIncrement) {
    var thumbsWrap = this.myImagesContainer.find(".thumbnails");
    
    this.myImagesPage += pageIncrement;
    if (this.myImagesPage < 1) this.myImagesPage = 1;
    
    if (pageIncrement !== 0 || !thumbsWrap.data('loaded')) { //load only if we are paginating, or if the images have never been loaded before
      thumbsWrap.html('');
      
      var myImagesList = $("<ul>");
      thumbsWrap.append(myImagesList);
      
      this.showSpinner(thumbsWrap);
      
      MTools.ServerManager.getRecords(WebDoc.Image, null, function(data) {
        this.images = {};
        for (var i = 0; i < data.length; i++) {
          var image = data[i];
          this.images[image.uuid()] = image;
          $("<img>").attr({
            id: image.uuid(),
            src : image.data.properties.thumb_url,
            alt : ""
          })
          .appendTo(myImagesList)
          .wrap("<li><a href=\"#\" title=\""+ "TODO IMAGEITEM TITLE" +"\"></a></li>");
        }
        thumbsWrap.data('loaded', true);
        this.hideSpinner(thumbsWrap);
      }.pBind(this), { ajaxParams: { page:this.myImagesPage }});
    }
  },
  loadWebImages: function() {
    // if (!container.data('loaded')) {
    // }
  },
  prepareDetailsView: function($super, type, data) { // type: my_image, flickr, google
    $super();
    // View title
    this.detailsView.find('.toolbar h1').attr({'class':type});
    
    // Image title
    this.detailsView.find('.image_title').text(data.title);
    
    // Image link
    var imageLink = "";
    switch (type) {
      case "my_image":
        break;
      case "flickr":
        imageLink = "http://www.flickr.com/photos/"+data.user_id+"/"+data.photo_id;
        break;
      case "google":
        break;
    }
    this.detailsView.find('.single_image a').attr({"href":imageLink});
    
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

