
//= require <mtools/record>
//= require <webdoc/model/item>


WebDoc.ItemThumbnailView = $.klass({
  item: null,
  pageView: null,
  initialize: function(item, pageView) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      throw "cannot create item view without a parent page view";
    }
    
    this.item = item;
    this.domNode = this.createDomNode();
    this.domNode.css({ position: "absolute"}); 
    item.addListener(this);
  },
  
  createDomNode: function() {
  
    var itemNode = $('<' + this.item.data.data.tag + '/>');
    
    itemNode.attr("id", "thumb_" + this.item.uuid());
    itemNode.addClass("item_thumb");
    for (var key in this.item.data.data) {
      if (key == 'css') {
        itemNode.css(this.item.data.data.css);
      }
      else {
        if (key == 'innerHtml') {
          itemNode.html(this.item.data.data[key]);
        }
        else {
          if (key != 'tag' && key != 'preference') {
            itemNode.attr(key, this.item.data.data[key]);
          }
        }
      }
    }
    this.pageView.itemDomNode.append(itemNode.get(0));
    return itemNode;
  },
  
  
  remove: function() {
    this.domNode.remove();
  },
  
  objectChanged: function(item) {
    this.domNode.animate(item.data.data.css, 'fast');
  },
  
  innerHtmlChanged: function() {
    this.domNode.html(this.item.data.data.innerHTML);
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
        itemNode.css(this.item.data.data.css);
      }
      else {
        if (key == 'innerHtml') {
          imageNode.html(this.item.data.data[key]);
        }
        else {
          if (key != 'tag') {
            imageNode.attr(key, this.item.data.data[key]);
          }
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
    $super(item);
    WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), {
      points: item.data.data.points
    });
    this.domNode[0].setAttribute("transform", this.item.data.data.transform);
  }  
});

WebDoc.WidgetThumbnailView = $.klass(WebDoc.ItemThumbnailView, {
  createDomNode: function($super) {
    
    if (this.item.data.data.tag == "iframe" || 
        this.item.data.data.innerHTML.match(/<iframe|<script|<object/)) {
      var itemNode = $('<div/>');
    
      itemNode.attr("id", "thumb_" + this.item.uuid());
      itemNode.css(this.item.data.data.css);
      itemNode.addClass("widget_thumb");
      this.pageView.itemDomNode.append(itemNode.get(0));
    
      return itemNode;
    }
    else {
      return $super();
    }
  },
  
  innerHtmlChanged: function() {
    if (this.item.data.data.tag != "iframe" || !this.item.data.data.innerHTML.match(/<iframe|<script|<object/)) {
      this.domNode.html(this.item.data.data.innerHTML);
    }
  }   
});


