CKEDITOR.plugins.add('html5support',   
{    

	requires : [ 'styles' ],
    
	beforeInit: function(editor)
	{
		//override DTD for HTM5 support
		
			
		CKEDITOR.dtd = (function()
		{
			var X = CKEDITOR.tools.extend,
		
				A = {isindex:1,fieldset:1},
				B = {input:1,button:1,select:1,textarea:1,label:1},
				C = X({a:1},B),
				D = X({iframe:1},C),
				E = {hr:1,ul:1,menu:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,mark:1,time:1,meter:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,blockquote:1,noscript:1,table:1,center:1,address:1,dir:1,pre:1,h5:1,dl:1,h4:1,noframes:1,h6:1,ol:1,h1:1,h3:1,h2:1},
				F = {ins:1,del:1,script:1,style:1},
				G = X({b:1,acronym:1,bdo:1,'var':1,'#':1,abbr:1,code:1,br:1,i:1,cite:1,kbd:1,u:1,strike:1,s:1,tt:1,strong:1,q:1,samp:1,em:1,dfn:1,span:1,wbr:1},F),
				H = X({sub:1,img:1,object:1,sup:1,basefont:1,map:1,applet:1,font:1,big:1,small:1,mark:1},G),
				I = X({p:1},H),
				J = X({iframe:1},H,B),
				K = {img:1,noscript:1,br:1,kbd:1,center:1,button:1,basefont:1,h5:1,h4:1,samp:1,h6:1,ol:1,h1:1,h3:1,h2:1,form:1,font:1,'#':1,select:1,menu:1,ins:1,abbr:1,label:1,code:1,table:1,script:1,cite:1,input:1,iframe:1,strong:1,textarea:1,noframes:1,big:1,small:1,span:1,hr:1,sub:1,bdo:1,'var':1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,mark:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,object:1,sup:1,strike:1,dir:1,map:1,dl:1,applet:1,del:1,isindex:1,fieldset:1,ul:1,b:1,acronym:1,a:1,blockquote:1,i:1,u:1,s:1,tt:1,address:1,q:1,pre:1,p:1,em:1,dfn:1},
		
				L = X({a:1},J),
				M = {tr:1},
				N = {'#':1},
				O = X({param:1},K),
				P = X({form:1},A,D,E,I),
				Q = {li:1},
				R = {style:1,script:1},
				S = {base:1,link:1,meta:1,title:1},
				T = X(S,R),
				U = {head:1,body:1},
				V = {html:1};
		
		
			var block = {address:1,blockquote:1,center:1,dir:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,dl:1,fieldset:1,form:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,isindex:1,noframes:1,ol:1,p:1,pre:1,table:1,ul:1};
		
			return /** @lends CKEDITOR.dtd */ {
		
				// The "$" items have been added manually.
		
				// List of elements living outside body.
				$nonBodyContent: X(V,U,S),
		
				/**
				 * List of block elements, like "p" or "div".
				 * @type Object
				 * @example
				 */
				$block : block,
		
				/**
				 * List of block limit elements.
				 * @type Object
				 * @example
				 */
				$blockLimit : { body:1,div:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,audio:1,video:1,details:1,datagrid:1,datalist:1,td:1,th:1,caption:1,form:1 },
		
				/**
				 * List of inline (&lt;span&gt; like) elements.
				 */
				$inline : L,	// Just like span.
		
				/**
				 * list of elements that can be children at &lt;body&gt;.
				 */
				$body : X({script:1,style:1}, block),
		
				$cdata : {script:1,style:1},
		
				/**
				 * List of empty (self-closing) elements, like "br" or "img".
				 * @type Object
				 * @example
				 */
				$empty : {area:1,base:1,br:1,col:1,hr:1,img:1,input:1,link:1,meta:1,param:1,wbr:1},
		
				/**
				 * List of list item elements, like "li" or "dd".
				 * @type Object
				 * @example
				 */
				$listItem : {dd:1,dt:1,li:1},
		
				/**
				 * List of list root elements.
				 * @type Object
				 * @example
				 */
				$list: {ul:1,ol:1,dl:1},
		
				/**
				 * Elements that accept text nodes, but are not possible to edit into
				 * the browser.
				 * @type Object
				 * @example
				 */
				$nonEditable : {applet:1,button:1,embed:1,iframe:1,map:1,object:1,option:1,script:1,textarea:1,param:1,audio:1,video:1},
		
				/**
				 *  List of block tags with each one a singleton element lives in the corresponding structure for description.
				 */
				$captionBlock : { caption:1, legend:1 },
		
				/**
				 * List of elements that can be ignored if empty, like "b" or "span".
				 * @type Object
				 * @example
				 */
				$removeEmpty : {abbr:1,acronym:1,address:1,b:1,bdo:1,big:1,cite:1,code:1,del:1,dfn:1,em:1,font:1,i:1,ins:1,label:1,kbd:1,q:1,s:1,samp:1,small:1,span:1,strike:1,strong:1,sub:1,sup:1,tt:1,u:1,'var':1,mark:1},
		
				/**
				 * List of elements that have tabindex set to zero by default.
				 * @type Object
				 * @example
				 */
				$tabIndex : {a:1,area:1,button:1,input:1,object:1,select:1,textarea:1},
		
				/**
				 * List of elements used inside the "table" element, like "tbody" or "td".
				 * @type Object
				 * @example
				 */
				$tableContent : {caption:1,col:1,colgroup:1,tbody:1,td:1,tfoot:1,th:1,thead:1,tr:1},
		
				html: U,
				head: T,
				style: N,
				script: N,
				body: P,
				base: {},
				link: {},
				meta: {},
				title: N,
				col : {},
				tr : {td:1,th:1},
				img : {},
				colgroup : {col:1},
				noscript : P,
				td : P,
				br : {},
				wbr : {},
				th : P,
				center : P,
				kbd : L,
				button : X(I,E),
				basefont : {},
				h5 : L,
				h4 : L,
				samp : L,
				h6 : L,
				ol : Q,
				h1 : L,
				h3 : L,
				option : N,
				h2 : L,
				form : X(A,D,E,I),
				select : {optgroup:1,option:1},
				font : L,
				ins : L,
				menu : Q,
				abbr : L,
				label : L,
				table : {thead:1,col:1,tbody:1,tr:1,colgroup:1,caption:1,tfoot:1},
				code : L,
				tfoot : M,
				cite : L,
				li : P,
				input : {},
				iframe : P,
				strong : L,
				textarea : N,
				noframes : P,
				big : L,
				small : L,
				span : L,
				hr : {},
				dt : L,
				sub : L,
				optgroup : {option:1},
				param : {},
				bdo : L,
				'var' : L,
				div : P,
				object : O,
				sup : L,
				dd : P,
				strike : L,
				area : {},
				dir : Q,
				map : X({area:1,form:1,p:1},A,F,E),
				applet : O,
				dl : {dt:1,dd:1},
				del : L,
				isindex : {},
				fieldset : X({legend:1},K),
				thead : M,
				ul : Q,
				acronym : L,
				b : L,
				a : J,
				blockquote : P,
				caption : L,
				i : L,
				u : L,
				tbody : M,
				s : L,
				address : X(D,I),
				tt : L,
				legend : L,
				q : L,
				pre : X(G,C),
				p : L,
				em : L,
				dfn : L,
				//HTML5
				section : P,
				header : P,
				footer : P,
				nav : P,
				article : P,
				aside : P,
				figure: P,
				dialog : P,
				hgroup : P,
				mark : L,
				time : L,
				meter : L,
				menu : L,
				command : L,
				keygen : L,
				output : L,
				progress : O,
				audio : O,
				video : O,
				details : O,
				datagrid : O,
				datalist : O
			};
			
			
			
		})();
		
		
		
		
		var proto = CKEDITOR.htmlParser.element.prototype;
		
		CKEDITOR.htmlParser.element = function( name, attributes )
{
	/**
	 * The element name.
	 * @type String
	 * @example
	 */
	this.name = name;

	/**
	 * Holds the attributes defined for this element.
	 * @type Object
	 * @example
	 */
	this.attributes = attributes || ( attributes = {} );

	/**
	 * The nodes that are direct children of this element.
	 * @type Array
	 * @example
	 */
	this.children = [];

	var tagName = attributes._cke_real_element_type || name;

	var dtd			= CKEDITOR.dtd,
		isBlockLike	= !!( dtd.$nonBodyContent[ tagName ] || dtd.$block[ tagName ] || dtd.$listItem[ tagName ] || dtd.$tableContent[ tagName ] || dtd.$nonEditable[ tagName ] || tagName == 'br' ),
		isEmpty		= !!dtd.$empty[ name ];

	this.isEmpty	= isEmpty;
	
	this.isUnknown	= !dtd[ name ];

	/** @private */
	this._ =
	{
		isBlockLike : isBlockLike,
		hasInlineStarted : isEmpty || !isBlockLike
	};
};

CKEDITOR.htmlParser.element.prototype = proto;

var sortAttribs = function( a, b )
	{
		a = a[0];
		b = b[0];
		return a < b ? -1 : a > b ? 1 : 0;
	};

CKEDITOR.htmlParser.element.prototype.writeHtml =

function( writer, filter )
{
	var attributes = this.attributes;

	// Ignore cke: prefixes when writing HTML.
	var element = this,
		writeName = element.name,
		a, newAttrName, value;

	var isChildrenFiltered;

	/**
	 * Providing an option for bottom-up filtering order ( element
	 * children to be pre-filtered before the element itself ).
	 */
	element.filterChildren = function()
	{
		if ( !isChildrenFiltered )
		{
			var writer = new CKEDITOR.htmlParser.basicWriter();
			CKEDITOR.htmlParser.fragment.prototype.writeChildrenHtml.call( element, writer, filter );
			element.children = new CKEDITOR.htmlParser.fragment.fromHtml( writer.getHtml() ).children;
			isChildrenFiltered = 1;
		}
	};

	if ( filter )
	{
		while ( true )
		{
			if ( !( writeName = filter.onElementName( writeName ) ) )
				return;

			element.name = writeName;

			if ( !( element = filter.onElement( element ) ) )
				return;

			element.parent = this.parent;

			if ( element.name == writeName )
				break;

			// If the element has been replaced with something of a
			// different type, then make the replacement write itself.
			if ( element.type != CKEDITOR.NODE_ELEMENT )
			{
				element.writeHtml( writer, filter );
				return;
			}

			writeName = element.name;

			// This indicate that the element has been dropped by
			// filter but not the children.
			if ( !writeName )
			{
				this.writeChildrenHtml.call( element, writer, isChildrenFiltered ? null : filter );
				return;
			}
		}

		// The element may have been changed, so update the local
		// references.
		attributes = element.attributes;
	}

	// Open element tag.
	writer.openTag( writeName, attributes );

	// Copy all attributes to an array.
	var attribsArray = [];
	// Iterate over the attributes twice since filters may alter
	// other attributes.
	for ( var i = 0 ; i < 2; i++ )
	{
		for ( a in attributes )
		{
			newAttrName = a;
			value = attributes[ a ];
			if ( i == 1 )
				attribsArray.push( [ a, value ] );
			else if ( filter )
			{
				while ( true )
				{
					if ( !( newAttrName = filter.onAttributeName( a ) ) )
					{
						delete attributes[ a ];
						break;
					}
					else if ( newAttrName != a )
					{
						delete attributes[ a ];
						a = newAttrName;
						continue;
					}
					else
						break;
				}
				if ( newAttrName )
				{
					if ( ( value = filter.onAttribute( element, newAttrName, value ) ) === false )
						delete attributes[ newAttrName ];
					else
						attributes [ newAttrName ] = value;
				}
			}
		}
	}
	// Sort the attributes by name.
	if ( writer.sortAttributes )
		attribsArray.sort( sortAttribs );

	// Send the attributes.
	var len = attribsArray.length;
	for ( i = 0 ; i < len ; i++ )
	{
		var attrib = attribsArray[ i ];
		writer.attribute( attrib[0], attrib[1] );
	}

	writer.openTagClose( writeName, element.isEmpty );

	if ( !element.isEmpty )
	{
		this.writeChildrenHtml.call( element, writer, isChildrenFiltered ? null : filter );
		// Close the element.
		writer.closeTag( writeName );
	}
}	
	

	// Elements which the end tag is marked as optional in the HTML 4.01 DTD
	// (expect empty elements).
	var optionalClose = {colgroup:1,dd:1,dt:1,li:1,option:1,p:1,td:1,tfoot:1,th:1,thead:1,tr:1};

	// Block-level elements whose internal structure should be respected during
	// parser fixing.
	var nonBreakingBlocks = CKEDITOR.tools.extend(
			{table:1,ul:1,ol:1,dl:1},
			CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl ),
		listBlocks = CKEDITOR.dtd.$list, listItems = CKEDITOR.dtd.$listItem;

CKEDITOR.htmlParser.fragment.fromHtml = function( fragmentHtml, fixForBody )
{
	var parser = new CKEDITOR.htmlParser(),
		html = [],
		fragment = new CKEDITOR.htmlParser.fragment(),
		pendingInline = [],
		pendingBRs = [],
		currentNode = fragment,
		// Indicate we're inside a <pre> element, spaces should be touched differently.
		inPre = false,
		returnPoint;

	function checkPending( newTagName )
	{
		var pendingBRsSent;

		if ( pendingInline.length > 0 )
		{
			for ( var i = 0 ; i < pendingInline.length ; i++ )
			{
				var pendingElement = pendingInline[ i ],
					pendingName = pendingElement.name,
					pendingDtd = CKEDITOR.dtd[ pendingName ],
					currentDtd = currentNode.name && CKEDITOR.dtd[ currentNode.name ];

				if ( ( !currentDtd || currentDtd[ pendingName ] ) && ( !newTagName || !pendingDtd || pendingDtd[ newTagName ] || !CKEDITOR.dtd[ newTagName ] ) )
				{
					if ( !pendingBRsSent )
					{
						sendPendingBRs();
						pendingBRsSent = 1;
					}

					// Get a clone for the pending element.
					pendingElement = pendingElement.clone();

					// Add it to the current node and make it the current,
					// so the new element will be added inside of it.
					pendingElement.parent = currentNode;
					currentNode = pendingElement;

					// Remove the pending element (back the index by one
					// to properly process the next entry).
					pendingInline.splice( i, 1 );
					i--;
				}
			}
		}
	}

	function sendPendingBRs( brsToIgnore )
	{
		while ( pendingBRs.length - ( brsToIgnore || 0 ) > 0 )
			currentNode.add( pendingBRs.shift() );
	}

	function addElement( element, target, enforceCurrent )
	{
		target = target || currentNode || fragment;

		// If the target is the fragment and this element can't go inside
		// body (if fixForBody).
		if ( fixForBody && !target.type )
		{
			var elementName, realElementName;
			if ( element.attributes
				 && ( realElementName =
					  element.attributes[ '_cke_real_element_type' ] ) )
				elementName = realElementName;
			else
				elementName =  element.name;
			if ( elementName
					&& !( elementName in CKEDITOR.dtd.$body )
					&& !( elementName in CKEDITOR.dtd.$nonBodyContent )  )
			{
				var savedCurrent = currentNode;

				// Create a <p> in the fragment.
				currentNode = target;
				parser.onTagOpen( fixForBody, {} );

				// The new target now is the <p>.
				target = currentNode;

				if ( enforceCurrent )
					currentNode = savedCurrent;
			}
		}

		// Rtrim empty spaces on block end boundary. (#3585)
		if ( element._.isBlockLike
			 && element.name != 'pre' )
		{

			var length = element.children.length,
				lastChild = element.children[ length - 1 ],
				text;
			if ( lastChild && lastChild.type == CKEDITOR.NODE_TEXT )
			{
				if ( !( text = CKEDITOR.tools.rtrim( lastChild.value ) ) )
					element.children.length = length -1;
				else
					lastChild.value = text;
			}
		}

		target.add( element );

		if ( element.returnPoint )
		{
			currentNode = element.returnPoint;
			delete element.returnPoint;
		}
	}

	parser.onTagOpen = function( tagName, attributes, selfClosing )
	{
		var element = new CKEDITOR.htmlParser.element( tagName, attributes );

		// "isEmpty" will be always "false" for unknown elements, so we
		// must force it if the parser has identified it as a selfClosing tag.
		if ( element.isUnknown && selfClosing )
			element.isEmpty = true;

		// This is a tag to be removed if empty, so do not add it immediately.
		if ( CKEDITOR.dtd.$removeEmpty[ tagName ] )
		{
			pendingInline.push( element );
			return;
		}
		else if ( tagName == 'pre' )
			inPre = true;
		else if ( tagName == 'br' && inPre )
		{
			currentNode.add( new CKEDITOR.htmlParser.text( '\n' ) );
			return;
		}

		if ( tagName == 'br' )
		{
			pendingBRs.push( element );
			return;
		}

		var currentName = currentNode.name;

		var currentDtd = currentName
			&& ( CKEDITOR.dtd[ currentName ]
				|| ( currentNode._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span ) );

		// If the element cannot be child of the current element.
		if ( currentDtd   // Fragment could receive any elements.
			 && !element.isUnknown && !currentNode.isUnknown && !currentDtd[ tagName ] )
		{

			var reApply = false,
				addPoint;   // New position to start adding nodes.

			// Fixing malformed nested lists by moving it into a previous list item. (#3828)
			if ( tagName in listBlocks
				&& currentName in listBlocks )
			{
				var children = currentNode.children,
					lastChild = children[ children.length - 1 ];

				// Establish the list item if it's not existed.
				if ( !( lastChild && lastChild.name in listItems ) )
					addElement( ( lastChild = new CKEDITOR.htmlParser.element( 'li' ) ), currentNode );

				returnPoint = currentNode, addPoint = lastChild;
			}
			// If the element name is the same as the current element name,
			// then just close the current one and append the new one to the
			// parent. This situation usually happens with <p>, <li>, <dt> and
			// <dd>, specially in IE. Do not enter in this if block in this case.
			else if ( tagName == currentName )
			{
				addElement( currentNode, currentNode.parent );
			}
			else if ( tagName in CKEDITOR.dtd.$listItem )
			{
				parser.onTagOpen( 'ul', {} );
				addPoint = currentNode;
				reApply = true;
			}
			else
			{
				if ( nonBreakingBlocks[ currentName ] )
				{
					if ( !returnPoint )
						returnPoint = currentNode;
				}
				else
				{
					addElement( currentNode, currentNode.parent, true );

					if ( !optionalClose[ currentName ] )
					{
						// The current element is an inline element, which
						// cannot hold the new one. Put it in the pending list,
						// and try adding the new one after it.
						pendingInline.unshift( currentNode );
					}
				}

				reApply = true;
			}

			if ( addPoint )
				currentNode = addPoint;
			// Try adding it to the return point, or the parent element.
			else
				currentNode = currentNode.returnPoint || currentNode.parent;

			if ( reApply )
			{
				parser.onTagOpen.apply( this, arguments );
				return;
			}
		}

		checkPending( tagName );
		sendPendingBRs();

		element.parent = currentNode;
		element.returnPoint = returnPoint;
		returnPoint = 0;

		if ( element.isEmpty )
			addElement( element );
		else
			currentNode = element;
	};

	parser.onTagClose = function( tagName )
	{
		// Check if there is any pending tag to be closed.
		for ( var i = pendingInline.length - 1 ; i >= 0 ; i-- )
		{
			// If found, just remove it from the list.
			if ( tagName == pendingInline[ i ].name )
			{
				pendingInline.splice( i, 1 );
				return;
			}
		}

		var pendingAdd = [],
			newPendingInline = [],
			candidate = currentNode;

		while ( candidate.type && candidate.name != tagName )
		{
			// If this is an inline element, add it to the pending list, if we're
			// really closing one of the parents element later, they will continue
			// after it.
			if ( !candidate._.isBlockLike )
				newPendingInline.unshift( candidate );

			// This node should be added to it's parent at this point. But,
			// it should happen only if the closing tag is really closing
			// one of the nodes. So, for now, we just cache it.
			pendingAdd.push( candidate );

			candidate = candidate.parent;
		}

		if ( candidate.type )
		{
			// Add all elements that have been found in the above loop.
			for ( i = 0 ; i < pendingAdd.length ; i++ )
			{
				var node = pendingAdd[ i ];
				addElement( node, node.parent );
			}

			currentNode = candidate;

			if ( currentNode.name == 'pre' )
				inPre = false;

			if ( candidate._.isBlockLike )
				sendPendingBRs();

			addElement( candidate, candidate.parent );

			// The parent should start receiving new nodes now, except if
			// addElement changed the currentNode.
			if ( candidate == currentNode )
				currentNode = currentNode.parent;

			pendingInline = pendingInline.concat( newPendingInline );
		}

		if ( tagName == 'body' )
			fixForBody = false;
	};

	parser.onText = function( text )
	{
		// Trim empty spaces at beginning of element contents except <pre>.
		if ( !currentNode._.hasInlineStarted && !inPre )
		{
			text = CKEDITOR.tools.ltrim( text );

			if ( text.length === 0 )
				return;
		}

		sendPendingBRs();
		checkPending();

		if ( fixForBody
			 && ( !currentNode.type || currentNode.name == 'body' )
			 && CKEDITOR.tools.trim( text ) )
		{
			this.onTagOpen( fixForBody, {} );
		}

		// Shrinking consequential spaces into one single for all elements
		// text contents.
		if ( !inPre )
			text = text.replace( /[\t\r\n ]{2,}|[\t\r\n]/g, ' ' );

		currentNode.add( new CKEDITOR.htmlParser.text( text ) );
	};

	parser.onCDATA = function( cdata )
	{
		currentNode.add( new CKEDITOR.htmlParser.cdata( cdata ) );
	};

	parser.onComment = function( comment )
	{
		checkPending();
		currentNode.add( new CKEDITOR.htmlParser.comment( comment ) );
	};

	// Parse it.
	parser.parse( fragmentHtml );

	// Send all pending BRs except one, which we consider a unwanted bogus. (#5293)
	sendPendingBRs( !CKEDITOR.env.ie && 1 );

	// Close all pending nodes.
	while ( currentNode.type )
	{
		var parent = currentNode.parent,
			node = currentNode;

		if ( fixForBody
			 && ( !parent.type || parent.name == 'body' )
			 && !CKEDITOR.dtd.$body[ node.name ] )
		{
			currentNode = parent;
			parser.onTagOpen( fixForBody, {} );
			parent = currentNode;
		}

		parent.add( node );
		currentNode = parent;
	}

	return fragment;
};

		
	},
	
	init: function (editor) 
	{
		
		
		var proto = CKEDITOR.style.prototype;
		var func = CKEDITOR.style.getStyleText;
				
		(function()
		{
			var blockElements	= { address:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,p:1,pre:1,section:1,header:1,footer:1,nav:1,article:1,aside:1,figure:1,dialog:1,hgroup:1,time:1,meter:1,menu:1,command:1,keygen:1,output:1,progress:1,details:1,datagrid:1,datalist:1 },
				objectElements	= { a:1,embed:1,hr:1,img:1,li:1,object:1,ol:1,table:1,td:1,tr:1,th:1,ul:1,dl:1,dt:1,dd:1,form:1,audio:1,video:1 };
		
			var semicolonFixRegex = /\s*(?:;\s*|$)/,
				varRegex = /#\((.+?)\)/g;
		
			var notBookmark = CKEDITOR.dom.walker.bookmark( 0, 1 ),
				nonWhitespaces = CKEDITOR.dom.walker.whitespaces( 1 );
				
				
			var varRegex = /#\((.+?)\)/g;
			
			function replaceVariables( list, variablesValues )
			{
				for ( var item in list )
				{
					list[ item ] = list[ item ].replace( varRegex, function( match, varName )
						{
							return variablesValues[ varName ];
						});
				}
			}		
			
			CKEDITOR.style = function( styleDefinition, variablesValues )
			{
				if ( variablesValues )
				{
					styleDefinition = CKEDITOR.tools.clone( styleDefinition );
		
					replaceVariables( styleDefinition.attributes, variablesValues );
					replaceVariables( styleDefinition.styles, variablesValues );
				}
		
				var element = this.element = styleDefinition.element ?
						( typeof styleDefinition.element == 'string' ? styleDefinition.element.toLowerCase() : styleDefinition.element )
						: '*';
		
				this.type =
					blockElements[ element ] ?
						CKEDITOR.STYLE_BLOCK
					: objectElements[ element ] ?
						CKEDITOR.STYLE_OBJECT
					:
						CKEDITOR.STYLE_INLINE;
		
				// If the 'element' property is an object with a set of possible element, it will be applied like an object style: only to existing elements
				if ( typeof this.element == 'object' )
					this.type = CKEDITOR.STYLE_OBJECT;
		
				this._ =
				{
					definition : styleDefinition
				};
			};
		})();  
		
		CKEDITOR.style.prototype = proto;
		CKEDITOR.style.getStyleText = func;
    }

});