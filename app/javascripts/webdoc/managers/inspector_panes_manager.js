
WebDoc.InspectorPanesManager = $.klass({
  
  initialize: function(itemViewOrGroupName) {
    
    if (typeof itemViewOrGroupName === 'String') {
      this.itemView = null;
      this.groupName = itemViewOrGroupName;
      // we store the state of each item views of the group so that we can restore it when needed
      this.itemViewsState = {};
    }
    else {
      this.groupName = null;
      //Any item view having some inspector panes associated (could be an app view or other) has an instance of this class
      this.itemView = itemViewOrGroupName;
    }
    
    // This is the wrapper is used to display both the list of panes and also a single (floating) pane
    this.domNode = $("<div>").addClass("inspector_pane_wrap inspector_pane floating");
    this.setMode("attached");
    
    // We now move the panes container (domNode) off screen (but we don't hide it) so that we can compute and adjust the height of each pane
    // Once all panes are setup we'll bring the domNode back on screen
    this.movePanesContainerOffScreen();
    
    if (WebDoc.application.boardController) {
     jQuery("#webdoc").after(this.domNode);
    }
    
    this.panesViews = {}; // { paneTitle1:InspectorPaneView1, paneTitle2:InspectorPaneView2, ... }
    this.panesViewsControllers = {};
    this.currentPane = "list";
    this.appPanesNeedingHeightAdjustment = 0;
  },
  
  movePanesContainerOffScreen: function() {
    this.domNode.css({ left:"-5000px", top:"-5000px" });
    this.domNodeOffScreen = true;
  },
  
  initNewPaneWithController: function(inspectorPaneController) {
    this.panesViewsControllers[inspectorPaneController.inspectorTitle()] = inspectorPaneController;
    this.initNewPane(inspectorPaneController.inspectorTitle(), inspectorPaneController.domNode);
    // be sure inspector node is not hidden
    if (inspectorPaneController.width) {
      this.domNode.css('width', inspectorPaneController.width());
    }
    inspectorPaneController.domNode.show();
  },
  
  
  initNewPane: function(title, content, appPane) {    
    this.panesViews[title] = new WebDoc.InspectorPaneView(this, title, content, appPane);
    if (appPane) {
      this.appPanesNeedingHeightAdjustment += 1;
    }
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
    this.closeAll(); //hide all panes views (".box") inside the panes container (domNode)
    this.domNodeOffScreen = false;
    //this.updateAttachedPanePosition();
    
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
        }.pBind(this)
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
  
  createOpenFloatingInspectorButton: function(itemView) {
    if (!this.openButtonForItemiew(itemView).length > 0 && this.panesCount() > 0) { //unless already created from the method below
      var correspondingItemView = itemView;
      var openFloatingInspectorButton = $('<a href="" class="show_floating_inspector" title="Show inspector"><span>Show inspector</span></a>');
      openFloatingInspectorButton.bind("click", function(event){
        event.preventDefault();
        this.showInspector(correspondingItemView);
      }.pBind(this));
       
      itemView.domNode.append(openFloatingInspectorButton);
    }
  },
  
  panesCount: function() {
    var count = 0;
    for (var i in this.panesViews) {
      count++;
    }
    return count;
  },
  
  showInspector: function(itemView, paneTitle) { // either shows the specified inspector pane, or (if param is omitted) shows the panes list (or directly the pane, if it's the only one available)
    this.closeAll();
    this.updateAttachedPanePositionAndContent(itemView);
    
    if (paneTitle) {
      this.showPane_(paneTitle);
    }
    else {
      if (this.panesCount() == 1) {
        //directly show the pane
        for (var firstPaneTitle in this.panesViews) {
          break;
        } // $.param(this.panesViews).split('=')[0];
        this.showPane_(firstPaneTitle);
      }
      else {
        //show the panes list first
        this.showPanesList_(itemView);
      }
    }
  },
  
  showPanesList_: function(itemView) { //do not call this directly, always call showInspector()
    if (this.panesList) {
      this.panesList.show();
    }
    else {
      var attachedIndicator = $('<span class="attached_indicator">');
      var list = $('<ul>');
      $.each(this.panesViews, function(title, paneView) { 
        var paneLink = $('<a href="">'+title+'</a>');
        paneLink.bind("click", function(event){
          event.preventDefault();
          this.showInspector(this.itemView, title);
        }.pBind(this));
        
        list.append($('<li>').append(paneLink));
      }.pBind(this));
      
      this.panesList = $('<div class="box list">').append(attachedIndicator).append(list);
      this.domNode.append(this.panesList);
    }
    
    this.currentPane = "list";
  },
  
  showPane_: function(title) { //do not call this directly, always call showInspector(title)
    this.panesViews[title].domNode.show();
    if (this.panesViewsControllers[title]) {
      this.panesViewsControllers[title].refresh();
    }
    this.currentPane = title;
  },
  
  attachedPanePosition: function(openButtonDomNode) { //could be the pane or the list of panes
    // Choose the reference element to align the pane (generally the "i" button)
    var refElementOffset;
    if (openButtonDomNode) {
      refElementOffset = openButtonDomNode.offset();
    }
    else {
      refElementOffset = this.domNode.offset();
    }
    return {left:(refElementOffset.left-this.domNode.width()/2)-2, top:(refElementOffset.top+34)};
  },
  
  updateAttachedPanePositionAndContent: function(itemView) { //could be the pane or the list of panes
    if (itemView && this.panesCount() > 0) {
      this.itemView = itemView;
      if (!this.domNodeOffScreen && this.mode == "attached") {
        this.domNode.css(this.attachedPanePosition(this.openButtonForItemiew(itemView)));
      }
      if (this.panesViewsControllers[this.currentPane]) {
        this.panesViewsControllers[this.currentPane].refresh();
      }
    }
  },
  
  closeAll: function() {
    $.each(this.panesViews, function(title, paneView) {
      paneView.domNode.hide();
    });
    
    if (this.panesList) this.panesList.hide();
    
    //reset to attached mode
    this.setMode("attached");
  },
  
  destroy: function() {
    // Remove all inspector panes
    $.each(this.panesViews, function(title, paneView) {
      paneView.remove();
    });
    this.domNode.remove();
  },
  
  itemDidSelect: function(itemView) {
    this.updateAttachedPanePositionAndContent(itemView);
    this.domNode.show();
  },
  
  itemDidUnselect: function(itemView) {
    if (this.currentPane == "list") {
      this.closeAll();
    }
    this.domNode.hide();
  },
  
  itemViewWillMove: function(itemView) {
    if (this.mode == "attached") {
      this.domNode.hide();
    }
  },
  
  itemViewDidMove: function(itemView) {
    if (this.mode == "attached") {
      this.domNode.show();
    }
  },
  
  openButtonForItemiew: function(itemView) {
    return itemView.domNode.find(".show_floating_inspector");
  }
  
});

jQuery.extend(WebDoc.InspectorPanesManager, {
  _allGroupManager: {},  
  featureEnabled: false,
  instanceFor: function(itemView) {
    if (this.featureEnabled) {
      if (!itemView.inspectorGroupName) {
        return new WebDoc.InspectorPanesManager(itemView);
      }
      else {
        return this._managerForGroup(itemView);
      }
    }
    else {
      return this.dummyManager;
    }
  },
  
  _managerForGroup: function(itemView) {
    var inspectorGroupName = itemView.inspectorGroupName();
    if (!this._allGroupManager[inspectorGroupName]) {
      var newManager = new WebDoc.InspectorPanesManager(inspectorGroupName);
      this._allGroupManager[inspectorGroupName] = newManager;
      if (itemView.inspectorControllersClasses) {
        var inspectorControllerClasses = itemView.inspectorControllersClasses();
        for (var i = 0; i < inspectorControllerClasses.length; i++) {
          var inspectorClass = inspectorControllerClasses[i];
          var newInspectorController = new inspectorClass();
          newManager.initNewPaneWithController(newInspectorController);
        }  
        newManager.allPanesHeightsAdjusted();
      }
      if (itemView.fullInspectorControllerClass) {
        var constructor = itemView.fullInspectorControllerClass();
        var fullInspectorController = new constructor();
        WebDoc.application.inspectorController.initPaneWithController(inspectorGroupName, fullInspectorController);
      }   
    }
    return this._allGroupManager[inspectorGroupName];    
  },
  
  /** 
   * Manager that is used when feature is disabled. This maager does nothing
   */
  dummyManager: {
    movePanesContainerOffScreen: function() {
    },
    
    initNewPaneWithController: function(inspectorPaneController) {
    },
    
    
    initNewPane: function(title, content, appPane) {    
    },
    
    adjustAppPaneHeight: function(paneIframeId, height) {
    },
    
    allPanesHeightsAdjusted: function() {
  
    },
    
    setupDetachedMode: function() {
    },
    
    setMode: function(mode) {
    },
    
    createOpenFloatingInspectorButton: function(itemView) {
    },
    
    panesCount: function() {
    },
    
    showInspector: function(itemView, paneTitle) { 
    },
    
    showPanesList_: function(itemView) { 
    },
    
    showPane_: function(title) { 
    },
    
    attachedPanePosition: function(openButtonDomNode) { 
    },
    
    updateAttachedPanePositionAndContent: function(itemView) { 
    },
    
    closeAll: function() {
    },
    
    destroy: function() {
    },
    
    itemDidSelect: function(itemView) {
    },
    
    itemDidUnselect: function(itemView) {
    },
    
    itemViewWillMove: function(itemView) {
    },
    
    itemViewDidMove: function(itemView) {
    },
    
    openButtonForItemiew: function(itemView) {
    }    
  }
});
