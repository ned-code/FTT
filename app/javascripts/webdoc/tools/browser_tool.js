/**
* @author jonathan
*/

//= require "tool"

WebDoc.BrowserTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass) {
    $super(selector, boardClass);
  },

  selectTool: function() {
		ddd('browser tool select');
  }

});