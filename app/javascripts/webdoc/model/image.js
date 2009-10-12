
//= require <mtools/record>

WebDoc.Image = $.klass(MTools.Record, {
  initialize: function($super, json) {
    $super(json);
  },
  
  className: function() {
    return "image";
  },
  
});

