/**
 * @author Noé
 */

WebDoc.IframeController = $.klass({
  initialize: function( ) {
    var container = $("#iframe-inspector");
    this.domNode = container.children();
    container.remove();
    
    this.domNode.find("#property-iframe-src").change(this.updateSrc);
    this.domNode.find("#set_page_size_to_iframe_size").click(this.setPageSizeToIframeize);
    
    // Quick hack
    //this.propertiesController = new WebDoc.PropertiesInspectorController('#iframe_properties', false);
  },

  inspectorTitle: function() {
    return "web page";  
  },
  
  refresh: function() {
    // Quick hack
    WebDoc.application.inspectorController.propertiesController.refresh();
    //this.propertiesController.refresh();
    
    var selectedItem = WebDoc.application.boardController.selection()[0];
    if (selectedItem.item.data.media_type === WebDoc.ITEM_TYPE_IFRAME) {
      $("#property-iframe-src")[0].value = selectedItem.item.getSrc();
    }
  },

  updateSrc: function(e) {
    var input = jQuery(e.target);
    
    input.validate({
      pass: function( value ){
        var item = WebDoc.application.boardController.selection()[0].item;
        consolidateSrc = WebDoc.UrlUtils.consolidateSrc(value);
        item.setSrc( consolidateSrc );
      },
      fail: function( value, error ){
        ddd(error);
      }
    });
  },

  setPageSizeToIframeize: function(e) {
    var item = WebDoc.application.boardController.selection()[0].item;
    if (item !== undefined && item.data.media_type === WebDoc.ITEM_TYPE_IFRAME) {
      WebDoc.application.undoManager.group();
      WebDoc.application.pageEditor.currentPage.setSize({width: item.width(), height: item.height()});
      item.moveTo({ left: '0px', top: '0px' }, true);
      WebDoc.application.undoManager.endGroup();
    }
  }
  
});
