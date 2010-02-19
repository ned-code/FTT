
WebDoc.WidgetApi = $.klass( 
{
  initialize: function(widgetItem, isInspector) {
    this.widgetItem = widgetItem;
    this.isInspector = isInspector;
  },
  
  setWidgetItem: function(item) {
    this.widgetItem = item;
  },
  
  isInspectorApi: function() {
    return this.isInspector;
  },
  
  resize: function(width, height) {
      this.resizeContainer(width, height);
  },
  
  resizeContainer: function(width, height) {
    this.widgetItem.data.data.css.width = width + "px";
    this.widgetItem.data.data.css.height = height + "px";
    ddd("resize container to " + this.widgetItem.data.data.css.width + ":"  + this.widgetItem.data.data.css.height);
    this.widgetItem.fireObjectChanged();
  },
  
  preference: function(key, value) {
    var result = this.widgetItem.data.data.preference[key];
	if (typeof(result)!='undefined') {return result;}
    return value;
  },
  
  setPreference: function(key, value) {
    var previous = this.widgetItem.data.data.preference[key];
    if (previous != value) {
      this.widgetItem.data.data.preference[key] = value;
      ddd("save widget pref");
      this.widgetItem.save();
      if (!this.isInspectorApi()) {
        ddd("will refresh inspector");
        WebDoc.application.inspectorController.refreshWidgetPalette();
      }
      else {
        this.widgetItem.fireWidgetChanged();
      }
    }
  },
  
  setPenColor: function(color) {
    WebDoc.application.drawingTool.penColor = color;   
  }
});