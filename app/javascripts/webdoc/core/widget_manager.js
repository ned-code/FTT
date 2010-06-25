
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    if (!WebDoc.WidgetManager.youtubeWidget) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'youtube', this._assignYoutubeWidget.pBind(this));
    }
    if (!WebDoc.WidgetManager.vimeoWidget) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'vimeo', this._assignVimeoWidget.pBind(this));
    }
    if (!WebDoc.WidgetManager.dailymotionWidget) {
      WebDoc.ServerManager.getRecords(WebDoc.Widget, 'dailymotion', this._assignDailymotionWidget.pBind(this));
    }
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
  
  _assignYoutubeWidget: function(data) {
    if (data && data.length > 0) {
      WebDoc.WidgetManager.youtubeWidget = data[0];
    }
    else {
      WebDoc.WidgetManager.youtubeWidget = null;
    }
    WebDoc.WidgetManager._readyForCallBack();
  },
  
  _assignVimeoWidget: function(data) {
    if (data && data.length > 0) {
      WebDoc.WidgetManager.vimeoWidget = data[0];
    }
    else {
      WebDoc.WidgetManager.vimeoWidget = null;
    }    
    WebDoc.WidgetManager._readyForCallBack();
  },  
    
  _assignDailymotionWidget: function(data) {
    if (data && data.length > 0) {
      WebDoc.WidgetManager.dailymotionWidget = data[0];
    }
    else {
      WebDoc.WidgetManager.dailymotionWidget = null;
    }
    WebDoc.WidgetManager._readyForCallBack();
  },
  
  _readyForCallBack: function() {
    if (WebDoc.WidgetManager.youtubeWidget !== undefined && WebDoc.WidgetManager.vimeoWidget !== undefined && WebDoc.WidgetManager.dailymotionWidget !== undefined) {
      WebDoc.WidgetManager._callBack.call(this,WebDoc.WidgetManager);
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
