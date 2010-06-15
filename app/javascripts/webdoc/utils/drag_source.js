/* 
Creator: J. Biolaz
Drag source defined all source that can be drop into webdoc

A source is added with: his domain name (without www.)
												a function that implement how to manage that source
	
*/

//Example with Vimeo. It works well !!
WebDoc.DrageAndDropController.addSource(
	'vimeo.com',
	function(uri_list,evt){
		ddd('vimeo processing called');
		id = uri_list.split('/')[3];
		
		var videoProperties = {
			type : 'vimeo',
			video_id : id
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);



WebDoc.DrageAndDropController.addSource(
	'youtube.com',
	function(uri_list,evt){
		ddd('youtube processing called');
		
		//here you parse the uri list to obtain the video id
		
		var videoProperties = {
			type : 'youtube',
			video_id : "Om4eqmF1hlM"
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);

