
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    this._initYoutube();
    this._initVimeo();  
    this._initDailymotion();  
    this._initMyspacevideo();
    this._initMetacafe();
    this._initGooglevideo();
    this._readyForCallBack();
  },

  getVimeoWidget: function() {
    return WebDoc.WidgetManager.vimeoWidget;   
  },
  
  getYoutubeWidget: function() {
    return WebDoc.WidgetManager.youtubeWidget;   
  },

  getDailymotionWidget: function() {
    return WebDoc.WidgetManager.dailymotionWidget;   
  },
  
  getVidsMyspaceWidget: function() {
    return WebDoc.WidgetManager.vidsMyspaceWidget;   
  },

  getMetacafeWidget: function() {
    return WebDoc.WidgetManager.metacafeWidget;   
  },
  
  getVidsGoogleWidget: function() {
    return WebDoc.WidgetManager.vidsGoogleWidget;   
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
  
  _initVimeo: function() {
    if (WebDoc.WidgetManager.vimeoWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'vimeo', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.vimeoWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.vimeoWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
  },
  
  _initDailymotion: function() {
    if (WebDoc.WidgetManager.dailymotionWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'dailymotion', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.dailymotionWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.dailymotionWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
  },
  
  _initMyspacevideo: function() {
    if (WebDoc.WidgetManager.vidsMyspaceWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'myspacevideo', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.vidsMyspaceWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.vidsMyspaceWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
  },
  _initMetacafe: function() {
    if (WebDoc.WidgetManager.metacafeWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'metacafe', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.metacafeWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.metacafeWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
  },    
  _initGooglevideo: function() {
    if (WebDoc.WidgetManager.vidsGoogleWidget === undefined) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'googlevideo', function(data) {
        if (data && data.length > 0) {
          WebDoc.WidgetManager.vidsGoogleWidget = data[0];
        }
        else {
          WebDoc.WidgetManager.vidsGoogleWidget = null;
        }
        this._readyForCallBack();
      }.pBind(this));
    }  
  },      
  
  _readyForCallBack: function() {
    if (WebDoc.WidgetManager.youtubeWidget !== undefined && 
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
