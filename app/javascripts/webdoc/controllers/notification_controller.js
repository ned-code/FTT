/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */

WebDoc.NotificationController = $.klass({
  
  initialize: function( selector) {
    this.domNode = jQuery(selector);
    this.domNode.hide();
    this.domNode.click(this.hide.pBind(this));    
  },

  notify: function(message, severity) {    
    this.domNode.html(message);
    this.domNode.removeClass("info error warning");
    this.domNode.addClass(severity);
    this.domNode.show();
  },
  
  hide: function() {
    this.domNode.hide();
  }
  
});

WebDoc.NotificationController.INFO = "info";
WebDoc.NotificationController.WARNING = "warning";
WebDoc.NotificationController.ERROR = "error";