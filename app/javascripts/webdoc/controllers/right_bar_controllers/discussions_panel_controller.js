  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {
    this.domNode = jQuery('#discussions-panel');
    this.currentDocument = WebDoc.application.pageEditor.currentDocument;
    this.creator = WebDoc.application.pageEditor.getCreator();
    this.discussionsDomNode = this.domNode.find('#wd_discussions');

    this.domNode.append(this.discussionsDomNode);


    // For add discussion button
    this.domNode.find(".add_discussion").bind("dragstart", this.prepareCreateDiscussionDragStart.pBind(this));
  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  refreshComments: function(discussions) {
    this.discussionsDomNode.empty();
    ddd('1');
    if (jQuery.isArray(discussions)) {
      ddd('2');
      ddd(discussions);
    }
    else {
      ddd('3');
      ddd(discussions);
      
      this.discussionsDomNode.append(jQuery('<div/>').text(discussions.uuid()));
    }
  },

  // Button part

  prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }

});