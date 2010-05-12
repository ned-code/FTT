/**
 * @author Julien Bachmann
 */
WebDoc.ImagePaletteController = $.klass({
  initialize: function( selector ) {
    this.domNode = $( selector );

    this.propertySrc = $("#property_src");
    this.propertySrc.blur(this.updateSrc.pBind(this));

    $("#restore_original_size").click(this.restoreOriginalSize);

    $("#preserve_aspect_ratio").click(this.changePreserveAspectRatio);

    this.addToMyImageLink = $(selector + " a[href=#add_to_my_images]");
    this.addToMyImageResult = $(selector + " #add_to_my_images_result");

    this.addToMyImageLink.click(this.addToMyImage.pBind(this));
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection().length) {      
      var selectedItem = WebDoc.application.boardController.selection()[0];
      if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
        $("#property_src")[0].value = selectedItem.item.data.data.src;
        if(selectedItem.item.data.data.preserve_aspect_ratio === "true") {
          $("#preserve_aspect_ratio").attr("checked", "checked");  
        }
        else {
          $("#preserve_aspect_ratio").removeAttr("checked");
        }
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
  },

  changePreserveAspectRatio: function() {
    var item = WebDoc.application.boardController.selection()[0].item;
    if (item !== undefined && item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
      if($(this).is(':checked')) {
        item.data.data.preserve_aspect_ratio = "true";
      }
      else {
        item.data.data.preserve_aspect_ratio = "false";
      }
      item.save();
    } 
  },

  addToMyImage: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0];
    if (selectedItem && selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
      if (selectedItem.item.data.data.src !== undefined && selectedItem.item.data.data.src !== '') {
        this.addToMyImageLink.hide();
        this.addToMyImageResult.text('Uploading...');
        image = new WebDoc.Image;
        image.data.remote_file_url = this.propertySrc.val();
        image.save(function(){
          WebDoc.application.rightBarController.getInspector(WebDoc.RightBarInspectorType.LIBRARY)
                  .imagesLibrary.refreshMyImages();
          this.addToMyImageResult.text('Image uploaded in my images!');
        }.pBind(this));
      }
    }
    return false;
  }

});
