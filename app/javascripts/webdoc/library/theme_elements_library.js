/**
 * @author Noe
**/


WebDoc.ThemeElementsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    this.themeElementsContainer = $("#theme_elements_content");
    
    this.element.bind('pageAnimationEnd', function(event, info) {
      var currentViewId = this.currentViewId();
      if (currentViewId === this.element.attr("id")) {
        if(this.themeElementsContainer.innerHTML === undefined) {
          var that = this;
          that.themeElementsContainer.innerHTML = 'test';
          WebDoc.application.pageEditor.currentDocument.getTheme(function(theme) {
            if (theme && theme.length === 1 && theme[0].getElementsUrl() !== undefined && theme[0].getElementsUrl() !== '') {
              ddd('ici!');
              ddd(theme[0].getElementsUrl());
              that.themeElementsContainer.html(theme[0].getElementsUrl());
            } else {
              ddd('la');
              that.themeElementsContainer.html("no theme or no theme elements");
            }
          });

        }
      }
    }.pBind(this));

    // currentDocument = WebDoc.application.pageEditor.currentDocument;
    // currentDocument.addListener(this);

  }

});
