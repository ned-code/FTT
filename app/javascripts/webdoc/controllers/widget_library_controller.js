/**
 * @author julien
 */

//= require <webdoc/model/widget>
WebDoc.WidgetLibraryController = $.klass({
  initialize: function() {
    this.domNode = $("#widget_library_wrap");
    this.loadWidgets();
    this.domNode.find("ul").bind("dragstart", this.dragStart.pBind(this));
  },
  
  loadWidgets: function() {
    this.domNode.find("ul").empty();
    MTools.ServerManager.getRecords(WebDoc.Widget, null, function(data)
        {
          this.widgets = {};
          for (var i = 0; i < data.length; i++) {
            this.widgets[data[i].uuid()] = data[i];
          }  
          this.refreshWidgetList();
        }.pBind(this));
  },
  
  refreshWidgetList: function() {    
    for (widgetId in this.widgets) {
      var widget = this.widgets[widgetId];
      var widgetItem = $("<img/>").attr({
        id: widget.uuid(),
        src: widget.data.properties.icon_url
      }).addClass("widget_item");
      var widgetListItem = $("<li/>").append(widgetItem);
      this.domNode.find("ul").append(widgetListItem);
    }
  },
  
  toggle: function() {
    this.domNode.slideToggle("slow");
  },
  
  dragStart: function(e) {
    ddd("start drag");
    ddd($(e.target));
    ddd(this.widgets[$(e.target).attr("id")]);
    e.originalEvent.dataTransfer.setData('application/ub-widget', $.toJSON(this.widgets[e.target.id].getData()));
  }
});

$.extend(WebDoc.ImageLibraryController,{
});