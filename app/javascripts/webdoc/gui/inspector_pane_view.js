
//= require <mtools/record>

WebDoc.InspectorPaneView = $.klass({
  initialize: function(title, content, appPane) {
    this.appPane = appPane; // can be null/undefined if this is an inspector pane not related to an app
    
    // inspector pane wrapper
    this.domNode = $("<div>").addClass("inspector_pane_wrap app_inspector floating");
    this.hide();
    this.build(title, content);
    WebDoc.application.boardController.boardContainerNode.after(this.domNode);

    var position = {
      top: "100px",
      left: "100px"
    };
    this.domNode.css(position);
  },
  
  isAppPane: function() {
    return !!this.appPane;
  },
  
  build: function(title, content) {
    this.domNode.append($('<div>').addClass('box').html('<div class="titlebar"><span class="attached_indicator"></span>' +
    '<a href="#" class="hide"><span>hide</span></a>' +
    '<strong class="title">' + title + '</strong>' +
    '<a href="#" class="arrow right" title="Send to sidebar"><span>Send to sidebar</span></a>' +
    '</div>' + content));
    setTimeout(function(){
      this.domNode.draggable({
        // containment: "parent",
        handle: 'div.titlebar',
        cursor: 'move',
        distance: 5,
        // cursorAt: { top: 30, left: 100 },
        iframeFix: true,
        start: function(e, ui) {
        }.pBind(this),
        drag: function(e, ui) {
        }.pBind(this),
        stop: function(e, ui) {
        }.pBind(this)
      });
      
    }.pBind(this), 1000)
  },

  show: function() {
    this.domNode.show();
  },

  hide: function() {
    this.domNode.hide();
  },
  
  remove: function() {
    this.domNode.remove();
  }
  
});