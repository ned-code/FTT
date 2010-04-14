/**
 * @author Noé
 */


WebDoc.IframeView = $.klass(WebDoc.ItemView, {

  initialize: function($super, item, pageView, afterItem) {
    $super(item, pageView, afterItem);
    
  },

  inspectorId: function() {
    return 6;
  }

});
