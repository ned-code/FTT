/* 
Creator: J. Biolaz
Drag source defined all source that can be drop into webdoc

A source is added with: his domain name (without www.)
												a function that implement how to manage that source
	
*/

//Example with Vimeo. It works well !!
WebDoc.DrageAndDropController.addUriSource(
	'vimeo.com',
	function(uri_list,evt){
		id = uri_list.split('/')[3];
		var videoProperties = {
			type : 'vimeo',
			video_id : id
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

WebDoc.DrageAndDropController.addUriSource(
	'youtube.com',
	function(uri_list,evt){ 
    var id = '';
    if(uri_list.indexOf('v=') !== -1){
      id = uri_list.split('v=')[1].split('&')[0];
    } else if(uri_list.indexOf('video_ids=') !== -1){
      var ids = uri_list.split('video_ids=')[1].split('%2C');
      var index = (uri_list.indexOf('index=') !== -1) ? uri_list.split('index=')[1].split('&')[0] : 0;
      id = ids[index].split('&')[0];
    } else {
      id = uri_list;
    }                                                                                                    
		var videoProperties = {
			type : 'youtube',
			video_id : id
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

WebDoc.DrageAndDropController.addUriSource(
	'dailymotion.com',
	function(uri_list,evt){
    if(uri_list.indexOf('request=') !== -1){
      id = uri_list.split('request=%2F')[1].split('video%2F')[1].split('_')[0];
    } else {
      id = uri_list.substr(uri_list.lastIndexOf("/") + 1, uri_list.length).split('_')[0];
    }       
		var videoProperties = {
			type : 'dailymotion',
			video_id : id
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

WebDoc.DrageAndDropController.addUriSource(
	'vids.myspace.com',
	function(uri_list,evt){
    if(uri_list.indexOf('videoid=') !== -1){
      id = uri_list.split('videoid=')[1].split('&')[0];
    } else {
      id = uri_list;
    }
		var videoProperties = {
			type : 'myspacevideo',
			video_id : id
		};
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

WebDoc.DrageAndDropController.addUriSource(
	'metacafe.com',
	function(uri_list,evt){
    if(uri_list.indexOf('watch/') !== -1){
      id = uri_list.split('watch/')[1].split('/')[0];
    } else {
      id = uri_list;
    }
		var videoProperties = {
			type : 'metacafe',
			video_id : id
		};
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

WebDoc.DrageAndDropController.addUriSource(
	'video.google.com',
	function(uri_list,evt){
    if(uri_list.indexOf('docid=') !== -1){
      id = uri_list.split('docid=')[1].split('&')[0];
    } else {
      id = $.trim(uri_list);
    } 
		var videoProperties = {
			type : 'googlevideo',
			video_id : id
		};
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

//Here you add the file type source (ex: png, jpg, jpeg etc)

WebDoc.DrageAndDropController.addFileTypeSource(
	'.jpg',
	function(uri_list,evt){
		id = undefined;
		imageUrl = uri_list;
		
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertImage(imageUrl, pos, id);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.jpeg',
	function(uri_list,evt){
		id = undefined;
		imageUrl = uri_list;
		
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertImage(imageUrl, pos, id);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.png',
	function(uri_list,evt){
		id = undefined;
		imageUrl = uri_list;
		
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertImage(imageUrl, pos, id);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.gif',
	function(uri_list,evt){
		id = undefined;
		imageUrl = uri_list;
		
		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertImage(imageUrl, pos, id);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.html',
	function(uri_list,evt){
		WebDoc.application.boardController.unselectAll();
		var newItem = WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
    WebDoc.application.boardController.insertItems([newItem]);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.php',
	function(uri_list,evt){
		ddd('php processor');
		WebDoc.application.boardController.unselectAll();
    var newItem = WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
    WebDoc.application.boardController.insertItems([newItem]);
	}
);

WebDoc.DrageAndDropController.addFileTypeSource(
	'.php3',
	function(uri_list,evt){
		WebDoc.application.boardController.unselectAll();
    var newItem = WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
    WebDoc.application.boardController.insertItems([newItem]);
	}
);