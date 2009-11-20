/**
 * @author julien
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function() {
    $("#default_properties").hide();
    $("#empty_properties").show();    
    
    $("#property_top").blur(this.updateProperties.pBind(this));
    $("#property_left").blur(this.updateProperties.pBind(this));
    $("#property_width").blur(this.updateProperties.pBind(this));
    $("#property_height").blur(this.updateProperties.pBind(this));
    $("#property_scroll").bind("change", this.updateSroll.pBind(this));
    $("#property_src").blur(this.updateSrc.pBind(this));
  },  
  
  refresh: function() {
    if (WebDoc.application.boardController.selection.length) {
      $("#empty_properties").hide();
      $("#default_properties").show();      
      var selectedItem = WebDoc.application.boardController.selection[0];
      $("#property_top")[0].value = selectedItem.item.position.top;
      $("#property_left")[0].value = selectedItem.item.position.left;
      $("#property_width")[0].value = selectedItem.item.size.width;
      $("#property_height")[0].value = selectedItem.item.size.height;      
      $("#property_scroll").attr("checked", selectedItem.domNode.css("overflow") == "auto");
      if (selectedItem.item.data.media_type == WebDoc.ITEM_TYPE_IMAGE) {
        $("#image_properties").css("display", "");
        $("#property_src")[0].value = selectedItem.item.data.data.src;
      }
      else {
        $("#image_properties").css("display", "none");
      }
    }
    else {
      $("#default_properties").hide();
      $("#empty_properties").show();
    }
  },
  
  updateSroll: function(event) {
    ddd("update scroll");
     var item = WebDoc.application.boardController.selection[0].item;
      if (item) {
        var newOverflow = { overflow: $("#property_scroll").attr("checked")?"auto":"hidden"};
        $.extend(item.data.data.css, newOverflow);
        WebDoc.application.boardController.selection[0].domNode.css(newOverflow);
        item.save();
      }
  },
  
  updateSrc: function(event) {
    var item = WebDoc.application.boardController.selection[0].item;
    item.data.data.src =  $("#property_src")[0].value;       
    item.save(function() {
      item.fireDomNodeChanged();
    });
  },
  
  updateProperties: function(event) {
    var changedProperty = event.target.id;
    var item = WebDoc.application.boardController.selection[0].item;
    if (changedProperty == "property_left" || changedProperty == "property_top") {
      var previousPosition = {
        top: item.position.top,
        left: item.position.left
      };
      var newPosition = {
        top: $("#property_top")[0].value,
        left: $("#property_left")[0].value
      };
      if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restorePosition(item, previousPosition);
        }.pBind(this));
        item.moveTo(newPosition);
        item.save();
      }
    }
    else {
      var previousSize = {
        width: item.size.width,
        height: item.size.height
      }; 
      var newSize = {
        width: $("#property_width")[0].value,
        height: $("#property_height")[0].value
      };
      if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restoreSize(item, previousSize);
        }.pBind(this));
        item.resizeTo(newSize);
        item.save();
      }
    }
  }
});
