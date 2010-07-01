/**
 * @author jonathan
 */

WebDoc.BrowserController = $.klass({
	window_ref: null,
	
  initialize: function() {
		ddd('[BrowserController] initialize');
  },

	openBrowser: function(){
		if(!this.bringToFront()){
			this.window_ref = window.open('/browse','browser_window', 'width=450,height=600,toolbar=yes,scrollbars=yes'); // 'width=undefined,height=undefined' is set to force Firefox to open a new window
		}
	},
	
	bringToFront: function(){
		if(this.window_ref != null){
			if(this.window_ref.closed){
				this.window_ref = null;
				return false;
			}			
			//this.window_ref.blur(); //to work with Chrome, they already are an issue in chromium: http://code.google.com/p/chromium/issues/detail?id=1383&can=1&q=window.focus%20type:Bug&colspec=ID%20Stars%20Pri%20Area%20Type%20Status%20Summary%20Modified%20Owner
			//setTimeout(this.window_ref.focus, 0);
			this.window_ref.focus();
			return true;
		}
		return false;
	}
	
});
