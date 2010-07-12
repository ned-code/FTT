/**
 * @author noe
 */

WebDoc.DiscussionView = $.klass({

  initialize: function(discussion, pageView) {
    ddd('DiscussionView init');
    ddd(discussion);
    this.pageView = pageView;
    this.discussion = discussion;

    this.domNode = $("<div/>").css("zIndex", 1500000);

    this.discussionDomNode = this.createDomNode();
    this.domNode.append(this.discussionDomNode);

    this.domNode.id(this.discussion.uuid());
    this.domNode.data("discussionView", this);
    
    discussion.addListener(this);
    this.pageView.discussionDomNode.prepend(this.domNode);

    this._moveToStoredPosition();
    this._initDrag();
  },

  createDomNode: function() {
    // TODO CSS for the icon
    var discussionNode = jQuery('<img/>', {'alt':'comment', 'class':'wd_discussion', 'src':'/images/icons/chat_16.png' });
    return discussionNode;
  },

  remove: function() {
    this.domNode.remove();
  },

  // objectChanged: function(item, options) {
  //   if (item._isAttributeModified(options, 'css')) {
  //     this._initItemCss(true);
  //   }
  //   if (item._isAttributeModified(options, 'class')) {
  //     this._initItemClass();
  //   }
  //   // this.inspectorPanesManager.updateAttachedPanePositionAndContent(this);
  // },

  // domNodeChanged: function() {
  //   if (!WebDoc.application.disableHtml) {
  //     this.unSelect();
  //     this.itemDomNode.remove();
  //     this.itemDomNode = this.createDomNode().addClass("item").addClass("layer").css({
  //       overflow: "hidden",
  //       width: "100%",
  //       height: "100%"
  //     });
  //     this.domNode.prepend(this.itemDomNode);
  //     if (this.item.getInnerHtml() && !jQuery.string(this.item.getInnerHtml()).empty()) {
  //       this.innerHtmlChanged();
  //     }
  //     //this.select();
  //   }
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
