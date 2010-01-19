/**
 * @author Julien Bachmann
 */
WebDoc.ImagePaletteController = $.klass({
  initialize: function() {
    $("#property_src").blur(this.updateSrc.pBind(this));
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection.length) {      
      var selectedItem = WebDoc.application.boardController.selection[0];
      if (selectedItem.item.data.media_type == WebDoc.ITEM_TYPE_IMAGE) {
        $("#property_src")[0].value = selectedItem.item.data.data.src;
      }
    }
  },
  updateSrc: function(event) {
    var item = WebDoc.application.boardController.selection[0].item;
    item.data.data.src =  $("#property_src")[0].value;       
    item.save(function() {
      item.fireDomNodeChanged();
    });
  }  
});