/**
 * @author noe
 */

WebDoc.DiscussionView = $.klass({

  initialize: function(discussion, pageView) {
    ddd('DiscussionView init');
    this.pageView = pageView;
    this.discussion = discussion;

    this.domNode = $("<div/>", { 'class':'wd_discussion_wrap' }).css('zIndex', '1500000').css('height', '16px').css('width', '16px').css('position', 'absolute');
    this.domNode.id(this.discussion.uuid());
    this.domNode.append(this.createDiscussionDomNode());
    this.domNode.data("discussionView", this);

    this.pageView.discussionDomNode.prepend(this.domNode);

    discussion.addListener(this);

    this._moveToStoredPosition();
    this._initDrag();
  },

  createDiscussionDomNode: function() {
    var discussionNode = jQuery('<div/>', { 'style': 'width:16px; height:16px;' });    
    this._icon = jQuery('<img/>', { 'alt':'comment', 'src':'/images/icons/chat_16.png' });
    discussionNode.append(this._icon);
    discussionNode.append(jQuery('<div/>', { 'style': 'top:3px; width:16px; height:13px; overflow: hidden; position:absolute; font-size: 8px; text-align:center; color: white;' }).text(this.discussion.comments.length));
    // add a div to catch click with a class wd_discussion
    discussionNode.append(jQuery('<div/>', { 'style': 'top:0px; width:16px; height:16px; position:absolute;', 'class': 'wd_discussion' }));
    return discussionNode;
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
