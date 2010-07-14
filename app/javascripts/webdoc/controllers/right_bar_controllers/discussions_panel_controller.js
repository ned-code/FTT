  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {

    this.creator = WebDoc.application.pageEditor.getCreator();
    this.currentPage = WebDoc.application.pageEditor.currentPage;

    this.domNode = jQuery('#discussions-panel');
    this.discussionsDomNode = this.domNode.find('#wd_discussions');

    this.currentPage.addListener(this);
    WebDoc.application.boardController.addCurrentPageListener(this);
    // WebDoc.application.boardController.addSelectionDiscussionListener(this);


    this.showCurrentPageDiscussions();

    
    // For add discussion button
    this.domNode.find(".wd_discussion_add").bind("dragstart", this.prepareCreateDiscussionDragStart.pBind(this));


  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  showCurrentPageDiscussions: function() {
    this.discussionsDomNode.empty();
    WebDoc.application.pageEditor.currentPage.getDiscussions(function(discussions) {
      if (discussions.length>0) {
        for(var i=0; i<discussions.length; i++) {
          this.discussionsDomNode.append(this.createDiscussionAndFormDomNode(discussions[i]));
        }
      }
    }.pBind(this));
  },

  createDiscussionAndFormDomNode: function(discussion) {
    var discussionDomNode = jQuery('<div/>', { 'style': 'margin: 10px; border: 1px solid white;' });
    discussionDomNode.append(this.createDiscussionDomNode(discussion));
    discussionDomNode.append(this.createCommentForm(discussion));
    discussionDomNode.bind('click', function() {
      WebDoc.application.boardController.selectDiscussion(discussion);
    });
    return discussionDomNode;
  },

  createDiscussionDomNode: function(discussion) {
    var newDiscussionsDomNode = jQuery('<div/>').attr('data-discussion-uuid', discussion.uuid());
    discussion.addListener(this);    

    for(var i=0; i<discussion.comments.length; i++) {
      var comment = discussion.comments[i];
      newDiscussionsDomNode.append(this.createCommentDomNode(comment));
    }
    
    return newDiscussionsDomNode;  
  },

  createCommentDomNode: function(comment) {
    var commentDomNode = jQuery('<div/>').attr('data-comment-uuid', comment.uuid()),
        firstPart = jQuery('<div/>', { 'style': 'width: 80%; float: left;'}),
        secondPart = jQuery('<div/>', { 'style': 'width: 20%; float: left;'});
    firstPart.append(comment.content().replace(/\n/g, '<br />'));
    firstPart.append(jQuery('<br/>'));
    firstPart.append(comment.created_at() + ' by ' + comment.user.getUsername());
    secondPart.append(jQuery('<img/>', { 'src': comment.user.getAvatarThumbUrl(), 'style': 'width:50px; height:50px;' }));

    commentDomNode.append(firstPart).append(secondPart).append(jQuery('<div/>', {'style':'clear:both;'})).append(jQuery('<hr>'));
    return commentDomNode;
  },

  createCommentForm: function(discussion) {
    var label = jQuery('<label/>').text('Comment'),
        commentContent = jQuery('<textarea/>', { name: 'comment', value: 'Your comment' }),
        form = $('<form/>'),
        button = jQuery('<input/>', { 'type': 'submit', 'value': 'Comment'});

    form
      .append(label)
      .append(commentContent)
      .append(button)
      .bind('submit', function(e){
        e.preventDefault();

        if(commentContent.val()) {
          button.hide();
          commentContent.attr('disabled', 'disabled');

          var newComment = new WebDoc.Comment(null, discussion);
          newComment.setContent( commentContent.val(), true );

          newComment.save(function(newCommentBack, status) {
            if (status == "OK") {
              discussion.addComment(newCommentBack);
              commentContent.val('');
              commentContent.removeAttr('disabled');
              button.show();
            }
          });
        }
    });

    return form;
  },

  selectDiscussion: function(discussion, oldDiscussion) {
    ddd('[DiscussionsPanel] select discussion');
    if (oldDiscussion !== null) {
      var oldDiscussionSelectedDomNode = this.discussionsDomNode.find("div[data-discussion-uuid='"+oldDiscussion.uuid()+"']")[0];
      jQuery(oldDiscussionSelectedDomNode).parent().removeClass('item_selected');
    }
    var discussionSelectedDomNode = this.discussionsDomNode.find("div[data-discussion-uuid='"+discussion.uuid()+"']")[0];
    jQuery(discussionSelectedDomNode).parent().addClass('item_selected');
    discussionSelectedDomNode.scrollIntoView(true);
  },

  // fire by page
  discussionAdded: function(addedDiscussion) {
    ddd('[DiscussionsPanel] discussion added');
    this.discussionsDomNode.append(this.createDiscussionAndFormDomNode(addedDiscussion));
  },

  // fire by discussion
  commentAdded: function(addedComment) {
    ddd('[DiscussionsPanel] comment added');
    this.discussionsDomNode.find("div[data-discussion-uuid='"+addedComment.discussion.uuid()+"']")
        .append(this.createCommentDomNode(addedComment));
    // this.discussionsDomNode.find("div[data-comment-uuid='"+addedComment.uuid()+"']")[0].scrollIntoView(true);
  },

  // fire by board controller
  currentPageChanged: function() {
    ddd('[DiscussionsPanel] current page changed');
    this.showCurrentPageDiscussions();
  },

  // Button part

  prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }

});