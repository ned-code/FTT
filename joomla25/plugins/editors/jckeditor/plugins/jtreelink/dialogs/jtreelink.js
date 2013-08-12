/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add('jtreelink',function(editor)
{

    var urlRegex = /^(index.php.*)/,
		targetRegex = /^(_(?:self|top|parent|blank))$/,
		urlMatch = '',
		notSetTargetValue = 'notSet';

		
	var pluginPath = editor.plugins.jtreelink.path; 
		
	var baseHref = editor.config.baseHref;
	
	
	var targetChanged = function()
	{
		var dialog = this.getDialog(),
			popupFeatures = dialog.getContentElement( 'target', 'popupFeatures' ),
			targetName = dialog.getContentElement( 'target', 'linkTargetName' ),
			modaltext = dialog.getContentElement( 'target', 'relModaltext' ),
			value = this.getValue(),
			JoomlaModelFeatures = dialog.getContentElement( 'target', 'JoomlaModelFeatures' ),
			useJoomlaTemplateBox = dialog.getContentElement( 'target', 'useJoomlaTemplateBox' );

		if ( !popupFeatures || !targetName)
			return;

		popupFeatures = popupFeatures.getElement();
		popupFeatures.hide();
		targetName.setValue(value);
		
		switch ( value )
 		{
			case 'frame' :
				targetName.setLabel( editor.lang.jtreelink.targetFrameName );
				targetName.getElement().show();
				modaltext.getElement().show();
				JoomlaModelFeatures.getElement().show();
				useJoomlaTemplateBox.getElement().show();
				break;
			case 'popup' :
				JoomlaModelFeatures.getElement().hide();
				popupFeatures.show();
				targetName.setLabel( editor.lang.jtreelink.targetPopupName );
				targetName.getElement().show();
				modaltext.getElement().hide();
				useJoomlaTemplateBox.getElement().hide();
				break;
			default :
				targetName.setValue( value );
				targetName.getElement().hide();
				modaltext.getElement().hide();
				JoomlaModelFeatures.getElement().hide();
				useJoomlaTemplateBox.getElement().hide();
				break;
 		}

	};
	
	var popupRegex =
		/\s*window.open\(\s*this\.href\s*,\s*(?:'([^']*)'|null)\s*,\s*'([^']*)'\s*\)\s*;\s*return\s*false;*\s*/;
	var popupFeaturesRegex = /(?:^|,)([^=]+)=(\d+|yes|no)/gi;	
	
	var relModalRegex = /\{handler:\s*'iframe'\s*,\s*size:\s*\{x:\s*(\d+?)\s*,\s*y:\s*(\d+?)\}\}/i;	
	var parseLink = function (editor, element) 
	{
	
		var href = ( element  && ( element.getAttribute( '_cke_saved_href' ) || element.getAttribute( 'href' ) ) ) || '',
			doc = editor.document,
			retval = {};	
	
		if (  href && ( urlMatch = href.match( urlRegex ) ) )
		{
			document.ckadminForm.url.value = urlMatch[1].replace('&tmpl=component','');
		}
		
		if(element)
		{
			
			var target = element.getAttribute( 'target' );
			retval.target = {};
			retval.adv = {};
			
			// IE BUG: target attribute is an empty string instead of null in IE if it's not set.
			if ( !target )
			{
				var onclick = element.getAttribute( '_cke_pa_onclick' ) || element.getAttribute( 'onclick' ),
					onclickMatch = onclick && onclick.match( popupRegex );
				if ( onclickMatch )
				{
					retval.target.type = 'popup';
					retval.target.name = onclickMatch[1];

					var featureMatch;
					while ( ( featureMatch = popupFeaturesRegex.exec( onclickMatch[2] ) ) )
					{
						if ( featureMatch[2] == 'yes' || featureMatch[2] == '1' )
							retval.target[ featureMatch[1] ] = true;
						else if ( isFinite( featureMatch[2] ) )
							retval.target[ featureMatch[1] ] = featureMatch[2];
					}
				}
			}
			else
			{
				var targetMatch = target.match( targetRegex );
				if ( targetMatch )
					retval.target.type = retval.target.name = target;
				else
				{
					retval.target.type = 'frame';
					retval.target.name = target;
				}
			}

			
			var rel = element.getAttribute( 'rel' );
			retval.target.rel ={};
			retval.target.modalchecked = true;
			
		
			if(retval.target.type == 'frame')
				retval.target.modalchecked = false;
				
			console.log(element.$.href);
			console.log(element.$.href.indexOf('&tmpl=component'));
				
			if(element.$.href.indexOf('&tmpl=component') != -1)
					retval.target.useJoomlaTemplate = false;
			else
					retval.target.useJoomlaTemplate = true;

		
			if(rel)
			{
				var classNames = element.getAttribute( 'class' );
				var modalClassMatch = classNames && classNames.match( /(?:^|\s)([\w\d]*)$/);
				if(	modalClassMatch)										  
					retval.target.rel.classname = modalClassMatch[1];
					
						
				var relModalMatch = rel.match( relModalRegex );
				
				if(relModalMatch)
				{
					if ( relModalMatch[1])
						retval.target.rel.width = relModalMatch[1];
					
					if ( relModalMatch[2])
						retval.target.rel.height = relModalMatch[2];
					
				    retval.target.modalchecked = true;
				}
				else
					retval.target.modalchecked = false;
					
				retval.target.type = 'frame';	
				
			}

			var me = this;
			
				
			
			var advAttr = function( inputName, attrName )
			{
				var value = element.getAttribute( attrName );
				if ( value !== null )
					retval.adv[ inputName ] = value || '';
			};
			advAttr( 'advId', 'id' );
			advAttr( 'advLangDir', 'dir' );
			advAttr( 'advAccessKey', 'accessKey' );
			advAttr( 'advName', 'name' );
			advAttr( 'advLangCode', 'lang' );
			advAttr( 'advTabIndex', 'tabindex' );
			advAttr( 'advTitle', 'title' );
			advAttr( 'advContentType', 'type' );
			advAttr( 'advCSSClasses', 'class' );
			advAttr( 'advCharset', 'charset' );
			advAttr( 'advStyles', 'style' );
	
		
			//document.ckadminForm.url.value = element.getAttribute('href');
			document.ckadminForm.text.value = element.getText();
			document.ckadminForm.title.value = element.getAttribute('title'); 
		}
		
		this._.selectedElement = element;
		
		return retval;
		
	};	
	
	var setupParams = function( page, data )
	{
		if ( data[page] )
			this.setValue( data[page][this.id] || '' );
	};

	var setupPopupParams = function( data )
	{
		return setupParams.call( this, 'target', data );
	};

	var setupAdvParams = function( data )
	{
		return setupParams.call( this, 'adv', data );
	};

	var commitParams = function( page, data )
	{
		if ( !data[page] )
			data[page] = {};

		data[page][this.id] = this.getValue() || '';
	};

	var commitPopupParams = function( data )
	{
		return commitParams.call( this, 'target', data );
	};

	var commitAdvParams = function( data )
	{
		return commitParams.call( this, 'adv', data );
	};
	
	
	var commonLang = editor.lang.common,
		linkLang = editor.lang.jtreelink;
	
	return {
		title:'',
        minWidth: 590,
        minHeight: 330,
        contents: 
		[
		 	{
				id: 'info',
				label: linkLang.info,
				title: linkLang.info,
				padding: 0,
				elements: 
				[
					{
						type : 'text',
						id : 'placer',
						style : 'display:none;'
					},
					
					{
						type:	'html',
						html:	'<div id="jtree-content_tree" style="height:260px;width:590px;overflow:auto;border:1px solid #CCC;"></div>' +
								'<div id="jtree-linkinfo-tree" style="margin-top:3px;border:1px solid #CCC;padding:3px">'+
								'<form name="ckadminForm" action="#" onSubmit="return false;">' +
								 '<table style="height:40px;width:100%;">' +
								  ' <tr>' +
									  '<td>Text</td>' +
									  '<td><input type="text" name="text" id="ctext" value="" size="30" style="border:1px solid #CCC;" /></td>' +
								 	  '<td>Title</td>' +
									  '<td><input type="text" name="title" id="ctitle"  value="" size="30" style="border:1px solid #CCC;"/></td>' +
								   '</tr>' +
                                    '<tr>' +
									   '<td>URL</td>' +
									   '<td colspan="3"><input type="text" name="url" id="url"  value="" size="30" style="border:1px solid #CCC;"/></td>' +
							 	  '</tr>' +
							    '</table>' +
								'</form>' +
								'</div>' 
					}
				]
        	},
			{
				id : 'target',
				label : linkLang.target,
				title : linkLang.target,
				elements :
				[
					{
						type : 'hbox',
						widths : [ '50%', '50%' ],
						children :
						[
							{
								type : 'select',
								id : 'linkTargetType',
								label : commonLang.target,
								'default' : 'notSet',
								style : 'width : 100%;',
								'items' :
								[
									[ commonLang.notSet, 'notSet' ],
									[ linkLang.targetFrame, 'frame' ],
									[ linkLang.targetPopup, 'popup' ],
									[ commonLang.targetNew, '_blank' ],
									[ commonLang.targetTop, '_top' ],
									[ commonLang.targetSelf, '_self' ],
									[ commonLang.targetParent, '_parent' ]
								],
								onChange : targetChanged,
								setup : function( data )
								{
									
									if ( data.target )
										this.setValue( data.target.type );
									targetChanged.call( this );
									
								},
								commit : function( data )
								{
									if ( !data.target )
										data.target = {};

									data.target.type = this.getValue();
								}
							},
							{
								type : 'text',
								id : 'linkTargetName',
								label : linkLang.targetFrameName,
								'default' : '',
								setup : function( data )
								{
									if ( data.target )
										this.setValue( data.target.name );
								},
								commit : function( data )
								{
									if ( !data.target )
										data.target = {};

									data.target.name = this.getValue().replace(/\W/gi, '');
								}
							}
						]
					},
					{
						type : 'hbox',
						widths : [ '25%','25%','25%','25%' ],
						id : 'JoomlaModelFeatures',
						height: '40',
						children :
						[
									
							{
								type : 'checkbox',
								id : 'modelcheckbox',
								label : 'Use Joomla Modal',
								'default' : 'checked',
								onClick : function() {
								
									var dialog = this.getDialog();
									
									var heightbox = dialog.getContentElement( 'target', 'relHeight' ),
										widthbox = dialog.getContentElement( 'target', 'relWidth' ),
										classbox = dialog.getContentElement( 'target', 'relClass' ),
										modaltext = dialog.getContentElement( 'target', 'relModaltext' ),
										useJoomlaTemplateBox = dialog.getContentElement( 'target', 'useJoomlaTemplateBox' );
		
									if(this.getValue())
									{
										heightbox.getElement().show();
										widthbox.getElement().show();
										classbox.getElement().show();
										modaltext.getElement().show();
										useJoomlaTemplateBox.getElement().show();
									}
									else
									{
										heightbox.getElement().hide();
										widthbox.getElement().hide();
										classbox.getElement().hide();
										modaltext.getElement().hide();
										useJoomlaTemplateBox.getElement().hide();
									}
													
								},
								setup : function( data )
								{
									if ( data.target )
									{
										var dialog = this.getDialog();
										var heightbox = dialog.getContentElement( 'target', 'relHeight' ),
											widthbox = dialog.getContentElement( 'target', 'relWidth' ),
											classbox = dialog.getContentElement( 'target', 'relClass' ),
											modaltext = dialog.getContentElement( 'target', 'relModaltext' ),
											useJoomlaTemplateBox = dialog.getContentElement( 'target', 'useJoomlaTemplateBox' );
											
										var 	useJoomlaTemplateBoxElem = 	useJoomlaTemplateBox.getElement(),
												modaltextElem = modaltext.getElement(),
												element = this.getElement();
												
												
										if(data.target.modalchecked)
										{
											heightbox.getElement().show();
											widthbox.getElement().show();
											classbox.getElement().show();
											if(element.getStyle('display') == 'block')
											{
												useJoomlaTemplateBoxElem.show();
												modaltextElem.show();
											}
										}
										else
										{
											heightbox.getElement().hide();
											widthbox.getElement().hide();
											classbox.getElement().hide();
											if(element.getStyle('display') == 'block')
											{
												useJoomlaTemplateBoxElem.hide();
												modaltextElem.hide();
											}	
										}		
										
										this.setValue( data.target.modalchecked );
												
									}
								},
								commit : function( data )
								{
									if ( !data.target )
										data.target = {};
		
									data.target.modalchecked = this.getValue();
								}
							},
							{
								type : 'text',
								id : 'relClass',
								label : 'Classname',
								'default' : 'modal',
								setup : function( data )
								{
									if (data.target && data.target.rel )
										this.setValue( data.target.rel.classname || 'modal' );
								},
								commit : function( data )
								{
									if ( !data.target.rel )
										data.target.rel = {};

									data.target.rel.classname = this.getValue();
								}
							},
							{
								type : 'text',
								id : 'relHeight',
								label : 'Height',
								'default' : '550',
								setup : function( data )
								{
									if (data.target && data.target.rel )
										this.setValue( data.target.rel.height || 550 );
								},
								commit : function( data )
								{
									if ( !data.target.rel )
										data.target.rel = {};

									data.target.rel.height = this.getValue().replace(/\W/gi, '');
								}
							},
							{
								type : 'text',
								id : 'relWidth',
								label : 'Width',
								'default' : '450',
								setup : function( data )
								{
									if (data.target && data.target )
										this.setValue( data.target.rel.width  || 450);
								},
								commit : function( data )
								{
									if ( !data.target.rel )
										data.target.rel = {};

									data.target.rel.width = this.getValue().replace(/\W/gi, '');
								}
							}
						]	
							
					},
					{
						type: 'vbox',
						id:	'useJoomlaTemplateBox',
						height: '40',
						children :
						[
							{		
								type : 'checkbox',
								id : 'useJoomlaTemplate',
								label : 'Use Joomla Template',
								onClick : function() 
								{
								
								},
								setup : function( data )
								{
									
									if (data.target)
									{
										this.setValue(data.target.useJoomlaTemplate);
									}
						
								},
								commit : function( data )
								{
									if ( !data.target )
										data.target = {};
		
									data.target.useJoomlaTemplate = this.getValue();
								}
							}	
						]
					},
					{
						type: 'vbox',
						id:	'relModaltext',
						children :
						[
									
							{
		
								type: 'html',
								html: '<div style="position: relative; height: 167px;"><span style=" position: absolute; bottom:0px; font-style:italic;"><span style="font-weight:bold;">Please note</span>: this functionality requires Joomla\'s Modal library to be loaded in order for this functionality to work. <br/>Please <a href="http://www.joomlackeditor.com/component/jdownloads/viewdownload/17-joomla-plugins/51-jck-modal-plugin" target="_blank" style="color: blue; text-decoration: underline; cursor: pointer;">click here</a> to view our solution.</span></div>'
							}
						]
					},
					{
						type : 'vbox',
						width : 260,
						align : 'center',
						padding : 2,
						id : 'popupFeatures',
						children :
						[
							{
								type : 'fieldset',
								label : linkLang.popupFeatures,
								children :
								[
									{
										type : 'hbox',
										children :
										[
											{
												type : 'checkbox',
												id : 'resizable',
												label : linkLang.popupResizable,
												setup : setupPopupParams,
												commit : commitPopupParams
											},
											{
												type : 'checkbox',
												id : 'status',
												label : linkLang.popupStatusBar,
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									},
									{
										type : 'hbox',
										children :
										[
											{
												type : 'checkbox',
												id : 'location',
												label : linkLang.popupLocationBar,
												setup : setupPopupParams,
												commit : commitPopupParams

											},
											{
												type : 'checkbox',
												id : 'toolbar',
												label : linkLang.popupToolbar,
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									},
									{
										type : 'hbox',
										children :
										[
											{
												type : 'checkbox',
												id : 'menubar',
												label : linkLang.popupMenuBar,
												setup : setupPopupParams,
												commit : commitPopupParams

											},
											{
												type : 'checkbox',
												id : 'fullscreen',
												label : linkLang.popupFullScreen,
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									},
									{
										type : 'hbox',
										children :
										[
											{
												type : 'checkbox',
												id : 'scrollbars',
												label : linkLang.popupScrollBars,
												setup : setupPopupParams,
												commit : commitPopupParams

											},
											{
												type : 'checkbox',
												id : 'dependent',
												label : linkLang.popupDependent,
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									},
									{
										type : 'hbox',
										children :
										[
											{
												type :  'text',

												widths : [ '30%', '70%' ],
												labelLayout : 'horizontal',
												label : linkLang.popupWidth,
												id : 'width',
												setup : setupPopupParams,
												commit : commitPopupParams

											},
											{
												type :  'text',
												labelLayout : 'horizontal',
												widths : [ '55%', '45%' ],
												label : linkLang.popupLeft,
												id : 'left',
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									},
									{
										type : 'hbox',
										children :
										[
											{
												type :  'text',
												labelLayout : 'horizontal',
												widths : [ '30%', '70%' ],
												label : linkLang.popupHeight,
												id : 'height',
												setup : setupPopupParams,
												commit : commitPopupParams

											},
											{
												type :  'text',
												labelLayout : 'horizontal',
												label : linkLang.popupTop,
												widths : [ '55%', '45%' ],
												id : 'top',
												setup : setupPopupParams,
												commit : commitPopupParams

											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				id : 'advanced',
				label : linkLang.advanced,
				title : linkLang.advanced,
				elements :
				[
					{
						type : 'vbox',
						padding : 1,
						children :
						[
							{
								type : 'hbox',
								widths : [ '45%', '35%', '20%' ],
								children :
								[
									{
										type : 'text',
										id : 'advId',
										label : linkLang.id,
										setup : setupAdvParams,
										commit : commitAdvParams
									},
									{
										type : 'select',
										id : 'advLangDir',
										label : linkLang.langDir,
										'default' : '',
										style : 'width:110px',
										items :
										[
											[ commonLang.notSet, '' ],
											[ linkLang.langDirLTR, 'ltr' ],
											[ linkLang.langDirRTL, 'rtl' ]
										],
										setup : setupAdvParams,
										commit : commitAdvParams
									},
									{
										type : 'text',
										id : 'advAccessKey',
										width : '80px',
										label : linkLang.acccessKey,
										maxLength : 1,
										setup : setupAdvParams,
										commit : commitAdvParams

									}
								]
							},
							{
								type : 'hbox',
								widths : [ '45%', '35%', '20%' ],
								children :
								[
									{
										type : 'text',
										label : linkLang.name,
										id : 'advName',
										setup : setupAdvParams,
										commit : commitAdvParams

									},
									{
										type : 'text',
										label : linkLang.langCode,
										id : 'advLangCode',
										width : '110px',
										'default' : '',
										setup : setupAdvParams,
										commit : commitAdvParams

									},
									{
										type : 'text',
										label : linkLang.tabIndex,
										id : 'advTabIndex',
										width : '80px',
										maxLength : 5,
										setup : setupAdvParams,
										commit : commitAdvParams

									}
								]
							}
						]
					},
					{
						type : 'vbox',
						padding : 1,
						children :
						[
							{
								type : 'vbox',
								children :
								[
									{
										type : 'text',
										label : linkLang.advisoryContentType,
										'default' : '',
										id : 'advContentType',
										setup : setupAdvParams,
										commit : commitAdvParams

									}
								]
							},
							{
								type : 'hbox',
								widths : [ '45%', '55%' ],
								children :
								[
									{
										type : 'text',
										label : linkLang.cssClasses,
										'default' : '',
										id : 'advCSSClasses',
										setup : setupAdvParams,
										commit : commitAdvParams

									},
									{
										type : 'text',
										label : linkLang.charset,
										'default' : '',
										id : 'advCharset',
										setup : setupAdvParams,
										commit : commitAdvParams

									}
								]
							},
							{
								type : 'hbox',
								children :
								[
									{
										type : 'text',
										label : linkLang.styles,
										'default' : '',
										id : 'advStyles',
										setup : setupAdvParams,
										commit : commitAdvParams

									}
								]
							}
						]
					}
				]
			}
		],
		onLoad : function()
		{
			
			dialog = this;
			editor = this.getParentEditor();
			
			//add stylesheet
			//load stylesheet added by AW 
			
			
			if ( !editor.config.jtreelinkShowAdvancedTab )
				this.hidePage( 'advanced' );		//Hide Advanded tab.

			if ( !editor.config.jtreelinkShowTargetTab )
				this.hidePage( 'target' );		//Hide Target tab.
	
			
			var autotext = '',
			tree =  new MooTreeControl({ 
				div: 'jtree-content_tree', 
				mode: 'files',
				grid: true,
				theme: pluginPath + 'images/mootree.gif',
				loader: {icon: pluginPath + 'images/mootree_loader.gif', text:'Loading...', color:'#a0a0a0'},
				onSelect: function (node,state){
						
					if (node.data.url && node.data.selectable == 'true') 
					{
						document.ckadminForm.url.value = node.data.url;
						document.ckadminForm.text.value = node.text;
						document.ckadminForm.title.value = node.text;
					}
				}
			},{ text: 'Links', open: true	});
			tree.root.load(pluginPath + 'dialogs/initialize.php?client='+editor.config.client);
		},
		onShow : function ()
		{
			
			var editor = this.getParentEditor(),
				selection = editor.getSelection(),
				element = null;
			
			
			link = element && element.getAscendant( 'a' );
			var linkPlugin =  CKEDITOR.plugins.link;

			// Fill in all the relevant fields if there's already one link selected.
			if ( ( element = linkPlugin.getSelectedLink( editor ) ) && element.hasAttribute( 'href' ) )
			{
				selection.selectElement( element );
			}
			else
			{
				element = null;
			}
		
			
			//parseLink.apply(this, [editor, element]);
			document.ckadminForm.url.value = '';
			document.ckadminForm.text.value = '';
			document.ckadminForm.title.value = ''; 
			this.setupContent( parseLink.apply( this, [ editor, element ] ) );
				
            /*
			if(CKEDITOR.env.gecko)
			{
				window.showModalDialog(
						'javascript:document.write("' +
							'<script>' +
								'window.setTimeout(' +
									'function(){window.close();}' +
									',50);' +
							'</script>")' );
			}
            */
			
		},
		onOk : function()
		{
			
			var editor = this.getParentEditor();
						
			var url = document.ckadminForm.url.value || false;
			
			var linkText = document.ckadminForm.text.value;
			var title =  document.ckadminForm.title.value;
			
			var attributes = {href:url,title:title},
				data = {},
				removeAttributes = [];
				
			this.commitContent( data );
			
			
			// Popups and target.
			if ( data.target )
			{
				if ( data.target.type == 'popup' )
				{
					var onclickList = [ 'window.open(this.href, \'',
							data.target.name || '', '\', \'' ];
					var featureList = [ 'resizable', 'status', 'location', 'toolbar', 'menubar', 'fullscreen',
							'scrollbars', 'dependent' ];
					var featureLength = featureList.length;
					var addFeature = function( featureName )
					{
						if ( data.target[ featureName ] )
							featureList.push( featureName + '=' + data.target[ featureName ] );
					};

					for ( var i = 0 ; i < featureLength ; i++ )
						featureList[i] = featureList[i] + ( data.target[ featureList[i] ] ? '=yes' : '=no' ) ;
					addFeature( 'width' );
					addFeature( 'left' );
					addFeature( 'height' );
					addFeature( 'top' );

					onclickList.push( featureList.join( ',' ), '\'); return false;' );
					attributes[ '_cke_pa_onclick' ] = onclickList.join( '' );

					// Add the "target" attribute. (#5074)
					removeAttributes.push( 'target' );
					removeAttributes.push( 'rel' );
				}
				else
				{
					if ( data.target.type != notSetTargetValue && data.target.name )
					{
						attributes.target = data.target.name;
						//removeAttributes.push( 'rel' );
					}
					else
						removeAttributes.push( 'target' );
					
			
					removeAttributes.push( '_cke_pa_onclick', 'onclick' );
				}
				
			}

			// Advanced attributes.
			if ( data.adv )
			{
				var advAttr = function( inputName, attrName )
				{
					var value = data.adv[ inputName ];
					if ( value )
						attributes[attrName] = value;
					else
					{
						if(attrName != 'class')
							removeAttributes.push( attrName );
					}	
				};

				if ( this._.selectedElement )
					advAttr( 'advId', 'id' );
				advAttr( 'advLangDir', 'dir' );
				advAttr( 'advAccessKey', 'accessKey' );
				advAttr( 'advName', 'name' );
				advAttr( 'advLangCode', 'lang' );
				advAttr( 'advTabIndex', 'tabindex' );
				advAttr( 'advContentType', 'type' );
				advAttr( 'advCSSClasses', 'class' );
				advAttr( 'advCharset', 'charset' );
				advAttr( 'advStyles', 'style' );
			}
			
	
			if(data.target && data.target.type == 'frame' && data.target.modalchecked)
			{
			//Joomla squeezebox stuff
			
				var relAttr = "{handler: 'iframe' , size: {x:" + data.target.rel.width +", y:" + data.target.rel.height + "}}";
				attributes['rel'] = relAttr;
				attributes['class'] = attributes['class'] ?  attributes['class']  + ' ' +  data.target.rel.classname : data.target.rel.classname;
				if(!data.target.useJoomlaTemplate)
				{
					attributes['href'] += '&tmpl=component';
				}
				else 
					attributes['href'] = attributes['href'].replace('&tmpl=component','');
			}
			else
			{
				removeAttributes.push( 'rel' );
				attributes['href'] = attributes['href'].replace('&tmpl=component','');
			}

			if (!this._.selectedElement) 
			{
				
				// Create element if current selection is collapsed.
				var selection = editor.getSelection(),
					ranges = selection.getRanges( true );
					
				if ( ranges.length == 1 && ranges[0].collapsed )
				{
					// Short mailto link text view (#5736).
			

					var text = new CKEDITOR.dom.text(linkText, editor.document );
					ranges[0].insertNode( text );
					ranges[0].selectNodeContents( text );
					selection.selectRanges( ranges );
				}
				
				// Apply style.
			
				var style = new CKEDITOR.style( { element : 'a', attributes : attributes } );
				style.type = CKEDITOR.STYLE_INLINE;		// need to override... dunno why.
				style.apply( editor.document );
	
			}
			else
			{
				
				// We're only editing an existing link, so just overwrite the attributes.
				var element = this._.selectedElement;
				
				var isImgLink = false;
				
				var children = element.getChildren(); // AW now add support for  image links
				for ( var i = 0, count = children.count(); i < count; i++ )
				{
					var child = children.getItem( i );
	
					if ( child.type == CKEDITOR.NODE_ELEMENT && child.is( 'img' ) )
					{
						isImgLink = true;
						break;	
					}
				}
				if(!isImgLink)
					element.setText(linkText);
				attributes._cke_saved_href = attributes.href //overite saved URL
				element.setAttributes( attributes );
				element.removeAttributes( removeAttributes );
				if( data.target && (data.target.type != 'frame' || data.target.type == 'frame' && !data.target.modalchecked))
				{
				    var classname = data.target.rel.classname;	
					if(classname && element.hasClass(classname))
					{
						element.removeClass(classname);
					}
				}
				if ( data.target.type != notSetTargetValue && data.target.name )
						attributes.target = data.target.name;
					else

		
				delete this._.selectedElement;
			}
						
		}
    };	
	
});
					