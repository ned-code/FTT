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
		id = uri_list.split('v=')[1].split('&')[0];
		var videoProperties = {
			type : 'youtube',
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
		ddd('ici');
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