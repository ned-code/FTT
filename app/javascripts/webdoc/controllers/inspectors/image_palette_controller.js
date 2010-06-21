/**
 * @author Julien Bachmann
 */
WebDoc.ImagePaletteController = $.klass({
  initialize: function( ) {
    this.domNode = $( "#image-inspector" );
    this.propertySrc = $("#property_src");
    this.propertySrc.blur(this.updateSrc.pBind(this));

    this.domNode.find("#restore_original_size").click(this.restoreOriginalSize);
    
    this.domNode.find("#set_page_size_to_image_size").click(this.setPageSizeToImageSize);

    this.domNode.find("#preserve_aspect_ratio").click(this.changePreserveAspectRatio);

    this.domNode.find("#placeholder_checkbox").click(this.changePlaceholder);

    this.addImageLink = this.domNode.find("a[href=#create_image_link]");
    this.linkFormController = new WebDoc.LinkFormController();
    this.addImageLink.click(function(e){
      e.preventDefault();
      this.selectedElement = WebDoc.application.boardController.selection()[0];
      this.linkFormController.showDialog(e, this.selectedElement.item.data.data.href, function(newLink){
        if (this.selectedElement && this.selectedElement.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
          this.selectedElement.item.data.data.href = newLink;
          this.selectedElement.item.save(function() {
            this.selectedElement.item.fireDomNodeChanged();
            this.refresh();
          }.pBind(this));
        }
        return false;
      }.pBind(this));
    }.pBind(this));

    this.clearImageLink = this.domNode.find("a[href=#clear_image_link]");
    this.clearImageLink.click(this._clearLink.pBind(this));
    
    this.addToMyImageLink = this.domNode.find("a[href=#add_to_my_images]");
    this.addToMyImageResult = this.domNode.find("#add_to_my_images_result");
    
    this.addToMyImageLink.click(this.addToMyImage.pBind(this));
    
    this.zoomNode = this.domNode.find('#image_zoom');
    this.xshiftNode = this.domNode.find('#image_xshift');
    this.yshiftNode = this.domNode.find('#image_yshift');
       
    var that = this;
    this._nbChange = 0;    
    this.zoomNode
    .bind('change', function(e){
      var factor = parseFloat( e.target.value ),
          item = WebDoc.application.boardController.selection()[0].item;               
      item.zoom( factor );
      that._delayItemSave(item);
    });
   
    
    this.xshiftNode
    .bind('change', function(e){
      var xfactor = parseFloat( e.target.value ),
          item = WebDoc.application.boardController.selection()[0].item;      
      item.displace({
        left: xfactor
      });
      that._delayItemSave(item);   
    });
    
    this.yshiftNode
    .bind('change', function(e){
      var yfactor = parseFloat( e.target.value ),
          item = WebDoc.application.boardController.selection()[0].item;
      
      item.displace({
        top: yfactor
      });
      that._delayItemSave(item);
    });
    
    // image properties
    this.propertiesController = new WebDoc.PropertiesInspectorController('#image_properties', false);
  },
  
  inspectorTitle: function() {
    return "Image";  
  },
  
  refresh: function() {
    this.propertiesController.refresh();
    if (WebDoc.application.boardController.selection().length) {      
      var selectedItem = WebDoc.application.boardController.selection()[0];
      if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
        this.addToMyImageResult.text('');
        if(selectedItem.item.data.media_id) {
          this.addToMyImageLink.hide();
        } else {
          this.addToMyImageLink.show();
        }
        $("#property_src")[0].value = selectedItem.item.data.data.src;
        if(selectedItem.item.data.data.preserve_aspect_ratio === true ||
           selectedItem.item.data.data.preserve_aspect_ratio === "true") {
          $("#preserve_aspect_ratio").attr("checked", "checked");  
        }
        else {
          $("#preserve_aspect_ratio").removeAttr("checked");
        }
        if(selectedItem.item.getIsPlaceholder()) {
          $("#placeholder_checkbox").attr("checked", "checked");
        }
        else {
          $("#placeholder_checkbox").removeAttr("checked");
        }
        this.zoomNode[0].value = selectedItem.item.getZoom();
        this.xshiftNode[0].value = selectedItem.item.getDisplacement().left;
        this.yshiftNode[0].value = selectedItem.item.getDisplacement().top;
        if(selectedItem.item.data.data.href) {
          this.addImageLink.text('Edit link');
          this.clearImageLink.show();
        }
        else {
          this.addImageLink.text('Create link');
          this.clearImageLink.hide();
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
    event.preventDefault();
  },

  restoreOriginalSize: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;

    if (item !== undefined && item.data.media_type === WebDoc.ITEM_TYPE_IMAGE && item.data.data.src !== undefined && item.data.data.src !== "") {
      var image = new Image();
      image.src = item.data.data.src;
      ddd("restore original size: "+image.width+"x"+image.height+"px");
      WebDoc.ItemView.restoreSize(item, { width: image.width+"px", height: image.height+"px"});
    }
    event.preventDefault();
  },

  setPageSizeToImageSize: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;
    if (item !== undefined && item.data.media_type === WebDoc.ITEM_TYPE_IMAGE && item.data.data.src !== undefined && item.data.data.src !== "") {
      ddd("[image palette controller]: set page size to image size "+item.width()+"x"+item.height());
      WebDoc.application.pageEditor.currentPage.setSize({width: item.width(), height: item.height()});
      ddd("[image palette controller]: set image position to 00");
      item.moveTo({ left: '0px', top: '0px' });
      item.save();
    }
    event.preventDefault();
  },

  changePreserveAspectRatio: function(event) {
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

  changePlaceholder: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;
    if(item && item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
      if($(this).is(':checked')) {
        item.setIsPlaceholder(true);
      }
      else {
        item.setIsPlaceholder(false);
      }
    }
  },

  addToMyImage: function(event) {
    event.preventDefault();
    var selected = WebDoc.application.boardController.selection()[0];
    if (selected && selected.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
      var selectedItem = selected.item;
      if (selectedItem.data.data.src !== undefined && selectedItem.data.data.src !== '') {
        this.addToMyImageLink.hide();
        this.addToMyImageResult.text('Uploading...');
        var image = new WebDoc.Image;
        image.data.remote_attachment_url = this.propertySrc.val();
        this.selectedItem = selectedItem;
        image.save(function(event){
          WebDoc.application.rightBarController.getInspector(WebDoc.RightBarInspectorType.LIBRARY)
                  .imagesLibrary.refreshMyImages();
          this.selectedItem.data.media_id = event.data.uuid;
          this.selectedItem.data.data.src = event.data.properties.url;
          ddd(event.data.properties.url);
          ddd(this.selectedItem.data.data.src);
          this.selectedItem.save();
          this.refresh();
          this.addToMyImageResult.text('Image uploaded in my images!');
        }.pBind(this));
      }
    }
    return false;
  },

  _clearLink: function(event) {
    ddd('[ImagePaletteController] clear link');
    this.selectedElement = WebDoc.application.boardController.selection()[0];
    if (this.selectedElement && this.selectedElement.item.data.media_type === WebDoc.ITEM_TYPE_IMAGE) {
      var selectedItem = this.selectedElement.item;
      if (selectedItem.data.data.href) {
        selectedItem.data.data.href = "";
        selectedItem.save(function() {
          this.selectedElement.item.fireDomNodeChanged();
          this.refresh();
        }.pBind(this));
      }
    }
    event.preventDefault();
  },
  
  _delayItemSave: function(item) {
      var that = this;
      this._nbChange += 1;
      var currentNbChange = this._nbChange;
      setTimeout(function(){ 
        if (currentNbChange == that._nbChange) {
          item.save();
          that._nbChange = 0;
        }}, 500);    
  }

});
