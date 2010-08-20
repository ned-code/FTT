/* 
Creator: J. Biolaz
Drag source defined all source that can be drop into webdoc

A source is added with: his domain name (without www.)
                        a function that implement how to manage that source
  
*/
var videoPlayerSources = {
  'youtube':{
    'urlPart':'youtube.com'
  },  
  'myspace':{
    'urlPart':'vids.myspace.com'
  },  
  'metacafe':{
    'urlPart':'metacafe.com', 
  },
  'vimeo':{
    'urlPart':'vimeo.com'
  },
  'break':{
    'urlPart':'break.com'
  },   
  'veoh':{
    'urlPart':'veoh.com'   
  },     
  'fancast':{
    'urlPart':'fancast.com'  
  },      
  'liveleak':{
    'urlPart':'liveleak.com'
  },   
  'viddler':{
    'urlPart':'viddler.com'
  },   
  'blip':{
    'urlPart':'blip.tv' 
  },
  'crackle':{
    'urlPart':'crackle.com'
  },    
  'ustream':{
    'urlPart':'ustream.tv' 
  },
  'revver':{
    'urlPart':'revver.com'
  },    
  'traileraddict':{
    'urlPart':'traileraddict.com'  
  },  
  'dailymotion':{
    'urlPart':'dailymotion.com'  
  },
  'google':{
    'urlPart':'video.google.com'  
  },
  'huhu':{
    'urlPart':'hulu.com'  
  },
  'megavideo':{
    'urlPart':'megavideo.com'  
  },
  'yahoo':{
    'urlPart':'video.yahoo.com'  
  },
  'joost':{
    'urlPart':'joost.com'  
  }
}

for(var source in videoPlayerSources){
  WebDoc.DrageAndDropController.addUriSource(
  	videoPlayerSources[source].urlPart,
  	function(uri_list,evt){
  		var videoProperties = {
  			type : 'video',
  			video_id : uri_list
  		};
  
  		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
  		WebDoc.application.boardController.insertVideo(videoProperties, pos);
  	}
  );  
}  

//Here you add the file type source (ex: png, jpg, jpeg etc)

WebDoc.DrageAndDropController.addFileTypeSource(
  '.flv',
  	function(uri_list,evt){
		var videoProperties = {
			type : 'video',
			video_id : uri_list
		};

		var pos = WebDoc.application.boardController.mapToPageCoordinate(evt);
		WebDoc.application.boardController.insertVideo(videoProperties, pos);
	}
);


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
    WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
  }
);

WebDoc.DrageAndDropController.addFileTypeSource(
  '.php',
  function(uri_list,evt){
    ddd('php processor');
    WebDoc.application.boardController.unselectAll();
    WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
  }
);

WebDoc.DrageAndDropController.addFileTypeSource(
  '.php3',
  function(uri_list,evt){
    WebDoc.application.boardController.unselectAll();
    WebDoc.DrageAndDropController.buildItemForIframe(uri_list,evt);
  }
);