/**
 * @author Noe
**/

WebDoc.ThemeElementsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    this.setupThemeElements();

  },

  setupThemeElements: function() {
    this.themeElementsContainer = $(this.tabContainers[0]);

  },

  loadThemeElements: function() {

  }

});