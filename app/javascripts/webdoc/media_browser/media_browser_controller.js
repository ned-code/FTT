/*
	@author Jonathan
*/


WebDoc.MediaBrowserController = $.klass(WebDoc.RightBarInspectorController, {
  
  MEDIA_BROWSER_SELECTOR: ".media-browser-wrap",
  MEDIA_BROWSER_BUTTON_SELECTOR: "a[href='#media-browser']",

  initialize: function() {
    this.webSearchController = new WebDoc.WebSearchController("media-browser-web");
		// just to preload the icon (so that it'll be immediately available at the first drag)
		
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		$(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
    // this.themeElementsLibrary = new WebDoc.ThemeElementsLibrary("theme_elements");
    
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
			//temps
			this.showTab('#media-browser-apps');
			$('#my-apps').show();
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