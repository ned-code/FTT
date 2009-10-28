/**
 * @author julien
 */
WebDoc.ImageView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var imageNode = $('<' + this.item.data.data.tag + ' width="100%" height="100%"/>');
    var itemNode = $("<div/>");
    itemNode.append(imageNode.get(0));
    this.selectionNode = $("<div/>").addClass("drag_handle");
    this.resizeNode = $("<div/>").addClass("resize_handle");
    itemNode.attr("id", this.item.uuid());
    
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
    itemNode.addClass("item");
    if (!this.item.data.data.css.width) {
      if (imageNode.width() <= 0) {
          this.item.resizeTo({
            width: 100,
            height: 100
        });
      }
      else {
        this.item.resizeTo({
          width: imageNode.width(),
          height: imageNode.height()
        });
      }
      
    }
    return itemNode;
  }
});