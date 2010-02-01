/**
 * @author Julien Bachmann
**/


WebDoc.WebBrowser = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);    
    this.browserFrame = $("#web-browser-ui iframe");
    ddd("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    ddd("web browser", this.browserFrame);    
    this.browserFrame.bind("load", this.locationChanged.pBind(this));
    this.browserFrame[0].contentWindow.location.href = "http://m.facebook.com";    
  },
  
  locationChanged: function(e) {
    ddd("browser location changed");
    //this.browserFrame.contentDocument.location.href = "http://m.google.com/m"; 
  }

});
