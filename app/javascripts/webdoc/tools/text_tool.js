/**
 * @author zeno
 */
//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"
//= require "text_tool/text_tool_view"

WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = "Empty content";


WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, selector, boardClass, paletteId ) {
    $super( selector, boardClass );
    this.delegate = new WebDoc.TextToolView();
    this.delegate.setEndEditionListener(this);
    this.textboxCss = {
      cursor: "default",
      width: "400px",
      height: "200px",
      overflow: "hidden",
      top: "20px",
      left: "20px"
    };
  },
  
  selectTool: function() {
    WebDoc.application.boardController.unselectAll();
    this.newTextBox();  
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    $("#inspector").accordion('activate', 1);
  },
  
  newTextBox: function() {
    //Create model
    var newItem = new WebDoc.Item(null, WebDoc.application.pageEditor.currentPage);
    newItem.data.media_type = WebDoc.ITEM_TYPE_TEXT;
    newItem.data.data.tag = "div";
    newItem.data.data['class'] = "textbox empty";
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
  },
  
  exitEditMode: function() {
    this.delegate.exitEditMode();
    this.delegate.activateToolbar(false); 
  },
  
  applyTextContent: function(content, classValue) {
    var previousContent = this.textView.item.data.data.innerHTML;
    ddd("previous text content", previousContent);
    var previousClass = this.textView.item.data.data['class'];
    this.textView.item.data.data.innerHTML = content;
    this.textView.item.data.data['class'] = classValue;
    this.textView.item.fireInnerHtmlChanged();
    this.textView.item.save();
    WebDoc.application.undoManager.registerUndo(function() {
      this.applyTextContent(previousContent, previousClass);
    }
.pBind(this));
  }
});
