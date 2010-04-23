/**
* @author noe
*/

//= require "tool"

WebDoc.OsGadgetTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass) {
    $super(selector, boardClass);
  },

  selectTool: function() {
    WebDoc.application.boardController.unselectAll();
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_OS_GADGET;
    newItem.data.data.css = { top: "100px", left: "100px", width: "300px", height: "200px", overflow: "auto"};
    newItem.data.data.tag = "div";
    WebDoc.application.boardController.insertItems([newItem]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  }

});
