/**
 * @author julien
 */
WebDoc.TextView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    $super(item, pageView, afterItem);
    if (this.itemDomNode.hasClass("empty")) {
      this.itemDomNode.html(WebDoc.NEW_TEXTBOX_CONTENT);
    }  
  },
  
  createDomNode: function($super) {
    var result = $super();
    return result;
  },
  
  inspectorId: function() {
    return 1;
  },
  
  canEdit: function() {
    return true;
  },
  
  edit: function($super) { //called if we clicked on an already selected textbox
    $super();
    WebDoc.application.textTool.enterEditMode(this);
  },
  
  isEditing: function() {
    return this.domNode.closest("." + WebDoc.TEXTBOX_WRAP_CLASS).length > 0;
  },
  
  stopEditing: function($super) {
    $super();
    WebDoc.application.textTool.exitEditMode();
  },
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
      if ($.string(this.item.data.data.innerHTML).blank()) {
        this.itemDomNode.html(WebDoc.NEW_TEXTBOX_CONTENT);
      }
      else {
        this.itemDomNode.html(this.item.data.data.innerHTML);
      }
    }
  }
});