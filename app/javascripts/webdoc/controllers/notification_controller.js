WebDoc.NotificationController = $.klass({
  
  initialize: function( selector) {},

  notify: function(message, severity) {
    jQuery('<p/>')
    .html(message)
    .flash({
    	type: severity
    });
  },
  
  hide: function() {
    jQuery.fn.flash.hide();
  }
  
});

WebDoc.NotificationController.INFO = "info";
WebDoc.NotificationController.WARNING = "warning";
WebDoc.NotificationController.ERROR = "error";