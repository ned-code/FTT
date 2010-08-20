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
    var placeholderContent = item.getInnerHtmlPlaceholder() || WebDoc.NEW_TEXTBOX_CONTENT;
    var shapeId = Math.round(Math.random()*2);
    
    this.placeholderNode = jQuery(placeholderContent);
    
    this.editNode = jQuery('<textarea/>', { "class": "text" });
    this.viewNode = jQuery('<div/>', { "class": "text" });
    //this.txtDummy = jQuery('<div/>', { css: { display: 'none'} });
    
    $super(item, pageView, afterItem);
    
    this.shape = new this.Shape( this.itemDomNode );
    if(this.item.getShape()){
      this.shape.id = this.item.getShape().id;
      this.shape.color = this.item.getShape().color;
      this.shape.strokeWidth = this.item.getShape().strokeWidth;
    }else{
      this.item.setShape({id:shapeId, color:"white", strokeColor:"black", strokeWidth:3});
      this.shape.id = shapeId;
    }
    
    this.editNode.html( this.item.getText() );
    
    // This should be done with model hooks
    //this.itemDomNode
    //.bind("resize", function(){that.shape.refresh()});
    
    this.innerHtmlChanged();
    this.setEditable();
    this.shape.drawShape(this.shape.id);
  },
  
  objectChanged: function($super, item, options) {
    $super(item, options);
  	this.shape.refresh();
  },
  
  _resizeTo: function($super, size) { 
  	$super(size);
  	this.shape.refresh();
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
      
      this.editNode
      .bind("keypress", function(){
        that.item.setText( jQuery(this).val() );
        //that.resizeTextArea();
      })
      .appendTo(this.itemDomNode);
    	
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
  
  Shape:function(itemNode){
    this.itemNode = itemNode;
    this.shapeNode = null;
    this.originalPath = null;
    this.id = 0;
    this.strokeWidth = 3;
    this.color = "white";

    this.refresh = function(){
      var path = this.originalPath;
      var newPath = "";
      var currentValue = "";
      var wh = 0;
      var scaleFactors = [
        this.itemNode.width()/100,
        this.itemNode.height()/100
      ];

      //  Set the stroke width
      this.shapeNode.find("#shape").attr("stroke-width", this.strokeWidth);
      this.shapeNode.find("#shape").attr("fill", this.color);

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
    
    this.drawShape = function(shapeId) {
      var that = this;

      // Remove and recreate the div which contains the shape.
      // One cannot use the css attribute due to a Firefox bug?
      if(this.shapeNode) this.shapeNode.remove();
      this.shapeNode = jQuery("<div class='shape'></div>");

      // Append the shape to the dom and draw the svg used to display the border
      this.shapeNode
        .prependTo(this.itemNode)
        .svg({
          onLoad:function(){
          	that.shapeNode.svg('get').load(
          	  "/shapes/"+shapeId+".svg", {
          	    addTo: false,
          	    onLoad: function(){
          	      that.originalPath = that.shapeNode.find("#shape").attr("d");
          	      that.refresh();
          	    }
          	  }
          	);
      	  }
        });
    };
    
    this.setBorderWidth = function(bw){
      this.strokeWidth = bw;
      this.refresh();
    }
    
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
    this.placeholderNode.remove();
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
    $super();
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