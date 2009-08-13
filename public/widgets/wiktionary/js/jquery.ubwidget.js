(function($) {
	jQuery.fn.ubwidget = function(options) {
		var settings = jQuery.extend({}, jQuery.fn.ubwidget.defaults, options);
		
		DD_roundies.addRule('.ubw-standard-corners', '5px', true);
		DD_roundies.addRule('.ubw-button-corners', '4px', true);
		DD_roundies.addRule('.ubw-dropdown-bottom-corners', '0px 0px 4px 4px', true);
		DD_roundies.addRule('.ubw-dropdown-top-corners', '4px 4px 0px 0px', true);
		
		$(window)
			.bind("blur", function(event){ 
  				$("#ubw-catcher").trigger("mousedown");
  				if($("#dd").find(".ubw-button-body").data("open")){
  					$("#dd").find(".ubw-button-body").trigger("click");
  				};
  			})
  			.bind("focus", function(event){
  			})
  			.trigger("focus");
		
		return this.each(function() {	
			var ubwbody = $(this)	
				.addClass("ubw-body");
		
			var ubwcontainer = $("<div></div>")
				.append(ubwbody)					
				.addClass("ubw-container")
				.addClass("ubw-standard-corners")
				.css({
					width:settings.width,
					height:settings.height
				});
				//.mouseenter(function(){$("#ibutton").show(0)});
			
			$('body').append(ubwcontainer);
		});
	};
	
	// Default options
	
	jQuery.fn.ubwidget.defaults = {
		width:250,
		height:300
	};
	
	// Shadows
	
	jQuery.fn.ubwshadows = function(settings){
			
			var shadow = $("<div class='ubw-shadow'></div>")
				.addClass("ubw-standard-corners")
				.css({
					backgroundColor:"#333377",
					opacity:".08",
  					filter: "alpha(opacity = 18)",				
					position:"absolute",
					top:settings.t,
					left:settings.l,
					width:settings.w,
					height:settings.h
				});
			
			$(this).before(shadow);
	};
	
	jQuery.fn.ubwbutton = function(size, arrows) {
			var arrows = typeof(arrows) != "undefined" ? arrows = arrows : arrows = {top:0, right:0, bottom:0, left:0};
			var button = null;
			var scale = 1.15;
						
			return this.each(function() {
				button = $(this)
					.addClass("ubw-button-wrapper")
					.disableTextSelect();	
				
				button.data("size", size);														
					
				var buttonContent = $("<div></div>")
					.addClass("ubw-button-content")
					.html($(this).html());
						
				$(this).empty();
				
				var buttonCanvas = $("<div></div>")
					.addClass("ubw-button-canvas")
					.appendTo(button)
				 	.html('<table width="auto" height="auto" cellpadding="0" cellspacing="0"><tr><td class="ubw-button-arrowTop" align="center"><img style="visibility:hidden; margin-bottom:-1px" src="images/arrows_out/top.png"></td></tr><tr><td><table width="auto" height="auto" border="0" cellpadding="0" cellspacing="0"><tr><td class="ubw-button-arrowLeft"><img style="visibility:hidden; margin-right:-1px" src="images/arrows_out/left.png"></td><td class="ubw-button-body"></td><td class="ubw-button-arrowRight"><img style="visibility:hidden; margin-left:-1px" src="images/arrows_out/right.png"></td></tr></table></td></tr><tr><td class="ubw-button-arrowBottom" align="center"><img style="visibility:hidden; margin-top:-1px" src="images/arrows_out/bottom.png"></td></tr></table>');
															
				if(arrows.top)buttonCanvas.find(".ubw-button-arrowTop").children("img").css({visibility:"visible"});
				if(arrows.right)buttonCanvas.find(".ubw-button-arrowRight").children("img").css({visibility:"visible"});
				if(arrows.bottom)buttonCanvas.find(".ubw-button-arrowBottom").children("img").css({visibility:"visible"});
				if(arrows.left)buttonCanvas.find(".ubw-button-arrowLeft").children("img").css({visibility:"visible"});
								
				var buttonBody = buttonCanvas.find(".ubw-button-body")											
					.append(buttonContent)
					.css({
						width:size.w,
						height:size.h
					});	
					
				button.css({
				width:size.w+8,
				height:size.h
				
				})			
			});	
	
			function buttonOverHandler(e) {			
			};
	
			function buttonOutHandler(e){
			};	
			
			function buttonDownHandler(e){
			};
			
			function buttonUpHandler(e){
			};
	};
		
	jQuery.fn.ubwtoggle = function(activated) {
			var activated = typeof(activated) != "undefined" ? activated = 1 : activated = 0;
	
			return this.each(function(){
				var button = $(this);
				var buttonBody = button.find(".ubw-button-body");
				var img = buttonBody.find("img");
				var imgsrc = img.attr("src");
								
				buttonBody
					.toggle(
						function(){
							img.css({visibility:"hidden"});
						}, 
						function(){
							img.css({visibility:"visible"});
						}
					);	
				
				if(!activated){
					buttonBody.trigger("click");
				};			
			});
	};
	
	jQuery.fn.ubwdropdown = function(size, list, func){
		return this.each(function(){
		
			var button = $(this);
						
			var dropdownList = $("<ul></ul>")
				.addClass("ubw-dropdown")
				.hide()
				.mouseenter(function(){
					button.find(".ubw-button-body").data("locked", true);
				})
				.mouseleave(function(){
					button.find(".ubw-button-body").data("locked", false);
				});
       	
       		for(var i=0; i<list.length; i++){       		
       			var newLine = $("<li>"+list[i]+"</li>")
       				.addClass("out")
       				.bind("mouseenter mouseleave", function(){
       					$(this).toggleClass("over");
       				})
       				.bind("click", {i:i}, function(e){       					
       					return function(){
       						func(list[e.data.i]);
       						button.find(".ubw-button-content")
       							.empty()
       							.append(list[e.data.i].substr(0, 2));
       						button.find(".ubw-button-body")
       							.trigger("click");
       					}();
       				});
        		dropdownList.append(newLine);
        		
        		if(i==0){
        			newLine.addClass("ubw-dropdown-top-corners");
        		}else if(i==list.length-1){
        			newLine.addClass("ubw-dropdown-bottom-corners");
        		}
        	}
        	
        	$(this).ubwbutton(size, {top:0, bottom:0, left:0, right:1})
        		.find(".ubw-button-body")
           			.toggle(
        				function(){
        					dropdownList.show();
        					$(this).data("open", true);
        					$(this).trigger("mouseleave");
        				},
        				function(){
        					dropdownList.hide();
        					$(this).data("open", false);
        				}
        			);
        	button.find(".ubw-button-canvas").append(dropdownList);
        	setTimeout(function(){button.find(".ubw-button-content").center()},10)
        });
	}
	
	jQuery.fn.scrollHandler = function(){
		return this.each(function(){
			$(this).mouseenter(function(){
						$(this).css({
							backgroundImage:"url(images/button_out_dark.png)",
							border:"none",
							color:"#eeeeee"
						})
					})
					.mouseleave(function(){
						$(this).css({
							backgroundImage:"url(images/button_out.gif)",
							color:"#555555",
							borderLeft:"2px solid rgb(231, 231, 233)",
							borderRight:"2px solid rgb(231, 231, 233)",
							borderBottom:"2px solid rgb(221, 221, 223)",
							borderTop:"2px solid rgb(241, 241, 244)"
						})
					});
		});	
	};
		
	jQuery.fn.ubwidget.inspector = function(_position, content, button){
		
		var position = {x:_position.x, y:_position.y};
		
		var catcher = $("<div id='ubw-catcher'></div>")
			.css({
				position:"absolute",
				width:"100%",
				height:"100%"
			})
			.mousedown(function(){
				inspector.hide();
				removeDropShadow();
				catcher.hide();
			});
					
			$("body").append(catcher);
			catcher.hide();
		
		var inspector = $("<div class='ubw-inspector'></div>")
			.css({				
				left:position.x,
				top:position.y
			})
			.append(content)
			.appendTo($("body"))
			.hide()
			.addClass("ubw-button-corners");
		
			var inspectorWidth = inspector.width();
			var inspectorHeight = inspector.height();	
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();					 	 
			
			$("body").prepend(button);
			//button.addClass("ubw-standard-corners")
			button.click(function(){
					catcher.show();
					inspector.show();
					dropShadow();
				})
				.attr("id", "ibutton");
					
			function dropShadow (){
				inspector.ubwshadows({w:inspectorWidth+23,h:inspectorHeight+22,l:150,t:60})}
			function removeDropShadow (){
				$(".ubw-shadow").remove()}
			
			// !!
			$(".ubw-shadow")
				.mousedown(function(){
					inspector.hide();
					removeDropShadow();
					catcher.hide();
				});
			
	
	};
		
})(jQuery);