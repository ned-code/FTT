
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    this._initYoutube();
    this._initVideo();  
  },

  getVideoWidget: function() {
    return WebDoc.WidgetManager.videoWidget;   
  },
  
  getYoutubeWidget: function() {
    return WebDoc.WidgetManager.youtubeWidget;   
  },

  _initYoutube: function() {
    if (WebDoc.WidgetManager.youtubeWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'youtube', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.youtubeWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.youtubeWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
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
  },
  
  _readyForCallBack: function() {
    if (WebDoc.WidgetManager.youtubeWidget !== undefined && 
        WebDoc.WidgetManager.videoWidget !== undefined && 
        WebDoc.WidgetManager.vimeoWidget !== undefined && 
        WebDoc.WidgetManager.dailymotionWidget !== undefined &&
        WebDoc.WidgetManager.vidsMyspaceWidget !== undefined &&
        WebDoc.WidgetManager.metacafeWidget !== undefined &&
        WebDoc.WidgetManager.vidsGoogleWidget !== undefined) {
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
