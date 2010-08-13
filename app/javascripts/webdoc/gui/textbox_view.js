/**
 * @author julien
 */
WebDoc.TEXTBOX_INSPECTOR_GROUP = "TextboxInspectorGroup";

WebDoc.TextboxView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    var placeholderContent = item.getInnerHtmlPlaceholder() || WebDoc.NEW_TEXTBOX_CONTENT;
    
    this.placeholderNode = jQuery(placeholderContent);
    this.svgNode = jQuery('<svg/>', {});
    this.editNode = jQuery('<textarea/>', {
    	"class": "text"
    });
    this.viewNode = jQuery('<div/>', {
    	"class": "text"
    });
    
    $super(item, pageView, afterItem);
    
    this.domNode
    .html( this.svgNode )
    .append( this.editNode )
    .addClass('textbox_item');
    
    this.innerHtmlChanged();
  },
  
  createDomNode: function($super) {
    var result = $super();
    return result;
  },
  
  inspectorId: function() {
    return 1;
  },
  
  inspectorGroupName: function() {
    return WebDoc.TEXTBOX_INSPECTOR_GROUP;  
  },
    
  inspectorControllersClasses: function() {
    return [/*WebDoc.TextPropertiesInspectorController*/];
  },
      
  canEdit: function() {
    return true;
  },
  
  edit: function($super) { //called if we clicked on an already selected textbox
    $super();        
    this.placeholderNode.remove();
    WebDoc.application.textboxTool.enterEditMode(this);
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
      if (!this.item.getInnerHtml() || $.string(this.item.getInnerHtml()).blank()) {
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
  }
});