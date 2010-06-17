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
    "preserve_aspect_ratio": true,
    "href": true
  },
  
  
  initialize: function($super, item, pageView, afterItem){
    $super(item, pageView, afterItem);   
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
    
    if(this.item.data.data.href) {
      var link = $('<a/>', { href: this.item.data.data.href, target: '_blank' });
      link.append( imageNode );
      frameNode.append(link);
    }
    else {
      frameNode.append( imageNode );
    }

    this.imageNode = imageNode;
    this.frameNode = frameNode;

    this._zoom();
    this._displace();
    
    return frameNode;
  },

  _zoom: function(){
    var image = this.imageNode,
      model = this.item,
      zoom = model.getZoom();

    var css = {
          width:  ((100 + zoom) * model.getRatio().width) + "%",
          height: ((100 + zoom) * model.getRatio().height) + "%"
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