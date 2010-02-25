/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
//= require <webdoc/controllers/page_inspector_controller>
//= require <webdoc/controllers/document_inspector_controller>

WebDoc.RightBarController = $.klass({
  
  CURRENT_CLASS: "current",
  ACTIVE_CLASS: "active",
  
  LIBRARY_BUTTON_SELECTOR: "a[href='#library']",
  PAGE_INSPECTOR_BUTTON_SELECTOR: "a[href='#page-inspector']",
  ITEM_INSPECTOR_BUTTON_SELECTOR: "a[href='#item-inspector']",
  DOCUMENT_INSPECTOR_BUTTON_SELECTOR: "a[href='#document-inspector']",
  
  STATE_BUTTON_SELECTOR: ".state-right-panel",
  PANEL_SELECTOR: "#right_bar",
  PANEL_GHOST_SELECTOR: "#right-panel-ghost",
  PANEL_TOGGLE_SELECTOR: "a[href='#right-panel-toggle']",
  
  initialize: function() {
    panel = $( this.PANEL_SELECTOR );
    
    // Some of these are lazy loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    
    var library = WebDoc.application.libraryController = new WebDoc.LibrariesController(),
        itemInspector = WebDoc.application.inspectorController = new WebDoc.InspectorController();
    
    library.buttonSelector = this.LIBRARY_BUTTON_SELECTOR;
    itemInspector.buttonSelector = this.ITEM_INSPECTOR_BUTTON_SELECTOR;
    
    this.visible = false;
    
    this.domNode = panel;
    this.panelGhostNode = $( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    this.panelWidth = panel.outerWidth();
    this.contentMap = {
      library: library,
      itemInspector: itemInspector
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
        currentClass = this.CURRENT_CLASS,
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
  
  showDocumentInspector: function() {
    ddd("[RightBarController] showDocumentInspector");
    var inspector = this.contentMap.documentInspector;
    
    if (!inspector) { // lazily load the page inspector
      ddd('[RightBarController] Load Document Inspector');
      inspector = WebDoc.application.documentInspectorController = new WebDoc.DocumentInspectorController();
      inspector.buttonSelector = this.DOCUMENT_INSPECTOR_BUTTON_SELECTOR;
    
      this.contentMap.documentInspector = inspector;
    }
    
    this._changePanelContent(inspector);
    this._changeButtonState(inspector);
    this.showRightBar();
  },
  
  // Show / hide Right bar ----------------------------------
  
  _show: function() {
    var panel = this.domNode,
        self = this,
        outerGhost = this.panelGhostNode,
        innerGhost = this.innerGhostNode,
        bothGhosts = outerGhost.add(innerGhost);
    
    innerGhost.show();
    
    panel.animate({
      marginLeft: -this.panelWidth
    }, {
      step: function(val){
        bothGhosts.css({
          width: -val
        })
      }
    });
    
    $( this.PANEL_TOGGLE_SELECTOR ).addClass( this.ACTIVE_CLASS );
    
    return true;
  },
  
  _hide: function( margin ){
    var panel = this.domNode,
        self = this,
        outerGhost = this.panelGhostNode,
        innerGhost = this.innerGhostNode,
        bothGhosts = outerGhost.add(innerGhost);
    
    panel.animate({
      marginLeft: margin || 0
    }, {
      step: function(val){
        bothGhosts.css({
          width: -val
        })
      },
      complete: function() {
        innerGhost.hide();
      }
    });
    
    $( this.PANEL_TOGGLE_SELECTOR ).removeClass( this.ACTIVE_CLASS );
    
    return false;
  },
  
  showRightBar: function() {
    this.visible = (this.visible) ? this.visible : this._show() ;
  },
  
  hideRightBar: function() {
    this.visible = (this.visible) ? this._hide() : this.visible ;
  },
  
  toggleRightBar: function() {
    this.visible = (this.visible) ? this._hide() : this._show() ;
  },
  
  concealRightBar: function() {
    return this._hide( 36 );
  },
  
  revealRightBar: function() {
    return (this.visible) ? this._show() : this._hide() ;
  }
  
});
