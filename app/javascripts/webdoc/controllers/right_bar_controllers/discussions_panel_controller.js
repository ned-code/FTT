  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {

    this.currentPage = WebDoc.application.pageEditor.currentPage;

    this._discussionsWithListener = [];

    this.domNode = jQuery('#discussions-panel');
    this.discussionsDomNode = this.domNode.find('#wd_discussions');

    this.currentPage.addListener(this);
    WebDoc.application.boardController.addCurrentPageListener(this);
  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  showCurrentPageDiscussions: function() {
    this.discussionsDomNode.empty();
    for(var i=0; i<this._discussionsWithListener.length; i++){
      this._discussionsWithListener[i].removeListener(this);
    }
    this._discussionsWithListener = [];
    var discussionViews = WebDoc.application.boardController.currentPageView().discussionViews;
    for (var discussionView in discussionViews) {
      var discussionDomNodeAndForm = this.createDiscussionAndFormDomNode(discussionViews[discussionView].discussion);
      this.discussionsDomNode.append(discussionDomNodeAndForm);
      this.compactMode(discussionDomNodeAndForm);
    }
  },

  createDiscussionAndFormDomNode: function(discussion) {
    var discussionDomNode = jQuery('<div/>', { 'style': 'margin: 10px; border: 1px solid white;' });
    discussionDomNode.append(this.createDiscussionDomNode(discussion));
    discussionDomNode.append(this.createCommentForm(discussion));
    discussionDomNode.bind('click', function() {
      var discussionView = WebDoc.application.boardController.currentPageView().discussionViews[discussion.uuid()];
      if(discussionView) {
        WebDoc.application.boardController.selectDiscussionView(discussionView);
      }
    });
    return discussionDomNode;
  },

  compactMode: function(discussionDomNodeAndForm) {
    var discussionDomNode = discussionDomNodeAndForm.children('div.wd_discussion_dom_node').first();
    var formDomNode = discussionDomNodeAndForm.children('div.wd_comment_form_dom_node').first();
    var divsComments = discussionDomNode.children('div.wd_comment_content_dom_node');
    if(divsComments.length > 0) {
      divsComments.each(function() { $(this).hide(); });
      divsComments.first().show();
      formDomNode.hide();
    }
    else {
      divsComments.each(function() { $(this).hide(); });
      formDomNode.show();
    }
  },

  expendMode: function (discussionDomNodeAndForm) {
    var discussionDomNode = discussionDomNodeAndForm.children('div.wd_discussion_dom_node').first();
    var formDomNode = discussionDomNodeAndForm.children('div.wd_comment_form_dom_node').first();
    var divsComments = discussionDomNode.children('div.wd_comment_content_dom_node');
    divsComments.each(function() { $(this).show(); });
    formDomNode.show();
  },

  createDiscussionDomNode: function(discussion) {
    var newDiscussionsDomNode = jQuery('<div/>').attr('data-discussion-uuid', discussion.uuid()).attr('class', 'wd_discussion_dom_node');
    discussion.addListener(this);
    this._discussionsWithListener.push(discussion);
    for(var i=0; i<discussion.comments.length; i++) {
      var comment = discussion.comments[i];
      newDiscussionsDomNode.append(this.createCommentDomNode(comment));
    }
    
    return newDiscussionsDomNode;  
  },

  createCommentDomNode: function(comment) {
    var commentDomNode = jQuery('<div/>').attr('data-comment-uuid', comment.uuid()).attr('class', 'wd_comment_content_dom_node'),
        firstPart = jQuery('<div/>', { 'style': 'width: 80%; float: left;'}),
        secondPart = jQuery('<div/>', { 'style': 'width: 20%; float: left;'});
    firstPart.append(comment.content().replace(/\n/g, '<br />'));
    firstPart.append(jQuery('<br/>'));
    firstPart.append(comment.created_at() + ' by ' + comment.user.getUsername());
    if(comment.user.uuid() === WebDoc.Application.getCurrentUser().uuid()) {
      firstPart.append(jQuery('<br/>'));
      var removeCommentLink = jQuery('<a/>', { 'href':'#', 'id':'remove_comment'}).text('remove');
      removeCommentLink.bind('click', function() {
        comment.discussion.removeComment(comment);
      });
      firstPart.append(removeCommentLink);

    }
    secondPart.append(jQuery('<img/>', { 'src': comment.user.getAvatarThumbUrl(), 'style': 'width:50px; height:50px;' }));

    commentDomNode.append(firstPart).append(secondPart).append(jQuery('<div/>', {'style':'clear:both;'})).append(jQuery('<hr>'));
    return commentDomNode;
  },

  createCommentForm: function(discussion) {
    var label = jQuery('<label/>').text('Comment'),
        commentContent = jQuery('<textarea/>', { name: 'comment' }),
        domNode = jQuery('<div/>').attr('class', 'wd_comment_form_dom_node'),
        form = jQuery('<form/>'),
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
          if (window._gaq) {
            _gaq.push(['_trackEvent', 'discussion', 'reply_xy_comment', WebDoc.application.pageEditor.currentDocument.uuid()]);
          }
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

    return domNode.append(form);
  },

  selectDiscussion: function(discussion, oldDiscussion) {
    ddd('[DiscussionsPanel] select discussion');
    if (oldDiscussion !== null) {
      var oldDiscussionSelectedDomNode = this.discussionsDomNode.find("div[data-discussion-uuid='"+oldDiscussion.uuid()+"']")[0];
      var oldParent = jQuery(oldDiscussionSelectedDomNode).parent();
      this.compactMode(oldParent);
      oldParent.removeClass('item_selected');
    }
    var discussionSelectedDomNode = this.discussionsDomNode.find("div[data-discussion-uuid='"+discussion.uuid()+"']")[0];
    if(discussionSelectedDomNode) {
      var parent = jQuery(discussionSelectedDomNode).parent();
      parent.addClass('item_selected');
      this.expendMode(parent);
      discussionSelectedDomNode.scrollIntoView(true);
    }
  },

  // fire by page
  discussionAdded: function(addedDiscussion) {
    ddd('[DiscussionsPanelController] discussion added');
    this.discussionsDomNode.append(this.createDiscussionAndFormDomNode(addedDiscussion));
  },

  // fire by page
  discussionRemoved: function(removedDiscussion) {
    ddd('[DiscussionsPanelController] discussion removed');
    this.discussionsDomNode.find("div[data-discussion-uuid='"+removedDiscussion.uuid()+"']").parent().remove();
  },

  // fire by discussion
  commentAdded: function(addedComment) {
    ddd('[DiscussionsPanelController] comment added');
    this.discussionsDomNode.find("div[data-discussion-uuid='"+addedComment.discussion.uuid()+"']")
        .append(this.createCommentDomNode(addedComment));
  },

  commentRemoved: function(removedComment) {
    ddd('[DiscussionsPanelController] comment removed');
    this.discussionsDomNode.find("div[data-comment-uuid='"+removedComment.uuid()+"']").remove();
  },

  // fire by board controller
  currentPageChanged: function() {
    ddd('[DiscussionsPanelController] current page changed');
    this.showCurrentPageDiscussions();
  }

});