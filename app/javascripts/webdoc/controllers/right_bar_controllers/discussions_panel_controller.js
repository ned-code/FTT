  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {
    this.domNode = jQuery('#discussions-panel');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    this.creator = WebDoc.application.pageEditor.getCreator();

    // For add discussion button
    this.domNode.find(".add_discussion").bind("dragstart", this.prepareDragStart.pBind(this));


  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  // Button part

  prepareDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }

});