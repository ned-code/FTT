/**
 * @author Noé
 */


WebDoc.IframeView = $.klass(WebDoc.ItemView, {

  initialize: function($super, item, pageView, afterItem) {
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div />");
    this.updateOverlay();
  },

  domNodeChanged: function($super) {
    $super();
    this.itemDomNode.css('overflow', this.item.data.data.css.overflow);
    this.updateOverlay();
  },

  updateOverlay: function() {
    ddd('update overlay');
    if (!WebDoc.application.pageEditor.disableHtml) {
      var src = this.item.getSrc();
      if (src === "" || src === undefined) {
        var that = this;
        var input = $('<input/>', { type: 'text', title: 'Web page address', name: 'input-iframe-src', value: '' }).blur(function(){
          that.item.setSrc( $(this).val() );
        });

        this.overlayDomNode.remove();
        this.overlayDomNode = $("<div />");
        this.overlayDomNode.append($('<div />').html('Enter a Web page address'));
        this.overlayDomNode.append($('<div />').html(input));
        this.domNode.append(this.overlayDomNode);
      }
      else {
        this.overlayDomNode.html('');

        var wait = $("<div/>")
                  .attr("id", "wait_" + this.item.uuid())
                  .css(this.item.data.data.css)
                  .addClass("load_item").addClass("layer")
                    .css("textAlign", "center");
        var imageTop = (parseFloat(this.item.data.data.css.height) / 2) - 16;
        var image = $("<img/>")
                      .attr("src", "/images/icons/waiting_wheel.gif")
                      .css({
                            verticalAlign: "middle",
                            position: "relative",
                            top: imageTop + "px"
                           });
        wait.append(image);
        this.pageView.itemDomNode.append(wait);

        var that = this;
        this.itemDomNode.bind('load', function() {
          ddd("iframe loaded");
          $("#wait_" + that.item.uuid()).remove();
        });

      }
    }
  },

  canEdit: function() {
    return true;
  },

  inspectorId: function() {
    return 6;
  }

});
