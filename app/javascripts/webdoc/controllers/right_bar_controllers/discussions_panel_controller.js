  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {
    this.domNode = jQuery('#discussions-panel');
    this.creator = WebDoc.application.pageEditor.getCreator();
    this.discussionsDomNode = this.domNode.find('#wd_discussions');

    this.domNode.append(this.discussionsDomNode);


    // For add discussion button
    this.domNode.find(".add_discussion").bind("dragstart", this.prepareCreateDiscussionDragStart.pBind(this));

    // this.showPageDiscussions();
  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  showDiscussion: function(discussion) {
    this.discussionsDomNode.empty();
    this.discussionsDomNode.append(this.createDiscussionDomNode(discussion));
  },

  // showPageDiscussions: function(discussions) {
  //   WebDoc.application.pageEditor.currentPage.getDiscussions(function(discussions) {
  //     this.discussionsDomNode.empty();
  //     if (discussions.length>0) {
  //       for(var i=0; i<discussions.length; i++) {
  //         this.discussionsDomNode.append(this.createDiscussionDomNode(discussions[i]));
  //       }
  //     }
  //   }.pBind(this));
  // },

  createDiscussionDomNode: function(discussion) {
    var newDiscussionsDomNode = jQuery('<div/>').text(discussion.uuid());

    for(var i=0; i<discussion.comments.length; i++) {
      var comment = discussion.comments[i];
      newDiscussionsDomNode.append(comment.content());
    }
    

    return newDiscussionsDomNode;  
  },

  // Button part

  prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }

});