
//= require <webdoc/model/widget>
//= require <mtools/server_manager>

WebDoc.WidgetManager = $.klass(
{  
  initialize: function(document)    
  {
    MTools.ServerManager.getRecords(WebDoc.Widget, null, this._assignYoutubeWidget, { ajaxParams: { system_widget_name: 'youtube'}});
    MTools.ServerManager.getRecords(WebDoc.Widget, null, this._assignVimeoWidget, { ajaxParams: { system_widget_name: 'vimeo'}});
  },

  getVimeoWidget: function(documentId) {
    return this.vimeoWidget;   
  },
  
  getYoutubeWidget: function(documentId) {
    return this.youtubeWidget;   
  },
  
  _assignYoutubeWidget: function(data) {
    if (data & data.length > 0) {
      this.youtubeWidget = data[0];
    }
  },
  
  _assignVimeoWidget: function(data) {
    if (data & data.length > 0) {
      this.vimeoWidget = data[0];
    }
  }  
});
