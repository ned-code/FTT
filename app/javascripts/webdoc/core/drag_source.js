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
		ddd('html processor');
		WebDoc.application.boardController.unselectAll();
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_IFRAME;
    newItem.data.data.src = uri_list;
    newItem.data.data.css = { top: "100px", left: "100px", width: "600px", height: "400px", overflow: "auto"};
    newItem.data.data.tag = "iframe";
    WebDoc.application.boardController.insertItems([newItem]);
	}
);