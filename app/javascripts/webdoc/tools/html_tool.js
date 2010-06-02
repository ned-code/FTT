/**
* @author zeno
*/

//= require "tool"

WebDoc.HtmlTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass) {
    $super(selector, boardClass);
  },

  selectTool: function() {
    WebDoc.application.boardController.unselectAll();      
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_WIDGET;
    newItem.data.data.tag = "div";
    newItem.data.data.innerHTML = "";
    newItem.data.data.css = { top: "100px", left: "100px", width: "256px", height: "128px"};
    WebDoc.application.boardController.insertItems([newItem]);    
    var createdItemView = WebDoc.application.boardController.currentPageView().itemViews[newItem.uuid()];
    // Select view
    WebDoc.application.boardController.selectItemViews([createdItemView]);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  }

});
