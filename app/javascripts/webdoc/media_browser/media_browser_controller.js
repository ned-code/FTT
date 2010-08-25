/*
	@author Jonathan
*/


WebDoc.MediaBrowserController = $.klass(WebDoc.RightBarInspectorController, {
  
  MEDIA_BROWSER_SELECTOR: ".media-browser-wrap",

  initialize: function() {
    this.webSearchController = new WebDoc.WebSearchController("media-browser-web");
		this.appsLibrary = new WebDoc.AppsLibrary("media-browser-apps");
		//this.themeElementsLibrary = new WebDoc.ThemeElementsLibrary("theme_elements");
		this.packagesLibrary = new WebDoc.PackagesLibrary("media-browser-packages");
		
		this._loadMostUsedApps();
		// just to preload the icon (so that it'll be immediately available at the first drag)
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("apps", ""));
    
    
    this.domNode = $(this.MEDIA_BROWSER_SELECTOR);

    // Tabs handling
    $(".tab_navigation").tabsHandler();
    
  	//little hack to be sure that the home page is on the first layer
  	this._hideAll();
  	this.showHome();
  },
  
  showHome: function(){
  	this.showTab('#media-browser-home');
  },
  
  showWeb: function(){
  	this.showTab('#media-browser-web');
  },
  
  showPackages: function(){
  	this.showTab('#media-browser-packages');
  },
  
  showApps: function(){
  	this.showTab('#media-browser-apps');
  	if($('#media-browser-app-details-back').attr('href') == '#media-browser-home'){
  		this.appsLibrary.setupBackButton(false);
  		this.appsLibrary.showList();
  	}
  },
  
  showMyContent: function(){
    if(WebDoc.application.mediaBrowserController.myContentsController){
      this.showTab('#media-browser-my-content');
    }
    else{
      WebDoc.application.mediaBrowserController.myContentsController = new WebDoc.MyContentsController('media-browser-my-content', this);
      this.showTab('#media-browser-my-content');
    }
  },
  	
  showAppDetails: function(widgetData){
    this._hideAll();
    this.showApps();
    this.appsLibrary.showDetailsView( widgetData, true );
  },
  
  showTab: function(tab_id){
    this._hideAll();
    $(tab_id).show();
  },
  
  _hideAll: function(){
     $('.media-browser-tab').hide();
  },
  
  _loadMostUsedApps: function(pageIncrement) {
    var appsThumbWrap = $('#most_used_apps');
    
    appsThumbWrap.html('');
    this.appsLibrary.showSpinner(appsThumbWrap);
    
    WebDoc.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
      var appsList, noApps;
      
      if (data.widgets.length === 0) {
        noApps = $("<span>").addClass('no_items').text('No Apps');
        appsThumbWrap.append(noApps);
      }
      else {   
        appsList = $("<ul/>", {
          'class': 'apps-index thumbs index'
        });
        
        for (var i = 0; i < data.widgets.length; i++) {
          appsList.append( this.appsLibrary._buildThumbnail(data.widgets[i])[0] );
        }
        
        // Build DOM tree
        appsThumbWrap.append(
          appsList
        )
        .find('.title')
        .truncate();
      }
     
 			appsThumbWrap.data('loaded', true);
      this.appsLibrary.hideSpinner(appsThumbWrap);
    }.pBind(this), { ajaxParams: { favorites: 1 }});
		
		//listen to click
		$("#most_used_apps").delegate("li a", "click", function (e) {
      var widgetData = $( e.currentTarget ).data("widget");
      this.showAppDetails(widgetData);
      e.preventDefault();
    }.pBind(this));

		//Drag and drop
		appsThumbWrap.delegate("a", "dragstart", this.appsLibrary._prepareThumbDrag.pBind(this.appsLibrary));
  }
});