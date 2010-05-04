/**
 * @author julien
 */
WebDoc.DrageAndDropController = $.klass({});

$.extend(WebDoc.DrageAndDropController, {
  KNOWN_TYPES : ['application/ub-image', 'application/ub-widget', 'application/ub-video', 'application/x-moz-file-promise-url', 'text/html'],

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
    
    if (evt.originalEvent.dataTransfer.types.length > 0) {
      evt.preventDefault();
      // take the correct data from the datatransfer
      var availableType = evt.originalEvent.dataTransfer.types[0];
      // if more then 1 type are in the datatransfer we take one we know the best
      if (evt.originalEvent.dataTransfer.types.length > 1) {
        for (knownTypeIndex in WebDoc.DrageAndDropController.KNOWN_TYPES) {
          var knownType = WebDoc.DrageAndDropController.KNOWN_TYPES[knownTypeIndex];
          if ((evt.originalEvent.dataTransfer.types.contains && evt.originalEvent.dataTransfer.types.contains(knownType)) ||
              ($.inArray(knownType, evt.originalEvent.dataTransfer.types) !== -1)) {
            availableType = knownType;
            break;            
          }
        }
      }      
      // create item depending on wath has been taken from the datatransfer
      var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
      var width = 200, height = 200, x = 0, y = 0;      
      var newItem;
      switch (availableType) {
        case 'application/ub-widget':
          var widget = evt.originalEvent.dataTransfer.getData('application/ub-widget');
          if (widget) 
          {
            var widgetData = $.evalJSON(widget);
            WebDoc.application.boardController.insertWidget(widgetData, pos);
          }
          break;
        case 'application/x-moz-file-promise-url' :
          var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
        case 'application/ub-image' :   
          var ubImage = evt.originalEvent.dataTransfer.getData('application/ub-image');
          var url = ubImage ? ubImage : imageUrl;
          
          WebDoc.application.boardController.insertImage(url, pos);
          break;
        case 'application/ub-video':                                       
          var videoProperties = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/ub-video'));
          WebDoc.application.boardController.insertVideo(videoProperties, pos);
          break;
        case 'text/html' :
          var html = evt.originalEvent.dataTransfer.getData('text/html');
          if (html) {
            WebDoc.application.boardController.insertHtml(html, pos);
          }
      }
      WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    }
  }
});
