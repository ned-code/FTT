
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    this._initVideo();  
  },

  getVideoWidget: function() {
    return WebDoc.WidgetManager.videoWidget;   
  },
  
   _initVideo: function() {
    if (WebDoc.WidgetManager.videoWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'video', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.videoWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.videoWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }
    else {
      this._readyForCallBack();      
    }
  },
  
  _readyForCallBack: function() {
    if (WebDoc.WidgetManager.videoWidget !== undefined) {
      this._callBack.call(this, WebDoc.WidgetManager);
    }
  }
      
});

$.extend(WebDoc.WidgetManager, {  
  
  init: function(callBack) {
    if (!this._instance) {
      this._instance = new WebDoc.WidgetManager(callBack);
    }  
    else {
      callBack.call(this, true);
    }
  },
  
  getInstance: function() {
    return this._instance;    
  }
});
