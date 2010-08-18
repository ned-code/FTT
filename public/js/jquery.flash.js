// jguery.flash.js
// 0.4
// Stephen Band
//
// Takes Rail's message (#flash) and provides javascript control
// over it (eg. for ajax messages). Flash is a singleton, so we can
// keep data in the closure rather than attaching it to the DOM node.

(function(jQuery, undefined){
	var debug = (window.console && console.log);
	
	var plugin = 'flash',
			options = {
				selector: '#flash',
				delay: 2800,
				showDuration: 200,
				hideDuration: 1800
			},
			flash, timer,
			state = 0;  // 0 is hidden, 1 is shown [, 2 is animating to hide, 3 is animating to show - not implemented yet]
	
	function show( options, callback ) {
		// Open flash
		flash
		.appendTo('body')
		.addTransitionClass('active', function(){
			state = 1;
			callback && callback();
		});
	}
	
	function hide( options, callback ) {
		// Close flash
		flash
		.removeTransitionClass('active', function(){
			state = 0;
			flash.remove();
			callback && callback();
		});
	}
	
	jQuery.fn[plugin] = function(o){
		// Overwrite options
		var options = jQuery.extend({}, jQuery.fn[plugin].options, o),
				message = jQuery('<div/>', {
					'class': "flash_message"
				});
		
		message.html( this );
		
		// Put the message in the flash...
		if (state === 0) {
			flash.html( message );
		}
		else {
			flash.append( message );
			
			// Reset timer
			clearTimeout( timer );
			timer = null;
		}
		
		if (state === 0) {
			show( options, options.showCallback );
		}
		
		timer = setTimeout(function(){
			timer = null;
			
		  if ( state === 1 ) {
				hide( options, options.hideCallback );
			}
		}, options.delay);
		
		return this;
	};
	
	jQuery(document).ready(function(){
		// Cache the flash container
		flash = jQuery( options.selector );
		
		// If flash doesn't exist, create it
		if ( flash.length === 0 ) {
			debug && console.log('[flash] #flash doesnt exist - creating it now');
			flash = jQuery('<div/>', {
				id: 'flash',
				css: { marginTop: -200 }
			});
		}
		
		// If flash is open on load, delay for a while, check again, then hide it
		else if ( flash.hasClass('active') ) {
			state = 1;
			
			timer = setTimeout(function(){
				timer = null;
				
				if ( state === 1 ) {
					hide( options );
				}
			}, options.delay);
		}
		else {
		  flash
		  .css({ display: '' })
		  .remove();
		}
	});
	
	// Export
	jQuery.fn[plugin].hide = hide;
	jQuery.fn[plugin].options = options;
	
})(jQuery);