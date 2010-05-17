/**
 * @author julien
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    var domNode = this.domNode = $(selector);
    
    domNode.delegate('input', 'change', jQuery.proxy( this, 'update' ));
    
    
    
    
//    jQuery('#item_inspector').delegate("#property_top", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_right", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_bottom", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_left", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_background", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_rotation", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_padding", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_width", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_height", 'change', this.updateProperties.pBind(this));
//    jQuery('#item_inspector').delegate("#property_scroll", 'change', this.updateSroll.pBind(this));
//    jQuery('#item_inspector').delegate("#property_opacity", 'change', this.updateProperties.pBind(this));    
//    jQuery('#item_inspector').delegate("#property-fit-to-screen", 'click', this.updatePropertiesWithFitToScreen.pBind(this));
//    
//    this.topNode = jQuery("#property_top");
//    this.leftNode = jQuery("#property_left");
//    this.widthNode = jQuery("#property_width");
//    this.heightNode = jQuery("#property_height");
//    this.scrollNode = jQuery("#property_scroll");
//    this.opacityNode = jQuery("#property_opacity");
//    this.opacityReadoutNode = jQuery("#property_opacity_readout");
  
  },
  
  refresh: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0];
    
    if ( selectedItem ) {
      var position = selectedItem.position();
      var size = selectedItem.size();
      this.topNode.data("inherited", position.topInherted);
      this.topNode.val(position.top);
      this.leftNode.data("inherited", position.leftInherted);
      this.leftNode.val(position.left);  
      this.widthNode.data("inherited", size.widthInherted);
      this.widthNode.val(size.width);  
      this.heightNode.data("inherited", size.heightInherted);
      this.heightNode.val(size.height);  
      
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
  
  update: function(){
    var self = this,
        field = jQuery(e.target);
    
    field.validate({
      pass: function(){ 
        var property = field.attr('data-css-property');
        
        
        
        
        
        
        self.updateItem.call( self );
      },
      fail: function(){}
    });
  },
  
  updateItem: function(){
    var item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css;
    
    
    
  },
  
  updateProperties: function(e) {
    ddd("updateProperties", e);
    
    var that = this,
        field = jQuery(e.currentTarget),
        item = WebDoc.application.boardController.selection()[0].item,
        css = item.data.data.css;
    
    field.validate({
      pass: function(value) {
  
//        switch( this ){
//          case that.leftNode[0]:
//          case that.topNode[0]:
//            var previousPosition = {
//	            top: css.top,
//	            left: css.left
//	          };
//	          var newPosition = {
//	            top: (this === that.topNode[0])? that.topNode.val() : css.top,
//	            left: (this === that.leftNode[0])? that.leftNode.val() : css.left
//	          };
//	          if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
//	            WebDoc.application.undoManager.registerUndo(function() {
//	              WebDoc.ItemView._restorePosition(item, previousPosition);
//	            }.pBind(that));
//	            item.moveTo(newPosition);
//	            item.save();
//	          }
//		    		break;
//            
//		    	case that.widthNode[0]:
//		    	case that.heightNode[0]:
//		    		var previousSize = {
//	            width: css.width,
//	            height: css.height
//	          }; 
//	          var newSize = {
//              width: (this === that.widthNode[0])? that.widthNode.val() : css.width,
//              height: (this === that.heightNode[0])? that.heightNode.val() : css.height              
//	          };
//	          if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
//	            WebDoc.application.undoManager.registerUndo(function() {
//	              WebDoc.ItemView.restoreSize(item, previousSize);
//	            }.pBind(that));
//	            item.resizeTo(newSize);
//	            item.save();
//	          }
//		        break;
//		      
//		    	case that.opacityNode[0]:
//		    		var previousOpacity = item.data.data.css.opacity || 1;
//		    		var newOpacity = parseFloat( that.opacityNode.val(), 10 ).toFixed(2);
//		    		ddd('[Properties] Opacity new: '+newOpacity+' previous: '+previousOpacity);
//		    		if(newOpacity != previousOpacity){
//		    			WebDoc.application.undoManager.registerUndo(function(){
//		    				that.restoreOpacity(item, previousOpacity);
//		    			}.pBind(that));
//		    			item.setOpacity(newOpacity);
//		    			that.opacityReadoutNode.html( newOpacity );
//		    			item.save();
//		    		}
//		    		break;
//		    }
        that.refresh();
        
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


