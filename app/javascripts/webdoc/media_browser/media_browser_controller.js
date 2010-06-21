/*
	@author Jonathan
*/


WebDoc.MediaBrowserController = $.klass(WebDoc.RightBarInspectorController, {
  
  MEDIA_BROWSER_SELECTOR: ".media-browser-wrap",
  MEDIA_BROWSER_BUTTON_SELECTOR: "a[href='#media-browser']",

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
		//media-browser-home is always in the dom !
		this.showTab('#media-browser-home');
	},
	
	showWeb: function(){
		ddd('[MediaBrowserController] showWeb');
		if($('#media-browser-web').length){
			this.showTab('#media-browser-web');
		}
		else{
			ddd('media-browser-web bot displayed, do ajax here');
		}
	},
	
	showPackages: function(){
		ddd('[MediaBrowserController] showPackages');
		if($('#media-browser-packages').length){
			this.showTab('#media-browser-packages');
		}
		else{
			ddd('media-browser-packages bot displayed, do ajax here');
		}
	},
	
	showApps: function(){
		ddd('[MediaBrowserController] showApps');
		if($('#media-browser-apps').length){
			this.showTab('#media-browser-apps');
		}
		else{
			ddd('ajax request to show apps');
			$.ajax({
			  url: "/apps",
			  success: function(html){
					this._hideAll();
			    $("#media-browser-content").append(html);
			  }.pBind(this)
			});
		}
	},
	
	showMyContent: function(){		
		if($('#media-browser-my-content').length > 0){
			this.showTab('#media-browser-my-content');
		}
		else{
			$.ajax({
			  url: "/images",
			  success: function(html){
					this._hideAll();
			    $("#media-browser-content").append(html);
			  }.pBind(this)
			});
		}
	},
	
	showTab: function(tab_id){
		ddd('[MediaBrowserController] showTab ' + tab_id);
		this._hideAll();
		$(tab_id).show();
	},
	
	_hideAll: function(){
		$('.media-browser-tab').hide();
	}
});