/**
 * @author Julien Bachmann
 */
WebDoc.ImagePaletteController = $.klass({
  initialize: function( selector ) {
    this.domNode = $( selector );
    
    $("#property_src").blur(this.updateSrc.pBind(this));

    $("#restore_original_size").click(this.restoreOriginalSize);
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection().length) {      
      var selectedItem = WebDoc.application.boardController.selection()[0];
      if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
        $("#property_src")[0].value = selectedItem.item.data.data.src;
      }
    }
  },
  updateSrc: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;
    item.data.data.src =  $("#property_src")[0].value;       
    item.save(function() {
      item.fireDomNodeChanged();
    });
  },

  restoreOriginalSize: function() {
    var item = WebDoc.application.boardController.selection()[0].item;

    if (item !== undefined && item.data.media_type === WebDoc.ITEM_TYPE_IMAGE && item.data.data.src !== undefined && item.data.data.src !== "") {
      var image = new Image();
      image.src = item.data.data.src;
      ddd("restore original size: "+image.width+"x"+image.height+" pixels");
      WebDoc.ItemView.restoreSize(item, { width: image.width, height: image.height});
    }
  }

});