 // Handles image drag and drop from OS
 
(function()
 {
	if (typeof atob == 'undefined') 
	{
		function atob(str) {
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			var invalid = {
				strlen: (str.length % 4 != 0),
				chars:  new RegExp('[^' + chars + ']').test(str),
				equals: (/=/.test(str) && (/=[^=]/.test(str) || /={3}/.test(str)))
			};
			if (invalid.strlen || invalid.chars || invalid.equals)
				throw new Error('Invalid base64 data');
			var decoded = [];
			var c = 0;
			while (c < str.length) {
				var i0 = chars.indexOf(str.charAt(c++));
				var i1 = chars.indexOf(str.charAt(c++));
				var i2 = chars.indexOf(str.charAt(c++));
				var i3 = chars.indexOf(str.charAt(c++));
				var buf = (i0 << 18) + (i1 << 12) + ((i2 & 63) << 6) + (i3 & 63);
				var b0 = (buf & (255 << 16)) >> 16;
				var b1 = (i2 == 64) ? -1 : (buf & (255 << 8)) >> 8;
				var b2 = (i3 == 64) ? -1 : (buf & 255);
				decoded[decoded.length] = String.fromCharCode(b0);
				if (b1 >= 0) decoded[decoded.length] = String.fromCharCode(b1);
				if (b2 >= 0) decoded[decoded.length] = String.fromCharCode(b2);
			}
			return decoded.join('');
		}
	}
  
	if(!XMLHttpRequest.prototype.sendAsBinary){
	  XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		function byteValue(x) {
		  return x.charCodeAt(0) & 0xff;
		}
		var ords = Array.prototype.map.call(datastr, byteValue);
		var ui8a = new Uint8Array(ords);
		this.send(ui8a.buffer);
	  }
	}
  
	CKEDITOR.plugins.add( 'imagedragndrop',
	{

		init : function( editor )
		{
			
			var EnableImageDragndrop = editor.config.EnableImageDragndrop;
	
			var onDrop = function(ev)
			{
				
				if(!EnableImageDragndrop)
					return;
				
				var domEvent = ev.data;
				
				var data = domEvent.$.dataTransfer;
			
				if(!data) return;
					
				if(!data.files || !data.files.length) return;
				
				domEvent.preventDefault(true);
				var data = domEvent.$.dataTransfer;
					
							
				var file = data.files[0];
				
			
				if(!file && !file.filename) return;
				
				var id = CKEDITOR.tools.getNextId();
				var img = editor.document.createElement( 'img' );
			
				img.setAttributes( {
										'id' :id,
										'alt' : ''
									});
				
				editor.getCommand('source').disable();
				
				var fileUploadUrl = editor.config.filebrowserImageUploadUrl || 
					editor.plugins.jfilebrowser._commandUrl(editor, 'QuickUpload', {
										type: 'Images'
									}); 

				var url = fileUploadUrl + '&client=' + editor.config.client + '&CKEditor=' + editor.name + '&CKEditorFuncNum=2&langCode=' + editor.langCode;
			   
			    if(window.FileReader)
				{
					var reader = new FileReader();
					
					reader.onload = function(evt) 
					{
						img.setAttribute('src',evt.target.result);
						editor.insertElement(img);
						
						var xhr = new XMLHttpRequest();

						xhr.open("POST", url);
						xhr.onload = function() {
							// Upon finish, get the url and update the file
							var imageUrl = this.responseText.match(/(0|2|201),\s*'(.*?)',/)[2];
							var theImage = editor.document.getById( id );
							if(theImage)
							{
								theImage.setAttribute( '_cke_saved_src', imageUrl);
								theImage.setAttribute( 'src', imageUrl);
								theImage.removeAttribute( 'id' );
							}
							editor.getCommand('source').enable();
						}

						// Create the multipart data upload. Is it possible somehow to use FormData instead?
						var BOUNDARY = "---------------------------1966284435497298061834782736";
						var rn = "\r\n";
						var req = "--" + BOUNDARY;

							req += rn + "Content-Disposition: form-data; name=\"upload\"";
							var dataUrl = img.$.src.replace(/data:image\/(png|jpeg|gif);base64,/,'');
							var bin = window.atob(dataUrl);
						
							// add timestamp?
							req += "; filename=\"" + file.name + "\"" + rn + "Content-type: " + file.type;

							req += rn + rn + bin + rn + "--" + BOUNDARY;

						req += "--";
		
						xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);
						xhr.sendAsBinary(req);
						
						delete img;
						  
					}
					reader.readAsDataURL(file);
				}
				else if(window.FormData) //use this method for Safari < 6
				{
					
					var form = new FormData();
					var xhr = new XMLHttpRequest();
					
					editor.insertElement(img);
						
					xhr.abort();
					xhr.open("POST", url);
					xhr.setRequestHeader("Cache-Control", "no-cache");
					xhr.onload = function() 
					{
						// Upon finish, get the url and update the file
													
						var match = this.responseText.match(/(0|2|201),\s*'(.*?)',/);
						if(match)
						{
							var imageUrl = match[2];
							var theImage = editor.document.getById( id );
							if(theImage)
							{
								theImage.setAttribute( '_cke_saved_src', imageUrl);
								theImage.setAttribute( 'src', imageUrl);
								theImage.removeAttribute( 'id' );
							}
							editor.getCommand('source').enable();
						}
						else //Sometimes Safari fails to upload image correctly so lets try again one more time
						{
							var form = new FormData();
							var xhr = new XMLHttpRequest();
				
							xhr.abort();
							xhr.open("POST", url);
							xhr.setRequestHeader("Cache-Control", "no-cache");
							xhr.onload = function() 
							{
								// Upon finish, get the url and update the file
								var match = this.responseText.match(/(0|2|201),\s*'(.*?)',/),
								theImage = editor.document.getById( id );
								if(theImage)
								{
								
									if(match)
									{
										var imageUrl = match[2];
										theImage.setAttribute( '_cke_saved_src', imageUrl);
										theImage.setAttribute( 'src', imageUrl);
										theImage.removeAttribute( 'id' );
									}
									else //delete image
									{
										theImage.remove();
									}
								}
								editor.getCommand('source').enable();
							}
							CKEDITOR.tools.setTimeout(function()
							{
								form.append('upload',file);
								xhr.send(form);
							},50);			
						}		
					}
					form.append('upload',file);
					xhr.send(form);  
				}
		
			}
				
				
			var cancelDragEvent	= function (ev) 
			{
				var domEvent = ev.data;
	
				domEvent.preventDefault(true);
				if(domEvent.$.dataTransfer)
					domEvent.$.dataTransfer.dropEffect = 'copy';
				return false;
            }

			
			editor.on( 'contentDom', function()
				{
					
					// Firefox OK
					editor.document.on( 'ondragenter', cancelDragEvent);
					editor.document.on( 'dragover', cancelDragEvent);
					editor.document.on( 'drop', onDrop);
					// IE OK
			
					if(CKEDITOR.env.ie)	
					{
						editor.document.getBody().on( 'ondragenter', cancelDragEvent);
						editor.document.getBody().on( 'dragover', cancelDragEvent);
						editor.document.getBody().on( 'drop', onDrop);
					}	
				});
		}
		
	});	
})();