
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass(
{
  initialize: function(page) {
    this.page = page;
    this.domNode = $('<div>').attr(
    {
      id: "board",
      style: "position: absolute; top: 0px; left: 0px;z-index:0"
    }).css(page.data.data.css);
    
    this.drawingDomNode = $(WebDoc.application.svgRenderer.createSurface());
    this.drawingDomNode.css("zIndex", 999999);
    this.domNode.append(this.drawingDomNode.get(0));
    
    this.itemDomNode = $('<div>').attr(
    {
      id: "items",
      style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
    });
    this.domNode.append(this.itemDomNode.get(0));
    
    
    
    var that = this;
    if (page.items && $.isArray(page.items)) {
      $.each(page.items, function() {
        var itemView = new WebDoc.ItemView(this, that);
      });
    }
    page.addListener(this);
  },
  
  objectChanged: function(page) {
    this.domNode.animate(page.data.data.css, 'fast');
  },
  
  findObjectAtPoint: function(point) {
    var i = 0;
    for (; i < this.page.items.length; i++) {
      var anObject = this.page.items[i];
      if (anObject.coverPoint(point) && !anObject.isBackground) {
        return anObject;
      }
    }
    return null;
  },

});
