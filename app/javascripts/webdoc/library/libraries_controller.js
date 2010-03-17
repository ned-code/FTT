/**
 * @author Zeno Crivelli
**/

//= require <webdoc/library/jqtouch>

var jQT = new $.jQTouch("libraries", { preloadImages: [] });

WebDoc.LibrariesController = $.klass(WebDoc.RightBarInspectorController, {
  
  LIBRARIES_SELECTOR: ".libraries_wrap",
  LIBRARY_BUTTON_SELECTOR: "a[href='#library']",

  initialize: function() {
    this.imagesLibrary = new WebDoc.ImagesLibrary("images");
    this.videosLibrary = new WebDoc.VideosLibrary("videos");
    this.appsLibrary = new WebDoc.AppsLibrary("apps");
    // this.webBrowser = new WebDoc.WebBrowser("browser"); // Provisory, will be added in a later alpha
    
    this.domNode = $(this.LIBRARIES_SELECTOR);
  },
  
  buttonSelector: function() {
    return this.LIBRARY_BUTTON_SELECTOR;  
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
    .css({ position:"absolute", top:"-500px" }) // because I can't use hide() in this case (or setDragImage won't work)
    .append(icon).append(mediaThumb);
    
    return mediaDragFeedback;
  }
});

LibraryUtils = $.klass({
  initialize: function() {},
  timeFromSeconds: function(t) {
    if (t==="") return "n/a";
    
    var h = Math.floor(t / 3600);
    t %= 3600;
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    
    h = h>0 ? ( h<10 ? '0'+h : h )+':' : '';
    m = m>0 ? ( m<10 ? '0'+m : m )+':' : '00:';
    s = s>0 ? ( s<10 ? '0'+s : s ) : '00';
    return h+m+s;
  },
  _reverseString: function(string) {
    return string.split('').reverse().join('');
  },
  numberWithThousandsSeparator: function(number, separator) {
    var sep = separator || ",";
    
    // http://www.codeproject.com/KB/scripting/prototypes.aspx
    var reversedNumberString = this._reverseString(""+number);
    var r = '';
    for (var i = 0; i < reversedNumberString.length; i++) {
     r += (i > 0 && i % 3 == 0 ? sep : '') + reversedNumberString.charAt(i);
    }
    return this._reverseString(r);
    
    // old (only working if number < 1'000'000)
    // var regexp = /\d{1,3}(?=(\d{3})+(?!\d))/g;
    // return (""+number).replace(regexp, "$1"+sep);
  }
});

//= require <webdoc/library/images_library>
//= require <webdoc/library/videos_library>
//= require <webdoc/library/apps_library>
//= require <webdoc/library/web_browser>

