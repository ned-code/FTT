
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(document)    
  {
    MTools.ServerManager.getRecords(WebDoc.Widget, 'youtube', this._assignYoutubeWidget.pBind(this));
    MTools.ServerManager.getRecords(WebDoc.Widget, 'vimeo', this._assignVimeoWidget.pBind(this));
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
  },
  
  _assignVimeoWidget: function(data) {
    if (data && data.length > 0) {
      this.vimeoWidget = data[0];
    }
  }  
});
