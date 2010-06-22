/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
// define all inspector type that can be displayed in the right bar
WebDoc.RightBarInspectorType = {
	MEDIA_BROWSER: 'media-browser',
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
    
    var itemInspector = new WebDoc.InspectorController(),
				mediaBrowser = new WebDoc.MediaBrowserController();
        
		WebDoc.application.mediaBrowserController = mediaBrowser;
    WebDoc.application.inspectorController = itemInspector;
    
    this.visible = false;
    
    this.domNode = panel;
    this.panelGhostNode = jQuery( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    this.panelWidth = panel.outerWidth();
    this._inspectorsControllersClasses = {};
    this._inspectorsControllersClasses[WebDoc.RightBarInspectorType.MEDIA_BROWSER] = WebDoc.MediaBrowserController;
    this._inspectorsControllersClasses[WebDoc.RightBarInspectorType.ITEM] = WebDoc.InspectorController;
    this._inspectorsControllersClasses[WebDoc.RightBarInspectorType.PAGE] = WebDoc.PageInspectorController;
    this._inspectorsControllersClasses[WebDoc.RightBarInspectorType.DOCUMENT] = WebDoc.DocumentInspectorController;
    this._inspectorsControllersClasses[WebDoc.RightBarInspectorType.SOCIAL] = WebDoc.SocialPanelController;

    this._inspectorsControllers = {};
    this._inspectorsControllers[WebDoc.RightBarInspectorType.MEDIA_BROWSER] = mediaBrowser;
    this._inspectorsControllers[WebDoc.RightBarInspectorType.ITEM] = itemInspector;
    
    this._currentInspectorType = null;  
    this.selectInspector(WebDoc.RightBarInspectorType.MEDIA_BROWSER);
    
    // This is a hack. Ultimately, we need a better way than this to be wrangling with show/hide
    $('#page-inspector, #document-inspector, #social-inspector').hide();
  },

  show: function() {
    this.visible = (this.visible) ? this.visible : this._show() ;
  },
  
  hide: function() {
    this.visible = (this.visible) ? this._hide() : this.visible ;
  },
  
  toggle: function() {
    this.visible = (this.visible) ? this._hide() : this._show() ;
  },
  
  conceal: function() {
    return this._hide( 36 );
  },
  
  reveal: function() {
    return (this.visible) ? this._show() : this._hide() ;
  },
  
  getSelectedInspector: function() {
    return this._currentInspectorType;  
  },
  
  selectInspector: function(inspectorType) {
    ddd("[RightBarController] select inspector", inspectorType);
    if (this._currentInspectorType !== inspectorType) {
      var inspectorController = this.getInspector(inspectorType);
      this._changePanelContent(inspectorController);
      this._changeButtonState(inspectorController);
      this._currentInspectorType = inspectorType;
    }
    else {
      // if(this._currentInspectorType === WebDoc.RightBarInspectorType.MEDIA_BROWSER) {
      //         jQT.goTo('#media_browser', 'slide');
      //       }
    }
  },

  getInspector: function(inspectorType) {
    ddd("[RightBarController] get inspector", inspectorType);
    var inspectorController = this._inspectorsControllers[inspectorType];
    if (!inspectorController) {
      inspectorController = new this._inspectorsControllersClasses[inspectorType]();
      this._inspectorsControllers[inspectorType] = inspectorController;
    }
    return this._inspectorsControllers[inspectorType];
  },
  
	showMediaBrowser: function(){
		ddd("[RightBarController] showMediaBrowser");
    this.selectInspector(WebDoc.RightBarInspectorType.MEDIA_BROWSER);
    this.show();
	},
  
  showPageInspector: function() {
    ddd("[RightBarController] show page inspector");
    this.selectInspector(WebDoc.RightBarInspectorType.PAGE);
    this.show();
  },
  
  showItemInspector: function() {
    ddd("[RightBarController] showItemInspector");
    this.selectInspector(WebDoc.RightBarInspectorType.ITEM);
    this.show();
  },
  
  showDocumentInspector: function() {
    ddd("[RightBarController] showDocumentInspector");
    this.selectInspector(WebDoc.RightBarInspectorType.DOCUMENT);
    this.show();
  },
  
  showSocialPanel: function() {
    ddd("[RightBarController] showSocialPanel");
    this.selectInspector(WebDoc.RightBarInspectorType.SOCIAL);
    this.show();
  },

  _changePanelContent: function(inspector) {
    ddd('[RightBarController] _changePanelContent(inspector)' + inspector);
    var inspectors = this._inspectorsControllers;
    
    for (var key in inspectors) {
      if ( inspectors[key] === inspector ) {
        inspectors[key].domNode.show();
        inspectors[key].refresh();
      }
      else {
        inspectors[key].domNode.hide();
      }
    }
  },
  
  _changeButtonState: function(inspector) {
    ddd('[RightBarController] _changeButtonState(inspector)');

    jQuery( this.STATE_BUTTON_SELECTOR ).removeClass( this.CURRENT_CLASS );
    jQuery( inspector.buttonSelector() ).addClass( this.CURRENT_CLASS );
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
  }
  
});
