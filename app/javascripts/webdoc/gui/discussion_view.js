/**
 * @author noe
 */

WebDoc.DiscussionView = $.klass({

  initialize: function(discussion, pageView) {
    ddd('DiscussionView init');
    ddd(discussion);
    this.pageView = pageView;
    this.discussion = discussion;

    this.domNode = $("<div/>").css('zIndex', '1500000').css('height', '16px').css('width', '16px');

    this.discussionDomNode = this.createDomNode();
    this.domNode.append(this.discussionDomNode);

    this.domNode.id(this.discussion.uuid());
    this.domNode.data("discussionView", this);
    
    discussion.addListener(this);

    this.pageView.discussionDomNode.prepend(this.domNode);

    this._moveToStoredPosition();
    this._initDrag();

    this._isSelected = false;

    this.domNode.bind('click', this.select.pBind(this));

  },

  createDomNode: function() {
    // TODO CSS for the icon
    var discussionNode =jQuery('<div/>');
    this._icon = jQuery('<img/>', {'alt':'comment', 'class':'wd_discussion', 'src':'/images/icons/chat_16.png' });
    discussionNode.append(this._icon);
    discussionNode.append(jQuery('<div/>').append(this.discussion.comments.length));

    return discussionNode;
  },

  // if param discussion is undefined => all discussion
  select: function() {
    WebDoc.application.rightBarController.showDiscussionsPanel();
    var discussionPanel = WebDoc.application.rightBarController.getInspector(WebDoc.RightBarInspectorType.DISCUSSIONS);
    discussionPanel.showDiscussion(this.discussion);
  },

  fireCommentAdded: function(addedComment) {
    this.discussionDomNode.empty();
    this.discussionDomNode = this.createDomNode();
    this.domNode.append(this.discussionDomNode);
  },

  // remove: function() {
  //   this.domNode.remove();
  // },

  // destroy: function() {
  //   this.item.removeListener();
  // },

  _initDrag: function() {
    this.domNode.draggable({
      containment: "parent",
      cursor: 'move',
      distance: 5,
      start: function(e, ui) {
        ddd("[DiscussionView] start drag");
        this.pageView.eventCatcherNode.show();        
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        var currentPosition = this.discussion.position();
        this.dragOffsetLeft = mappedPoint.x - parseFloat(currentPosition.left);
        this.dragOffsetTop = mappedPoint.y - parseFloat(currentPosition.top);
      }.pBind(this)        ,
      drag: function(e, ui) {
        var mappedPoint = WebDoc.application.boardController.mapToPageCoordinate(e);
        ui.position.left = mappedPoint.x - this.dragOffsetLeft;
        ui.position.top = mappedPoint.y - this.dragOffsetTop;
        this._moveTo(ui.position);
      }.pBind(this)        ,
      stop: function(e, ui) {
        ddd("[DiscussionView] stop drag");
        this.pageView.eventCatcherNode.hide();
        // this.inspectorPanesManager.itemViewDidMove(this);
        this.discussion.setPosition({left: ui.position.left, top: ui.position.top}, true);
        this.discussion.save();
      }.pBind(this)
    });
  },

  _moveTo: function(position) {
    this.discussion.setPosition({left: position.left, top: position.left}, true);
    this._moveToStoredPosition();
  },

  _moveToStoredPosition: function() {
    this.domNode.css({
      top: this.discussion.position().top+'px',
      left: this.discussion.position().left+'px'
    });
  }

});
