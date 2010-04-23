/**
 * @author Noé
 */

WebDoc.IframeController = $.klass({
  initialize: function( selector ) {
    this.domNode = $(selector);

    $("#property-iframe-src").change(this.updateSrc);

  },

  refresh: function() {
    ddd("refresh iframe inspector");
    var selectedItem = WebDoc.application.boardController.selection()[0];
    if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IFRAME) {
      $("#property-iframe-src")[0].value = selectedItem.item.getSrc();
    }
  },

  updateSrc: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;
    item.setSrc( $("#property-iframe-src")[0].value );
  }
  
});
