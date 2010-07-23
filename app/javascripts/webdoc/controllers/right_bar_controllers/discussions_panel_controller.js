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
    
    this.showCurrentPageDiscussions();
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
    var discussionDomNode = this.createDiscussionDomNode(discussion);
    
    discussionDomNode.append(this.createCommentForm(discussion));
    
    discussionDomNode.bind('click', function() {
      var discussionView = WebDoc.application.boardController.currentPageView().discussionViews[discussion.uuid()];
      if(discussionView) {
        WebDoc.application.boardController.selectDiscussionView(discussionView, true);
      }
    });
    
    return discussionDomNode;
  },

  compactMode: function(discussionDomNodeAndForm) {
    discussionDomNodeAndForm.removeClass('active');
  },

  expendMode: function (discussionDomNodeAndForm) {
    discussionDomNodeAndForm.addClass('active');
  },

  createDiscussionDomNode: function(discussion) {
    var newDiscussionsDomNode = jQuery('<ul/>').attr('data-discussion-uuid', discussion.uuid()).attr('class', 'vertical comments_index index');
    discussion.addListener(this);
    this._discussionsWithListener.push(discussion);
    for(var i=0; i<discussion.comments.length; i++) {
      var comment = discussion.comments[i];
      newDiscussionsDomNode.append(this.createCommentDomNode(comment));
    }
    
    return newDiscussionsDomNode;  
  },

  createCommentDomNode: function(comment) {
    var domNode = jQuery('<li/>'),
        commentNode = jQuery('<div/>').attr('data-comment-uuid', comment.uuid()).attr('class', 'comment'),
        header = jQuery('<header/>'),
        info = jQuery('<div/>', { 'class': 'comment_info' }),
        time = jQuery('<time/>', { 'datetime': comment.created_at() }).html( comment.created_at() ),
        thumb = jQuery('<a/>', { 'class': 'user_thumb thumb', 'title': comment.user.getUsername(), 'style': 'background-image: url('+comment.user.getAvatarThumbUrl()+');' }).html(comment.user.getUsername()),
        title = '<a href="'+'">'+comment.user.getUsername()+'</a> says:',
        body = jQuery('<div/>').html('<p>'+ comment.content().replace(/\n/g, '</p><p>') +'</p>'),
        textarea = jQuery('<textarea/>', { name: 'commentId', id: 'commentId', placeholder: 'Write your comment...' }),
        button = jQuery('<input/>', { 'type': 'submit', 'value': 'Add comment'}),
        remove = '';
    
    var current_user_uuid = WebDoc.Application.getCurrentUser().uuid();
    
    if(current_user_uuid && ( current_user_uuid ===  WebDoc.application.pageEditor.getCreator().uuid() || current_user_uuid === comment.user.uuid())) {
      remove = jQuery('<a/>', { 'href':'#', 'id':'remove_comment'}).text('remove');
      remove.bind('click', function() {
        comment.discussion.removeComment(comment);
      });
    }
    
    domNode
    .append(
      commentNode
      .append(
        header
        .append(
          info
          .append(remove)
          .append(time)
        )
        .append(thumb)
        .append(title)
      )
      .append(
        body
      )
    );
    
    return domNode;
  },

  createCommentForm: function(discussion) {
    var user = WebDoc.Application.getCurrentUser(),
        domNode = jQuery('<li/>'),
        form = jQuery('<form/>', { 'class': 'comment' }),
        header = jQuery('<header/>'),
        thumb = jQuery('<a/>', { 'class': 'user_thumb thumb', 'title': user.getUsername(), 'style': 'background-image: url('+ user.getAvatarThumbUrl() +');' }).html(user.getUsername()),
        label = jQuery('<label/>').attr('for', '#commentId').html('Write a comment'),
        body = jQuery('<div/>'),
        textarea = jQuery('<textarea/>', { name: 'commentId', id: 'commentId', placeholder: 'Write your comment...' }),
        button = jQuery('<input/>', { 'type': 'submit', 'value': 'Add comment'});

    form
    .append(
      header
      .append(thumb)
      .append(label)
    )
    .append(
      body
      .append(textarea)
      .append(button)
    )
    .bind('submit', function(e){
      e.preventDefault();

      if(textarea.val()) {
        button.hide();
        textarea.attr('disabled', 'disabled');
        if (window._gaq) {
          _gaq.push(['_trackEvent', 'discussion', 'reply_xy_comment', WebDoc.application.pageEditor.currentDocument.uuid()]);
        }
        var newComment = new WebDoc.Comment(null, discussion);
        newComment.setContent( textarea.val(), true );

        newComment.save(function(newCommentBack, status) {
          if (status == "OK") {
            discussion.addComment(newCommentBack);
            textarea.val('');
            textarea.removeAttr('disabled');
            button.show();
          }
        });
      }
    });

    return domNode.append(form);
  },

  selectDiscussion: function(discussion, oldDiscussion, skipScroll) {
    ddd('[DiscussionsPanel] select discussion');
    this.unSelectDiscussion(oldDiscussion);
    var discussionSelectedDomNode = this.discussionsDomNode.find("[data-discussion-uuid='"+discussion.uuid()+"']")[0];
    if(discussionSelectedDomNode) {
      var node = jQuery(discussionSelectedDomNode).addClass('item_selected');
      this.expendMode(node);
      if(!skipScroll || skipScroll !== true) {
        discussionSelectedDomNode.scrollIntoView(true);
      }
    }
  },

  unSelectDiscussion: function(discussion) {
    if (discussion !== null) {
      var oldDiscussionSelectedDomNode = this.discussionsDomNode.find("[data-discussion-uuid='"+discussion.uuid()+"']")[0];
      var node = jQuery(oldDiscussionSelectedDomNode).removeClass('item_selected');
      this.compactMode(node);
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
    this.discussionsDomNode.find("[data-discussion-uuid='"+removedDiscussion.uuid()+"']").parent().remove();
  },

  // fire by discussion
  commentAdded: function(addedComment) {
    ddd('[DiscussionsPanelController] comment added');
    var discussionDomNode = this.discussionsDomNode.find("[data-discussion-uuid='"+addedComment.discussion.uuid()+"']");
    var commentDomNode = this.createCommentDomNode(addedComment);
    var items =  discussionDomNode.children();
    
    items
    .eq( items.length - 1 )
    .before(commentDomNode);
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