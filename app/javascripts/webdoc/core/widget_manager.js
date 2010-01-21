
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(document)    
  {
    MTools.ServerManager.getRecords(WebDoc.Widget, null, this._assignYoutubeWidget.pBind(this), { ajaxParams: { system_widget_name: 'youtube'}});
    MTools.ServerManager.getRecords(WebDoc.Widget, null, this._assignVimeoWidget.pBind(this), { ajaxParams: { system_widget_name: 'vimeo'}});
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
