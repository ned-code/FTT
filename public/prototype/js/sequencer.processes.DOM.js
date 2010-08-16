(function(){
	
	var selectors = {},
			processes = Sequencer.processes;
	
	// Add a process that fires DOM Events
	
	var events = 'click mousedown mouseup mouseover mouseleave mousein moueout input change resize focus blur keydown keyup keypress play';
	
	function DOMEventProcess(e) {
		var obj;
		
		// Cache the jQuery object corresponding to this selector
		// This could be dangerous if the DOM changes! We need a
		// way to intelligently flush the cache!!
		if ( e.selector ) {
			if ( selectors[e.selector] ) {
				obj = selectors[e.selector];
			}
			else {
				obj = selectors[e.selector] = jQuery(e.target || e.selector);
			}
		}
		else {
			obj = jQuery(e.target);
		}
		
		return function(){
			obj.trigger(e);
		}
	}
	
	var eventList = events.split(' '),
			l = eventList.length;
	
	while (l--) {
		processes[ eventList[l] ] = DOMEventProcess;
	}
	
	// Add a new process that takes selectors and adds
	// words to their DOM nodes. Let's call it on
	// 'addhtml' events.
	
	Sequencer.processes.addhtml = function(e) {
		
		var obj;
		
		// Cache the jQuery object corresponding to this selector
		// This could be dangerous if the DOM changes! We need a
		// way to intelligently flush the cache!!
		if ( e.selector ) {
			if ( selectors[e.selector] ) {
				obj = selectors[e.selector];
			}
			else {
				obj = selectors[e.selector] = jQuery(e.target || e.selector);
			}
		}
		else {
			obj = jQuery(e.target);
		}
		
		return function(){
			obj.html( obj.html() + e.html );
		}
	};


	// Add a new process that adds Classes
	
	Sequencer.processes.addClass = function(e) {
		
		var obj;
		
		// Cache the jQuery object corresponding to this selector
		// This could be dangerous if the DOM changes! We need a
		// way to intelligently flush the cache!!
		if ( e.selector ) {
			if ( selectors[e.selector] ) {
				obj = selectors[e.selector];
			}
			else {
				obj = selectors[e.selector] = jQuery(e.target || e.selector);
			}
		}
		else {
			obj = jQuery(e.target);
		}
		
		return function(){
			obj.addClass( e.className );
		}
	};
	
	
	// Add a new process that removes Classes
	
	Sequencer.processes.removeClass = function(e) {
		
		var obj;
		
		// Cache the jQuery object corresponding to this selector
		// This could be dangerous if the DOM changes! We need a
		// way to intelligently flush the cache!!
		if ( e.selector ) {
			if ( selectors[e.selector] ) {
				obj = selectors[e.selector];
			}
			else {
				obj = selectors[e.selector] = jQuery(e.target || e.selector);
			}
		}
		else {
			obj = jQuery(e.target);
		}
		
		return function(){
			obj.removeClass( e.className );
		}
	};
	
})();