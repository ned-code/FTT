/**
 * @author julien, steven, matthieu
 */
WebDoc.TEXTBOX_INSPECTOR_GROUP = "TextboxInspectorGroup";

WebDoc.TextboxView = $.klass(WebDoc.ItemView, {
  
  initialize: function($super, item, pageView, afterItem) {
    var placeholderContent = item.getInnerHtmlPlaceholder() || WebDoc.NEW_TEXTBOX_CONTENT;
    var that = this
    var shapeId = Math.round(Math.random()*2);
    
    this.placeholderNode = jQuery(placeholderContent);
    
    this.svgNode = jQuery('<div/>');
    this.editNode = jQuery('<textarea/>', {
    	"class": "text"
    });
    this.viewNode = jQuery('<div/>', {
    	"class": "text"
    });
    this.txtDummy = jQuery('<div/>', {"style":"display:none"});
    
    $super(item, pageView, afterItem);
    
    this.shape = new this.Shape(this.domNode);
    if(this.item.getShape()){
      this.shape.id = this.item.getShape().id;
      this.shape.color = this.item.getShape().color;
      this.shape.strokeWidth = this.item.getShape().strokeWidth;
    }else{
      this.item.setShape({id:shapeId, color:"white", strokeColor:"black", strokeWidth:3});
      this.shape.id = shapeId;
    }
    
    this.editNode.val(this.item.getText());
    
    this.domNode
      .append(this.editNode)
      //.append(this.txtDummy)
      .addClass('textbox_item')
      .bind("resize", function(){that.shape.refresh()});
              
    this.innerHtmlChanged();
    that.setEditable();
    this.shape.drawShape(this.shape.id);
  },
  
  toggleMode: function(){
    var that = this;
        
    if(!WebDoc.application.boardController.isInteractionMode()){
      this.viewNode
        .html(this.editNode.val())
        //.height(this.editNode.height())
        //.width(this.editNode.width())
        .appendTo(this.domNode);
      this.editNode.remove();
    }else{
      this.viewNode.remove();
      this.editNode
        .bind("keyup", function(){
          that.item.setText(jQuery(this).val());
          //that.resizeTextArea();
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
    }
    
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
    }
    
    this.setBorderWidth = function(bw){
      this.strokeWidth = bw;
      this.refresh();
    }
    
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
    //WebDoc.application.textTool.exitEditMode();
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