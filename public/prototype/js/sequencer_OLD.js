// Event Sequencer
// 
// Runs a series of timed events with a self-regulating timer
// that gaurantees that events stay (as close as possible in
// javascript) in sync with the browser's Date. Events are JSON
// so they can easily be transferred. They are also triggerable
// as DOM Events. The Sequencer shepherds them into sequence
// processes depending on their type. Sequences themselves are
// a type of event. New sequence processes can easily be added
// to handle new event types.

(function(){
	
	var debug = (window.console && console.log);
	
	// Transport --------------------------------------
	
	var transport = {
		play: function(){
			var now = new Date().getTime();
			this.starttime = now;
			makeProcessQueue(this, now, clock);
		},
		latency: 0
	}
	
	var timer;
	
	var processQueue;
	
	function clock(process, t){
		var now = new Date().getTime();
		
		if ( t > now ) {
			var wait = t - now;
			
			timer = setTimeout(function(){
				var now = new Date().getTime(),
						latency = now - t;
				
				transport.latency = latency;
				
				playProcessQueue(process);
				clearTimeout(timer);
				timer = null;
				
				debug && console.log('now:', now, 'latency:', latency, 'idle:', wait);
				
				makeProcessQueue(process, t, clock);
			}, wait );
		}
		else {
			debug && console.log('now:', now, 'latency:', now-t, 'idle:', 0, '[buffered]');
			playProcessQueue(process, t);
			makeProcessQueue(process, t, clock);
		}
	}
	
	function makeProcessQueue(process, t, fn) {
		var limit = t + 20000,
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
	
	function playProcessQueue(process, t) {
		var l = processQueue.length;
		
		// Trigger the processes
		while (l--) {
			processQueue[l](t);
		}
	}
	
	function clearProcessQueue() {
		clearTimeout(timer);
		timer = null;
		processQueue = undefined;
	}
	
	// Processes --------------------------------------
	
	var processes = {
		audio: 		makeMediaSequenceProcess,
		sequence: makeSequenceProcess
	};
	
	var audiosrcs = {};
	
	function Process() {
	
	}
	
	Process.prototype = {};
	
	function makeSequenceProcess(e, t, parent, fn) {
		var process = new SequenceProcess(e, t);
		parent.addChildProcess(process);
	}
	
	function SequenceProcess(e, t) {
	  this.starttime = t;
	  this.sequence = e;
	  this.children = [];
	  this.latency = 1;
	  
	  
		console.log('process:', this);
	}
	
	function makeMediaSequenceProcess(e, t, parent, fn) {
		var process = new SequenceProcess(e, t),
				audio, canplay, triggerTime, playTime, playLatency;
		
		// Cache the Audio obj for this sound src
		if ( e.src ) {
			if ( audiosrcs[e.src] ) {
				audio = audiosrcs[e.src];
			}
			else {
				audio = new Audio(e.src);
				if (debug) { console.log('[AudioEventProcess] '+e.src, 'Created new Audio object'); }
			}
		}
		
		jQuery(audio)
		.bind('play', function(){
			console.log('[audio] e: play');
			
			playTime = new Date().getTime();
			playLatency = playTime - triggerTime;
			
			var playhead = this.currentTime;
			
			console.log('playhead', playhead, 'audio latency', playLatency);
			
			// We've got a problem between local time and global time.
			// Bollocks.
			// 
			// Either... bring the audio up to sync with the sequence
			
			//audio.currentTime = playLatency/1000;
			
			// Or... update process starttime to delay the rest of
			// the sequence to match the media
			process.starttime = playLatency + t;
			
			if (parent && parent.addChildProcess) {
				parent.addChildProcess(process);
			}
			
			clearProcessQueue();
			makeProcessQueue(PPP, playTime, clock);
			
			// But watch out for events that have already played - they'll double!
			// But now we need some way to update the event queue...
			
		})
		.bind('canplaythrough', function(){
			canplay = true;
			if(fn) fn();
		});
		
		return function(t){
			triggerTime = t;
			
			if (canplay) {
				audio.play();
			}
			else {
				jQuery(audio).bind('canplaythrough', function(){
					audio.play();
				});
			}
		};
	}
	
	function MediaSequenceProcess(e, t) {
		this.starttime = t;
		this.sequence = e;
		this.children = [];
		this.latency = 1;
	}
	
	SequenceProcess.prototype = new Process();
	MediaSequenceProcess.prototype = new Process();
	
	jQuery.extend(SequenceProcess.prototype, {
		getProcessList: function getProcessList(t) {
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
					process = processes[ event.type ]( event, t, this );
					
					if (process) {
						processList.push(process);
					}
				}
			}
			
			l = children.length;
			
			while (l--) {
				processList = processList.concat( children[l].getProcessList(t) )
			}
			
			return processList;
		},
		addChildProcess: function( process ){
			this.children.push(process);
		}
	});
	
	var PPP;
	
	function Sequencer(sequence){
		var process = new SequenceProcess(sequence);
		jQuery.extend(process, transport);
		// Quick hack
		PPP = process;
		return process;
	}
	
	// Expose processes as a property of Sequencer
	Sequencer.processes = processes;
	
	// Expose Sequencer to global scope
	window.Sequencer = Sequencer;
	
})();