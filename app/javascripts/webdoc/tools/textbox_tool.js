// Stephen - copied from text_tool


WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = '<div class="item-placeholder"><div class="item-icon"></div>Double-click to start writing</div>';

WebDoc.TextboxTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass) {
    $super(selector, boardClass);
  },
  
  selectTool: function() {
    var boardController = WebDoc.application.boardController,
        item = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage),
        itemData = item.data,
        itemView;
    
    boardController.unselectAll();
    
    itemData.media_type = WebDoc.ITEM_TYPE_TEXTBOX;
    itemData.data.tag = "div";
    itemData.data.css = { top: "100px", left: "100px", width: "256px", height: "128px" };
    item.setShape(WebDoc.ShapeManager.getDefaultShape(), true);

    boardController.insertItems( [item] );    
    
    itemView = boardController.currentPageView().itemViews[ item.uuid() ];
    
    // Select view
    boardController.selectItemViews( [itemView] );
    boardController.setCurrentTool( WebDoc.application.arrowTool );
  }
});