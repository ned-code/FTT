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
	
	var timer;
	var processQueue;
	
	function clock(process, t){
		var now = new Date().getTime(),
				wait = t - now;
		
		if ( wait > 0 ) {
			timer = setTimeout(function(){
				var now = new Date().getTime(),
						latency = now - t;
				
				debug && console.log('now:', now, 'latency:', latency, 'idle:', wait);
				
				process.playProcessQueue(t, latency);
				
				if (process.playing){
					process.buildProcessQueue(t, clock);
				}
			}, wait );
		}
		else {
			debug && console.log('now:', now, 'latency:', -wait, 'idle:', 0, '[buffered]');
			
			process.playProcessQueue(t, -wait);
			
			if (process.playing){
				process.buildProcessQueue(t, clock);
			}
		}
	}
	
	// Processes --------------------------------------
	
	var processes = {
		audio: 		makeMediaSequenceProcess,
		sequence: makeSequenceProcess
	};
	
	var audiosrcs = {};
	
	function Process() {}
	
	Process.prototype = {
		play: function(){
			var now = new Date().getTime();
			
			Process.prototype.master = this;
			this.startTime = now;
			this.playing = true;
			this.buildProcessQueue(now);
		},
		
		stop: function(){
			clearTimeout(timer);
			timer = null;
			this.playing = false;
			debug && console.log('Stop master');
		},
		
		buildProcessQueue: function(t){
			var limit = t + 10000;
			
			clearTimeout(timer);
			timer = null;
			
			// Scan ahead looking for next events
			while (t++ < limit) {
				processQueue = this.getProcessList(t);
				
				if ( processQueue.length ) {
					return clock(this, t);
				}
				else if  ( processQueue === false ) {
					debug	&& console.log('Process queue false. Something quit.');
					return;
				}
			}
			
			debug && console.log('No events in the next 20 seconds. Stopping.');
		},
		
		playProcessQueue: function(t, latency){
		  var l = processQueue.length;
		  
		  // Trigger processes
		  while (l--) {
		  	processQueue[l](t, latency);
		  }
		}
	};
	
	function makeSequenceProcess(e, t, parent, fn) {
		var process = new SequenceProcess(e, t);
		parent.addChildProcess(process);
	}
	
	function SequenceProcess(e, t) {
	  this.startTime = t;
	  this.sequence = e;
	  this.children = [];
	}
	
	function makeMediaSequenceProcess(e, t, parent, fn) {
		var process = new MediaSequenceProcess(e, t),
				audio, canplay, triggerTime, triggerLatency, playTime, playLatency;
		
		process.getMediaObj = function(){
			return audio;
		}
		
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
			playTime = new Date().getTime();
			playLatency = playTime - triggerTime;
			
			console.log('[audioObj] play latency', playLatency);
			
			// Either bring the audio up to sync with the sequence
			if (process.sync) {
				audio.currentTime = ( process.sequence.start + playLatency + triggerLatency ) / 1000;
			}
			
			// Or update process startTime to delay the rest of
			// the sequence to match the media
			else {
				process.startTime = t + playLatency + triggerLatency;
				
				if (parent && parent.addChildProcess) {
					parent.addChildProcess(process);
				}
				
				// Rebuild process queue, as we're sporking a new
				// process asynchronously, right now
				process.master.buildProcessQueue(playTime, clock);
			}
		})
		.bind('canplaythrough', function(){
			canplay = true;
			if(fn) fn();
		});
		
		return function(t, latency){
			triggerTime = t;
			triggerLatency = latency;
			
			if (canplay) {
				audio.currentTime = process.sequence.start/1000 || 0;
				audio.play();
			}
			else {
				jQuery(audio).bind('canplaythrough', function(){
					audio.currentTime = process.sequence.start/1000 || 0;
					audio.play();
				});
			}
		};
	}
	
	SequenceProcess.prototype = new Process();
	
	function MediaSequenceProcess(e, t){
	  this.sequence = e;
	  this.children = [];
	  this.sync = e.sync;
	}
	
	MediaSequenceProcess.prototype = new SequenceProcess();
	
	jQuery.extend(SequenceProcess.prototype, {
		getProcessList: function getProcessList(t) {
			var self = this,
					sequence = this.sequence,
					children = this.children,
					t = t - this.startTime + (sequence.start || 0),
					l,
					events, k, event,
					processList = [];
			
			// If we've passed the end of the sequence, kill it
			if ( sequence.end && t > sequence.end ) {
				return [ function(t){ self.kill(t); } ];
			}
			
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
			process.parent = this;
		},
		removeChildProcess: function( process ){
			var children = this.children,
					l = children.length;
			
			while(l--) {
				if( children[l] === process ) {
					children.splice( l );
					return;
				}
			}
		},
		kill: function(){
			var children = this.children,
					l = children.length;
			
			debug && console.log('Kill sequence "'+this.sequence.type+'"');
			
			// Kill descendents
			while(l--) {
				children[l].kill();
			}
			
			if (this.parent) {
				this.parent.removeChildProcess( this );
			}
		}
	});
	
	jQuery.extend(MediaSequenceProcess.prototype, {
		kill: function(t){
			var children = this.children,
					l = children.length;
			
			debug && console.log('Kill sequence "'+this.sequence.type+'"');
			
			// Kill children
			while(l--) {
				children[l].kill();
			}
			
			// Kill this
			if (this.parent) {
				this.parent.removeChildProcess( this );
			}
			
			// Stop the music
			this.getMediaObj().pause();
		}
	})
	
	function Sequencer(sequence){
		var process = new SequenceProcess(sequence);
		
		process.parent = {
			removeChildProcess: function(){
				process.stop();
			}
		}
		
		return process;
	}
	
	// Expose processes as a properties of Sequencer
	Sequencer.processes = processes;
	
	// Expose Sequencer to global scope
	window.Sequencer = Sequencer;
	
})();