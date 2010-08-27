jQuery.fn.rotatable = function(settings,to) {
	settings = jQuery.extend({
		startAngle : 0,
 		hideHandler : true,
 		handlerSelect : '.handle_rotate',
		callBack: function() { }
	}, settings);
	
	
		return this.each(function(){
				if (settings.startAngle != 0) {
					var matches = settings.startAngle.match(/(\d+)/);
					settings.startAngle = matches[0];
				}
 			  	obj = $(this);
    	
    			obj.append('<div class="handle_rotate"><img src="/images/apps/rotate.png" /></div>');
    			obj.updateToolPosition({item:obj,angle:settings.startAngle});
    			obj.children(settings.handlerSelect).draggable({
    				handle: settings.handlerSelect,
    				opacity: 0.01, 
   			 		helper: 'clone',
   			 		start: function(event,ui) {
   			 			currOffset  = obj.offset();
   			 			var x = (obj.width() / 2) - (event.pageX - currOffset.left);
 						var y = (obj.height() / 2) - (event.pageY - currOffset.top);
 						
   			 		//	dragStartAngle = Math.atan2(x, y) + settings.startAngle;
   			 			dragStartAngle = Math.atan2(x, y);
   			 			

   			 		},
    				drag: function(event, ui){
    					currOffset  = obj.offset();
    					var x = (obj.width() / 2) - (event.pageX - currOffset.left);
 						var y = (obj.height() / 2) - (event.pageY - currOffset.top);
 						
 						var diff = dragStartAngle - Math.atan2(x, y);
 						
 						
 						angle = Math.round(diff * (180 / Math.PI));

 						
 						//var angle = Math.round(Math.atan2(x, y)* 180 / Math.PI);
 		
 						if (angle < 0) {
    				      angle += 360;
    				   	}
 					
    				    // Very small angles produce an unexpected result because they are
    				    // converted to a scientific notation string.
    				    if (angle < 1e-6) {
    				      angle = 0;
    				    }
    				        					
    					var rotateCSS = 'rotate(' + angle + 'deg)';
			
    		   			obj.css({
    		     	   		'-moz-transform': rotateCSS,
    		     	   		'-webkit-transform': rotateCSS
    		    		});
						//	obj.children(settings.handlerSelect).hide();
						obj.children('.item_tool').hide();
					
    				},
    				stop: function(event,ui) {
    					var reverseRotationCSS = 'rotate(-' + angle + 'deg)';
    					var vartoparse = 'rotate(' + angle + 'deg)';
    					
    				    					    					
    					obj.children(settings.handlerSelect).fadeIn();
    					obj.children('.item_tool').css({
    		     	   		'-moz-transform': reverseRotationCSS,
    		     	   		'-webkit-transform': reverseRotationCSS
    		    		}).fadeIn();
    					settings.callBack(vartoparse);
    					obj.updateToolPosition({
    						item:obj,
    						angle:vartoparse
    					});
    				}
    				
				})
 			
 			});
};


 $.fn.rotatableDestroy = function() {
 	return this.each(function() {
 		$(this).children('.handle_rotate').remove();
 		$(this).children('.handle_resize').remove();
 	});
 }
 
 
  $.fn.resizeWithRatio = function(settings) {
	settings = jQuery.extend({
		startAngle:0,
		callBack: function() { }
	}, settings);
  
 	return this.each(function() {
 			if (settings.startAngle != 0) {
					var matches = settings.startAngle.match(/(\d+)/);
					settings.startAngle = matches[0];
			}
 		var oriWidth = 0;
 		var oriHeight = 0;
 		var destHeight = 0;
 		var destWidth = 0;
 		obj = $(this);
		obj.append('<div class="handle_resize"><img src="/images/apps/arrow-resize-135.png" /></div>');
		
		obj.children(".handle_resize").draggable({
				handle: $(".handle_resize"),
    				opacity: 0.01, 
   			 		helper: 'clone',
   			 start: function(event,ui) {
   			 	oriWidth = obj.width();
   			 	oriHeight = obj.height();
   			 },
   			 
			drag: function(event, ui){
			currOffset  = obj.offset();
				var aspectRatio = oriWidth / oriHeight;
				newHeight = event.pageY-currOffset.top;
				obj.height(newHeight);				
				obj.width(Math.round(aspectRatio*newHeight));
				$("#webdoc").next().hide();

			},
			stop: function(event,ui) {
				var aspectRatio = oriWidth / oriHeight;
				destHeight = event.pageY-currOffset.top;
				destWidth = Math.round(aspectRatio*newHeight);
				settings.callBack(destHeight,destWidth);
				$("#webdoc").next().fadeIn();
				
				
			}
		
		});



 	});
 };
 
 
jQuery.fn.updateToolPosition = function(settings) {
	settings = jQuery.extend({
	angle :0,
		item:false	
	}, settings);
   
   	return this.each(function() {
   			if (settings.angle != 0) {
					var matches = settings.angle.match(/(\d+)/);
					settings.angle = matches[0];
				}
				
   					resize = settings.item.children('.handle_resize');
   					rotate = settings.item.children('.handle_rotate');
   					resize.css({
    						'top':'',
    						'bottom':'',
    						'left':'',
    						'right':''
    					});
    				rotate.css({
    						'top':'',
    						'bottom':'',
    						'left':'',
    						'right':''
    					});
    					
    					var angle = settings.angle;
				
    					
    					if (angle > 0 && angle<=45) {
    						resize.css({
    							'bottom':'-20px',
    							'right':'-20px'
    						});
    						rotate.css({
    							'bottom':'-20px',
    							'left':'-20px'
    						});
    					} else if (angle > 45 && angle<=90) {
    						resize.css({
    							'top':'-20px',
    							'right':'-20px'
    						});
    						rotate.css({
    							'bottom':'-20px',
    							'right':'-20px'
    						});	
    					} else if (angle > 90 && angle<=135) {
    						resize.css({
    							'top':'-20px',
    							'right':'-20px'
    						});
    						rotate.css({
    							'bottom':'-20px',
    							'right':'-20px'
    						});
    					} else if (angle > 135 && angle<=180) {
    						resize.css({
    							'top':'-20px',
    							'left':'-20px'
    						});
    						rotate.css({
    							'top':'-20px',
    							'right':'-20px'
    						});
    					} else if (angle > 180 && angle<=225) {
    						resize.css({
    							'top':'-20px',
    							'left':'-20px'
    						});
    						rotate.css({
    							'top':'-20px',
    							'right':'-20px'
    						});
    					} else if (angle > 225 && angle<=270) {
    						resize.css({
    							'bottom':'-20px',
    							'left':'-20px'
    						});
    						rotate.css({
    							'top':'-20px',
    							'left':'-20px'
    						});
    					} else if (angle > 270 && angle<=315) {
    						resize.css({
    							'bottom':'-20px',
    							'left':'-20px'
    						});
    						rotate.css({
    							'top':'-20px',
    							'left':'-20px'
    						});
    					} else if (angle > 315 && angle<=360) {
    						resize.css({
    							'bottom':'-20px',
    							'right':'-20px'
    						});
    						rotate.css({
    							'bottom':'-20px',
    							'left':'-20px'
    						});
    					} else {
    							resize.css({
    							'bottom':'-20px',
    							'right':'-20px'
    						});
    						rotate.css({
    							'bottom':'-20px',
    							'left':'-20px'
    						});
    					}
    					
   	
   	});
   };
   