/**
 * @author Julien Bachmann
**/


WebDoc.WebBrowser = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);    
    this.browserFrame = $("#web-browser-ui iframe");  
    this.browserFrame.bind("load", this.locationChanged.pBind(this));
    this.browserFrame[0].contentWindow.location.href = "http://m.google.com/m";    
  },
  
  locationChanged: function(e) {
    ddd("browser location changed");
  }

});
