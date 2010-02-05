/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
//= require <webdoc/controllers/page_inspector_controller>

WebDoc.RightBarController = $.klass({
  
  CURRENT_CLASS: "current",
  ACTIVE_CLASS: "active",
  
  LIBRARY_BUTTON_SELECTOR: "a[href='#library']",
  PAGE_INSPECTOR_BUTTON_SELECTOR: "a[href='#page-inspector']",
  ITEM_INSPECTOR_BUTTON_SELECTOR: "a[href='#item-inspector']",
  
  STATE_BUTTON_SELECTOR: ".state-right-panel",
  PANEL_SELECTOR: "#right_bar",
  PANEL_TOGGLE_SELECTOR: "a[href='#right-panel-toggle']",
  
  initialize: function() {
    panel = $( this.PANEL_SELECTOR );
    
    // Some of these are lazy loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    
    var library = WebDoc.application.libraryController = new WebDoc.LibrariesController(),
        itemInspector = WebDoc.application.inspectorController = new WebDoc.InspectorController();
        //pageInspector = WebDoc.application.pageInspectorController = new WebDoc.PageInspectorController();
    
    library.buttonSelector = this.LIBRARY_BUTTON_SELECTOR;
    itemInspector.buttonSelector = this.ITEM_INSPECTOR_BUTTON_SELECTOR;
    //pageInspector.buttonSelector = this.PAGE_INSPECTOR_BUTTON_SELECTOR;
    
    this.visible = false;
    this.domNode = panel;
    this.panelWidth = panel.outerWidth();
    this.contentMap = {
      library: library,
      itemInspector: itemInspector
      //pageInspector: pageInspector
    };
  },
  
  _changePanelContent: function(inspector) {
    ddd('[RightBarController] _changePanelContent(inspector)' + inspector);
    var inspectors = this.contentMap;
    
    for (var key in inspectors) {
      if ( inspectors[key] === inspector ) {
        inspectors[key].domNode.show();
      }
      else {
        inspectors[key].domNode.hide();
      }
    }
  },
  
  _changeButtonState: function(inspector) {
    ddd('[RightBarController] _changeButtonState(inspector)');
    
    var stateButtons = $( this.STATE_BUTTON_SELECTOR ),
        currentClass = this.ACTIVE_CLASS,
        buttonSelector = inspector.buttonSelector;
    
    stateButtons.removeClass( currentClass );
    $( buttonSelector ).addClass( currentClass );
  },

  showLib: function() {
    ddd("[RightBarController] showLib");
    
    var inspector = this.contentMap.library;
    
    if (!inspector) { // lazily load the library
      ddd('[RightBarController] Load Library');
      inspector = WebDoc.application.libraryController = new WebDoc.LibrariesController();
      inspector.buttonSelector = this.LIBRARY_BUTTON_SELECTOR;
      
      this.contentMap.library = inspector;
    }
    
    this._changePanelContent(inspector);
    this._changeButtonState(inspector);
    this.showRightBar();
  },
  
  showPageInspector: function() {
    ddd("[RightBarController] showPageInspector");
    var inspector = this.contentMap.pageInspector;
    
    if (!inspector) { // lazily load the page inspector
      ddd('[RightBarController] Load Page Inspector');
      inspector = WebDoc.application.pageInspectorController = new WebDoc.PageInspectorController();
      inspector.buttonSelector = this.PAGE_INSPECTOR_BUTTON_SELECTOR;
    
      this.contentMap.pageInspector = inspector;
    }
    
    this._changePanelContent(inspector);
    this._changeButtonState(inspector);
    this.showRightBar();
  },
  
  showItemInspector: function() {
    ddd("[RightBarController] showItemInspector");
    var inspector = this.contentMap.itemInspector;
    
    if (!inspector) { // lazily load the item inspector
      ddd('[RightBarController] Load Item Inspector');
      inspector = WebDoc.application.inspectorController = new WebDoc.InspectorController();
      inspector.buttonSelector = this.ITEM_INSPECTOR_BUTTON_SELECTOR;
      
      this.contentMap.itemInspector = inspector;
    }
    
    this._changePanelContent(inspector);
    this._changeButtonState(inspector);
    this.showRightBar();
  },
  
  showRightBar: function() {
    var panel = this.domNode,
        boardManager = WebDoc.application.boardController.marginManagerNode,
        self = this;
    
    if (!this.visible) {
      this.visible = true;
      
      panel.animate({
        marginLeft: -this.panelWidth
      }, {
        step: function(val){
          boardManager.css({ marginRight: -val });
        },
        complete: function() {
          
        }
      });
    }
    
    $( this.PANEL_TOGGLE_SELECTOR ).addClass( this.ACTIVE_CLASS );
  },
  
  hideRightBar: function() {
    var panel = this.domNode,
        boardManager = WebDoc.application.boardController.marginManagerNode,
        self = this;
    
    if (this.visible) {
      this.visible = false;
      
      panel.animate({
          marginLeft: 0
      }, {
          step: function(val){
              boardManager.css({ marginRight: -val });
          },
          complete: function() {
              //self._changeButtonState();
          }
      });
    }
    
    $( this.PANEL_TOGGLE_SELECTOR ).removeClass( this.ACTIVE_CLASS );
  },
  
  toggleRightBar: function() {
    if (this.visible) {
      this.hideRightBar();
    }
    else {
      this.showRightBar();
    }
  }
  
});
