/**
 * @author Julien Bachmann
 */

WebDoc.ThemeManager = $.klass({
  initialize: function() {
    this._defaultTheme = new WebDoc.Theme({
      theme: {
        id: 'default',
        title: 'Webdoc Default',
        layouts: [],
        style_url: '/themes/default/css/typography.css',
        thumbnail_url: ''
      }
    });
    // Override theme object methods
    // that we don't want on default
    this._defaultTheme.refresh = function(){};
    this._defaultTheme.save = function(){};
  },   
  
  getDefaultTheme: function(callBack) {
    return this._defaultTheme;
  }
});

$.extend(WebDoc.ThemeManager, {  
  getInstance: function() {
    if (!this._instance) {
      this._instance = new WebDoc.ThemeManager();
    }
    return this._instance;    
  }
});