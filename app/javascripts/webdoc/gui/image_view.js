/**
 * @author julien
 */
WebDoc.ImageView = $.klass(WebDoc.ItemView, {
  createDomNode: function($super) {
    var imageNode = $super();
    imageNode.css({width:"100%", height:"100%"});
    return imageNode;
  }
});