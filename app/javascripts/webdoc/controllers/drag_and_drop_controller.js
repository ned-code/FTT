/**
 * @author julien and Jonathan
 */

	WebDoc.DrageAndDropController = {
  KNOWN_TYPES : ['application/wd-image', 'application/wd-widget', 'application/wd-video', 'application/post-message-action', 'application/x-moz-file-promise-url'],
	KNOWN_SOURCES: [],// All source are defined in utils/drag_source.js EX ['youtube.com', function(uri_list){alert(uri_list);}], 
	KNOWN_FILE_TYPES: [], //All file type recognised by WD EX: jpg, .jpeg. Defined in utils/drag_source.js
	
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
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
          break;
        case 'application/wd-image' :
          if(imageUrl === undefined) {
            var params = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/wd-image'));
            var imageUrl = params.url;
            var id = params.id ? params.id : undefined;  
          }
          var parent = jQuery(evt.target).parent();
          if(parent && parent.data('itemView') && parent.data('itemView').item.data.media_type === WebDoc.ITEM_TYPE_IMAGE && parent.data('itemView').item.getIsPlaceholder()){
            var item = parent.data('itemView').item;
            item.replacePlaceholder(WebDoc.ITEM_TYPE_IMAGE, {imageUrl: imageUrl});
          }  
          else {
            WebDoc.application.boardController.insertImage(imageUrl, pos, id);
          }
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
          break;
        case 'application/wd-video':
          var videoProperties = $.evalJSON(evt.originalEvent.dataTransfer.getData('application/wd-video'));
          WebDoc.application.boardController.insertVideo(videoProperties, pos);
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
          break;
        case 'application/post-message-action':
          var action = evt.originalEvent.dataTransfer.getData('application/post-message-action');
          if (action) {
            WebDoc.application.postMessageManager.processMessage(action, pos);
          }
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
          break;
      }

			//new drop style
			
			//not in our defined type, we look if there is a type 'text/uri-list
			for(typeIndex in receivedTypes){
				if (receivedTypes[typeIndex] == 'text/uri-list'){
					//if there is one, we try to parse it 
					if(WebDoc.DrageAndDropController._parseUriList(evt.originalEvent.dataTransfer.getData('text/uri-list'), evt)){
						WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
						return true;
					}
				}
			}
			
			//Works only for FireFox
			for(typeIndex in receivedTypes){
				if (receivedTypes[typeIndex] == 'application/x-moz-file-promise-url'){
					//if there is one, we try to parse it 
					var imageUrl = evt.originalEvent.dataTransfer.getData('application/x-moz-file-promise-url');
					var id = undefined;
					
					WebDoc.application.boardController.insertImage(imageUrl, pos, id);
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
				}
			}
						
			//No text/uri-list, or not parsable. we look for antoher type...
			//text/html
			// for(typeIndex in receivedTypes){
			// 	if (receivedTypes[typeIndex] == 'text/html'){
			// 		//if there is one, we try to parse it 
			// 		if(WebDoc.DrageAndDropController._parseHtml(evt.originalEvent.dataTransfer.getData('text/html'), evt)){
			// 			return true;
			// 		}
			// 	}
			// }
			
			//nothing found here, we display the url received (if there is one) in an iframe !
			
			for(typeIndex in receivedTypes){
				if (receivedTypes[typeIndex] == 'text/uri-list'){
					WebDoc.application.boardController.unselectAll();
					WebDoc.DrageAndDropController.buildItemForIframe(evt.originalEvent.dataTransfer.getData('text/uri-list'),evt);
					WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
					return true;
				}
			}
			
      WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    }
  },
	
	addUriSource: function(uri, parse_method){
		this.KNOWN_SOURCES.push([uri,parse_method]);
	},

	addFileTypeSource: function(extension, parse_method){
		this.KNOWN_FILE_TYPES.push([extension, parse_method]);
	},
	
	buildItemForIframe: function(uri_list,event){
		//transform as input to validate
		//<input type="url" title="Web page address" name="input-iframe-src" data-type="webdoc_iframe_url">
		var src = $("<input type='url' name='input-iframe-src' data-type='webdoc_iframe_url' value='"+ uri_list +"'>");
		src.validate({
      pass: function( value ){
				var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
				var pos = WebDoc.application.boardController.mapToPageCoordinate(event);
				var posX = pos.x +'px';
				var posY = pos.y +'px';

		    newItem.data.media_type = WebDoc.ITEM_TYPE_IFRAME;
		    newItem.data.data.src = uri_list;
				newItem.data.data.css = { top: posY, left: posX, width: "600px", height: "400px", overflow: "auto"};
		    newItem.data.data.tag = "iframe";
				WebDoc.application.boardController.insertItems([newItem]);
      },
      fail: function( value, error ){
        ddd(error);
      }
    });
	},
	
	_parseUriList: function(uri_list, evt) {
		ddd('[DrageAndDropController] _parseUriList');		
		var knowSources = this.KNOWN_SOURCES;
		var knowFileType = this.KNOWN_FILE_TYPES;
		
		//here we get the domain of the parsed element
		domain = WebDoc.UrlUtils.consolidateSrc(uri_list).split('://')[1].split('/')[0].split('?')[0];
		
		//removed the www.
		if (domain.split('www.').length > 1){
			domain = domain.split('www.')[1];
		}
		
		//here we get the url parameter domain of the parsed element (like http://www.example.com?url=http://www.example2.com)
		if(WebDoc.UrlUtils.consolidateSrc(uri_list).split('://').length > 2){
		  var urlParameterDomain = WebDoc.UrlUtils.consolidateSrc(uri_list).split('://')[2].split('/')[0].split('?')[0];
		  //removed the www for urlParameterDomain.
		  if (urlParameterDomain.split('www.').length > 1){
		      urlParameterDomain = urlParameterDomain.split('www.')[1];
		  }        
		}
		
		//FACEBOOK HACK to drop photo, we should normaly add a KNOWN_SOURCES
		// and use the FB API !!!
		if(uri_list.match('facebook.com')){
			//we return false. It should normaly use the x-moz-file-promise-url to drop the photo
			return false;
		}
		
		//Google image hack
		//if it's a google image search, we do the same hack as Facebook
		if(uri_list.match('google')){
			if(uri_list.match('images')){
				//we return false. It should normaly use the x-moz-file-promise-url to drop the photo
				return false;
			}
		}
		
		//Now we look if it's in KNOWN_SOURCES. If yes, we call the methods associated with it
		for(knowSourceIndex in knowSources){
			if(domain == knowSources[knowSourceIndex][0]){
				knowSources[knowSourceIndex][1](uri_list,evt);
				return true
			}
		}
		
		for(knowSourceIndex in knowSources){
			if((urlParameterDomain && urlParameterDomain == knowSources[knowSourceIndex][0])){
				uri_list = 'http://'+WebDoc.UrlUtils.consolidateSrc(uri_list).split('http://')[2]
		    knowSources[knowSourceIndex][1](uri_list,evt);
		    return true
		   }
		}
		
		//src.match(pattern_has_protocole)
		for(knowFileTypeIndex in knowFileType){
			var reg = new RegExp('(' + knowFileType[knowFileTypeIndex][0] + ')');
			if(uri_list.match(knowFileType[knowFileTypeIndex][0])){
				knowFileType[knowFileTypeIndex][1](uri_list,evt);
				return true;
			}
		}
		
		//uri-list not in KNOWN_SOURCES. We try to look if it's in KNOW_FILE_TYPES to display this file
		
		//We don't find the domain in KNOWN_SOURCES or KNOW_FILE_TYPES. We do nothing here
		return false
	},
	
	//Not yet implemented
	_parseHtml: function(html,evt){
		return false;
	}
};
