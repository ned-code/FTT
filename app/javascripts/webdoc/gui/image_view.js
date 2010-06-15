/**
 * @author julien
 */
WebDoc.IMAGE_INSPECTOR_GROUP = "ImageInspectorGroup";

WebDoc.ImageView = $.klass(WebDoc.ItemView, {
  
  // Classes applied to the item in initItemClass
  ITEMCLASSES: "item image_item layer",
  
  // Data to be ignored
  IGNORE: {
    "innerHTML": true,
    "innerHtml": true,
    "class": true,
    "wrapClass": true,
    "innerHTMLPlaceholder": true,
    "tag": true,
    "css": true,
    "preference": true,
    "properties": true,
    "preserve_aspect_ratio": true
  },
  
  
  initialize: function($super, item, pageView, afterItem){
    $super(item, pageView, afterItem);
    
    this._zoom();
    this._displace();    
  },

  inspectorGroupName: function() {
    return WebDoc.IMAGE_INSPECTOR_GROUP;  
  },
    
  inspectorControllersClasses: function() {
    return [/*WebDoc.ImagePaletteController, WebDoc.ImagePropertiesInspectorController*/];
  },
  
  fullInspectorControllerClass: function() {
    return WebDoc.ImagePaletteController;  
  },
  
  
  objectChanged: function($super, item, options) {
    $super(item, options);
    if (item._isAttributeModified(options, 'zoom')) {
      this._zoom();
    }
    if (item._isAttributeModified(options, 'displacement')) {
      this._displace();
    }
  },
  
  createDomNode: function() {
    var imageNode = jQuery('<' + this.item.data.data.tag + '/>'),
        frameNode = jQuery('<div/>', { 'class': "layer" });
    
    for (var key in this.item.data.data) {
      if ( this.IGNORE[ key ] ) { continue; }
      imageNode.attr(key, this.item.data.data[key]);
    }
    
    frameNode.append( imageNode );
    
    this.imageNode = imageNode;
    this.frameNode = frameNode;
    
    return frameNode;
  },

  _zoom: function(){
    var image = this.imageNode,
        model = this.item,
        zoom = model.getZoom(),
        css = {
          width: (100 + zoom) + "%",
          height: (100 + zoom) + "%"
        };
    
    image.css( css );
  },
  
  _displace: function(){
    var model = this.item,
        image = this.imageNode,
        displacement = model.getDisplacement(),
        css = {
          top: -( displacement.top ) + "%",
          left: -( displacement.left ) + "%"
        };
    
    image.css( css );
  },
  
  inspectorId: function() {
    return 0;
  }
});