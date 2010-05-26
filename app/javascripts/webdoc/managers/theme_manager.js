/**
 * @author Julien Bachmann
 */

WebDoc.ThemeManager = $.klass({
  initialize: function(callBack) {

    this._defaultTheme = undefined;
    WebDoc.ServerManager.getRecords(WebDoc.Theme, null, function(data) {
      if (data && data.length > 0) {
        this._defaultTheme = data[0];
        callBack.call(this, WebDoc.ThemeManager);
      }
    }.pBind(this), { ajaxParams: { default_theme: true }});    
  },   
  
  getDefaultTheme: function(callBack) {
    return this._defaultTheme;
  }
});

$.extend(WebDoc.ThemeManager, {  
  
  init: function(callBack) {
    if (!this._instance) {
      this._instance = new WebDoc.ThemeManager(callBack);
    }  
    else {
      callBack.call(this, true);
    }
  },
  
  getInstance: function() {
    return this._instance;    
  }
});