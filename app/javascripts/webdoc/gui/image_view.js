/**
 * @author julien
 */
WebDoc.ImageView = $.klass(WebDoc.ItemView, {
  
  // Classes applied to the item in _initItemClass
  ITEMCLASSES: "item",
  
  initialize: function($super, item, pageView, afterItem){
    $super(item, pageView, afterItem);
    
    //var model = this.item,
    //    aspectRatio = model.getProperty( 'aspectRatio' ),
    //    dimensions = model.getProperty( 'dimensions' );
    //
    //if (!aspectRatio || !dimensions) {
    //  this._setDimensions();
    //  aspectRatio = model.getProperty( 'aspectRatio' );
    //  dimensions = model.getProperty( 'dimensions' );
    //}
    //
    //ddd( '[ImageView]', model.getProperty( 'dimensions' ), model.getProperty( 'aspectRatio' ) )
  },
  
  _setDimensions: function(){
  
    var model = this.item,
        image = new Image();
    
    image.src = model.data.data.src;
    
    model.setProperty( 'dimensions', {
      width: image.width,
      height: image.height
    });
    
    model.setProperty( 'aspectRatio', image.width / image.height );
  },
  
  displace: function( coords ){
    var img = this.itemDomNode,
        model = this.item,
        imageSize = model.getProperty( 'dimensions' ),
        wrapSize = {
          width: this.domNode.width(),
          height: this.domNode.height()
        },
        diffSize = {
          width: wrapSize.width - imageSize.width,
          height: wrapSize.height - imageSize.height
        },
        css = {
          top: coords.top < diffSize.height ?
            diffSize.height :
            coords.top < 0 ?
            coords.top :
            0,
          left: coords.left < diffSize.width ?
            diffSize.width :
            coords.left < 0 ?
            coords.left :
            0
        };
    
    model.setProperty('cssDisplacement', css);
    this.itemDomNode.css( css );
  },
  
  zoom: function(){
    var img = this.itemDomNode,
        model = this.item,
        factor = model.getProperty( 'zoom' ),
        imgSize = model.getProperty( 'dimensions' ),
        aspectRatio = model.getProperty( 'aspectRatio' ),
        css = {
          width: imgSize.width * aspectRatio * factor,
          height: imgSize.height * factor
        };
    
    this.itemDomNode.css( css );
  },
  
  displace: function(){
    var model = this.item,
        img = this.itemDomNode,
        wrap = this.domNode,
        zoom = model.getProperty( 'zoom' ),
        size = model.getProperty( 'dimensions' ),
        css = {
          marginTop:  ( size.height * zoom - wrap.height() ) * model.displacement[1],
          marginLeft: ( size.width * zoom  - wrap.width()  ) * model.displacement[0]
        };
    
    img.css( css );
  },
  
  inspectorId: function() {
    return 4;
  }
});