/**
 * @author Noe
**/

WebDoc.ThemeElementsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    this.themeElementsContainer = $("#theme_elements_content");
    this.themeElementsContainer.addClass('loading');

    this.themeElementsIFrame = this.themeElementsContainer.find('iframe');

  },

	showView: function(){
		if(this.themeElementsIFrame.attr('src') === '') {
      this._refreshElements();
    }
    var currentDocument = WebDoc.application.pageEditor.currentDocument;
    currentDocument.addListener(this);
	},

  objectChanged: function(record, options) {
    if (record._isAttributeModified(options, 'theme')) {
      this._refreshElements();
    }
  },

  _refreshElements: function() {
    this.themeElementsContainer.addClass('loading');
    var that = this;
    WebDoc.application.pageEditor.currentDocument.getTheme(function(theme) {
      that.themeElementsContainer.removeClass('loading');
      if (theme && theme.length === 1 && theme[0].getElementsUrl() !== null
              && theme[0].getElementsUrl() !== undefined && theme[0].getElementsUrl() !== '') {
        that.themeElementsIFrame.attr('src', theme[0].getElementsUrl());
      } else {
      }
    });
  }
  
});
