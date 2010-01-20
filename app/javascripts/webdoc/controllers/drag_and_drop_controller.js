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
      var newItem;
      switch (availableType) {
        case 'application/ub-widget':

          var widget = evt.originalEvent.dataTransfer.getData('application/ub-widget');

          if (widget) 
          {
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
            newItem.data.data.properties = {
              inspector_url: widgetData.properties.inspector_url
            };
            newItem.data.data.css = {
              top: pos.y + "px",
              left: pos.x + "px",
              width: width + "px",
              height: height + "px"
            };
            newItem.recomputeInternalSizeAndPosition();
            WebDoc.application.boardController.insertItems([newItem]);
          }
          break;
        case 'application/x-moz-file-promise-url' :
          var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
        case 'application/ub-image' :   
          var ubImage = evt.originalEvent.dataTransfer.getData('application/ub-image');
          var url = ubImage ? ubImage : imageUrl;
          
          var image = document.createElement('img'); /* Preload image in order to have width and height parameters available */
          $(image).bind("load", pos, WebDoc.DrageAndDropController.createImageItem); /* WebDoc.Item creation will occur after image load*/
          image.src = url;
          break;
        case 'application/ub-video':                                       
          var ubVideo = evt.originalEvent.dataTransfer.getData('application/ub-video');
          var videoData = $.evalJSON(ubVideo);
          var videoWidget;
          switch (videoData.properties.type) {
            case 'youtube' :
              videoWidget = WebDoc.application.widgetManager.getYoutubeWidget();
              break;
            case 'vimeo' :
              videoWidget = WebDoc.application.widgetManager.getVimeoWidget();
              break;
          }
          newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
          if (widgetData.properties.width) {
            width = videoWidget.data.properties.width;
            height = videoWidget.data.properties.height;
          }
          newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
          newItem.data.media_id = videoWidget.data.id;
          newItem.data.data.tag = "iframe";
          newItem.data.data.src = videoWidget.data.properties.index_url;
          newItem.data.data.properties = {
            inspector_url: videoWidget.data.properties.inspector_url
          };
          newItem.data.data.css = {
            top: pos.y + "px",
            left: pos.x + "px",
            width: width + "px",
            height: height + "px"
          };
          newItem.data.preferences.url = videoData.properties.video_id;
          newItem.recomputeInternalSizeAndPosition();
          WebDoc.application.boardController.insertItems([newItem]);            
          break;
        case 'text/html' :
          var html = evt.originalEvent.dataTransfer.getData('text/html');

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
    }
  },
  
  createImageItem: function(e) {
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_IMAGE;
    newItem.data.data.tag = "img";
    newItem.data.data.src = this.src;
    newItem.data.data.css = {
      overflow: "hidden",
      top: e.data.y + "px",
      left: e.data.x + "px",
      width: this.width + "px",
      height: this.height + "px"
    };
    WebDoc.application.boardController.insertItems([newItem]);
  }
});
