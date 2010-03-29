// jquery.truncate.js
// 
// 0.2
// Stephen Band
// 
// Truncates the html of a node so that the node is no greater than one line high
// Options:
// height				- the ideal height.  Html is truncated until node is shorter in height
// testContent	- the ideal amount of content. Html is truncated to be shorter in height

(function(undefined){
	
	var options = {
		marker: '&hellip;',
		testContent: '&nbsp;'
		//height: false
	};
	
	jQuery.fn.truncate = function(text, o){
		if (typeof text !== 'string') {
			o = text;
			text = undefined;
		}
		
		o = jQuery.extend({}, options, o);
		
		return this.each(function(){
			var node = jQuery(this),
					data = node.data('truncate'),
					html = text || data && data.html || node.html(),
					newHtml = html,
					height = node.height(),
					testHeight = o.height,
					length = html.length,
					testNode = jQuery('<span/>');
			
			if ( !data ) {
				node.data('truncate', {
					html: html
				});
			}
			
			node.html( testNode );
			
			if ( !testHeight ) {
				// Find out how high it would be with the test content in it
				testHeight = testNode.html( o.testContent ).height();
			}
			
			// When the text is big, roughly hack off the chunk we don't need
			// Remember 'm's are thicker than 'i's so we can't be too brutal 
			// with the hacking-off factor.
			if ( height > testHeight * 2.8 ) {
				length = Math.ceil( length * testHeight * 2.8 / height );
				newHtml = html.slice(0, length);
			}
			
			testNode.html( newHtml );
			
			// Reduce length letter by letter
			while ( length-- && testNode.height() > testHeight ){
				// Reduce letters until we find a space
				// TODO: needs more logic, because not all text has spaces
				//while ( length-- && html[ length ] !== ' ' ) {}
				
				newHtml = html.slice(0, length) + o.marker;
				testNode.html( newHtml );
			}
			
			// Get rid of testNode
			node.html( newHtml );
		});
	};
})();