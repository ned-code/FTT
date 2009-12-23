/**
 * @author julien
 */
WebDoc.DrageAndDropController = $.klass({
});

$.extend(WebDoc.DrageAndDropController,{
  dragEnter: function(evt) {
    ddd("drag enter");
    ddd(evt);
    evt.preventDefault();  
  },
  
  dragOver: function(evt) {
    evt.preventDefault();
  },
  
  drop: function(evt) {
    ddd("drop");
    /*
    var i = 0;
    for(; i < evt.originalEvent.dataTransfer.types.length; i++) {
      ddd("-----------");
      ddd("type " + evt.originalEvent.dataTransfer.types[i] );
      ddd("value " + evt.originalEvent.dataTransfer.getData(evt.originalEvent.dataTransfer.types[i]));
      ddd("-----------");
    }
    ddd("==================");
    */
    evt.preventDefault();
    var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
    var widget = evt.originalEvent.dataTransfer.getData('application/ub-widget');    
    var html = evt.originalEvent.dataTransfer.getData('text/html');        
    var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
    var ubImage = evt.originalEvent.dataTransfer.getData('application/ub-image');    
    var newItem;
    if (widget) {
      var widgetData = $.evalJSON(widget);
      newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
      var width = 200, height = 200;
      if (widgetData.properties.width) {
        width = widgetData.properties.width;
        height = widgetData.properties.height;
      }
      newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
      newItem.data.media_id = widgetData.id;
      newItem.data.data.tag = "iframe";
      newItem.data.data.src = widgetData.properties.index_url;
      newItem.data.data.css = {
        top: pos.y + "px",
        left: pos.x + "px",
        width: width + "px",
        height: height + "px"
      };
      newItem.recomputeInternalSizeAndPosition();
      WebDoc.application.boardController.insertItems([newItem]);   
    }
    else if (imageUrl || ubImage) {
      var url = ubImage? ubImage : imageUrl;
	  
	  var image=document.createElement('img'); /* Preload image in order to have width and height parameters available */	
	  $(image).bind("load", pos, WebDoc.DrageAndDropController.createImageItem); /* WebDoc.Item creation will occur after image load*/
	  image.src=url;
    } 
    else {      
      if (html) {
        newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
        newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
        newItem.data.data.tag = "div";
        newItem.data.data.innerHTML = html;
        newItem.data.data.css = {
          top: pos.y + "px",
          left: pos.x + "px",
          width: "0px",
          height: "0px"
        };
        WebDoc.application.boardController.insertItems([newItem]);
      }
    }
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  },
 createImageItem: function(e){
	var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
	newItem.data.media_type = WebDoc.ITEM_TYPE_IMAGE;
    newItem.data.data.tag = "img";
    newItem.data.data.src = this.src;
    newItem.data.data.css = {
        overflow: "hidden",
        top: e.data.y + "px",
        left: e.data.x + "px",
		width: this.width + "px",
		height: this.height +"px"
      };
    WebDoc.application.boardController.insertItems([newItem]);
  }
});