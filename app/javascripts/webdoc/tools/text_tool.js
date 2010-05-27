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
    if (textView.itemDomNode.hasClass("empty")) {
      var placeholderNode = jQuery(textView.item.getInnerHtmlPlaceholder());
      if (placeholderNode.length) {
        if (placeholderNode[0].nodeName.match(/h[1-6]/i)) {
          this.delegate.editorExec('format', placeholderNode[0].nodeName);    
        }
        else if (placeholderNode[0].nodeName.match(/ul/i)) {
          this.delegate.editorExec('insertUnorderedList');
        }
        else if (placeholderNode[0].nodeName.match(/ol/i)) {
          this.delegate.editorExec('insertOrderedList');
        }        
      }
      
    }
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
  
  applyTextContent: function(content, classValue, scrollTop) {

    if (classValue && classValue === "empty") {
      this.textView.itemDomNode.addClass("empty");
      if (this.textView.item.data.data['class'].indexOf('empty') < 0) {
        this.textView.item.data.data['class'] = this.textView.item.data.data['class'] + " empty";
      }
    }
    else {
      this.textView.itemDomNode.removeClass("empty");
      if (this.textView.item.data.data['class'].indexOf('empty') >= 0) {
        this.textView.item.data.data['class'] = jQuery.string().gsub("empty", "", this.textView.item.data.data['class']);
      }
    }
    this.textView.item.data.data.innerHTML = content;    
    this.textView.itemDomNode.scrollTop(scrollTop);
    this.textView.item.fireInnerHtmlChanged();
    this.textView.item.save();        
  }
});
