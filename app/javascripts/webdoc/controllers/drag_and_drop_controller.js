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
    
    if (widget) {
      var newItem = new WebDoc.Item();
      newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
      newItem.data.data.tag = "iframe";
      newItem.data.data.src = widget;
      newItem.data.data.css = {
        top: pos.y + "px",
        left: pos.x + "px",
        width: "200px",
        height: "200px"
      };
      newItem.recomputeInternalSizeAndPosition();
      WebDoc.application.boardController.insertItems([newItem]);   
    }
    else if (imageUrl || ubImage) {
      var url = ubImage? ubImage : imageUrl;
      var newItem = new WebDoc.Item();
      newItem.data.media_type = WebDoc.ITEM_TYPE_IMAGE;
      newItem.data.data.tag = "img";
      newItem.data.data.src = url;
      newItem.data.data.css = {
        top: pos.y + "px",
        left: pos.x + "px",
      };
      WebDoc.application.boardController.insertItems([newItem]);
    } 
    else {      
      if (html) {
        var newItem = new WebDoc.Item();
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
});