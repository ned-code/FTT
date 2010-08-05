(function(){
	
	var debug = (window.console && console.log);
	
	// Transport --------------------------------------
	
	var transport = {
		play: function(){
			var now = new Date().getTime();
			
			this.starttime = now;
			
			console.log('now: ', now);
			
			makeProcessQueue(this, now, clock);
		},
		latency: 0
	}
	
	var timer;
	
	function clock(process, t){
		var now = new Date().getTime();
		
		if (debug) { console.log('now: ', now, 't: ', t); }
		
		if ( t > now ) { //(now - transport.latency) ) {
			timer = setTimeout(function(){
				var now = new Date().getTime(),
						latency = now - t;
				
				transport.latency = latency;
				
				playProcessQueue(process);
				clearTimeout(timer);
				timer = null;
				
				console.log('latency: ', latency);
				makeProcessQueue(process, t, clock);
			}, t - now ); //- transport.latency);
		}
		else {
			console.log('latency: ', now - t, ' - buffered');
			playProcessQueue(process);
			makeProcessQueue(process, t, clock);
		}
	}
	
	function makeProcessQueue(process, t, fn) {
		var processQueue,
				limit = t + 20000,
				l;
		
		// Scan ahead looking for next eventList
		while (t++ < limit) {
			processQueue = process.getProcessList(t);
			l = processQueue.length;
			
			if ( l ) {
				return fn(process, t);
			}
		}
		
		if (debug) { console.log('No events in the next 20 seconds. Stopping.'); }
	}
	
	function playProcessQueue(process) {
		var processQueue = process.processQueue,
				l = processQueue.length;
		
		// Trigger the processes
		while (l--) {
			processQueue[l]();
		}
	}
	
	// Processes --------------------------------------
	
	var processes = {
		'click': DOMEventProcess,
		'audio': AudioEventProcess,
		'sequence': SequenceProcess
	};
	
	var selectors = {};
	
	var audiosrcs = {};
	
	function Process() {
	
	}
	
	Process.prototype = {};
	
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
	
	DOMEventProcess.prototype = new Process();

	function AudioEventProcess(e) {
		var obj, canplay = false;
		
		if (debug) { console.log('[AudioEventProcess] '+e.src, 'Initialisation'); }
		
		// Cache the Audio obj for this sound src
		if ( e.src ) {
			if ( audiosrcs[e.src] ) {
				obj = audiosrcs[e.src];
			}
			else {
				obj = new Audio(e.src);
				obj.oncanplay = function(){
					canplay = true;
					if (debug) { console.log('[AudioEventProcess] '+e.src, 'canplay'); }
				};
				if (debug) { console.log('[AudioEventProcess] '+e.src, 'Created new Audio object'); }
			}
		}
		
		return function(){
			if (canplay) { obj.play(); }
			else {
				obj.oncanplay = function(){
					if (debug) { console.log('[AudioEventProcess] '+e.src, 'canplay and play()'); }
					obj.play();
				}
			}
		}
	}
	
	AudioEventProcess.prototype = new Process();
	
	function SequenceProcess(e, t) {
		this.starttime = t;
		this.sequence = e;
		this.children = [];
		this.latency = 1;
	}
	
	SequenceProcess.prototype = new Process();
	
	jQuery.extend(SequenceProcess.prototype, {
		getProcessList: 	function getProcessList(t) {
			var sequence = this.sequence,
					children = this.children,
					t = t - this.starttime,
					l,
					events, k, event,
					processList = [];
			
			events = sequence[t];
			
			if ( events ) {
				k = events.length;
				
				while (k--) {
					event = events[k];
					process = new processes[ event.type ]( event, t );
					if (process instanceof SequenceProcess) {
						children.push(process);
					}
					else {
						processList.push(process);
					}
				}
			}
			
			l = children.length;
			
			while (l--) {
				processList = processList.concat( children[l].getProcessList(t) );
			}
			
			this.processQueue = processList;
			
			return processList;
		}
	});
	
	function Sequencer(sequence){
		var process = new SequenceProcess(sequence);
		jQuery.extend(process, transport);
		return process;
	}
	
	Sequencer.processes = processes;
	
	// Expose Sequencer to global scope
	window.Sequencer = Sequencer;
	
})();