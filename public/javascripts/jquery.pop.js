// jquery.pop.js
// 0.3
// Stephen Band
// 
// http://webdev.stephband.info

(function(jQuery, undefined){

	var plugin = 'pop',
			options = {
				popClass: plugin,
				popWrapClass: plugin+'-wrap',
				origin: [12, 12]
				// attachTo
				// initCallback
				// openCallback
				// closeCallback
				// width
				// height
				// openEasing
				// closeEasing
				// (orientation) ??
			},
			bodySize,
			body;
	
	function closeHandler(e) {
		jQuery.fn[plugin].close();
	}
	
	function updateBodySize(e) {
		bodySize = {
			width: body.width(),
			height: body.height()
		};
	}
	
	jQuery.fn[plugin] = function(o){
		// Overwrite options
		var options = jQuery.extend({}, jQuery.fn[plugin].options, o);
		
		// Define actions
		return this.each(function(i) {
			var node = options.attachTo || body,
					offset = node.offset(),
					width = node.outerWidth(),
					height = node.outerHeight(),
					pop = jQuery(this),
					wrapCss = {
						left: offset.left + 0.5 * width,
						top: offset.top + 0.5 * height
					}
					wrap = jQuery('<div/>', {
						'class': options.popWrapClass,
						css: wrapCss
					}),
					popShutCss = {
						opacity: 0
					}
					originX = options.origin[0],
					originY = options.origin[1];
			
			// Close existing instances
			if ( jQuery.fn[plugin].instances.length ) {
		    jQuery.fn[plugin].close();
			}
			
			// Store data
			jQuery.fn[plugin].instances.push({
				options: options,
				node: pop,
				wrap: wrap
			});
			
			pop
			.addClass( options.popClass );
			
			wrap
			.html( pop )
			.appendTo( body )
			// Bind close event
			.bind('close.'+plugin, closeHandler)
			// Bind cancel button detector
			.delegate('a[href=#cancel]', 'click.'+plugin, closeHandler);
			
			// Bind the lose focus detector to body (just once)
			if ( i === 0 ) {
				// Wait till this thread has finished
				var t = setTimeout(function() {
					
					jQuery(document)
					// Focus gets lost
					.bind('click.' + plugin + ' focusin.' + plugin, function(e){
						// .closest() has problems with context - I've had to resort to .has()
						if ( wrap.has( e.target ).length === 0 ) {
							jQuery.fn[plugin].close();
						}
					})
					// Escape key is pressed
					.bind('keydown.' + plugin, function(e){
						if (event.which === 27) {
							jQuery.fn[plugin].close();
						}
					});
					
					t = null;
				
				}, 0);
			}
			
			// Send the callback before we start animating
			if ( options.initCallback ) { options.initCallback.call( pop ); }
			
			// Figure out orientation
			popShutCss[ wrapCss.left + pop.width() < bodySize.width ? 'left' : 'right' ] = -originX;
			//popShutCss[ wrapCss.top + pop.height() < bodySize.height ? 'top' : 'bottom' ] = -originY;
			popShutCss.top = -originY;
			popShutCss.WebkitTransformOrigin = originX + 'px ' + originY + 'px';
			popShutCss.MozTransformOrigin = originX + 'px ' + originY + 'px';
			
			// Animate using transform
			pop
			.css( popShutCss );
			
			jQuery({
				transform: 0.2
			})
			.animate({
				transform: 1
			}, {
				step: function(a){
					//console.log(a);
					var scale = 'scale('+a+')';
					
					pop.css({
						WebkitTransform: scale,
						MozTransform: scale,
						opacity: a
					});
				},
				duration: 200,
				easing: options.openEasing,
				complete: function(){
					if ( options.openCallback ) options.openCallback() ;
				}
			});
		});
	};
	
	jQuery.extend(jQuery.fn[plugin], {
		options: options,
		instances: [],
		close: function() {
			var l = this.instances.length,
					instance;
			
			// Unbind 'lose focus' detection
			jQuery(document).unbind('.' + plugin);
			
			while (l--) {
				instance = this.instances.pop(),
				closeFn = instance.options.closeCallback;
				
				if ( closeFn ) { closeFn(); }
				
				// Animate using transform
				jQuery({
					transform: 1
				})
				.animate({
					transform: 0.2
				}, {
					step: function(a){
						var scale = 'scale('+a+')';
						
						instance.node.css({
							WebkitTransform: scale,
							MozTransform: scale,
							opacity: a
						});
					},
					duration: 200,
					easing: options.closeEasing,
					complete: function() {
						instance.wrap.remove();
					}
				});
			}
		}
	});
	
	jQuery.fn[plugin].options = options;
	
	jQuery(document).ready(function(){
		body = jQuery('body');
		
		jQuery(window).bind('resize.'+plugin, updateBodySize);
		
		updateBodySize();
	});
})(jQuery);


// TODO: put this setup somewhere more sensible

jQuery.extend(jQuery.fn.pop.options, {
  // Some of these should really be put in a global setup
  popWrapClass: 'ui ui-pop-position',
  popClass: 'ui-pop ui-widget ui-corner-all',
  openEasing: 'easeOutBack',
  shutEasing: 'easeInQuart'
});