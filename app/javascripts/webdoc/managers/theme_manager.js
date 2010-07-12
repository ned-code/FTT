/**
 * @author Julien Bachmann
 */

WebDoc.ThemeManager = {
  _initialized: false,
  _defaultTheme: undefined,
  
  init: function(callBack) {
    if (!this._initialized) {
      this._initialize(callBack);
    }  
    else {
      callBack.call(this, true);
    }
  },
  
  getInstance: function() {
    return this;    
  }, 
 
  _initialize: function(callBack) {
    if (this._defaultTheme === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Theme, 'default', function(data) {
        if (data && data.length > 0) {
          this._defaultTheme = data[0];
        }
        else {
          this._defaultTheme = null;
        }
        callBack.call(this, WebDoc.ThemeManager);
        
      }.pBind(this));
    }    
    else {
      callBack.call(this, WebDoc.ThemeManager);
    }
  },   
  
  getDefaultTheme: function(callBack) {
    return this._defaultTheme;
  }
};

