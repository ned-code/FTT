// jguery.flash.js
// 0.3
// Stephen Band
//
// Takes Rail's message (#flash) and provides javascript control
// over it (eg. for ajax messages).

(function(jQuery, undefined){
	var plugin = 'flash',
			options = {
				selector: '#flash',
				delay: 2600,
				showDuration: 200,
				hideDuration: 1800
			},
			flash,
			state = 0;  // 0 is hidden, 1 is shown [, 2 is animating to hide, 3 is animating to show - not implemented yet]
	
	function show( options, callback ) {
		// Open flash
		flash
		.appendTo('body')
		.animate({
			opacity: 1,
			marginTop: 0
		}, {
			duration: options.showDuration,
			complete: function(){
				state = 1;
				callback && callback();
			}
		});
	}
	
	function hide( options, callback ) {
		var height = flash.height();
		
		// Close flash
		flash
		.stop()
		.animate({
			opacity: 0.2,
			marginTop: -height
		}, {
			duration: options.hideDuration,
			easing: 'easeInCubic',
			complete: function(){
				state = 0;
				flash.remove();
				callback && callback();
			}
		});
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
		
		// If flash is open on load, delay for a while, check again, then hide it
		if ( flash.hasClass('active') ) {
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