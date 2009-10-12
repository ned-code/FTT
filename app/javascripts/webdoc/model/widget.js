
//= require <mtools/record>

WebDoc.Widget = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  },
  
  className: function() {
    return "widget";
  },
  
});

