// editor.init.js
//
// Makes ui components work (ONLY ui things that are NOT dependent
// on the application).

(function(undefined){
	
	var doc = jQuery(document),
			
			// Store jQuery objects
			dropdowns = {},
			
			// Properies in links object correspond to #ref values of links
			links = {
				dropdown: function(e){
					var button = jQuery(this),
							selector = button.attr('data-for'),
							dropdown = dropdowns[selector],
							obj, state;
					
					e.preventDefault();
					
					// Store dropdown jQuery object and state
					if ( !dropdown ) {
						dropdown = dropdowns[selector] = {
							obj: jQuery(selector),
							state: false
						};
					}
					
					obj = dropdown.obj;
					state = dropdown.state;
					
					// Control opening and closing of dropdown menu
					if (!state) {
						state = true;
						obj.addTransitionClass('active');
						
						doc.bind('click.dropdown', function(e){
							
							state = false;
							obj.removeTransitionClass('active');
							
							doc.unbind('.dropdown');
						});
					}
				}
			};
	
	doc.ready(function(){
		
		// Delegate clicked buttons to their interface functions
		doc.delegate('a', 'click', function(e){
			var href = jQuery(this).attr('href'),
					ref = /^#(.+)$/.exec(href);
			
			return links[ ref[1] ] ? links[ ref[1] ].call(this, e) : undefined ;
		});
		
	});
})();