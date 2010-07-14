  /**
 * @author noe
 */

WebDoc.DiscussionsPanelController = jQuery.klass(WebDoc.RightBarInspectorController, {

  DISCUSSIONS_PANEL_BUTTON_SELECTOR: "a[href='#discussions-panel']",

  initialize: function() {

    this.creator = WebDoc.application.pageEditor.getCreator();
    this.currentPage = WebDoc.application.pageEditor.currentPage;

    this.domNode = jQuery('#discussions-panel');
    this.formDomNode = this.domNode.find('#wd_discussion_form');
    this.discussionsDomNode = this.domNode.find('#wd_discussions');

    this._currentDiscussion = null;


    this.currentPage.addListener(this);

    // For add discussion button
    this.domNode.find(".wd_discussion_add").bind("dragstart", this.prepareCreateDiscussionDragStart.pBind(this));


    // this.showPageDiscussions();
  },

  buttonSelector: function() {
    return this.DISCUSSIONS_PANEL_BUTTON_SELECTOR;
  },

  showDiscussion: function(discussion) {
    if(this._currentDiscussion) {
      discussion.removeListener(this._currentDiscussion);
    }
    this._currentDiscussion = discussion;
    discussion.addListener(this);
    this.formDomNode.empty();
    this.formDomNode.append(this.createCommentForm());
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
    var newDiscussionsDomNode = jQuery('<div/>').attr('data-discussion-uuid', discussion.uuid());

    for(var i=0; i<discussion.comments.length; i++) {
      var comment = discussion.comments[i];
      newDiscussionsDomNode.append(this.createCommentDomNode(comment));
    }
    
    return newDiscussionsDomNode;  
  },

  createCommentDomNode: function(comment) {
    var commentDomNode = jQuery('<div/>'),
        firstPart = jQuery('<div/>', { 'style': 'width: 60%; float: left;'}),
        secondPart = jQuery('<div/>', { 'style': 'width: 40%; float: left;'});
    firstPart.append(comment.content());
    firstPart.append(jQuery('<br/>'));
    firstPart.append(comment.created_at() + ' by ' + comment.user.getUsername());
    secondPart.append(jQuery('<img/>', { 'src': comment.user.getAvatarThumbUrl() }));

    commentDomNode.append(firstPart).append(secondPart).append(jQuery('<div/>', {'style':'clear:both;'})).append(jQuery('<hr>'));
    return commentDomNode;
  },

  createCommentForm: function() {
    var label = jQuery('<label/>').text('Comment');
    var discussionForForm = this._currentDiscussion;

    this._commentContent = jQuery('<textarea/>', { name: 'comment', value: 'Your comment' });
    this._form = $('<form/>');
    this._button = jQuery('<input/>', { 'type': 'submit', 'value': 'Comment'});
    this._form.append(label).append(this._commentContent).append(this._button);

    this._form
    .bind('submit', function(e){
      e.preventDefault();

      this._button.hide();
      this._commentContent.attr('disabled', 'disabled');

      var newComment = new WebDoc.Comment(null, this._currentDiscussion);
      newComment.setContent( this._commentContent.val(), true );

      newComment.save(function(newCommentBack, status) {
        this._form.show();
        if (status == "OK")
        {
          discussionForForm.addComment(newCommentBack); 
          this._commentContent.val('');
          this._commentContent.removeAttr('disabled');
          this._button.show();
        }
      }.pBind(this));


    }.pBind(this));

    return this._form;
  },

  discussionAdded: function(discussion) {
    this.showDiscussion(discussion);  
  },

  fireCommentAdded: function(addedComment) {
    ddd('[DiscussionsPanel] fire comment added');
    if(this._currentDiscussion === addedComment.discussion) {
      this.discussionsDomNode.find("div[data-discussion-uuid='"+addedComment.discussion.uuid()+"']")
          .append(this.createCommentDomNode(addedComment));
    }
  },

  // Button part

  prepareCreateDiscussionDragStart: function(event) {
    event.originalEvent.dataTransfer.setData("application/wd-discussion", $.toJSON({ action: 'create' }));
  }

});