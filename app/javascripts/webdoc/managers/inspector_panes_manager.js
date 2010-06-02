
WebDoc.InspectorPanesManager = $.klass({
  initialize: function(itemView) {
    //Any item view having some inspector panes associated (could be an app view or other) has an instance of this class
    this.itemView = itemView;
    
    // This is the wrapper is used to display both the list of panes and also a single (floating) pane
    this.domNode = $("<div>").addClass("inspector_pane_wrap inspector_pane floating attached");
    this.domNode.hide();
    
    WebDoc.application.boardController.boardContainerNode.after(this.domNode);
    
    this.panesViews = {}; // paneTitle:InspectorPaneView
  },
  
  initNewPane: function(title, content, appPane) {
    this.panesViews[title] = new WebDoc.InspectorPaneView(this, title, content, appPane);
  },
  
  createShowFloatingInspectorButton: function() {
    this.showFloatingInspectorButton = $('<a href="" class="show_floating_inspector" title="Show inspectors"><span>Show inspectors</span></a>');
    this.showFloatingInspectorButton.bind("click", function(event){
      event.preventDefault();
      this.showFloatingInspector();
    }.pBind(this));
    this.itemView.domNode.append(this.showFloatingInspectorButton);
  },
  
  panesCount: function() {
    var count = 0;
    for (var i in this.panesViews) count++;
    return count;
  },
  
  showFloatingInspector: function() {
    if (this.panesCount() == 1) {
      //directly show the pane
      for (var firstPaneTitle in this.panesViews) break; // $.param(this.panesViews).split('=')[0];
      this.showPane(firstPaneTitle);
    }
    else {
      //show the panes list first
      this.showPanesList();
    }
  },
  
  showPanesList: function() {
    this.buildPaneList();
    this.domNode.show();
  },
  
  showPane: function(title) {
    this.updateAttachedPanePosition();
    this.hideAll();
    this.panesViews[title].domNode.show();
  },

  buildPaneList: function() {
    var attachedIndicator = $('<span class="attached_indicator">');
    var titleBar = $('<div class="titlebar">').append(attachedIndicator);
    var list = $('<ul class="list">');
    
    $.each(this.panesViews, function(title, paneView) { 
      list.append($('<li>'+'pane'+'</li>'))
    });
    
    this.domNode.append($('<div class="box">').append(titleBar).append(list));
  },
  
  attachedPanePosition: function() { //could be the pane or the list of panes
    // Choose the reference element to align the pane (generally the "i" button)
    var refElementOffset;
    if (this.showFloatingInspectorButton) {
       refElementOffset = this.showFloatingInspectorButton.offset();
    }
    else {
      refElementOffset = this.domNode.offset();
    }
    return {left:(refElementOffset.left-this.domNode.width()/2)-2, top:(refElementOffset.top+34)}
  },
  
  updateAttachedPanePosition: function() { //could be the pane or the list of panes
    this.domNode.css(this.attachedPanePosition());
  },
  
  setDetachedMode: function() {
    this.domNode.removeClass('attached');
    
    // Make the pane draggable
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
      
    }.pBind(this), 100)
  },
  
  hideAll: function() {
    $.each(this.panesViews, function(title, paneView) { 
      paneView.domNode.hide();
    });
  },
  
  destroy: function() {
    // Remove all inspector panes
    $.each(this.panesViews, function(title, paneView) { 
      paneView.remove();
    });
    this.domNode.remove();
  }  
});