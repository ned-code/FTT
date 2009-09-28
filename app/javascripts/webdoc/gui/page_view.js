
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass(
{
  initialize: function(page) {
    this.page = page;
    this.domNode = $('<div>').attr({
      id: "board",
      style: "position: absolute; top: 0px; left: 0px;z-index:0"
    }).css(page.data.data.css);
    
    this.drawingDomNode = $(WebDoc.application.svgRenderer.createSurface());
    this.drawingDomNode.css("zIndex", 999999);
    this.domNode.append(this.drawingDomNode.get(0)); //TODO re-enable this!!!
    
    this.itemDomNode = $('<div>').attr({
      id: "items",
      style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    });
    this.domNode.append(this.itemDomNode.get(0));
    
    var that = this;
    this.itemViews = [];
    if (page.items && $.isArray(page.items)) {
      $.each(page.items, function() {
        var itemView;
        switch (this.data.media_type) {
          case WebDoc.ITEM_TYPE_TEXT:
            itemView = new WebDoc.TextView(this, that);
            break;
          case  WebDoc.ITEM_TYPE_IMAGE:
            itemView = new WebDoc.ImageView(this, that);
            break;
          case  WebDoc.ITEM_TYPE_DRAWING:
            itemView = new WebDoc.DrawingView(this, that);
            break;
          case  WebDoc.ITEM_TYPE_WIDGET:
            itemView = new WebDoc.WidgetView(this, that);
            break;            
          default: 
            itemView = new WebDoc.ItemView(this, that);
            break;
        }
      });
    }
    page.addListener(this);
  },
  
  objectChanged: function(page) {
    this.domNode.animate(page.data.data.css, 'fast');
  },
  
  findObjectAtPoint: function(point) {
    var i = 0;
    for (; i < this.itemViews.length; i++) {
      var anItemView = this.itemViews[i];
      if (anItemView.coverPoint(point) && !anItemView.isBackground) {
        return anItemView;
      }
    }
    return null;
  }
});
