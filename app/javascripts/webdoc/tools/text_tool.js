/**
 * @author zeno
 */
//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"
//= require "text_tool/text_tool_view"

WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, toolId, paletteId) {
    $super(toolId);
    this.delegate = new WebDoc.TextToolView("/stylesheets/textbox.css");
    this.delegate.setEndEditionListener(this);
    this.textboxCss = {
      cursor: "default",
      width: "400px",
      height: "200px",
      overflow: "hidden"
    };
    
    this.paletteEl = $(paletteId ? paletteId : "#palette_text");
    this.paletteOverlayEl = this.paletteEl.find("#palette_overlay");
    
    // events handler for palette clicks
    this.paletteEl.bind("click", function(event) {
      var link = $(event.target).closest('a')[0];
      if (link) {
        event.preventDefault();
        optional = ($('.' + link.className).val()) ? $('.' + link.className).val() : null;
        this.delegate.editorExec(link.className, optional);
      }
    }.pBind(this));
    
    // events handler for palette selects change
    this.paletteEl.bind("change", function(event) {
      var select = $(event.target).closest('select')[0];
      if (select && ($(select).val() != 'default')) {
        event.preventDefault();
        optional = ($('.' + select.className).val()) ? $('.' + select.className).val() : null;
        this.delegate.editorExec(select.className, optional);
        $(select).find('option:first').attr('selected', 'selected');
      }
    }.pBind(this));
    
    this.paletteOverlayEl.hide();
    this.paletteEl.removeClass("disabled");
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
    newItem.recomputeInternalSizeAndPosition();
    //Create view
    WebDoc.application.boardController.insertItems([newItem]);
    // Select view
    // WebDoc.application.boardController.selectItemViews([newItemView]);
  
    // newItem.save();
  },
  
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    ddd("Text tool: entering edit mode");
    // Unselect existing selected text box (if necessary)
    if (this.textView && textView != this.textView) {
      WebDoc.application.boardController.unselectItemViews([this.textView]);
    }
    this.textView = textView;
    this.delegate.enterEditMode(textView.domNode);
  },
  
  exitEditMode: function() {
    this.delegate.exitEditMode();
  },
  
  applyTextContent: function(content, classValue) {
    var previousContent = this.textView.item.data.data.innerHTML;
    var previousClass = this.textView.item.data.data['class'];
    this.textView.item.data.data.innerHTML = content;
    this.textView.item.data.data['class'] = classValue;
    this.textView.item.fireInnerHtmlChanged();
    this.textView.item.save();
    WebDoc.application.undoManager.registerUndo(function() {
      this._applyTextContent(previousContent, previousClass);
    }
.pBind(this));
  }
});
