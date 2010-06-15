/**
 * @author Noé
 */

WebDoc.IframeController = $.klass({
  initialize: function( ) {
    this.domNode = $("#iframe-inspector");
    this.domNode.find("#property-iframe-src").change(this.updateSrc);
    this.propertiesController = new WebDoc.PropertiesInspectorController('#iframe_properties', false);
  },

  inspectorTitle: function() {
    return "web page";  
  },
  
  refresh: function() {
    ddd("refresh iframe inspector");
    this.propertiesController.refresh();
    var selectedItem = WebDoc.application.boardController.selection()[0];
    if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IFRAME) {
      $("#property-iframe-src")[0].value = selectedItem.item.getSrc();
    }
  },

  updateSrc: function(e) {
    var input = jQuery(e.target);
    
    input.validate({
      pass: function( value ){
        var item = WebDoc.application.boardController.selection()[0].item;
        consolidateSrc = WebDoc.UrlUtils.consolidateSrc(value);
        item.setSrc( consolidateSrc );
      },
      fail: function( value, error ){
        ddd(error);
      }
    });
    

  }
  
});
