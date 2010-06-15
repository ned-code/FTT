/**
 * @author julien
 */
WebDoc.DrageAndDropController = $.klass({});

$.extend(WebDoc.DrageAndDropController, {
  KNOWN_TYPES : ['application/ub-image', 'application/ub-widget', 'application/ub-video', 'application/x-moz-file-promise-url', 'text/html', 'application/post-message-action'],

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
        case 'application/x-moz-file-promise-url':
          var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
        case 'application/ub-image' :
          if(imageUrl === undefined) {
            var params = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/ub-image'));
            var imageUrl = params.url;
            var id = params.id ? params.id : undefined;  
          }
          var parent = jQuery(evt.target).parent();
          if(parent && parent.data('itemView') && parent.data('itemView').item.data.media_type === WebDoc.ITEM_TYPE_IMAGE && parent.data('itemView').item.getIsPlaceholder()){
            var itemView = parent.data('itemView');
            itemView.item.data.data.src = imageUrl;
            itemView.item.preLoadImageWithCallback(function(event){
              itemView.item.setRatio(itemView.item.calcRatio(event));
              itemView.item.save(function() {
                itemView.item.fireDomNodeChanged();
                itemView.item.fireObjectChanged({ modifedAttribute: 'zoom' });
              });
            });
          }  
          else {
            WebDoc.application.boardController.insertImage(imageUrl, pos, id);
          }
          break;
        case 'application/ub-video':                                       
          var videoProperties = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/ub-video'));
          WebDoc.application.boardController.insertVideo(videoProperties, pos);
          break;
        case 'text/html':
          var html = evt.originalEvent.dataTransfer.getData('text/html');
          if (html) {
            WebDoc.application.boardController.insertHtml(html, pos);
          }
          break;
        case 'application/post-message-action':
          var action = evt.originalEvent.dataTransfer.getData('application/post-message-action');
          if (action) {
            WebDoc.application.postMessageManager.processMessage(action, pos);
          }
          break;
      }
      WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    }
  }
});
