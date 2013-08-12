CKEDITOR.dialog.add( 'audio', function ( editor )
{
	var lang = editor.lang.audio;

	function commitValue( audioNode )
	{
		var value=this.getValue();

		if ( !value && this.id=='id' )
			value = generateId();
		if ( !value )
			return;
			
		audioNode.setAttribute( this.id, value);
	}

	function commitSrc( audioNode, audios )
	{
		var match = this.id.match(/(\w+)(\d)/),
			id = match[1],
			number = parseInt(match[2], 10);

		var audio = audios[number] || (audios[number]={});
		audio[id] = this.getValue();
	}

	function loadValue( audioNode )
	{
		if ( audioNode )
			this.setValue( audioNode.getAttribute( this.id ) );
		else
		{
			if ( this.id == 'id')
				this.setValue( generateId() );
		}
	}

	function loadSrc( audioNode, audios )
	{
		var match = this.id.match(/(\w+)(\d)/),
			id = match[1],
			number = parseInt(match[2], 10);

		var audio = audios[number];
		if (!audio)
			return;
		this.setValue( audio[ id ] );
	}

	function generateId()
	{
		var now = new Date();
		return 'audio' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds();
	}

	// To automatically get the dimensions of the poster image

	return {
		title : lang.dialogTitle,
		minWidth : 400,
		minHeight : 200,

		onShow : function()
		{
			// Clear previously saved elements.
			this.fakeImage = this.audioNode = null;
			
			var fakeImage = this.getSelectedElement();
			if ( fakeImage && fakeImage.getAttribute( '_cke_real_element_type' ) && fakeImage.getAttribute( '_cke_real_element_type' ) == 'audio' )
			{
				this.fakeImage = fakeImage;

				var audioNode = editor.restoreRealElement( fakeImage ),
					audios = [],
					sourceList = audioNode.getElementsByTag( 'source', '' );
				if (sourceList.count()==0)
					sourceList = audioNode.getElementsByTag( 'source', 'cke' );

				for ( var i = 0, length = sourceList.count() ; i < length ; i++ )
				{
					var item = sourceList.getItem( i );
					audios.push( {src : item.getAttribute( 'src' ), type: item.getAttribute( 'type' )} );
				}

				this.audioNode = audioNode;

				this.setupContent( audioNode, audios );
			}
			else
				this.setupContent( null, [] );
		},

		onOk : function()
		{
			// If there's no selected element create one. Otherwise, reuse it
			var audioNode = null;
			if ( !this.fakeImage )
			{
				audioNode = CKEDITOR.dom.element.createFromHtml( '<cke:audio></cke:audio>', editor.document );
				audioNode.setAttributes(
					{
						controls : 'controls'
					} );
			}
			else
			{
				audioNode = this.audioNode;
			}

			var audios = [];
			this.commitContent( audioNode, audios );

			var innerHtml = '', links = '',
				link = lang.linkTemplate || '',
				fallbackTemplate = lang.fallbackTemplate || '';
			
			for(var i=0; i<audios.length; i++)
			{
				var audio = audios[i];
				if ( !audio || !audio.src )
					continue;
				innerHtml += '<cke:source src="' + audio.src + '" type="' + audio.type + '" />';
				links += link.replace('%src%', audio.src).replace('%type%', audio.type);
			}
			audioNode.setHtml( innerHtml + fallbackTemplate.replace( '%links%', links ) );

			// Refresh the fake image.
			var newFakeImage = editor.createFakeElement( audioNode, 'cke_audio', 'audio', false );
			
			if ( this.fakeImage )
			{
				newFakeImage.replace( this.fakeImage );
				editor.getSelection().selectElement( newFakeImage );
			}
			else
				editor.insertElement( newFakeImage );
		},
		onHide : function()
		{
		
		},

		contents :
		[
			{
				id : 'info',
				elements :
				[
					{
						type : 'hbox',
						widths: [ '33%', '33%','33%'],
						children : [
							{
								id : 'autoplay',
								label : 'Autoplay',
								type : 'select',
								'default' : '',
								items :
								[
									[ editor.lang.common.notSet, '' ],
									[ 'autoplay', 'autoplay' ]
									
								],
								commit : commitValue,
								setup : loadValue
							},
							{
								id : 'loop',
								label : 'Loop',
								type : 'select',
								'default' : '',
								items :
								[
									[ editor.lang.common.notSet, '' ],
									[ 'loop', 'loop' ]
									
								],
								commit : commitValue,
								setup : loadValue
							},
							{
								id : 'preload',
								label : 'Preload',
								type : 'select',
								'default' : 'auto',
								items :
								[
									[ 'none', 'none' ],
									[ 'metadata', 'metadata' ],
									[ 'auto', 'auto' ]
								],
								commit : commitValue,
								setup : loadValue
							}]
					},
					{
						type : 'hbox',
						widths: [ '50%'],
						children : [
							{
								type : 'text',
								id : 'id',
								label : 'Id',
								commit : commitValue,
								setup : loadValue
							}]
					},
					{
						type : 'hbox',
						widths: [ '', '100px', '75px'],
						children : [
							{
								type : 'text',
								id : 'src0',
								label : lang.sourceVideo,
								commit : commitSrc,
								setup : loadSrc
							},
							{
								type : 'button',
								id : 'browse',
								hidden : 'true',
								style : 'display:inline-block;margin-top:10px;',
								filebrowser :
								{
									action : 'Browse',
									target: 'info:src0',
									url: editor.config.filebrowserVideoBrowseUrl || editor.config.filebrowserBrowseUrl
								},
								label : editor.lang.common.browseServer
							},
							{
								id : 'type0',
								label : lang.sourceType,
								type : 'select',
								'default' : 'audio/mpeg',
								items :
								[
									[ 'MPEG', 'audio/mpeg' ],
									[ 'OGG', 'audio/ogg' ]
								],
								commit : commitSrc,
								setup : loadSrc
							}]
					},

					{
						type : 'hbox',
						widths: [ '', '100px', '75px'],
						children : [
							{
								type : 'text',
								id : 'src1',
								label : lang.sourceVideo,
								commit : commitSrc,
								setup : loadSrc
							},
							{
								type : 'button',
								id : 'browse',
								hidden : 'true',
								style : 'display:inline-block;margin-top:10px;',
								filebrowser :
								{
									action : 'Browse',
									target: 'info:src1',
									url: editor.config.filebrowserVideoBrowseUrl || editor.config.filebrowserBrowseUrl
								},
								label : editor.lang.common.browseServer
							},
							{
								id : 'type1',
								label : lang.sourceType,
								type : 'select',
								'default':'audio/ogg',
								items :
								[
									[ 'MPEG', 'audio/mpeg' ],
									[ 'OGG', 'audio/ogg' ]
								],
								commit : commitSrc,
								setup : loadSrc
							}]
					}
				]
			}

		]
	};
} );