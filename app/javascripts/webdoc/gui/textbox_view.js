/**
 * @author julien, steven, matthieu
 */

WebDoc.TEXTBOX_INSPECTOR_GROUP = "TextboxInspectorGroup";

WebDoc.TextboxView = $.klass(WebDoc.ItemView, {
  
  // Classes applied to the item in initItemClass
  ITEMCLASSES: "textbox_item item layer",
  
  // Data to be ignored
  IGNORE: {
    "class": true,
    "wrapClass": true,
    "innerHTMLPlaceholder": true,
    "tag": true,
    "css": true,
    "preference": true,
    "properties": true,
    "preserve_aspect_ratio": true,
    "href": true,
    "placeholder": true
  },
  
  initialize: function($super, item, pageView, afterItem) {
    
    this.editNode = jQuery('<textarea/>', { "class": "text" });
    this.viewNode = jQuery('<div/>', { "class": "text" });
    //this.txtDummy = jQuery('<div/>', { css: { display: 'none'} });
    
    $super(item, pageView, afterItem);
    
    this.shapeUI = new this.ShapeUI( this.itemDomNode );
    this.shapeUI.setShape(this.item.getShape());

    this.innerHtmlChanged();
    this.shapeUI.draw();
  },
  
  objectChanged: function($super, item, options) {
    $super(item, options);
  	this.shapeUI.refresh();
  },

  // we redefined this method so that shape is redraw during the resize. Otherwise redraw is done at the end of resize
  _resizeTo: function($super, size) { 
  	$super(size);
  	this.shapeUI.refresh();
  },
  
  toggleMode: function(){
    var that = this,
        text;
    
    if(!WebDoc.application.boardController.isInteractionMode()){
      // Parse the text for line breaks, and replace with <br/>
      text = this.editNode.val().replace( /\n/g, '<br/>' );
      
      this.viewNode
      .html( text )
        //.height(this.editNode.height())
        //.width(this.editNode.width())
      .appendTo(this.itemDomNode);
      
      this.editNode.remove();
    }
    else {
      // Parse the text for <br/>s, replace with line breaks
      text = this.viewNode.html().replace( /<br\/>/g, '\n' );
      this.editNode.appendTo(this.itemDomNode);
    	this.viewNode.remove();
    }
  },
  
  resizeTextArea: function(){
    this.txtDummy.css({
      width:this.editNode.width(),
      height:"auto"});
    this.txtDummy.text(this.editNode.val());
    this.editNode.height(this.txtDummy.height());
            
    /*this.item.resizeTo({
      width:this.item.width(),
      height:this.editNode.height() + this.editNode.position().top*2});*/
  },
  
  ShapeUI:function(itemNode){
    this.itemNode = itemNode;
    this.shapeNode = null;
    this.originalPath = null;

    this.setShape = function(shape) {
      this.shape = shape;  
    };

    this.refresh = function(){
      var path = this.originalPath;
      var newPath = "";
      var currentValue = "";
      var wh = 0;
      var scaleFactors = [
        this.itemNode.width()/100,
        this.itemNode.height()/100
      ];
      
      this.shapeNode.find("#shape")
        .attr("stroke", this.shape.getStroke())
        .attr("stroke-width", this.shape.getStrokeWidth())
        .attr("fill", this.shape.getFill());
      
      //  parse the shape and multiply each point by the scale factor
      for(var i=0; i<path.length; i++){
        if(path[i].match(/[a-zA-Z|\-|,| ]/g)){
          if(parseFloat(currentValue)*0 === 0){
            currentValue = parseFloat(currentValue) * scaleFactors[wh] + 1000;
            wh = (wh+1)%2; // Width or Height factor. Assuming that the values are always x, y
          }
          currentValue += path[i];
          newPath += currentValue;
          currentValue = "";
          continue;
        }
        currentValue += path[i];
      }
      // Set the new path
      this.shapeNode.find("#shape").attr("d", newPath);
    };
    
    this.draw = function() {
      var svgNS = WebDoc.application.svgRenderer.svgNS;
      var that = this;
      var path = this.shape.getPath();
      var svgNode = document.createElementNS(svgNS, "svg");
      var pathNode = document.createElementNS(svgNS, "path");      
      
      jQuery(pathNode)
        .attr("id", "shape")
        .attr("d", path);
      
      jQuery(svgNode)
        .append(pathNode);

      // Remove and recreate the div which contains the shape.
      if(this.shapeNode) this.shapeNode.remove();
      this.shapeNode = jQuery("<div>", {"class":"shape"});
      
      this.shapeNode
        .prependTo(this.itemNode)
        .append(svgNode);
        
      this.originalPath = path;
      this.refresh();
    };
  },
  
  // Gotcha! createDomNode creates the itemDomNode
  createDomNode: function($super) {
    var itemNode = jQuery('<div/>');
		
    for (var key in this.item.data.data) {
      if ( this.IGNORE[ key ] ) { continue; }
      itemNode.attr(key, this.item.data.data[key]);
    }
    
    itemNode
    .addClass("textbox_item item layer")
    .append(this.editNode);
    
    return itemNode;
  },
  
  domNodeChanged: function() {
    if (!WebDoc.application.disableHtml) {
      this.unSelect();
      
      this.itemDomNode.replace( this.createDomNode() );
      
      if (this.item.getInnerHtml() && !jQuery.string(this.item.getInnerHtml()).empty()) {
        this.innerHtmlChanged();
      }
      
      //this.select();
    }
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
  },
  
  setEditable: function($super) { // called when the interaction mode is changed
    $super();
    this.toggleMode();
  },
  
  isEditing: function() {
  	// Arrgh. Dont use classes as javascript flags!
    return this.domNode.closest("." + WebDoc.TEXTBOX_WRAP_CLASS).length > 0;
  },
  
  stopEditing: function($super) {
    this.item.setInnerHtml(this.editNode.val());    
    $super();
    this._initItemCss(false);
  },
  
  innerHtmlChanged: function() {
    this.editNode.html( this.item.getInnerHtml() );
    this.setEditable();
  },
  
  _initItemCss: function($super, withAnimate) {
    $super(withAnimate);
  }
});