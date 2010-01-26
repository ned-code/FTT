/**
 * @author Zeno Crivelli
 * @author Julien Bachmann
**/

//= require <webdoc/model/widget>

WebDoc.AppsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    ddd("will init super");
    $super(libraryId);
    ddd("super done");
    this.domNode = $("#apps_library_wrap");
    this.loadWidgets();
    this.domNode.find("ul").bind("dragstart", this.dragStart.pBind(this));
    ddd("end int");
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
