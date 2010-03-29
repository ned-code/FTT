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
				origin: [12, 12],
				// attachTo
				// initCallback
				// openCallback
				// closeCallback
				// width
				// height
				// openEasing
				// closeEasing
				// (orientation) ??
				cancelSelector: 'a[href=#cancel], .cancel',
				cancelEvent: 'close'
			},
			body,
			windowSize,
			bodyScroll;
	
	function closeHandler(e) {
		jQuery.fn[plugin].close();
	}
	
	function updateBodySize(e) {
		var win = jQuery(window);
		
		windowSize = {
			width: win.width(),
			height: win.height()
		};
	}
	function updateScroll(e) {
		bodyScroll = {
			top: body.scrollTop(),
			left: body.scrollLeft()
		};
	}
	
	function makeWrapCss( node ){
		var	offset = node.offset(),
				width = node.outerWidth(),
				height = node.outerHeight();
		
		return {
			left: offset.left + 0.88 * width - bodyScroll.left,
			top: offset.top + 0.5 * height - bodyScroll.top
		};
	}
	
	function makePopCss( node, origin, wrapCss ){
		var factor = wrapCss.top / windowSize.height,
				transform = '11px ' + factor*node.height() + 'px';
		
		return {
			left: - origin[0],
			top:  - factor*node.height() - origin[1],
			WebkitTransformOrigin: transform,
			MozTransformOrigin: transform,
			transformOrigin: transform
		};
	}
	
	jQuery.fn[plugin] = function(o){
		// Overwrite options
		var options = jQuery.extend({}, jQuery.fn[plugin].options, o);
		
		// Define actions
		return this.each(function(i) {
			var pop = jQuery(this),
					node = options.attachTo || body,
					wrapCss = makeWrapCss( node ),
					wrap = jQuery('<div/>', {
						'class': options.popWrapClass,
						css: wrapCss
					}),
					popCss,
					diffY;
			
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
			
			jQuery(window).bind('scroll.'+plugin, function(){
				wrapCss = makeWrapCss( node );
				popCss = makePopCss( pop, options.origin, wrapCss );
				
				wrap.css( wrapCss );
				pop.css( popCss );
			});
			
			pop
			.addClass( options.popClass );
			
			wrap
			.html( pop )
			.appendTo( body )
			// Bind close event
			.bind(options.cancelEvent+plugin, closeHandler)
			// Bind cancel button detector
			.delegate(options.cancelSelector, 'click.'+plugin, closeHandler);
			
			// Bind the lose focus detector to body (just once)
			if ( i === 0 ) {
				// Wait till this thread has finished
				var t = setTimeout(function() {
					
					jQuery(document)
					// Focus gets lost
					.bind( 'click.'+plugin + ' focusin.' + plugin, function(e){
						// .closest() has problems with context - I've had to resort to .has()
						if ( wrap.has( e.target ).length === 0 ) {
							jQuery.fn[plugin].close();
						}
					})
					// Escape key is pressed
					.bind('keydown.' + plugin, function(e){
						if (e.which === 27) {
							jQuery.fn[plugin].close();
						}
					});
					
					t = null;
				
				}, 0);
			}
			
			// Send the callback before we start animating
			if ( options.initCallback ) { options.initCallback.call( pop ); }
			
			// Animate using transform
			popCss = makePopCss( pop, options.origin, wrapCss );
			popCss.opacity = 0;
			
			pop.css( popCss );
			
			jQuery({
				transform: 0.2
			})
			.animate({
				transform: 1
			}, {
				step: function(a){
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
		jQuery(window).bind('scroll.'+plugin, updateScroll);
		
		updateBodySize();
		updateScroll();
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