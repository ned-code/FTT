/**
 * @author Julien Bachmann
**/


WebDoc.WebBrowser = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);    
    this.showBrowser = $("#show-browser");
    this.browserFrame = $("#web-browser-ui iframe");
    $("#favorites-links")
    .bind('click', jQuery.delegate({
        'a':               this.openFavorite
      }, this)
    );
    this.showDetailsView = $("#show_web-browser");
    test = this;
  },
  
  locationChanged: function(e) {
    ddd("browser location changed");
  },
  
  openFavorite: function(e) {
    var link = $(e.target).attr("href").substring(1);

    this.browserFrame.bind("load", function() {
      this.browserFrame.unbind("load");
      this.showDetailsView.click();      
    }.pBind(this));
    this.browserFrame.attr("src", link);

    e.preventDefault();
    return false;
  }
  
});
