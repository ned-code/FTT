/**
 * @author julien
 */
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
    
    this.zoom();
    this.displace();
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

  zoom: function(){
    var image = this.imageNode,
        model = this.item,
        wrap = this.domNode,
        zoom = model.getProperty( 'zoom' ) || 1,
        imgSize = model.getOriginalSize(),
        displacement = model.getDisplacement(),
        css = {
          left: - displacement.left * zoom,
          top: - displacement.top * zoom,
          width: imgSize.width * zoom,
          height: imgSize.height * zoom
        },
        wrapCss = {
          maxWidth: css.width,
          maxHeight: css.height
        };
    
    image.css( css );
    wrap.css( wrapCss );
  },
  
  displace: function(){
    var model = this.item,
        modelCss = model.data.data.css,
        frame = this.frameNode,
        size = model.getOriginalSize(),
        displacement = model.getDisplacement(),
        zoom = model.getZoom(),
        dy = displacement.top * zoom,
        dx = displacement.left * zoom,
        travx = (size.width * zoom) - modelCss.width,
        travy = (size.height * zoom) - modelCss.height,
        css = {
          top: -( dy > travy ? travy : dy ),
          left: -( dx > travx ? travx : dx )
        };
    
    this.imageNode.css( css );
  },
  
  inspectorId: function() {
    return 4;
  }
});