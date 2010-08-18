/**
 * @author julien, steven, matthieu
 */
WebDoc.TEXTBOX_INSPECTOR_GROUP = "TextboxInspectorGroup";

WebDoc.TextboxView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    var placeholderContent = item.getInnerHtmlPlaceholder() || WebDoc.NEW_TEXTBOX_CONTENT;
    var that = this
    
    this.placeholderNode = jQuery(placeholderContent);
    
    this.svgNode = jQuery('<svg/>');
    this.editNode = jQuery('<textarea/>', {
    	"class": "text"
    });
    this.viewNode = jQuery('<div/>', {
    	"class": "text"
    });
    this.txtDummy = jQuery('<div/>', {"style":"display:none"});
    
    $super(item, pageView, afterItem);
    
    this.editNode.val(this.item.getText());
    
    this.domNode
      .html(this.svgNode)
      .append(this.editNode)
      .append(this.txtDummy)
      .addClass('textbox_item')
      .bind("resize", function(){that.resizeTextArea()});
              
    this.innerHtmlChanged();
    this.setEditable();
  },
  
  toggleMode: function(){
    var that = this;
    
    if(!WebDoc.application.boardController.isInteractionMode()){
      this.viewNode
        .html(this.editNode.html())
        .appendTo(this.domNode);
      this.editNode.remove();
    }else{
      this.viewNode.remove();
      this.editNode
        .bind("keyup", function(){
          that.item.setText(jQuery(this).val());
          that.resizeTextArea();
        })
        .appendTo(this.domNode);
    }
  },
  
  resizeTextArea: function(){
    this.txtDummy.css({
      width:this.editNode.width(),
      height:"auto"});
    this.txtDummy.text(this.editNode.val())
    this.editNode.height(this.txtDummy.height());
            
    /*this.item.resizeTo({
      width:this.item.width(),
      height:this.editNode.height() + this.editNode.position().top*2});*/
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
  
  setEditable: function($super) { // called when the interaction mode is changed
    $super();
    this.toggleMode();
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