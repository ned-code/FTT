/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
WebDoc.RightBarInspectorType = {
  LIBRARY: 'library',
  ITEM: 'item',
  PAGE: 'page',
  DOCUMENT: 'document',
  SOCIAL: 'social'
};

WebDoc.RightBarController = $.klass({
    
  CURRENT_CLASS: "current",
  ACTIVE_CLASS: "active",
      
  STATE_BUTTON_SELECTOR: ".state-right-panel",
  PANEL_SELECTOR: "#right_bar",
  PANEL_GHOST_SELECTOR: "#right-panel-ghost",
  PANEL_TOGGLE_SELECTOR: "a[href='#right-panel-toggle']",
  
  initialize: function() {
    panel = jQuery( this.PANEL_SELECTOR );
    
    // Some of these are lazy loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    
    var library = new WebDoc.LibrariesController(),
        itemInspector = new WebDoc.InspectorController();
        
    WebDoc.application.libraryController = library;
    WebDoc.application.inspectorController = itemInspector;
    
    this.visible = false;
    
    this.domNode = panel;
    this.panelGhostNode = jQuery( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    this.panelWidth = panel.outerWidth();
    this._inspectorsControllersClasses = {
      library: WebDoc.LibrariesController,
      item: WebDoc.InspectorController,
      page: WebDoc.PageInspectorController,
      document: WebDoc.DocumentInspectorController,
      social: WebDoc.SocialPanelController
    }; 
    this._inspectorsControllers = {
      library: library,
      item: itemInspector
    };
  },

  selectInspector: function(inspectorType) {
    ddd("[RightBarController] select inspecor", inspectorType);
    var inspectorController = this._inspectorsControllers[inspectorType]; 
    if (!inspectorController) {
      inspectorController = new this._inspectorsControllersClasses[inspectorType]();
      this._inspectorsControllers[inspectorType] = inspectorController;
    }
    this._changePanelContent(inspectorController);
    this._changeButtonState(inspectorController);
  },
  
  showLib: function() {
    ddd("[RightBarController] showLib");
    this.selectInspector(WebDoc.RightBarInspectorType.LIBRARY);
    this.showRightBar();
  },
  
  showPageInspector: function() {
    ddd("[RightBarController] show page inspector");
    this.selectInspector(WebDoc.RightBarInspectorType.PAGE);
    this.showRightBar();
  },
  
  showItemInspector: function() {
    ddd("[RightBarController] showItemInspector");
    this.selectInspector(WebDoc.RightBarInspectorType.ITEM);
    this.showRightBar();
  },
  
  showDocumentInspector: function() {
    ddd("[RightBarController] showDocumentInspector");
    this.selectInspector(WebDoc.RightBarInspectorType.DOCUMENT);
    this.showRightBar();
  },
  
  showSocialPanel: function() {
    ddd("[RightBarController] showSocialPanel");
    this.selectInspector(WebDoc.RightBarInspectorType.SOCIAL);
    this.showRightBar();
  },

  _changePanelContent: function(inspector) {
    ddd('[RightBarController] _changePanelContent(inspector)' + inspector);
    var inspectors = this._inspectorsControllers;
    
    for (var key in inspectors) {
      if ( inspectors[key] === inspector ) {
        inspectors[key].domNode.show();
        //inspectors[key].select();
      }
      else {
        inspectors[key].domNode.hide();
      }
    }
  },
  
  _changeButtonState: function(inspector) {
    ddd('[RightBarController] _changeButtonState(inspector)');

    jQuery( this.STATE_BUTTON_SELECTOR ).removeClass( this.CURRENT_CLASS );
    jQuery( inspector.buttonSelector ).addClass( this.CURRENT_CLASS );
  },
    
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
        });
      }
    });
    
    jQuery( this.PANEL_TOGGLE_SELECTOR ).addClass( this.ACTIVE_CLASS );
    
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
        });
      },
      complete: function() {
        innerGhost.hide();
      }
    });
    
    jQuery( this.PANEL_TOGGLE_SELECTOR ).removeClass( this.ACTIVE_CLASS );
    
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
