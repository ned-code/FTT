// jquery.list.js
// 
// 0.1
// 
// Stephen Band
//
// Populates a node with a list of links constructed from an object or array
// (first argument). Optionally takes another object (second argument) that
// maps properties of the first object to html attributes

(function(jQuery, undefined){
	var options = {
				itemTag: 'li',
				linkTag: 'a',
				textProperty: 'text',
				path: '#'
			},
			
			//debug = (window.console && window.console.log),
			debug = false;
			
			maps = {
				a: {
					href: ['#', true],
					title: true,
					text: true
				},
				input: {
					type: 'type',
					value: 'value'
				}
			},
			
			ignore = {
				tag: true
			};
	
	// typeOf function that distinguishes Objects from Arrays
	// http://javascript.crockford.com/remedial.html
	if (!window.typeOf) {
		function typeOf(value) {
			var s = typeof value;
			if (s === 'object') {
				if (value) {
					if (value instanceof Array) {
						s = 'array';
					}
				} else {
					s = 'null';
				}
			}
			return s;
		}
	}
	
	function itemString(obj, key, map, linkTag){
		// Item contents
		var itemObj = obj[key],
				content = ['<', linkTag],
				attr, prefix, value, postfix, mattr, textPre, textVal, textPost;
		
		for (attr in map) {
			// Ignore the tag attribute, dumbass!
			if ( ignore[attr] ) { continue; }
			
			prefix = undefined;
			postfix = undefined;
			mattr = map[attr];
			
			// Append everything else as attributes, if they exist
			if ( typeOf(mattr) === 'array' ) {
				prefix = mattr[0];
				postfix = mattr[2];
				mattr = mattr[1];
			}
			
			value = (mattr === true) ? key : (typeof itemObj[mattr] === 'function') ? itemObj[mattr]() : itemObj[mattr] ;
			
			if (prefix !== undefined || value !== undefined) {
				if (attr === 'text') {
					textPre = prefix;
					textVal = value;
					textPost = postfix;
				}
				else {
					content.push(' ', attr, '="', prefix, value, postfix, '"');
				}
			}
		}
		
		content.push('>', textPre, textVal, textPost, '</', linkTag, '>');
		
		return content.join('');
	}
	
	function listString(obj, map, itemTag, linkTag){
		var	type = typeOf(obj),
				itemTagOpen = '<' + itemTag,
				itemTagClose = '</' + itemTag + '>',
				html = '',
				key, length;
		
		if ( type === 'object' ) {
			for (key in obj) {
				html += itemTagOpen + '>' + itemString( obj, key, map, linkTag ) + itemTagClose;
			}
		}
		else if ( type === 'array' ) {
			length = obj.length;
			key = 0;
			
			while ( key < length ) {
				html += itemTagOpen + '>' + itemString( obj, key, map, linkTag ) + itemTagClose;
				key++;
			}
		}
		
		if (debug) { console.log(html); }
		
		return html;
	}
	
	jQuery.list = function(obj, m){
		var node = jQuery('<ul/>'),
				map = m || maps.a,
				html = listString(obj, map, 'li', 'a');
		
		return node.html( html );
	};
	
	jQuery.fn.list = function(obj, o){
		//var options = jQuery.extend({}, jQuery.fn.populate.options, o),
		//		m = options.map,
		//		constants = options.prefixes;
		var m = o;
		
		return this.each(function(){
			var tagName = this.nodeName.toLowerCase(),
					map, html;
			
			if (tagName === 'ul' || tagName === 'ol' || tagName === 'menu') {
				map = m || maps.a;
				
				html = listString(obj, map, 'li', 'a');
			}
			else if (tagName === 'form') {
				map = m || maps.input;
				
				html = listString(obj, map, 'div', 'input');
			}
			else {
				// When not an itemisable tag, ignore it
				return;
			}
			
			jQuery(this).html(html);
		});
	};
	
	jQuery.list.options = options;
	jQuery.fn.list.options = options;
	
})(jQuery);