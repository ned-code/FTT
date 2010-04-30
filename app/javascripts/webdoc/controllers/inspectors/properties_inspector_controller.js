/**
 * @author julien
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    this.domNode = $(selector);
    jQuery('#item_inspector').delegate("#property-top", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-right", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-bottom", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-left", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-width", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-height", 'change', this.updateProperties.pBind(this));
    jQuery('#item_inspector').delegate("#property-scroll", 'change', this.updateSroll.pBind(this));
    jQuery('#item_inspector').delegate("#property-opacity", 'change', this.updateProperties.pBind(this));    
    jQuery('#item_inspector').delegate("#property-fit-to-screen", 'click', this.updatePropertiesWithFitToScreen.pBind(this));
    this.topNode = jQuery("#property-top");
    this.rightNode = jQuery("#property-right");
    this.bottomNode = jQuery("#property-bottom");
    this.leftNode = jQuery("#property-left");
    this.widthNode = jQuery("#property-width");
    this.heightNode = jQuery("#property-height");
    this.scrollNode = jQuery("#property-scroll");
    this.opacityNode = jQuery("#property-opacity");
    this.opacityReadoutNode = jQuery("#property-opacity-readout");
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
  
  updateProperties: function(e) {
    ddd("updateProperties", e);
    
    var that = this,
        field = jQuery(e.currentTarget),
        item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css;
    
    field.validate({
      pass: function(value) {
        
        switch( this ){
          case that.leftNode[0]:
          case that.topNode[0]:
            var previousPosition = {
	            top: css.top,
	            left: css.left
	          };
	          var newPosition = {
	            top: that.topNode.val(),
	            left: that.leftNode.val()
	          };
	          if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
	            WebDoc.application.undoManager.registerUndo(function() {
	              WebDoc.ItemView._restorePosition(item, previousPosition);
	            }.pBind(that));
	            item.moveTo(newPosition);
	            item.save();
	          }
		    		break;
            
		    	case that.widthNode[0]:
		    	case that.heightNode[0]:
		    		var previousSize = {
	            width: css.width,
	            height: css.height
	          }; 
	          var newSize = {
	            width: that.widthNode.val(),
	            height: that.heightNode.val()
	          };
	          if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
	            WebDoc.application.undoManager.registerUndo(function() {
	              WebDoc.ItemView.restoreSize(item, previousSize);
	            }.pBind(that));
	            item.resizeTo(newSize);
	            item.save();
	          }
		        break;
		      
		    	case that.opacityNode[0]:
		    		var previousOpacity = item.data.data.css.opacity || 1;
		    		var newOpacity = parseFloat( that.opacityNode.val(), 10 ).toFixed(2);
		    		ddd('[Properties] Opacity new: '+newOpacity+' previous: '+previousOpacity);
		    		if(newOpacity != previousOpacity){
		    			WebDoc.application.undoManager.registerUndo(function(){
		    				that.restoreOpacity(item, previousOpacity);
		    			}.pBind(that));
		    			item.setOpacity(newOpacity);
		    			that.opacityReadoutNode.html( newOpacity );
		    			item.save();
		    		}
		    		break;
		      }
        
        
      },
      fail: function(error) {
        
      }
    })
    

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
    var item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css,
        previousTop = css.top,
        previousLeft = css.left,
        previousWidth = css.width,
        previousHeight = css.height;
    
    item.moveToAndResizeTo("0px", "0px", "100%", "100%");
    item.save(function(){
      WebDoc.application.undoManager.registerUndo(function() {
        WebDoc.ItemView.restorePositionAndSize(item, previousTop, previousLeft, previousWidth, previousHeight);
	  }.pBind(this));
    });
    event.preventDefault();
    return;
  }
});


