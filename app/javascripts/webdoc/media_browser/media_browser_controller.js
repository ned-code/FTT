/*
	@author Jonathan
*/


WebDoc.MediaBrowserController = $.klass(WebDoc.RightBarInspectorController, {
  
  MEDIA_BROWSER_SELECTOR: ".media-browser-wrap",
  MEDIA_BROWSER_BUTTON_SELECTOR: "a[href='#media-browser']",

  initialize: function() {
    this.webSearchController = new WebDoc.WebSearchController("media-browser-web");
		this.appsLibrary = new WebDoc.AppsLibrary("media-browser-apps");
		this.themeElementsLibrary = new WebDoc.ThemeElementsLibrary("theme_elements");
		
		// just to preload the icon (so that it'll be immediately available at the first drag)
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("apps", ""));
    
    
    this.domNode = $(this.MEDIA_BROWSER_SELECTOR);

		//little hack to be sure that the home page is on the first layer
		this._hideAll();
		this.showHome();
	},

	buttonSelector: function() {
		return this.MEDIA_BROWSER_BUTTON_SELECTOR;  
	},
	
	showHome: function(){
		this.showTab('#media-browser-home');
	},
	
	showWeb: function(){
		this.showTab('#media-browser-web');
	},
	
	showPackages: function(){
		this.showTab('#media-browser-packages');
		this.themeElementsLibrary.showView();
	},
	
	showApps: function(){
		this.showTab('#media-browser-apps');
	},
	
	showMyContent: function(){
		WebDoc.application.myContentController 
		if(WebDoc.application.mediaBrowserController.myContentsController){
			this.showTab('#media-browser-my-content');
		}
		else{
			WebDoc.application.mediaBrowserController.myContentsController = new WebDoc.MyContentsController('media-browser-my-content', this);
			this.showTab('#media-browser-my-content');
		}
	},
	
	showTab: function(tab_id){
		this._hideAll();
		$(tab_id).show();
	},
	
	_hideAll: function(){
		$('.media-browser-tab').hide();
	}
});