// jQuery.scrollbars.js
// 
// Stephen Band
// 
// 0.2
// 
// initial port from POC code.

(function( jQuery, undefined ){
	
	var debug = false; //(window.console && console.log);
	var options = {};
	
	function update( elem, scroll, options ){

		var width, height;
		
		if (options.x) {
		  
		  width = elem.width();
		  
		  scroll.x = elem.scrollLeft();
		  scroll.xmax = elem.scrollLeft(9999999).scrollLeft();
		  scroll.xsize = width / (width + scroll.xmax);
		  scroll.xratio = scroll.x / scroll.xmax;
		  scroll.xtravel = options.x.css({ WebkitTransition: 'none', width: '100%' }).width();
		  
		  options.x.css({ WebkitTransition: 'left 0.025s linear, width 0.1s linear', width: scroll.xsize * 100 + '%' });
		  elem.scrollLeft( scroll.x );
		}
		
		if (options.y) {
			
			height = elem.height();
			
		  scroll.y = elem.scrollTop();
		  scroll.ymax = elem.scrollTop(9999999).scrollTop();
		  scroll.ysize = height / (height + scroll.ymax);
		  scroll.yratio = scroll.y / scroll.ymax;
		  scroll.ytravel = options.y.css({ WebkitTransition: 'none', height: '100%' }).height();
		  
		  options.y.css({ WebkitTransition: 'top 0.025s linear, height 0.1s linear', height: scroll.ysize * 100 + '%' });
		  elem.scrollTop( scroll.y );
		}

	}
	
	jQuery.fn.scrollbars = function( o ){
		
		var options = jQuery.extend( {}, jQuery.fn.scrollbars.options, o ),
				elem = this.eq(0),
				icon = new Image(),
				store = {},
				scroll = {};
		
		update( elem, scroll, options );
		
		// Trigger update when stuff resizes. This is a 
		// tricky one, there are going to be more conditions when
		// we need to update...
		jQuery(window).bind('resize', function(){
			update( elem, scroll, options );
		});
		
		elem.bind('scroll', function(e){
			
			var elem = jQuery(this);
			
			if (options.x) {
				scroll.x = elem.scrollLeft();
				scroll.xratio = scroll.x / scroll.xmax;
				options.x.css({ left: scroll.xratio * (1 - scroll.xsize) * 100 + '%' });
			}
			
			if (options.y) {
				scroll.y = elem.scrollTop();
				scroll.yratio = scroll.y / scroll.ymax;
				options.y.css({ top: scroll.yratio * (1 - scroll.ysize) * 100 + '%' });
			}
			
		});
		
		// WebKit won't move the scrollbars without an image to
		// use as a drag image.
		icon.src = "images/icon_blank.png";
		
		// Set up dragging of the handle
		options.x
		.bind('dragstart', function(e){
			
			if (debug) { console.log('EVENT '+e.type, e); }
			
			var eOrig = e.originalEvent;
			
			// FireFox must have have data bound here or it doesn't
			// fire any of the other drag and drop events.
			eOrig.dataTransfer.setData("scroll", "x");
			eOrig.dataTransfer.setDragImage(icon, 12, 12);
			eOrig.dataTransfer.effectAllowed = "none";
			
			store.xstartpos = e.pageX;
			store.xstartratio = scroll.xratio;
			
		  return true;
		});
		
		options.y
		.bind('dragstart', function(e){
			
			if (debug) { console.log('EVENT '+e.type, e); }
			
			var eOrig = e.originalEvent;
			
			// FireFox must have have data bound here or it doesn't
			// fire any of the other drag and drop events.
			eOrig.dataTransfer.setData("scroll", "y");
			eOrig.dataTransfer.setDragImage(icon, 12, 12);
			eOrig.dataTransfer.effectAllowed = "none";
			
			store.ystartpos = e.pageY;
			store.ystartratio = scroll.yratio;
			
		  return true;
		});
		
		// FireFox does not report mouse coordinates on drag event.
		// That's pretty annoying, actually. It means we have to
		// use dragover event on something else.
		
		jQuery(document)
		.bind('dragenter dragover dragleave', function(e) {
			
			if (debug) { console.log('EVENT '+e.type, e); }
			
			var dataTransfer = e.originalEvent.dataTransfer,
					travel, diff, ratio;
			
			if ( (dataTransfer.getData("scroll") === 'x') && (e.pageX !== store.x) ) {
				store.x = e.pageX;
				
				travel = ( 1 - scroll.xsize ) * scroll.xtravel ;
				diff = ( store.x - store.xstartpos ) / travel ;
				ratio = store.xstartratio + diff;
				
				elem.scrollLeft( scroll.xmax * ratio );
			}
			
			if ( (dataTransfer.getData("scroll") === 'y') && (e.pageY !== store.y) ) {
				store.y = e.pageY;
				
				travel = ( 1 - scroll.ysize ) * scroll.ytravel ;
				diff = ( store.y - store.ystartpos ) / travel ;
				ratio = store.ystartratio + diff;
				
				elem.scrollTop( scroll.ymax * ratio );
			}
			
		});
		
		return this;
	};
	
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