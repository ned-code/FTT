// jquery.truncate.js
// 
// 0.1
// Stephen Band
// 
// Truncates the html of a node so that the node is no greater than one line high

(function(undefined){
	
	var options = {};
	
	jQuery.fn.truncate = function(o){
		
		return this.each(function(){
			var node = jQuery(this),
					data = node.data('truncate'),
					html = data && data.html || node.html(),
					height = node.height(),
					length = html.length;
			
			if ( !options.height ) {
				// Find out how high it would be with only a space in it
				options.height = node.html('&nbsp;').height();
				node.html( html );
			}
			
			if ( !data ) {
				node.data('truncate', {
					html: html
				});
			}
			
			// When the text is big, roughly hack off the chunk we don't need
			// Remember 'm's are thicker than 'i's so we can't be too brutal 
			// with the hacking-off factor.
			if ( height > options.height * 2.8 ) {
				length = Math.ceil( length * options.height * 2.8 / height );
			}
			
			// Reduce length letter by letter
			while ( length-- && node.height() > options.height ){
				
				// Reduce letters until we find a space
				// TODO: needs more logic, because not all text has spaces
				//while ( length-- && html[ length ] !== ' ' ) {}
				
				node.html( html.slice(0, length) + '&hellip;' );
			}
		});
	};
})();