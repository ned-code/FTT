/**
 * @author julien
 */
WebDoc.TextView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var result = $super();
    if (result.hasClass("empty")) {
      result.html(WebDoc.NEW_TEXTBOX_CONTENT);
    }
    return result;
  },
  
  inspectorId: function() {
    return 1;
  },
  
  edit: function($super) { //called if we clicked on an already selected textbox
    $super();
    WebDoc.application.boardController.unselectItemViews([this]); 
    WebDoc.application.boardController.editingItem = this;
    WebDoc.application.textTool.enterEditMode(this);
    this.domNode.addClass("item_edited");
    WebDoc.application.inspectorController.selectPalette(1);
  },
  
  isEditing: function() {
    return this.domNode.closest("." + WebDoc.TEXTBOX_WRAP_CLASS).length > 0;
  },
  
  stopEditing: function() {
    this.domNode.removeClass("item_edited");
    WebDoc.application.textTool.exitEditMode();
  },
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
      if ($.string(this.item.data.data.innerHTML).blank()) {
        this.domNode.html(WebDoc.NEW_TEXTBOX_CONTENT);
      }
      else {
        this.domNode.html(this.item.data.data.innerHTML);
      }
    }
  }
});