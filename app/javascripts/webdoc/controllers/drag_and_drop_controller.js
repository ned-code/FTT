/**
 * @author julien and Jonathan
 */

	WebDoc.DrageAndDropController = {
  //KNOWN_TYPES : ['application/wd-image', 'application/wd-widget', 'application/wd-video', 'application/x-moz-file-promise-url', 'text/html', 'application/post-message-action'],
  KNOWN_TYPES : ['application/wd-image', 'application/wd-widget', 'application/wd-video', 'application/post-message-action'],
	
	KNOWN_SOURCES: [],// All source are defined in utils/drag_source.js EX ['youtube.com', function(uri_list){alert(uri_list);}], 

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
		var receivedTypes = evt.originalEvent.dataTransfer.types;
		
    if (receivedTypes.length > 0) {
      evt.preventDefault();

			//we keep the old way to support drag from the WD library.
			
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
        case 'application/wd-widget':
          var widget = evt.originalEvent.dataTransfer.getData('application/wd-widget');
          if (widget) 
          {
            var widgetData = $.evalJSON(widget);
            WebDoc.application.boardController.insertWidget(widgetData, pos);
          }
          break;
        // case 'application/x-moz-file-promise-url':
        //   var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
        case 'application/wd-image' :
          if(imageUrl === undefined) {
            var params = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/wd-image'));
            var imageUrl = params.url;
            var id = params.id ? params.id : undefined;  
          }
          WebDoc.application.boardController.insertImage(imageUrl, pos, id);
          break;
        case 'application/wd-video':
          ddd('ub-video type');
          var videoProperties = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/wd-video'));
					ddd(videoProperties);
          WebDoc.application.boardController.insertVideo(videoProperties, pos);
          break;
        // case 'text/html':
        //   var html = evt.originalEvent.dataTransfer.getData('text/html');
        //   if (html) {
        //     WebDoc.application.boardController.insertHtml(html, pos);
        //   }
        //   break;
        case 'application/post-message-action':
          var action = evt.originalEvent.dataTransfer.getData('application/post-message-action');
          if (action) {
            WebDoc.application.postMessageManager.processMessage(action, pos);
          }
          break;
      }

			//new drop style
			
			//not in our defined type, we look if there is a type 'text/uri-list
			for(typeIndex in receivedTypes){
				if (receivedTypes[typeIndex] == 'text/uri-list'){
					//if there is one, we try to parse it 
					if(WebDoc.DrageAndDropController._parseUriList(evt.originalEvent.dataTransfer.getData('text/uri-list'), evt)){
						return true;
					}
				}
			}
			//No text/uri-list, or not parsable. we look for antoher type...
			//text/html
			for(typeIndex in receivedTypes){
				if (receivedTypes[typeIndex] == 'text/html'){
					//if there is one, we try to parse it 
					if(WebDoc.DrageAndDropController._parseHtml(evt.originalEvent.dataTransfer.getData('text/html'), evt)){
						return true;
					}
				}
			}
			
			//nothing found here !
			
      WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    }
  },
	
	addSource: function(url, parse_method){
		this.KNOWN_SOURCES.push([url,parse_method]);
	},

	_parseUriList: function(uri_list, evt) {
		ddd('[DrageAndDropController] _parseUriList');		
		var knowSources = this.KNOWN_SOURCES;
		
		//here we get the domain of the parsed element
		domain = WebDoc.UrlUtils.consolidateSrc(uri_list).split('://')[1].split('/')[0];
		//removed the www.
		if (domain.split('www.').length > 1){
			domain = domain.split('www.')[1];
		}
		
		//Now we look if it's in KNOWN_SOURCES. If yes, we call the methods associated with it
		for(knowSourceIndex in knowSources){
			if(domain == knowSources[knowSourceIndex][0]){
				knowSources[knowSourceIndex][1](uri_list,evt);
				return true
			}
		}
		
		
		//Check if image file or other (pdf etc)
		
		//We don't find the domain in KNOWN_SOURCES
		return false
	},
	
	_parseHtml: function(html,evt){
		ddd('_parseHtml');
		return false;
	}
}
