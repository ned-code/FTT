
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(callBack)    
  {
    this._callBack = callBack;
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'youtube', this._assignYoutubeWidget.pBind(this));
    WebDoc.ServerManager.getRecords(WebDoc.Widget, 'vimeo', this._assignVimeoWidget.pBind(this));
  },

  getVimeoWidget: function() {
    return this.vimeoWidget;   
  },
  
  getYoutubeWidget: function() {
    return this.youtubeWidget;   
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
