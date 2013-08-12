CKEDITOR.plugins.add('adddialogfieldexample',   
{    

    
	init:function(editor) 
	{
       // Do Nothing
	},
	  
	afterInit: function (editor) 
	{
		CKEDITOR.on( 'dialogDefinition', function( ev )
		{
			// Take the dialog name and its definition from the event
			// data.
			var dialogName = ev.data.name;
			var dialogDefinition = ev.data.definition;
			
			function unescapeSingleQuote( str )
			{
				return str.replace( /\\'/g, '\'' );
			}
		
			function escapeSingleQuote( str )
			{
				return str.replace( /'/g, '\\$&' );
			}

					
			var emailProtection = editor.config.emailProtection || '';

			// Compile the protection function pattern.
			if ( emailProtection && emailProtection != 'encode' )
			{
				var compiledProtectionFunction = {};
		
				emailProtection.replace( /^([^(]+)\(([^)]+)\)$/, function( match, funcName, params )
				{
					compiledProtectionFunction.name = funcName;
					compiledProtectionFunction.params = [];
					params.replace( /[^,\s]+/g, function( param )
					{
						compiledProtectionFunction.params.push( param );
					} );
				} );
			}
		
			function protectEmailLinkAsFunction( email )
			{
				var retval,
					name = compiledProtectionFunction.name,
					params = compiledProtectionFunction.params,
					paramName,
					paramValue;
		
				retval = [ name, '(' ];
				for ( var i = 0; i < params.length; i++ )
				{
					paramName = params[ i ].toLowerCase();
					paramValue = email[ paramName ];
		
					i > 0 && retval.push( ',' );
					retval.push( '\'',
								 paramValue ?
								 escapeSingleQuote( encodeURIComponent( email[ paramName ] ) )
								 : '',
								 '\'');
				}
				retval.push( ')' );
				return retval.join( '' );
			}
		
			function protectEmailAddressAsEncodedString( address )
			{
				var charCode,
					length = address.length,
					encodedChars = [];
				for ( var i = 0; i < length; i++ )
				{
					charCode = address.charCodeAt( i );
					encodedChars.push( charCode );
				}
				return 'String.fromCharCode(' + encodedChars.join( ',' ) + ')';
			}
			
			
		
			// Check if the definition is from the dialog we're
			// interested on (the "Link" dialog).
			if ( dialogName == 'link' )
			{
				
				// Get a reference to the "Link Advanced" tab.
				var advancedTab = dialogDefinition.getContents( 'advanced' );
	
						
				// Add a text field to the "advanced" tab.
				advancedTab.add( {
						type : 'text',
						label : 'Relationship',
						id : 'advRel',
						'default' : '',
						setup : function()
								{
									var plugin = CKEDITOR.plugins.link;
									var element = plugin.getSelectedLink( editor );
									if(element)
										this.setValue(element.$.rel);
								},
						commit :  function(data)
						          {
								     if(!data.adv)
										data.adv = {};
									 data.adv.advRel = this.getValue();
								  } 
					});
							
				dialogDefinition.onOk = function()
				{
					var attributes = { href : 'javascript:void(0)/*' + CKEDITOR.tools.getNextNumber() + '*/' },
						removeAttributes = [],
						data = { href : attributes.href },
						me = this,
						editor = this.getParentEditor();
		
					this.commitContent( data );
		
					// Compose the URL.
					switch ( data.type || 'url' )
					{
						case 'url':
							var protocol = ( data.url && data.url.protocol != undefined ) ? data.url.protocol : 'http://',
								url = ( data.url && data.url.url ) || '';
							attributes._cke_saved_href = ( url.indexOf( '/' ) === 0 ) ? url : protocol + url;
							break;
						case 'anchor':
							var name = ( data.anchor && data.anchor.name ),
								id = ( data.anchor && data.anchor.id );
							attributes._cke_saved_href = '#' + ( name || id || '' );
							break;
						case 'email':
		
							var linkHref,
								email = data.email,
								address = email.address;
		
							switch( emailProtection )
							{
								case '' :
								case 'encode' :
								{
									var subject = encodeURIComponent( email.subject || '' ),
										body = encodeURIComponent( email.body || '' );
		
									// Build the e-mail parameters first.
									var argList = [];
									subject && argList.push( 'subject=' + subject );
									body && argList.push( 'body=' + body );
									argList = argList.length ? '?' + argList.join( '&' ) : '';
		
									if ( emailProtection == 'encode' )
									{
										linkHref = [ 'javascript:void(location.href=\'mailto:\'+',
													 protectEmailAddressAsEncodedString( address ) ];
										// parameters are optional.
										argList && linkHref.push( '+\'', escapeSingleQuote( argList ), '\'' );
		
										linkHref.push( ')' );
									}
									else
										linkHref = [ 'mailto:', address, argList ];
		
									break;
								}
								default :
								{
									// Separating name and domain.
									var nameAndDomain = address.split( '@', 2 );
									email.name = nameAndDomain[ 0 ];
									email.domain = nameAndDomain[ 1 ];
		
									linkHref = [ 'javascript:', protectEmailLinkAsFunction( email ) ];
								}
							}
		
							attributes._cke_saved_href = linkHref.join( '' );
							break;
					}
		
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
						}
						else
						{
							if ( data.target.type != 'notSet' && data.target.name )
								attributes.target = data.target.name;
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
								removeAttributes.push( attrName );
						};
		
						if ( this._.selectedElement )
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
						advAttr( 'advRel', 'rel' );
					}
		
					if ( !this._.selectedElement )
					{
						// Create element if current selection is collapsed.
						var selection = editor.getSelection(),
							ranges = selection.getRanges( true );
						if ( ranges.length == 1 && ranges[0].collapsed )
						{
							// Short mailto link text view (#5736).
							var text = new CKEDITOR.dom.text( data.type == 'email' ?
									data.email.address : attributes._cke_saved_href, editor.document );
							ranges[0].insertNode( text );
							ranges[0].selectNodeContents( text );
							selection.selectRanges( ranges );
						}
		
						// Apply style.
						var style = new CKEDITOR.style( { element : 'a', attributes : attributes } );
						style.type = CKEDITOR.STYLE_INLINE;		// need to override... dunno why.
						style.apply( editor.document );
		
						// Id. Apply only to the first link.
						if ( data.adv && data.adv.advId )
						{
							var links = this.getParentEditor().document.$.getElementsByTagName( 'a' );
							for ( i = 0 ; i < links.length ; i++ )
							{
								if ( links[i].href == attributes.href )
								{
									links[i].id = data.adv.advId;
									break;
								}
							}
						}
					}
					else
					{
						// We're only editing an existing link, so just overwrite the attributes.
						var element = this._.selectedElement,
							href = element.getAttribute( '_cke_saved_href' ),
							textView = element.getHtml();
		
						// IE BUG: Setting the name attribute to an existing link doesn't work.
						// Must re-create the link from weired syntax to workaround.
						if ( CKEDITOR.env.ie && attributes.name != element.getAttribute( 'name' ) )
						{
							var newElement = new CKEDITOR.dom.element( '<a name="' + CKEDITOR.tools.htmlEncode( attributes.name ) + '">',
									editor.document );
		
							selection = editor.getSelection();
		
							element.moveChildren( newElement );
							element.copyAttributes( newElement, { name : 1 } );
							newElement.replace( element );
							element = newElement;
		
							selection.selectElement( element );
						}
		
						element.setAttributes( attributes );
						element.removeAttributes( removeAttributes );
						// Update text view when user changes protocol (#4612).
						if ( href == textView || data.type == 'email' && textView.indexOf( '@' ) != -1 )
						{
							// Short mailto link text view (#5736).
							element.setHtml( data.type == 'email' ?
								data.email.address : attributes._cke_saved_href );
						}
						// Make the element display as an anchor if a name has been set.
						if ( element.getAttribute( 'name' ) )
							element.addClass( 'cke_anchor' );
						else
							element.removeClass( 'cke_anchor' );
		
						if ( this.fakeObj )
							editor.createFakeElement( element, 'cke_anchor', 'anchor' ).replace( this.fakeObj );
		
						delete this._.selectedElement;
					}
				}
					//end Ok

			}
		});
	}

});