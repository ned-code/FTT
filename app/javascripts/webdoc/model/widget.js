
//= require <mtools/record>

WebDoc.Widget = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  },
  
  className: function() {
    return "widget";
  },
  
  refresh: function($super, json) {
    $super(json);
    this.fireWidgetChanged();
  },
  
  fireWidgetChanged: function() {
    for (var i = 0; i < this.listeners.length; i++) {
      if (this.listeners[i].widgetChanged) {
        this.listeners[i].widgetChanged();
      }
    }     
  }
  
});

