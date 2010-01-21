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
      var currentViewId = this.currentViewId();
      if (currentViewId === this.element.attr("id")) { // Images view did appear
        if (this.element.find('div.selected')[0] == this.tabContainers[0]) {
          this.loadMyImages(0);
        }
      }
      else if (currentViewId === "add_images") { // Add Images view did appear
        this.imagesUploader.loadSWFUpload();
      }
    }.pBind(this));

    // view transition starts (slide in/out)
    this.element.bind('pageAnimationStart', function(event, info){
      var currentViewId = this.currentViewId();
      if (currentViewId === "add_images") { // Add Images view will disappear
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
    
    // Setup thumbnails drag n' drop
    this.myImagesContainer.find(".thumbnails").bind("dragstart", this.dragStart.pBind(this));
    
    // Next/Previous page links
    this.paginationWrap = $("<div class='pagination' style='display:none'>");
    this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
    this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
    this.previousPageLink.click(function(event){
      this.loadMyImages(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.nextPageLink.click(function(event){
      this.loadMyImages(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.myImagesContainer.append(this.paginationWrap);
  },
  setupDetailsView: function() {
    this.detailsViewImg = this.detailsView.find('.single_image img');
    
    // handle possible actions 
    $("#image_actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsViewImg.data("properties"); //properties of the currenlty displayed image are store in this element
      
      var link = $(event.target);
      var li = link.parent(); 
      var info = $("<span>").text("...");
      
      switch (link.attr("id")) {
        
        case "add_image_to_page_action":
          ddd("add_image_to_page_action");
          break;
          
        case "set_image_as_bg_action": 
          var page = WebDoc.application.pageEditor.currentPage;
          var imgUrl = this.detailsView.find('.single_image a img').attr("src");
          page.setBackgroundImageAndRepeatMode("url("+imgUrl+")", "no-repeat", "center center");
          WebDoc.application.pageEditor.loadPage(WebDoc.application.pageEditor.currentPage);
          break;
          
        case "delete_image_action": //delete an uploaded image from My Images
        case "delete_from_my_images_action": //remove a web image from My Images
          if (confirm ("Are you sure?")) {
            link.hide();
            li.append(info);
            
            $.ajax({
              type: "DELETE",
              url: "/images/"+properties.uuid,
              success: function(serverData) {
                info.text("Done!");
                setTimeout(function(){ info.fadeOut(500); }, 500);
                this.refreshMyImages();
              }.pBind(this),
              complete: function() {
                var delay = setTimeout(function(){ li.hide(); info.remove(); link.show(); }, 1000);
                if (link.attr("id") === "delete_image_action") { // Go back
                  //in this case we need to immediately rehestablish the UI, in case the user will quickly reselects another thumbnail just after deleting this one
                  clearTimeout(delay); li.hide(); info.remove(); link.show();
                  this.detailsView.find(".toolbar .back").click();
                }
              }.pBind(this)
            });
          }
          break;
        
        case "show_flickr_page_action":
          ddd("show_flickr_page_action");
          window.open(properties.image_link, '_blank');
          break;
          
        case "add_to_my_images_action":
          link.hide();
          li.append(info);
          
          var railsParams = {};
          MTools.Record.convertToRailsJSon({ properties : properties }, railsParams, "image");
          $.ajax({
            type: "POST",
            url: this.imagesUploader.uploadUrl,
            data: railsParams,
            dataType: "json",
            success: function(serverData) {
              info.text("Done!");
              setTimeout(function(){ info.fadeOut(500); }, 500);
              this.refreshMyImages([serverData.image]);
            }.pBind(this),
            complete: function() {
              setTimeout(function(){ li.hide(); info.remove(); link.show();  }, 1000);
            }.pBind(this)
          });
          break;
      }
      
    }.pBind(this));
  },
  
  dragStart: function(event) {
    // we take closest li and then search down the img because safari and firefox have not the same target.
    // on ff target is the a tag but in safarai target is the img.
    var draggingImg = $(event.target).closest('li').find('img');
    ddd("drag target",event.target);
    ddd("propeties", draggingImg.data("properties"));
    event.originalEvent.dataTransfer.setData('application/ub-image', draggingImg.data("properties").url);
  },
  
  showSpinner: function($super, container) {
    $super(container);
    if (this.hasPagination) this.paginationWrap.hide();
  },
  hideSpinner: function($super, container) {
    $super(container);
    if (this.hasPagination) this.paginationWrap.show();
  },
  didClickOnTab: function($super, tab) {
    $super(tab);
    if (tab == this.tabContainers[0].id) { // My Images tab
      this.loadMyImages(0);
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
          var noImages = $("<span>").addClass('no_items').text('No Images');
          thumbsWrap.append(noImages);
        }
        else {
          var myImagesList = $("<ul>");
          thumbsWrap.append(myImagesList);
          
          $.each(data.images, function(i,webDocImage){
            
            myImagesList.append(this.buildThumbnail(webDocImage.uuid(), webDocImage.data.properties));
            
          }.pBind(this));
        }
        this.refreshMyImagesPagination(data.pagination);
        thumbsWrap.data('loaded', true);
        this.hideSpinner(thumbsWrap);
      }.pBind(this), { ajaxParams: { page:this.myImagesPage }});
    }
  },
  refreshMyImages: function(newImages) {
    // Note: do not pass the newImages arg to force reloading the whole section
    
    //if we are in first page, don't reload the whole thing, just add the newly uploaded images to the top of the list 
    var myImagesList = this.myImagesContainer.find('.thumbnails ul');
    if (newImages && this.myImagesPage === 1 && myImagesList.length > 0) {
      
       $.each(newImages, function(i,image) {
         
         myImagesList.prepend(this.buildThumbnail(image.uuid, image.properties));
          
        }.pBind(this));
    }
    else { // If not (or if no newImages are passed) reload the 1st page
      this.myImagesContainer.find(".thumbnails").data('loaded', false);
      this.myImagesPage = 1;
      this.loadMyImages(0);
    }
  },
  buildThumbnail: function(uuid, properties, myImagesList) {
    var thumb = $("<img>").attr({
      src : properties.thumb_url,
      alt : ""
    })
    .data("properties", jQuery.extend({type:"my_image", uuid:uuid}, properties));
    
    var liWrap = $("<li>");
    if (properties.type) liWrap.addClass(properties.type);
    var aWrap = $("<a href='' title=''></a>");
    aWrap.append(thumb);
    aWrap.append($("<span>").addClass("icon_overlay")); //flickr/google mini icon
    liWrap.append(aWrap);

    return liWrap;
  },
  refreshMyImagesPagination: function(pagination) {
    this.hasPagination = pagination.total_pages > 1 ? true : false;
    if (this.hasPagination) {
      this.paginationWrap.show();
      if (pagination.previous_page > 0) this.previousPageLink.show();
      else this.previousPageLink.hide();
      if (pagination.next_page > 0) this.nextPageLink.show();
      else this.nextPageLink.hide();
    }
    else {
      this.paginationWrap.hide();
    }
  },
  prepareDetailsView: function($super, properties) { // type: my_image, flickr, google
    $super(properties);
    // View title
    this.detailsView.attr({'class':"view "+properties.type});

    // Image name
    var name = "";
    if (properties.name) name = properties.name;
    else if (properties.url.match(/([^\/\\]+)\.([a-z0-9]{3,4})$/i)) { // extract filename
      name = RegExp.$1 +"."+ RegExp.$2;
    }
    this.detailsView.find('.image_name').text(name);

    // Image size
    var imageSizeEl = this.detailsView.find('.image_size');
    if (properties.width && properties.height) {
      imageSizeEl.text(properties.width+" x "+properties.height);
    }
    else {
      imageSizeEl.text('');
    }

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
    
    // If Details view is loaded from the My Images section, we won't need this action...
    if (this.element.find('div.selected')[0] == this.tabContainers[0]) {
      $("#add_to_my_images_action").parent().hide();
    }
    else {
      $("#delete_from_my_images_action").parent().hide();
    }
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
