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
			flash,
			state = 0;  // 0 is hidden, 1 is shown [, 2 is animating to hide, 3 is animating to show - not implemented yet]
	
	function show( options, callback ) {
		// Open flash
		
		flash
		.appendTo('body')
		.addTransitionClass('active', function(){
			state = 1;
			callback && callback();
		});
		
//		.animate({
//			opacity: 1,
//			marginTop: 0
//		}, {
//			duration: options.showDuration,
//			complete: function(){
//				state = 1;
//				callback && callback();
//			}
//		});
	}
	
	function hide( options, callback ) {
		var height = flash.height();
		
		// Close flash
		flash
		.removeTransitionClass('active', function(){
			state = 0;
			flash.remove();
			callback && callback();
		});
		
//		.stop()
//		.animate({
//			opacity: 0.2,
//			marginTop: -height
//		}, {
//			duration: options.hideDuration,
//			easing: 'easeInCubic',
//			complete: function(){
//				state = 0;
//				flash.remove();
//				callback && callback();
//			}
//		});
	}
	
	jQuery.fn[plugin] = function(o){
		// Overwrite options
		var options = jQuery.extend({}, jQuery.fn[plugin].options, o);
		
		// Put the message in the flash...
		flash.html(this);
		
		if (state === 0) {
			show( options, arguments[1] || options.showCallback );
		}
		
		setTimeout(function(){
		  if ( state === 1 ) {
				hide( options, arguments[2] || options.hideCallback );
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
			
			setTimeout(function(){
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