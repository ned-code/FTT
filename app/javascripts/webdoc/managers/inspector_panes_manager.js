
WebDoc.InspectorPanesManager = $.klass({
  initialize: function(itemView) {
    //Any item view having some inspector panes associated (could be an app view or other) has an instance of this class
    this.itemView = itemView;
    
    // This is the wrapper is used to display both the list of panes and also a single (floating) pane
    this.domNode = $("<div>").addClass("inspector_pane_wrap inspector_pane floating");
    this.setMode("attached");
    
    // We now move the panes container (domNode) out of screen (but we don't hide it) so that we can compute and adjust the height of each pane
    // Once all panes are setup we'll bring the domNode back on screen
    this.movePanesContainerOutScreen();
    
    WebDoc.application.boardController.boardContainerNode.after(this.domNode);
    
    this.panesViews = {}; // paneTitle:InspectorPaneView
    this.currentPane = "list";
    this.appPanesNeedingHeightAdjustment = 0;
  },
  
  movePanesContainerOutScreen: function() {
    this.domNode.css({ left:"-5000px", top:"-5000px" });
    this.domNodeOutScreen = true;
  },
  
  initNewPane: function(title, content, appPane) {
    this.panesViews[title] = new WebDoc.InspectorPaneView(this, title, content, appPane);
    if (appPane) this.appPanesNeedingHeightAdjustment += 1;
  },
  
  adjustAppPaneHeight: function(paneIframeId, height) {
    // This method is only used if the pane is an App inspector pane whose content is an iframe
    // (this is called from the app pane itself (via postmessaging), height is the height of the iframe's document)
    if (height > 0) {
      $('#'+paneIframeId).height(height);
    }
    this.appPanesNeedingHeightAdjustment -= 1;
    
    // Bring back the domNode to screen
    if (this.appPanesNeedingHeightAdjustment < 1) {
      this.allPanesHeightsAdjusted();
    }
  },
  
  allPanesHeightsAdjusted: function() {
    // Called automatically in case the panes are "AppPanes" (iframes),
    // If your panes are not iframes and didn't need height adjustment, call this method manually (once all panes are loaded) to bring back the domNode on screen
    this.domNode.hide();
    this.hideAll(); //hide all panes views (".box") inside the panes container (domNode)
    this.domNodeOutScreen = false;
    this.updateAttachedPanePosition();
    
    this.setupDetachedMode();
  },
  
  setupDetachedMode: function() {
    // Make the pane draggable
    setTimeout(function(){
      this.domNode.draggable({
        handle: 'div.titlebar',
        cursor: 'move',
        distance: 5,
        iframeFix: true,
        // start: function(e, ui) {}.pBind(this),
        drag: function(e, ui) {
          if (this.mode == "attached") {
            this.setMode("detached");
          }
        }.pBind(this),
        // stop: function(e, ui) {}.pBind(this)
      });
    }.pBind(this), 100);
  },
  
  setMode: function(mode) { // attached / detached
    if (mode == "detached") {
      this.mode = "detached";
      this.domNode.removeClass("attached");
    }
    else {
      this.mode = "attached";
      this.domNode.addClass("attached");
    }
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
    this.currentPane = "list";
  },
  
  showPane: function(title) {
    this.updateAttachedPanePosition();
    this.hideAll();
    this.panesViews[title].domNode.show();
    this.currentPane = title;
  },
  
  buildPaneList: function() {
    var attachedIndicator = $('<span class="attached_indicator">');
    var titleBar = $('<div class="titlebar">').append(attachedIndicator);
    var list = $('<ul class="list">');
    
    $.each(this.panesViews, function(title, paneView) { 
      list.append($('<li>'+'pane'+'</li>'));
    });
    
    this.domNode.append($('<div class="box list">').append(titleBar).append(list));
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
    return {left:(refElementOffset.left-this.domNode.width()/2)-2, top:(refElementOffset.top+34)};
  },
  
  updateAttachedPanePosition: function() { //could be the pane or the list of panes
    if (!this.domNodeOutScreen && this.mode == "attached") {
      this.domNode.css(this.attachedPanePosition());
    }
  },
  
  hideAll: function() {
    $.each(this.panesViews, function(title, paneView) { 
      paneView.domNode.hide();
    });
    
    //reset to attached mode
    this.setMode("attached");
  },
  
  destroy: function() {
    // Remove all inspector panes
    $.each(this.panesViews, function(title, paneView) { 
      paneView.remove();
    });
    this.domNode.remove();
  }  
});