/**
 * @author julien
 */

WebDoc.PropertiesInspectorController = $.klass({
  initialize: function( selector ) {
    this.domNode = $(selector);
  
    this.topNode = $("#property-top").blur(this.updateProperties.pBind(this));
    this.rightNode = $("#property-right").blur(this.updateProperties.pBind(this));
    this.bottomNode = $("#property-bottom").blur(this.updateProperties.pBind(this));
    this.leftNode = $("#property-left").blur(this.updateProperties.pBind(this));
    this.widthNode = $("#property-width").blur(this.updateProperties.pBind(this));
    this.heightNode = $("#property-height").blur(this.updateProperties.pBind(this));
    this.scrollNode = $("#property-scroll").bind("change", this.updateSroll.pBind(this));
    this.opacityNode = $("#property-opacity").blur(this.updateProperties.pBind(this));
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
      this.scrollNode.attr("checked", selectedItem.domNode.css("overflow") === "auto");
      this.opacityNode.val( selectedItem.item.data.data.css.opacity || "1" );
    }
  },
  
  updateSroll: function(event) {
    ddd("update scroll");
     var item = WebDoc.application.boardController.selection()[0].item;
      if (item) {
        var newOverflow = { overflow: this.scrollNode.attr("checked")?"auto":"hidden"};
        $.extend(item.data.data.css, newOverflow);
        WebDoc.application.boardController.selection()[0].domNode.css(newOverflow);
        item.save();
      }
  },
  
  updateProperties: function(event) {
    var changedProperty = event.target;
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
	          WebDoc.ItemView._restoreSize(item, previousSize);
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
	}
});


