/**
* @author zeno
*/

//= require "tool"

WebDoc.HtmlTool = $.klass(WebDoc.Tool, {
  initialize: function($super, toolId, paletteId) {
    $super(toolId);
  },

  selectTool: function() {
    WebDoc.application.boardController.unselectAll();      
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.data.tag = "div";
    newItem.data.data.innerHTML = "HTML Snipplet";
    newItem.data.data.css = { top: "100px", left: "100px", width: "100px", height: "100px"};
    newItem.recomputeInternalSizeAndPosition();
    WebDoc.application.boardController.insertItems([newItem]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);        
  }

});
