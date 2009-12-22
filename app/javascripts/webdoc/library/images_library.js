/**
 * @author Zeno Crivelli
**/

//= require "images_library/web_images_search"
//= require "images_library/images_uploader"

WebDoc.ImagesLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
    
    // view transition finished (slide in/out)
    this.element.bind('pageAnimationEnd', function(event, info){
      var currentView = $("#libraries").find("> .view:visible");
      if (currentView.attr("id") === this.element.attr("id")) { // Images view did appear
        var currentTabContainer = this.element.find('div.selected');
        if (currentTabContainer[0] == this.tabContainers[0]) {
          this.loadMyImages(0);
        }
        else {
          this.loadWebImages();
        }
      }
      else if (currentView.attr("id") === "add_images") { // Add Images view did appear
        this.imagesUploader.loadSWFUpload();
      }
    }.pBind(this));

    // view transition starts (slide in/out)
    this.element.bind('pageAnimationStart', function(event, info){
      var currentView = $("#libraries").find("> .view:visible");
      if (currentView.attr("id") === "add_images") { // Add Images view will disappear
        this.imagesUploader.unloadSWFUpload();
      }
    }.pBind(this));
    
    // Setup my images
    this.setupMyImages();
    // Setup web images
    this.webImagesSearch = new WebDoc.WebImagesSearch('web_images_search_field', this);
    // Setup images uploader
    this.imagesUploader = new WebDoc.ImagesUploader('upload_control', this);
    // Setup details view
    this.setupDetailsView();
    
    // Observe thumb clicks (with event delegation) for all current and future thumbnails
    $("#"+libraryId+" .thumbnails ul li a").live("click", function (event) {
      var properties = $(event.target).data("properties");
      this.prepareDetailsView(properties);
      this.showDetailsView.click();
      event.preventDefault();
    }.pBind(this));
    
  },
  setupMyImages: function() {
    this.myImagesPage = 1;
    this.myImagesContainer = $(this.tabContainers[0]);
    
    // Setup drag n' drop
    this.myImagesContainer.find(".thumbnails").bind("dragstart", this.dragStart.pBind(this));
    
    // Next/Previous page links
    var paginationWrap = $("<div class='pagination'>");
    this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page" }).html("&larr; Previous");
    
    this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page" }).html("Next &rarr;");
    this.previousPageLink.click(function(event){
      this.loadMyImages(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(paginationWrap).hide();
    this.nextPageLink.click(function(event){
      this.loadMyImages(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(paginationWrap).hide();
    this.myImagesContainer.append(paginationWrap);
  },
  setupDetailsView: function() {
    this.detailsViewImg = this.detailsView.find('.single_image img');
    
    // handle possible actions 
    $("#image_actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsViewImg.data("properties"); //properties of the currenlty displayed image are store in this element
      
      switch ($(event.target).attr("id")) {
        
        case "add_image_to_page_action":
          ddd("add_image_to_page_action");
          break;
          
        case "set_image_as_bg_action":
          ddd("set_image_as_bg_action");
          break;
          
        case "delete_image_action":
          ddd("delete_image_action");
          break;
          
        case "show_flickr_page_action":
          ddd("show_flickr_page_action");
          window.open(properties.image_link, '_blank');
          break;
          
        case "add_to_my_images_action":
          var railsParams = {};
          MTools.Record.convertToRailsJSon({ properties : properties }, railsParams, "image");
          $.ajax({
            type: "POST",
            url: this.imagesUploader.uploadUrl,
            data: railsParams,
            dataType: "json",
            success: function(data) {
              ddd(data);
            }
          });
          break;
      }
      
    }.pBind(this));
  },
  dragStart: function(event) {
    var draggingImg = $(event.target).find('img');
    event.originalEvent.dataTransfer.setData('application/ub-image', draggingImg.data("properties").url);
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
      
      this.showSpinner(thumbsWrap);
      
      MTools.ServerManager.getRecords(WebDoc.Image, null, function(data) {
        if (data.images.length === 0) {
          var noImages = $("<span>").text('No Images');
          thumbsWrap.append(noImages);
        }
        else {
          var myImagesList = $("<ul>");
          thumbsWrap.append(myImagesList);
          
          $.each(data.images, function(i,image){
            $("<img>").attr({
              id: image.uuid(),
              src : image.data.properties.thumb_url,
              alt : ""
            })
            .data("properties", jQuery.extend({type:"my_image"}, image.data.properties))
            .appendTo(myImagesList)
            .wrap("<li><a href=\"#\" title=\""+ "TODO IMAGEITEM TITLE" +"\"></a></li>");
          }.pBind(this));
        }
        this.refreshMyImagesPagination(data.pagination);
        thumbsWrap.data('loaded', true);
        this.hideSpinner(thumbsWrap);
      }.pBind(this), { ajaxParams: { page:this.myImagesPage }});
    }
  },
  refreshMyImages: function(newImages) {
    //if we are in first page, don't reload the whole thing, just add the newly uploaded images to the top of the list 
    var myImagesList = this.myImagesContainer.find('.thumbnails ul');
    if (this.myImagesPage === 1 && myImagesList.length > 0) {
      
      
      //TODO optmize code duplication with loadMyImages!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      
      
       $.each(newImages, function(i,image){
          $("<img>").attr({
            id: image.uuid,
            src : image.properties.thumb_url,
            alt : ""
          })
          .data("properties", jQuery.extend({type:"my_image"}, image.properties))
          .prependTo(myImagesList)
          .wrap("<li><a href=\"#\" title=\""+ "TODO IMAGEITEM TITLE" +"\"></a></li>");
        }.pBind(this));
    }
    else { // If not, load the 1st page
      this.myImagesContainer.find(".thumbnails").data('loaded', false);
      this.myImagesPage = 1;
      this.loadMyImages(0);
    }
  },
  refreshMyImagesPagination: function(pagination) {
    if (pagination.previous_page > 0) this.previousPageLink.show();
    else this.previousPageLink.hide();
    if (pagination.next_page > 0) this.nextPageLink.show();
    else this.nextPageLink.hide();
  },
  loadWebImages: function() {
  },
  prepareDetailsView: function($super, properties) { // type: my_image, flickr, google
    $super();
    // View title
    this.detailsView.find('.toolbar h1').attr({'class':properties.type});

    // Image name
    var name = "";
    if (properties.name) name = properties.name;
    else if (properties.url.match(/([^\/\\]+)\.([a-z0-9]{3,4})$/i)) { // extract filename
      name = RegExp.$1 +"."+ RegExp.$2;
    }
    this.detailsView.find('.image_name').text(name);

    // Image Link
    var imageLink = properties.image_link ? properties.image_link : properties.url;
    this.detailsView.find('.single_image a').attr({"href":imageLink});

    // Image source (+ store the current properties in the img element)
    var imageContainer = this.detailsView.find('.single_image');
    imageContainer.hide();
    imageContainer.before($('<div class="loading">Loading</div>'));
    this.detailsViewImg.attr({'src':properties.url}).data("properties", properties);
    this.preloadImage(properties.url);

    // Show/Hide right image actions
    var imageActions = $('#image_actions');
    imageActions.find(".dyn").hide();
    imageActions.find("."+properties.type).show();
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
