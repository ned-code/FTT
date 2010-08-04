(function(){
	
	var debug = (window.console && console.log);
	
	var processMap ={
		'click': DOMEventProcess,
		'audio': function(){},
		'sequence': SequenceProcess
	}
	
	function register( fn ) {
		fn(this);
	}
	
	function kill( fn ) {
		fn(this);
	}
	
	function makeProcessQueue(time) {
		var processQueue = [],
				t = time - this.starttime,
				eventList, l, e;
		
		// Scan ahead looking for next eventList
		while (t++ < 10) {
			
			if (debug) { console.log(t); }
			
			eventList = this.getEventList(t);
			l = eventList.length;
			
			if ( l ) {
				while (l--) {
					e = eventList[l];
					processQueue[l] = new processMap[ e.type ]( e );
				}
				
				break;
			}
		}
		
		this.processQueue = processQueue;
	}
	
	function playProcessQueue() {
		var processQueue = this.processQueue,
				l = processQueue.length;
		
		// Trigger the processes
		while (l--) {
			processQueue[l].play();
		}
	}
	
	function getEventList(t) {
		var sequence = this.sequence,
				children = this.children,
				l = children.length,
				eventList = [];
		
		while (l--) {
			eventList = eventList.concat( children[l].getEventList(t) );
		}
		
		if ( sequence[t] ) {
			eventList = eventList.concat( sequence[t] );
		}
		
		return eventList;
	}
	
	function Process() {
	
	}
	
	Process.prototype = {
		register: register,
		kill: kill
	};
	
	function DOMEventProcess(e) {
		this.play = function(){
			jQuery(e.target || e.selector).trigger(e);
		}
	}
	
	DOMEventProcess.prototype = new Process();
	
	function SequenceProcess(e, parent) {
		
		if (debug && e.type !== 'sequence') {
			console.log('Your trying to spork a SequenceProcess with an object that ain\t a sequence.');
			return;
		}
		
		this.starttime = 0;
		this.sequence = e;
		this.children = [];
		
		// Register with parent process
		if (parent) {
			this.register(parent);
		}
		
		this.makeProcessQueue(-1);
		
		console.log( this.processQueue );
	}
	
	SequenceProcess.prototype = new Process();
	
	jQuery.extend(SequenceProcess.prototype, {
		makeProcessQueue: makeProcessQueue,
		playProcessQueue: playProcessQueue,
		getEventList: getEventList,
		play: function(t){
			var now = t || new Date().getTime();
			
			this.starttime = now;
			
			this.playProcessQueue();
			this.makeProcessQueue(now);
		},
		register: function(parent) {
			// Add process to children
			parent.children.unshift(this);
		},
		kill: function(process) {
			// Find this in parent.children and splice remove 
			//parent.children
		}
	});
	
	var sequencer = new SequenceProcess({
		type: 'sequence',
		2: [{ type: 'click', selector: '#fong' }]
	});
	
	//sequencer.play();
	
})();