/**
 * @author noe
 */

WebDoc.DiscussionView = $.klass({

  initialize: function(discussion, pageView) {
    ddd('[DiscussionView] init');
    this.pageView = pageView;
    this.discussion = discussion;

    this.domNode = $("<a/>", {
    	'class': 'wd_discussion app_button button',
    	href: '#webdoc_discussion',
    	id: this.discussion.uuid(),
    	text: this.discussion.comments.length,
    	title: this.discussion.comments.length + ' comments'
    })
    .data( "discussionView", this );

    this.pageView.discussionDomNode.prepend(this.domNode);

    discussion.addListener(this);

    this._moveToStoredPosition();
    this._initDrag();
  },

  refreshDicussionDomNode: function() {
    this.domNode.empty();
    this.domNode.append(this.createDiscussionDomNode());
  },

  commentAdded: function(addedComment) {
    ddd('[DiscussionView] comment added');
    this.refreshDicussionDomNode();
  },

  commentRemoved: function() {
    ddd('[DiscussionView] comment removed');
    this.refreshDicussionDomNode();
  },

  // fire by record class
  objectChanged: function(discussion, options) {
    if (discussion._isAttributeModified(options, 'refresh') && options.refresh === true) {
      this._moveToStoredPosition();
    }
  },

  select: function(skipScroll) {
    this.domNode.addClass("item_selected");
    if(!skipScroll || skipScroll !== true) {
      this.domNode[0].scrollIntoView(true);
    }
  },

  unSelect: function() {
    this.domNode.removeClass("item_selected");
  },

  remove: function() {
    this.domNode.remove();
  },

  destroy: function() {
    this.discussion.removeListener(this);
  },

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
