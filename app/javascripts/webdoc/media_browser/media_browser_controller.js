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
	}
});