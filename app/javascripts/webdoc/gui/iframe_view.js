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
    this.updateOverlay();
  },

  updateOverlay: function() {
    ddd('update overlay');
    if (!WebDoc.application.pageEditor.disableHtml) {
      if (this.item.data.data.src === "" || this.item.data.data.src === undefined) {
        var that = this;
        var input = $('<input/>', { type: 'text', title: 'Web page address', name: 'input-iframe-src', value: '' }).blur(function(){
          that.item.setSrc( $(this).val() );
          WebDoc.application.inspectorController.refreshSubInspectors();
        });

        this.overlayDomNode.remove();
        this.overlayDomNode = $("<div />");
        this.overlayDomNode.append($('<div />').html('Enter a Web page address'));
        this.overlayDomNode.append($('<div />').html(input));
        this.domNode.append(this.overlayDomNode);
      }
      else {
        this.overlayDomNode.html('');
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
