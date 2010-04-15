/**
* @author noe
*/

//= require "tool"

WebDoc.IframeTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass) {
    $super(selector, boardClass);
  },

  selectTool: function() {
    WebDoc.application.boardController.unselectAll();
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_IFRAME;
    newItem.data.data.src = "";
    newItem.data.data.css = { top: "100px", left: "100px", width: "600px", height: "400px", overflow: "auto"};
    newItem.data.data.tag = "iframe";
    WebDoc.application.boardController.insertItems([newItem]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  }

});
