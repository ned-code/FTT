
WebDoc.InspectorPaneView = $.klass({
  
  initialize: function(manager, title, content, appPane) {
    this.manager = manager;
    this.title = title;
    this.appPane = appPane; // can be null/undefined if this is an inspector pane not related to an app
    this.build(title, content);
    manager.domNode.append(this.domNode);
  },
  
  isAppPane: function() {
    return !!this.appPane;
  },
  
  build: function(title, content) { //content can be either a (html) string or element
    // When the pane is floating in the page (attached or detached mode) its domNode must be wrapped in the InspectorPanesManager's domMode
    // InspectorPanesManager will take cares domMode
    this.domNode = $('<div class="box">');
    
    var attachedIndicator = $('<span class="attached_indicator">');
    var closeLink = $('<a href="" class="hide"><span>hide</span></a>');
    closeLink.bind("click", function(event){
      event.preventDefault();
      this.manager.closeAll();
    }.pBind(this));
    var sendToSidebarLink = $('<a href="" class="arrow right" title="Send to sidebar"><span>Send to sidebar</span></a>');
    sendToSidebarLink.bind("click", function(event){
      event.preventDefault();
      this.sendToSidebar();
    }.pBind(this));
    
    var titleBar = $('<div class="titlebar">')
    .append(closeLink)
    .append('<strong class="title">' + title + '</strong>')
    .append(sendToSidebarLink);
    
    this.domNode.append(attachedIndicator).append(titleBar).append(content);
  },
  
  remove: function() {
    this.domNode.remove();
  },
  
  sendToSidebar: function() {
    ddd("Send to sidebar (TODO)");
  }
  
});