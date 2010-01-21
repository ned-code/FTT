/**
 * @author Zeno Crivelli
**/

//= require <webdoc/library/jqtouch>

var jQT = new $.jQTouch("libraries", { preloadImages: [] });

WebDoc.LibrariesController = $.klass({
  initialize: function() {
    this.imagesLibrary = new WebDoc.ImagesLibrary("images");
    this.videosLibrary = new WebDoc.VideosLibrary("videos");
    this.appsLibrary = new WebDoc.AppsLibrary("apps");
  }
});

// Generic class to be used as parent class for every library implementation (Images library, Videos library ,etc).
// Do not instanciate this directly (use one of its subclasses)
WebDoc.Library = $.klass({
  initialize: function(libraryId) {
    this.elementId = libraryId;
    this.element = $('#'+libraryId);
    
    // Setup Tabs
    this.tabContainers = $('#'+libraryId+' div.tabs > div');
    this.tabContainers.hide().filter(':first').show();
    
    $('#'+this.elementId+' div.tabs ul.tab_navigation a').click(function (event) {
      var el = $(event.target);
      this.setupTabUI(el);
      this.didClickOnTab(el.attr('class'));
      event.preventDefault();
    }.pBind(this));
    this.setupTabUI($('#'+this.elementId+' div.tabs ul.tab_navigation a:first')); // selecting first tab
    
    // Setup Details view "toggler"
    var detailViewId = libraryId.replace(/s$/,"_details"); //"images" => "image_details"
    this.detailsView = $('#'+detailViewId);
    this.showDetailsView = $('#show_'+detailViewId); // usage: call "this.showDetailsView.click()" to show details view
    this.showDetailsView.hide();
  },
  setupTabUI: function(el) {
    this.tabContainers.hide();
    this.tabContainers.removeClass('selected');
    this.tabContainers.filter('#'+el.attr('class')).show().addClass('selected');
    $('#'+this.elementId+' div.tabs ul.tab_navigation li').removeClass('selected');
    el.parent().addClass('selected'); //add the class to the LI element
  },
  currentViewId: function() {
    return $("#libraries").find("> .view:visible").attr("id");
  },
  showSpinner: function(container) {
    //common code to be executed for all subclasses
    container.append($('<div class="loading">Loading</div>'));
  },
  hideSpinner: function(container) {
    //common code to be executed for all subclasses
    container.find('.loading').remove();
  },
  didClickOnTab: function(tab) {
    //common code to be executed for all subclasses
  },
  prepareDetailsView: function(properties) {
    //common code to be executed for all subclasses
  },
  buildMediaDragFeedbackElement: function(type, thumbUrl) { //type=image|video
    $("#media_drag_feedback").remove();
    var mediaThumb = $("<img>").attr({ src:thumbUrl }), icon = $("<span>");
    var mediaDragFeedback = $("<div>").attr({ id:"media_drag_feedback", 'class':type })
    .css({ position:"relative", top:"-500px" }) // because I can't use hide() in this case (or setDragImage won't work)
    .append(icon).append(mediaThumb);
    
    return mediaDragFeedback;
  }
});

//= require <webdoc/library/images_library>
//= require <webdoc/library/videos_library>
//= require <webdoc/library/apps_library>

