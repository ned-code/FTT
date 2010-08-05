(function(){
	
	var debug = (window.console && console.log);
	
	var processMap ={
		'click': DOMEventProcess,
		'audio': function(){},
		'sequence': SequenceProcess
	}
	
	function clock(t, process){
	  var now = new Date().getTime(),
	  		timer;
	  
	  if (debug) { console.log('now: ', now, 't: ', t); }
	  
	  if (t > now){ //(now - process.latency) ) {
	  	timer = setTimeout(function(){
	  		var now = new Date().getTime();
	  		
	  		//process.latency = now - t;
	  		process.playProcessQueue();
	  		
	  		clearTimeout(timer);
	  		timer = null;
	  		
	  		console.log('latency: ', now - t);
	  		
	  		process.makeProcessQueue(t, clock);
	  	}, t - now ); //- process.latency)
	  }
	  else {
	  	process.playProcessQueue();
	  	console.log('latency: ', now - t);
	  	process.makeProcessQueue(t, clock);
	  }
	}
	
	function kill( fn ) {
		fn(this);
	}
	
	function makeProcessQueue(t, fn) {
		var processQueue,
				limit = t + 10000,
				l;
		
		// Scan ahead looking for next eventList
		while (t++ < limit) {
			processQueue = this.getProcessList(t);
			l = processQueue.length;
			
			if ( l ) {
				fn(t, this);
				break;
			}
		}
	}
	
	function playProcessQueue() {
		var processQueue = this.processQueue,
				l = processQueue.length;
		
		// Trigger the processes
		while (l--) {
			processQueue[l]();
		}
	}
	
	function getProcessList(t) {
		var sequence = this.sequence,
				children = this.children,
				t = t - this.starttime,
				l,
				events, k, event,
				processList = [];
		
		//if (debug) { console.log('starttime: ' + this.starttime, 't: ' + t, 'events: ', sequence[t]); }
		
		events = sequence[t];
		
		if ( events ) {
			k = events.length;
			
			while (k--) {
				event = events[k];
				process = new processMap[ event.type ]( event, t );
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
	
	function Process() {
	
	}
	
	Process.prototype = {
		kill: kill
	};
	
	function DOMEventProcess(e) {
		return function(){
			jQuery(e.target || e.selector).trigger(e);
		}
	}
	
	DOMEventProcess.prototype = new Process();
	
	function SequenceProcess(e, t) {
		this.starttime = t;
		this.sequence = e;
		this.children = [];
		this.latency = 1;
	}
	
	SequenceProcess.prototype = new Process();
	
	jQuery.extend(SequenceProcess.prototype, {
		makeProcessQueue: makeProcessQueue,
		playProcessQueue: playProcessQueue,
		getProcessList: getProcessList,
		play: function(){
			var now = new Date().getTime();
			
			this.starttime = now;
			
			console.log('now: ', now);
			
			this.makeProcessQueue(now, clock);
		},
		
	});
	
	window.Sequencer = SequenceProcess;
	
})();