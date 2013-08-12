CKEDITOR.plugins.add('ie9selectionoverride',   
{    

	init:function(editor) 
	 {
		//if(CKEDITOR.env.ie9Compat)
		//	editor.addCss( 'br { display:block;}');
	 },
	 
	afterInit: function(editor)
	{
		CKEDITOR.dom.selection.prototype.getRanges = (function()
		{
			var func = CKEDITOR.env.ie ?
				( function()
				{
					function getNodeIndex( node ) { return new CKEDITOR.dom.node( node ).getIndex(); }

					// Finds the container and offset for a specific boundary
					// of an IE range.
					var getBoundaryInformation = function( range, start )
					{
						// Creates a collapsed range at the requested boundary.
						range = range.duplicate();
						range.collapse( start );

						// Gets the element that encloses the range entirely.
						var parent = range.parentElement(),
							doc = parent.ownerDocument;

						// Empty parent element, e.g. <i>^</i>
						if ( !parent.hasChildNodes() )
							return  { container : parent, offset : 0 };

						var siblings = parent.children,
							child,
							sibling,
							testRange = range.duplicate(),
							startIndex = 0,
							endIndex = siblings.length - 1,
							index = -1,
							position,
							distance;

						// Binary search over all element childs to test the range to see whether
						// range is right on the boundary of one element.
						while ( startIndex <= endIndex )
						{
							index = Math.floor( ( startIndex + endIndex ) / 2 );
							child = siblings[ index ];
							testRange.moveToElementText( child );
							position = testRange.compareEndPoints( 'StartToStart', range );

							if ( position > 0 )
								endIndex = index - 1;
							else if ( position < 0 )
								startIndex = index + 1;
							else
							{
								// IE9 report wrong measurement with compareEndPoints when range anchors between two BRs.
								// e.g. <p>text<br />^<br /></p> (#7433)
								if ( CKEDITOR.env.ie9Compat && child.tagName == 'BR' )
								{
									var bmId = 'cke_range_marker';
									range.execCommand( 'CreateBookmark', false, bmId );
									child = doc.getElementsByName( bmId )[ 0 ];
									var offset = getNodeIndex( child );
									parent.removeChild( child );
									return { container : parent, offset : offset };
								}
								else
									return { container : parent, offset : getNodeIndex( child ) };
							}
						}

						// All childs are text nodes,
						// or to the right hand of test range are all text nodes. (#6992)
						if ( index == -1 || index == siblings.length - 1 && position < 0 )
						{
							// Adapt test range to embrace the entire parent contents.
							testRange.moveToElementText( parent );
							testRange.setEndPoint( 'StartToStart', range );

							// IE report line break as CRLF with range.text but
							// only LF with textnode.nodeValue, normalize them to avoid
							// breaking character counting logic below. (#3949)
							distance = testRange.text.replace( /(\r\n|\r)/g, '\n' ).length;

							siblings = parent.childNodes;

							// Actual range anchor right beside test range at the boundary of text node.
							if ( !distance )
							{
								child = siblings[ siblings.length - 1 ];

								if ( child.nodeType == CKEDITOR.NODE_ELEMENT )
									return { container : parent, offset : siblings.length };
								else
									return { container : child, offset : child.nodeValue.length };
							}

							// Start the measuring until distance overflows, meanwhile count the text nodes.
							var i = siblings.length;
							while ( distance > 0 )
								distance -= siblings[ --i ].nodeValue.length;

							return  { container : siblings[ i ], offset : -distance };
						}
						// Test range was one offset beyond OR behind the anchored text node.
						else
						{
							// Adapt one side of test range to the actual range
							// for measuring the offset between them.
							testRange.collapse( position > 0 ? true : false );
							testRange.setEndPoint( position > 0 ? 'StartToStart' : 'EndToStart', range );

							// IE report line break as CRLF with range.text but
							// only LF with textnode.nodeValue, normalize them to avoid
							// breaking character counting logic below. (#3949)
							distance = testRange.text.replace( /(\r\n|\r)/g, '\n' ).length;

							// Actual range anchor right beside test range at the inner boundary of text node.
							if ( !distance )
								return { container : parent, offset : getNodeIndex( child ) + ( position > 0 ? 0 : 1 ) };

							// Start the measuring until distance overflows, meanwhile count the text nodes.
							while ( distance > 0 )
							{
								try
								{
									sibling = child[ position > 0 ? 'previousSibling' : 'nextSibling' ];
									distance -= sibling.nodeValue.length;
									child = sibling;
								}
								// Measurement in IE could be somtimes wrong because of <select> element. (#4611)
								catch( e )
								{
									return { container : parent, offset : getNodeIndex( child ) };
								}
							}

							return { container : child, offset : position > 0 ? -distance : child.nodeValue.length + distance };
						}
					};

					return function()
					{
						// IE doesn't have range support (in the W3C way), so we
						// need to do some magic to transform selections into
						// CKEDITOR.dom.range instances.

						var sel = this.getNative(),
							nativeRange = sel && sel.createRange(),
							type = this.getType(),
							range;

						if ( !sel )
							return [];

						if ( type == CKEDITOR.SELECTION_TEXT )
						{
							range = new CKEDITOR.dom.range( this.document );

							var boundaryInfo = getBoundaryInformation( nativeRange, true );
							range.setStart( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

							boundaryInfo = getBoundaryInformation( nativeRange );
							range.setEnd( new CKEDITOR.dom.node( boundaryInfo.container ), boundaryInfo.offset );

							// Correct an invalid IE range case on empty list item. (#5850)
							if ( range.endContainer.getPosition( range.startContainer ) & CKEDITOR.POSITION_PRECEDING
									&& range.endOffset <= range.startContainer.getIndex() )
							{
								range.collapse();
							}

							return [ range ];
						}
						else if ( type == CKEDITOR.SELECTION_ELEMENT )
						{
							var retval = [];

							for ( var i = 0 ; i < nativeRange.length ; i++ )
							{
								var element = nativeRange.item( i ),
									parentElement = element.parentNode,
									j = 0;

								range = new CKEDITOR.dom.range( this.document );

								for (; j < parentElement.childNodes.length && parentElement.childNodes[j] != element ; j++ )
								{ /*jsl:pass*/ }

								range.setStart( new CKEDITOR.dom.node( parentElement ), j );
								range.setEnd( new CKEDITOR.dom.node( parentElement ), j + 1 );
								retval.push( range );
							}

							return retval;
						}

						return [];
					};
				})()
			:
				function()
				{

					// On browsers implementing the W3C range, we simply
					// tranform the native ranges in CKEDITOR.dom.range
					// instances.

					var ranges = [],
						range,
						doc = this.document,
						sel = this.getNative();

					if ( !sel )
						return ranges;

					// On WebKit, it may happen that we'll have no selection
					// available. We normalize it here by replicating the
					// behavior of other browsers.
					if ( !sel.rangeCount )
					{
						range = new CKEDITOR.dom.range( doc );
						range.moveToElementEditStart( doc.getBody() );
						ranges.push( range );
					}

					for ( var i = 0 ; i < sel.rangeCount ; i++ )
					{
						var nativeRange = sel.getRangeAt( i );

						range = new CKEDITOR.dom.range( doc );

						range.setStart( new CKEDITOR.dom.node( nativeRange.startContainer ), nativeRange.startOffset );
						range.setEnd( new CKEDITOR.dom.node( nativeRange.endContainer ), nativeRange.endOffset );
						ranges.push( range );
					}
					return ranges;
				};

			return function( onlyEditables )
			{
				var cache = this._.cache;
				if ( cache.ranges && !onlyEditables )
					return cache.ranges;
				else if ( !cache.ranges )
					cache.ranges = new CKEDITOR.dom.rangeList( func.call( this ) );

				// Split range into multiple by read-only nodes.
				if ( onlyEditables )
				{
					var ranges = cache.ranges;
					for ( var i = 0; i < ranges.length; i++ )
					{
						var range = ranges[ i ];

						// Drop range spans inside one ready-only node.
						var parent = range.getCommonAncestor();
						if ( parent.isReadOnly() )
							ranges.splice( i, 1 );

						if ( range.collapsed )
							continue;

						var startContainer = range.startContainer,
							endContainer = range.endContainer,
							startOffset = range.startOffset,
							endOffset = range.endOffset,
							walkerRange = range.clone();

						// Range may start inside a non-editable element, restart range
						// by the end of it.
						var readOnly;
						if ( ( readOnly = startContainer.isReadOnly() ) )
							range.setStartAfter( readOnly );

						// Enlarge range start/end with text node to avoid walker
						// being DOM destructive, it doesn't interfere our checking
						// of elements below as well.
						if ( startContainer && startContainer.type == CKEDITOR.NODE_TEXT )
						{
							if ( startOffset >= startContainer.getLength() )
								walkerRange.setStartAfter( startContainer );
							else
								walkerRange.setStartBefore( startContainer );
						}

						if ( endContainer && endContainer.type == CKEDITOR.NODE_TEXT )
						{
							if ( !endOffset )
								walkerRange.setEndBefore( endContainer );
							else
								walkerRange.setEndAfter( endContainer );
						}

						// Looking for non-editable element inside the range.
						var walker = new CKEDITOR.dom.walker( walkerRange );
						walker.evaluator = function( node )
						{
							if ( node.type == CKEDITOR.NODE_ELEMENT
								&& node.isReadOnly() )
							{
								var newRange = range.clone();
								range.setEndBefore( node );

								// Drop collapsed range around read-only elements,
								// it make sure the range list empty when selecting
								// only non-editable elements.
								if ( range.collapsed )
									ranges.splice( i--, 1 );

								// Avoid creating invalid range.
								if ( !( node.getPosition( walkerRange.endContainer ) & CKEDITOR.POSITION_CONTAINS ) )
								{
									newRange.setStartAfter( node );
									if ( !newRange.collapsed )
										ranges.splice( i + 1, 0, newRange );
								}

								return true;
							}

							return false;
						};

						walker.next();
					}
				}

				return cache.ranges;
			};
		})();
	 
	} 
	 
	 
});