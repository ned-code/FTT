// jQuery.scrollbars.js
// 
// Stephen Band
// 
// 0.3
// 
// initial port from POC code.

(function( jQuery, undefined ){
	

	var debug = (window.console && console.log);
	var options = {};
	
	function update( elem, scroll, options ){

		var width, height;
		
		if (options.x) {
		  
		  width = elem.width();
		  
		  scroll.x = elem.scrollLeft();
		  scroll.xmax = elem.scrollLeft(9999999).scrollLeft();
		  scroll.xsize = width / (width + scroll.xmax);
		  scroll.xratio = scroll.x / scroll.xmax;
		  scroll.xtravel = options.x.addClass('no_transition').css({ width: '100%' }).width();
		  
		  options.x
		  .removeClass('no_transition')
		  .css({
		  	width: scroll.xsize * 100 + '%',
		  	opacity: scroll.xsize === 1 ? 0 : 1 
		  });
		  elem.scrollLeft( scroll.x );
		}
		
		if (options.y) {
			
			height = elem.height();
			
		  scroll.y = elem.scrollTop();
		  scroll.ymax = elem.scrollTop(9999999).scrollTop();
		  scroll.ysize = height / (height + scroll.ymax);
		  scroll.yratio = scroll.y / scroll.ymax;
		  scroll.ytravel = options.y.addClass('no_transition').css({ height: '100%' }).height();
		  
		  options.y
		  .removeClass('no_transition')
		  .css({
		  	height: scroll.ysize * 100 + '%',
		  	opacity: scroll.ysize === 1 ? 0 : 1
		  });
		  elem.scrollTop( scroll.y );
		}

	}
	
	function moveBarX( elem, options, scroll ){
		scroll.x = elem.scrollLeft();
		scroll.xratio = scroll.x / scroll.xmax;
		options.x.css({ left: scroll.xratio * (1 - scroll.xsize) * 100 + '%' });
	}
	
	function moveBarY( elem, options, scroll ){
		scroll.y = elem.scrollTop();
		scroll.yratio = scroll.y / scroll.ymax;
		options.y.css({ top: scroll.yratio * (1 - scroll.ysize) * 100 + '%' });
	}
	
	jQuery.fn.scrollbars = function( o ){
		
		var options = jQuery.extend( {}, jQuery.fn.scrollbars.options, o ),
				elem = this.eq(0),
				store = {},
				scroll = {};
		
		update( elem, scroll, options );
		
		// Trigger update when stuff resizes. This is a 
		// tricky one, there may be more conditions when
		// we need to update...
		jQuery(window)
		.add(elem)
		.bind('resize', function(){
			update( elem, scroll, options );
		});
		
		elem.bind('scroll', function(e){
			
			// If this scrollbar exists, and isn't been grabbed
			// directly by the mouse
			if ( options.x ) {
				moveBarX( elem, options, scroll );
			}
			
			if ( options.y ) {
				moveBarY( elem, options, scroll );
			}
			
		});
		
		// Set up dragging of the handle
		if (options.x) {
		
			options.x
			.bind('mousedown.scrollbars', function(e){
				
				e.preventDefault();
				
				// Take direct control of the bar and store initial mouse pos
				//scroll.xgrabbed = true;
				
				store.xstartpos = e.pageX;
				store.xstartratio = scroll.xratio;
				options.x.addClass('no_transition');
				
				jQuery(document)
				.bind('mousemove.scrollbars', function(e){
					
					if (debug) { console.log('EVENT '+e.type, e); }
					
					var travel, diff, ratio;
					
					if ( e.pageX !== store.x ) {
						store.x = e.pageX;
						
						travel = ( 1 - scroll.xsize ) * scroll.xtravel ;
						diff = ( store.x - store.xstartpos ) / travel ;
						ratio = store.xstartratio + diff;
						
						//limit ratio to range 0-1
						ratio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio ;
						
						elem.scrollLeft( scroll.xmax * ratio );
					}
					
				})
				.bind('mouseup.scrollbars', function(e){
					
					if (debug) { console.log('EVENT '+e.type, e); }
					
					jQuery(this).unbind('mousemove.scrollbars mouseup.scrollbars');
					//scroll.xgrabbed = false;
					options.x.removeClass('no_transition');
					
				});
				
			});
		
		}
		
		if (options.y) {
		
			options.y
			.bind('mousedown.scrollbars', function(e){
				
				e.preventDefault();
				
				// Take direct control of the bar
				scroll.ygrabbed = true;
				
				store.ystartpos = e.pageY;
				store.ystartratio = scroll.yratio;
				
				jQuery(document)
				.bind('mousemove.scrollbars', function(e){
					
					if (debug) { console.log('EVENT '+e.type, e); }
					
					var travel, diff, ratio;
					
					if ( e.pageY !== store.y ) {
						store.y = e.pageY;
						
						travel = ( 1 - scroll.ysize ) * scroll.ytravel ;
						diff = ( store.y - store.ystartpos ) / travel ;
						ratio = store.ystartratio + diff;
						
						elem.scrollTop( scroll.ymax * ratio );
					}
					
				})
				.bind('mouseup.scrollbars', function(e){
					
					if (debug) { console.log('EVENT '+e.type, e); }
					
					jQuery(this).unbind('mousemove.scrollbars mouseup.scrollbars');
					scroll.ygrabbed = false;
					
				});
				
			});
		
		}
		
		// Return jQuery collection to chain
		return this;
	}
	
	jQuery.fn.scrollbars.options = options;
	
})( jQuery );


//  // The last thing to do is enable clicking on the control bar
//  
//  control
//  .bind('mousedown', function(e){
//    if (debug) { console.log('EVENT '+e.type); }
//    
//    // Don't do anything if the click was on a child
//    // of control
//    if (this !== e.target) { return; }
//    
//    var controlPos = control.offset().top;
//    
//    scrollRatio = (e.pageY - controlPos)/controlHeight;
//    
//    scroll.scrollTop( maxScroll * scrollRatio );
//  });
//});