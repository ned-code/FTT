
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'youtube', this._assignYoutubeWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'vimeo', this._assignVimeoWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'dailymotion', this._assignDailymotionWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'myspacevideo', this._assignVidsMyspaceWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'metacafe', this._assignMetacafeWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'googlevideo', this._assignVidsGoogleWidget.pBind(this));
  },

  getVimeoWidget: function() {
    return this.vimeoWidget;   
  },
  
  getYoutubeWidget: function() {
    return this.youtubeWidget;   
  },

  getDailymotionWidget: function() {
    return this.dailymotionWidget;   
  },
  
  getVidsMyspaceWidget: function() {
    return this.vidsMyspaceWidget;   
  },

  getMetacafeWidget: function() {
    return this.metacafeWidget;   
  },
  
  getVidsGoogleWidget: function() {
    return this.vidsGoogleWidget;   
  },
  
  _assignYoutubeWidget: function(data) {
    if (data && data.length > 0) {
      this.youtubeWidget = data[0];
    }
    else {
      this.youtubeWidget = null;
    }
    if (this.vimeoWidget !== undefined) {
      this._callBack.call(this,WebDoc.WidgetManager);
    }
  },
  
  _assignVimeoWidget: function(data) {
    if (data && data.length > 0) {
      this.vimeoWidget = data[0];
    }
    else {
      this.vimeoWidget = null;
    }    
    if (this.youtubeWidget !== undefined) {
      this._callBack.call(this,WebDoc.WidgetManager);
    }    
  },  
    
  _assignDailymotionWidget: function(data) {
    if (data && data.length > 0) {
      this.dailymotionWidget = data[0];
    }
    else {
      this.dailymotionWidget = null;
    }
    if (this.youtubeWidget !== undefined && this.vimeoWidget !== undefined) {
      this._callBack.call(this,WebDoc.WidgetManager);
    }
  },
  
  _assignVidsMyspaceWidget: function(data) {
    if (data && data.length > 0) {
      this.vidsMyspaceWidget = data[0];
    }
    else {
      this.vidsMyspaceWidget = null;
    }
    this._callBack.call(this,WebDoc.WidgetManager);
  },
  
  _assignMetacafeWidget: function(data) {
    if (data && data.length > 0) {
      this.metacafeWidget = data[0];
    }
    else {
      this.metacafeWidget = null;
    }
    this._callBack.call(this,WebDoc.WidgetManager);
  },
  
  _assignVidsGoogleWidget: function(data) {
    if (data && data.length > 0) {
      this.vidsGoogleWidget = data[0];
    }
    else {
      this.vidsGoogleWidget = null;
    }
    this._callBack.call(this,WebDoc.WidgetManager);
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
