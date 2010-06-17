/*
	@author Jonathan
*/


WebDoc.MediaBrowserController = $.klass(WebDoc.RightBarInspectorController, {
  
  MEDIA_BROWSER_SELECTOR: ".media_browser_wrap",
  MEDIA_BROWSER_BUTTON_SELECTOR: "a[href='#media_browser']",

  initialize: function() {
    // this.imagesLibrary = new WebDoc.ImagesLibrary("images");
    // this.videosLibrary = new WebDoc.VideosLibrary("videos");
    // this.appsLibrary = new WebDoc.AppsLibrary("apps");
    // this.themeElementsLibrary = new WebDoc.ThemeElementsLibrary("theme_elements");
    // this.webBrowser = new WebDoc.WebBrowser("browser"); // Provisory, will be added in a later alpha
    
    this.domNode = $(this.MEDIA_BROWSER_SELECTOR);
	},

	buttonSelector: function() {
		return this.MEDIA_BROWSER_BUTTON_SELECTOR;  
	},
	
	showHome: function(){
		ddd('[MediaBrowserController] showHome');
		this.showTab('#media_browser_home');
	},
	
	showWeb: function(){
		ddd('[MediaBrowserController] showWeb');
		this.showTab('#media_browser_web');
	},
	
	showPackages: function(){
		ddd('[MediaBrowserController] showPackages');
		this.showTab('#media_browser_packages');
	},
	
	showApps: function(){
		ddd('[MediaBrowserController] showApps');
		this.showTab('#media_browser_apps');
	},
	
	showMyContent: function(){
		ddd('[MediaBrowserController] showMyContent');
		this.showTab('#media_browser_my_content');
	},
	
	showTab: function(tab_id){
		ddd('[MediaBrowserController] showTab ' + tab_id);
		this._hideAll();
		$(tab_id).show();
	},
	
	_hideAll: function(){
		$('.media_browser_tab').hide();
	}
});