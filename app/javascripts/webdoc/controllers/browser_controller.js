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
			this.window_ref = window.open('/browse','browser_window', 'width=undefined,height=undefined'); // 'width=undefined,height=undefined' is set to force Firefox to open a new window
		}
	},
	
	bringToFront: function(){
		if(this.window_ref){
			if(this.window_ref.closed){
				this.window_ref = null;
				return false;
			}
			this.window_ref.focus();
			return true;
		}
		return false;
	}
	
});
