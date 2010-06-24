
//= require <mtools/record>
//= require <webdoc/model/item>


WebDoc.ItemThumbnailView = $.klass({
  item: null,
  pageView: null,
  
  // Define all css keys that must be translated into
  // browser specific keys (-moz and -webkit)
  BROWSER_CSS_KEYS: {
    transform: true,
    transition: true,
    borderRadius: true,
    boxShadow: true
  },
  
  initialize: function(item, pageView) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    this.domNode = this.createDomNode();
    this.domNode.css({ position: "absolute" }); 
    item.addListener(this);
  },
  
  createDomNode: function() {
  
    var itemNode = $('<' + this.item.data.data.tag + '/>');
    
    itemNode.attr("id", "thumb_" + this.item.uuid());
    itemNode.addClass("item_thumb");
    for (var key in this.item.data.data) {
      switch(key) {         
        case "innerHTMLPlaceholder":
        case "tag":  
        case "preference":
        case "properties":
        case "class": 
          itemNode.addClass(this.item.data.data[key]);
          break;
        case "wrapClass":
          itemNode.addClass(this.item.data.data[key]);
          break;          
        case "css": 
          this.makeCss( this.item.data.data.css, function( css ){
            itemNode.css( css );
          });
          break;        
        default:
          itemNode.attr(key, this.item.data.data[key]);
      }           
    }
    if (!jQuery.string(this.item.getInnerHtml()).empty()) {
      itemNode.html(this.item.getInnerHtml());
    }
    else if (this.item.data.data.innerHTMLPlaceholder){
      itemNode.html(this.item.data.data.innerHTMLPlaceholder);      
    }
    this.pageView.itemDomNode.append(itemNode.get(0));
    return itemNode;
  },
  
  makeCss: function( css, callback ){
    var domNode = this.domNode,
        itemCss = jQuery.extend({ overflow: 'hidden' }, css ),
        key, timer;
    
    // Loop through the results and apply browser specific
    // extensions where needed
    for ( key in itemCss ) {
      if ( this.BROWSER_CSS_KEYS[key] ) {
        itemCss['-webkit-'+key] = itemCss['-moz-'+key] = itemCss[key];
      }
    }
    
    return callback( itemCss );
  },
  
  remove: function() {
    this.domNode.remove();
  },
  
  objectChanged: function(item) {
    var domNode = this.domNode,
        classes = ["item_thumb", item.data.data['class'], 'animate', item.data.data.wrapClass].join(' ');
    
    domNode.attr("class", classes);
    
    this.makeCss( item.data.data.css, function( css ){
      domNode.css( css );
    });
  },
  
  innerHtmlChanged: function() {
    if (!jQuery.string(this.item.getInnerHtml()).empty()) {
      this.domNode.html(this.item.getInnerHtml());
    }
    else if (this.item.data.data.innerHTMLPlaceholder){
      this.domNode.html(this.item.data.data.innerHTMLPlaceholder);      
    }
  },

  domNodeChanged: function() {
    if (!WebDoc.application.disableHtml) {
      this.domNode.remove();
      this.domNode = this.createDomNode();
      this.domNode.css({ position: "absolute"}); 
    }
  }

});

WebDoc.ImageThumbnailView = $.klass(WebDoc.ItemThumbnailView, {
  createDomNode: function($super) {
    ddd("create image thumb");
    var imageNode = $('<' + this.item.data.data.tag + ' width="100%" height="100%"/>');
    var itemNode = $("<div/>");
    itemNode.append(imageNode.get(0));
    itemNode.attr("id", "thumb_" + this.item.uuid());
    
    for (var key in this.item.data.data) {
      if (key == 'css') {
        this.makeCss( this.item.data.data.css, function( css ){
          itemNode.css( css );
        });
      }
      else {
        if (key != 'tag') {
          imageNode.attr(key, this.item.data.data[key]);
        }
      }
    }
    this.pageView.itemDomNode.append(itemNode.get(0));

    return itemNode;
  }
});

WebDoc.DrawingThumbnailView = $.klass(WebDoc.ItemThumbnailView, {
  createDomNode: function($super) {
    var newLine = WebDoc.application.svgRenderer.createPolyline(this.item);
    newLine.setAttribute("id", "thumb_" + this.item.uuid());
    this.pageView.drawingDomNode.append(newLine);
    return $(newLine);
  },
  
  objectChanged: function($super, item) {
    this.domNode.animate(item.data.data.css, 'fast');
    WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), {
      points: item.data.data.points
    });
    this.domNode[0].setAttribute("transform", this.item.data.data.transform);
  }  
});

WebDoc.WidgetThumbnailView = $.klass(WebDoc.ItemThumbnailView, {
  createDomNode: function($super) {
    
    if (this.item.data.data.tag == "iframe" || 
        this.item.getInnerHtml().match(/<iframe|<script|<object|<embed/i)) {
      var itemNode = $('<div/>');
    
      itemNode.attr("id", "thumb_" + this.item.uuid());
      this.makeCss( this.item.data.data.css, function( css ){
        itemNode.css( css );
      });
      itemNode.addClass("widget_thumb");
      this.pageView.itemDomNode.append(itemNode.get(0));
    
      return itemNode;
    }
    else {
      return $super();
    }
  },
  
  objectChanged: function($super, item) {
    $super(item);
    if (this.item.data.data.tag == "iframe" || (this.item.getInnerHtml() && this.item.getInnerHtml().match(/<iframe|<script|<object|<embed/i))) {
      this.domNode.addClass("widget_thumb");    
    }
  },
  
  innerHtmlChanged: function() {
    if (this.item.data.data.tag != "iframe" && (!this.item.getInnerHtml() || !this.item.getInnerHtml().match(/<iframe|<script|<object|<embed/i))) {
      if (!jQuery.string(this.item.getInnerHtml()).empty()) {
        this.domNode.html(this.item.getInnerHtml());
      }
      else if (this.item.data.data.innerHTMLPlaceholder){
        this.domNode.html(this.item.data.data.innerHTMLPlaceholder);      
      }
    }
    else if (!this.domNode.hasClass('widget_thumb')) {
        this.domNode.addClass('widget_thumb');
    }
  }   
});


