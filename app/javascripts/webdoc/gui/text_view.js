/**
 * @author julien
 */
WebDoc.TextView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    this.placeholderNode = $(WebDoc.NEW_TEXTBOX_CONTENT);
    
    $super(item, pageView, afterItem);
    if (this.itemDomNode.hasClass("empty")) {
      this.domNode.append( this.placeholderNode );
    }
    this.domNode.addClass('item-text');
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
    this.placeholderNode.remove();
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
    if (!WebDoc.application.disableHtml) {
      if ($.string(this.item.data.data.innerHTML).blank()) {
        this.domNode.append( this.placeholderNode );
      }
      else {
        this.placeholderNode.remove();
        this.itemDomNode.html(this.item.data.data.innerHTML);
      }
    }
  }
});