/**
 * @author julien
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    this.domNode = $(selector);
    jQuery('#item_inspector').delegate("#property-top", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-right", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-bottom", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-left", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-width", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-height", 'blur', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-scroll", 'change', this.updateSroll.pBind(this));
    jQuery('#item_inspector').delegate("#property-opacity", 'blur', this.updateProperties.pBind(this));    
    jQuery('#item_inspector').delegate("a[href='#property-fit-to-screen']", 'click', this.updatePropertiesWithFitToScreen.pBind(this));
    this.topNode = jQuery("#property-top");
    this.rightNode = jQuery("#property-right");
    this.bottomNode = jQuery("#property-bottom");
    this.leftNode = jQuery("#property-left");
    this.widthNode = jQuery("#property-width");
    this.heightNode = jQuery("#property-height");
    this.scrollNode = jQuery("#property-scroll");
    this.opacityNode = jQuery("#property-opacity");
  },
  
  refresh: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0];
    
    if ( selectedItem ) {
      this.topNode.val( selectedItem.item.data.data.css.top );
      this.rightNode.val( selectedItem.item.data.data.css.left );
      this.bottomNode.val( selectedItem.item.data.data.css.top );
      this.leftNode.val( selectedItem.item.data.data.css.left );
      this.widthNode.val( selectedItem.item.data.data.css.width );
      this.heightNode.val( selectedItem.item.data.data.css.height );      
      this.opacityNode.val( selectedItem.item.data.data.css.opacity || "1" );
      // drawing item has no itemDomNode
      if (selectedItem.itemDomNode) {
        this.scrollNode.attr("checked", selectedItem.itemDomNode.css("overflow") === "auto");
      }
    }
  },
  
  updateSroll: function(event) {
    ddd("update scroll");
     var item = WebDoc.application.boardController.selection()[0].item;
      if (item) {        
        var newOverflow = { overflow: this.scrollNode.attr("checked")?"auto":"hidden"};
        $.extend(item.data.data.css, newOverflow);
        WebDoc.application.boardController.selection()[0].itemDomNode.css("overflow", newOverflow.overflow);
        item.save();
      }
  },
  
  updateProperties: function(event) {
    ddd("update properties",event);
    var changedProperty = event.currentTarget;
    var item = WebDoc.application.boardController.selection()[0].item;
    switch(changedProperty){
      case this.leftNode[0]:
      case this.topNode[0]:
        var previousPosition = {
	        top: item.data.data.css.top,
	        left: item.data.data.css.left
	      };
	      var newPosition = {
	        top: this.topNode.val(),
	        left: this.leftNode.val()
	      };
	      if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
	        WebDoc.application.undoManager.registerUndo(function() {
	          WebDoc.ItemView._restorePosition(item, previousPosition);
	        }.pBind(this));
	        item.moveTo(newPosition);
	        item.save();
	      }
				break;
			case this.widthNode[0]:
			case this.heightNode[0]:
				var previousSize = {
	        width: item.data.data.css.width,
	        height: item.data.data.css.height
	      }; 
	      var newSize = {
	        width: this.widthNode.val(),
	        height: this.heightNode.val()
	      };
	      if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
	        WebDoc.application.undoManager.registerUndo(function() {
	          WebDoc.ItemView.restoreSize(item, previousSize);
	        }.pBind(this));
	        item.resizeTo(newSize);
	        item.save();
	      }
				break;
			case this.opacityNode[0]:
				var previousOpacity = item.data.data.css.opacity || 1;
				var newOpacity = this.opacityNode.val();
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
  },

  updatePropertiesWithFitToScreen: function(event) {
    var item = WebDoc.application.boardController.selection()[0].item;
	var previousTop = item.data.data.css.top,
            previousLeft = item.data.data.css.left,
            previousWidth = item.data.data.css.width,
            previousHeight = item.data.data.css.height;
    item.moveToAndResizeTo("0px", "0px", "100%", "100%");
    item.save(function(){
      WebDoc.application.undoManager.registerUndo(function() {
        WebDoc.ItemView.restorePositionAndSize(item, previousTop, previousLeft, previousWidth, previousHeight);
	  }.pBind(this));
    });
    return false;
  }
});


