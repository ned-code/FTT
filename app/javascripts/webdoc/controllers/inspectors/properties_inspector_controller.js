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
		$("#property_opacity").blur(this.updateProperties.pBind(this));
  },  
  
  refresh: function() {
    if (WebDoc.application.boardController.selection().length) {
      $("#empty_properties").hide();
      $("#default_properties").show();      
      var selectedItem = WebDoc.application.boardController.selection()[0];
      $("#property_top")[0].value = selectedItem.item.data.data.css.top;
      $("#property_left")[0].value = selectedItem.item.data.data.css.left;
      $("#property_width")[0].value = selectedItem.item.data.data.css.width;
      $("#property_height")[0].value = selectedItem.item.data.data.css.height;      
      $("#property_scroll").attr("checked", selectedItem.domNode.css("overflow") == "auto");
 			$("#property_opacity")[0].value = selectedItem.item.data.data.css.opacity || "1";
    }
    else {
      $("#default_properties").hide();
      $("#empty_properties").show();
    }
  },
  
  updateSroll: function(event) {
    ddd("update scroll");
     var item = WebDoc.application.boardController.selection()[0].item;
      if (item) {
        var newOverflow = { overflow: $("#property_scroll").attr("checked")?"auto":"hidden"};
        $.extend(item.data.data.css, newOverflow);
        WebDoc.application.boardController.selection()[0].domNode.css(newOverflow);
        item.save();
      }
  },
  
  updateProperties: function(event) {
    var changedProperty = event.target.id;
    var item = WebDoc.application.boardController.selection()[0].item;
    switch(changedProperty){
			case "property_left":
			case "property_top":
				var previousPosition = {
	        top: item.data.data.css.top,
	        left: item.data.data.css.left
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
				break;
			case "property_width":
			case "property_height":
				var previousSize = {
	        width: item.data.data.css.width,
	        height: item.data.data.css.height
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
				break;
			case "property_opacity":
				var previousOpacity = item.data.data.css.opacity || 1;
				var newOpacity = $("#property_opacity")[0].value;
				ddd('previous opacity:'+previousOpacity);
				if(newOpacity != previousOpacity){
					WebDoc.application.undoManager.registerUndo(function(){
						this.restoreOpacity(item, previousOpacity);
					}.pBind(this));
					item.setOpacity(newOpacity);
					item.save();
				}
				break;
		}
  },
	restoreOpacity: function(item, opacity){
		ddd("restore opacity "+opacity);
		var previousOpacity=item.data.data.css.opacity;
		item.setOpacity(opacity);
		WebDoc.application.undoManager.registerUndo(function(){
			this.restoreOpacity(item, previousOpacity);
		}.pBind(this));
		item.save();
	}
});


