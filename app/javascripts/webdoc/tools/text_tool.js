/**
 * @author zeno
 */
//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"
//= require "text_tool/text_tool_view"

WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = '<div class="item-placeholder"><div class="item-icon"></div>Double-click to start writing</div>';


WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass, paletteId ) {
    $super( selector, boardClass );
    this.delegate = new WebDoc.TextToolView();
    this.delegate.setEndEditionListener(this);
    this.textboxCss = {
      overflow: "auto",
      cursor: "default",
      width: "400px",
      height: "200px",
      top: "20px",
      left: "20px"
    };
  },
  
  selectTool: function() {
    WebDoc.application.boardController.unselectAll();
    this.newTextBox();  
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    //$("#inspector").accordion('activate', 1);
  },
  
  newTextBox: function() {
    //Create model
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_TEXT;
    newItem.data.data.tag = "div";
    newItem.data.data['class'] = "empty";
    newItem.data.data.innerHTML = "";
    newItem.data.data.css = this.textboxCss;
    //Create view
    WebDoc.application.boardController.insertItems([newItem]);
    // Select view
    // WebDoc.application.boardController.selectItemViews([newItemView]);
  
    // newItem.save();
  },
  
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    ddd("Text tool: entering edit mode");

    this.textView = textView;
    this.delegate.enterEditMode(textView.itemDomNode[0]);
    this.delegate.activateToolbar(true);
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool); 
    var textViewToExit = this.textView; 
    WebDoc.application.undoManager.registerUndo(function() {
      if (WebDoc.application.boardController.editingItem() === textViewToExit) {
          WebDoc.application.boardController.stopEditing();
      }
    }.pBind(this)); 
  },
  
  exitEditMode: function() {
    this.delegate.exitEditMode();
    this.delegate.activateToolbar(false);
    var textViewToEdit = this.textView; 
    WebDoc.application.undoManager.registerUndo(function() {
      WebDoc.application.boardController.editItemView(textViewToEdit);
    }.pBind(this));    
  },
  
  applyTextContent: function(content, classValue) {

    if (classValue && classValue === "empty") {
      this.textView.itemDomNode.addClass("empty");
    }
    else {
      this.textView.itemDomNode.removeClass("empty");
    }
    this.textView.item.data.data.innerHTML = content;    
    this.textView.item.data.data['class'] = this.textView.itemDomNode.attr("class");
    this.textView.item.fireInnerHtmlChanged();
    this.textView.item.save();
  }
});
