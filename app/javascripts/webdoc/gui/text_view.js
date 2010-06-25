/**
 * @author julien
 */
WebDoc.TEXT_INSPECTOR_GROUP = "TextInspectorGroup";

WebDoc.TextView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    var placeholderContent = item.getInnerHtmlPlaceholder() || WebDoc.NEW_TEXTBOX_CONTENT; 
    this.placeholderNode = jQuery(placeholderContent);
    
    $super(item, pageView, afterItem);
    if (this.itemDomNode.hasClass("empty")) {
      this.itemDomNode.append( this.placeholderNode );
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
  
  inspectorGroupName: function() {
    return WebDoc.TEXT_INSPECTOR_GROUP;  
  },
    
  inspectorControllersClasses: function() {
    return [/*WebDoc.TextPropertiesInspectorController*/];
  },
    
//  fullInspectorControllerClass: function() {
//    return WebDoc.ImagePaletteController;  
//  },
      
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
    this._initItemCss(false);
  },
  
  innerHtmlChanged: function() {
    if (!WebDoc.application.disableHtml) {
      if ($.string(this.item.getInnerHtml()).blank()) {
        this.itemDomNode.append( this.placeholderNode );
      }
      else {
        this.placeholderNode.remove();
        this.itemDomNode.html(this.item.getInnerHtml());
      }
    }
  },
  
  _initItemCss: function($super, withAnimate) {
    $super(withAnimate);
    // be sure that we don't have two scrol bar. Because text view in edition has its own overflow so we remove the overflow from the itemdomnode
    if (this.domNode.hasClass("item-edited") ) {
      this.itemDomNode.css("overflow", "hidden");
      if (this.item.data.data.css.overflow) {
        WebDoc.application.textTool.delegate.updateOverflow(this.item.data.data.css.overflow, this.item.data.data.css.overflow);
      }    
    }
  }
});