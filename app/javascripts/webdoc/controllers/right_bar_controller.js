/**
 * Controller of the right bar. It manages the show, the hide and the toggle the right bar. It also manages if the right bar shows the inspector or the lib.
 * @author Julien Bachmann
 */
// define all inspector type that can be displayed in the right bar
WebDoc.PanelInspectorType = {
  ITEM: 'item',
  PAGE: 'page',
  PAGE_BROWSER: 'page_browser',
  DOCUMENT: 'document',
  DISCUSSIONS: 'discussions',
  SOCIAL: 'social',
  MY_CONTENT: 'my_content',
  APPS: 'apps',
  BROWSE_WEB: 'browse_web',
  PACKAGES: 'packages'
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
    
    this.rightPanelsArray = [
      'browser_panel',
      'inspector_panel',
      'comments_panel',
      'apps_panel',
      'my_content_panel',
      'packages_panel',
      'browse_web_panel',
      'page_inspector_panel',
      'document_inspector_panel'
    ];
    this.bottomPanelsArray = ['social', 'pages_panel'];
    
    // Some of these are lazy loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    
    var itemInspector = new WebDoc.InspectorController();
    var myContentController = new WebDoc.MyContentsController();
    var webSearchController = new WebDoc.WebSearchController();
    
    WebDoc.application.inspectorController = itemInspector;
    WebDoc.application.myContentController = myContentController;
    WebDoc.application.webSearchController = webSearchController;
    
    this.visible = false;
    
    this.domNode = panel;
    this.panelGhostNode = jQuery( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    this.panelWidth = panel.outerWidth();
    this._inspectorsControllersClasses = {};
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.ITEM] = WebDoc.InspectorController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.PAGE] = WebDoc.PageInspectorController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.DOCUMENT] = WebDoc.DocumentInspectorController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.DISCUSSIONS] = WebDoc.DiscussionsPanelController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.SOCIAL] = WebDoc.SocialPanelController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.MY_CONTENT] = WebDoc.MyContentsController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.APPS] = WebDoc.AppsLibrary;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.BROWSE_WEB] = WebDoc.WebSearchController;
    this._inspectorsControllersClasses[WebDoc.PanelInspectorType.PACKAGES] = WebDoc.PackagesLibrary;

    this._inspectorsControllers = {};
    this._inspectorsControllers[WebDoc.PanelInspectorType.ITEM] = itemInspector;
    this._inspectorsControllers[WebDoc.PanelInspectorType.MY_CONTENT] = myContentController;
    this._inspectorsControllers[WebDoc.PanelInspectorType.BROWSE_WEB] = webSearchController;
    
    this._currentInspectorType = null;      
    this._preloadDragDropIcon();
    
    // This is a hack. Ultimately, we need a better way than this to be wrangling with show/hide
    $('#document-inspector').hide();
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
      //this._changePanelContent(inspectorController);
      //this._changeButtonState(inspectorController);
      this._currentInspectorType = inspectorType;
      if(jQuery.inArray( inspectorType, this.bottomPanelsArray ) == -1){
        this._hideRightPanels();
      }
    }
  },

  getInspector: function(inspectorType) {
    ddd("[RightBarController] get inspector", inspectorType);
    var inspectorController = this._inspectorsControllers[inspectorType];
    if (!inspectorController) {
      ddd(inspectorType);
      inspectorController = new this._inspectorsControllersClasses[inspectorType]();
      this._inspectorsControllers[inspectorType] = inspectorController;
    }
    return this._inspectorsControllers[inspectorType];
  },
  
  _showPanel: function(panelName){
    var panel = jQuery('.' + panelName );
    if(panel.hasClass(this.ACTIVE_CLASS)){
      panel.removeClass(this.ACTIVE_CLASS);
    }
    else{
      panel.addClass(this.ACTIVE_CLASS);
    }
  },
  
  //Hide all the panel that are on the right of the webdoc
  _hideRightPanels: function(){
    jQuery(this._stringSelectorFromArray(this.rightPanelsArray)).removeClass(this.ACTIVE_CLASS);
    //jQuery(this.rightPanels).removeClass(this.ACTIVE_CLASS);
  },
  
  _hideBottomPanels: function(){
    jQuery(this._stringSelectorFromArray(this.bottomPanelsArray)).removeClass(this.ACTIVE_CLASS);
  },
  
  //transform an array of string ['str1','str2'] to '.str1, .str2'
  _stringSelectorFromArray: function(array){
    var length = array.length;
    var stringSelector = '';
    for(var i=0; i<length;i++){
      stringSelector += '.'+array[i]+','
    }
    stringSelector =  stringSelector.substring(0, stringSelector.length-1);
    return stringSelector;
  },
  
  showMyContent: function(){
    this.selectInspector(WebDoc.PanelInspectorType.MY_CONTENT);
    this._showPanel('my_content_panel');
    if(!this._inspectorsControllers[WebDoc.PanelInspectorType.MY_CONTENT].isMyImageLoaded()){
      this._inspectorsControllers[WebDoc.PanelInspectorType.MY_CONTENT].setup();
    }
  },
  
  showApps: function(){
    this.selectInspector(WebDoc.PanelInspectorType.APPS);
    this._showPanel('apps_panel');
  },
  
  showPackages: function(){
    this.selectInspector(WebDoc.PanelInspectorType.PACKAGES);
    this._showPanel('packages_panel');
  },
  
  showBrowseWeb: function(){
    this.selectInspector(WebDoc.PanelInspectorType.BROWSE_WEB);
    this._showPanel('browse_web_panel');
  },
  
  showPageInspector: function() {
    ddd('showPageInspector');
    this.selectInspector(WebDoc.PanelInspectorType.PAGE);
    this._showPanel('page_inspector_panel');
  },
  
  showItemInspector: function() {
    this.selectInspector(WebDoc.PanelInspectorType.ITEM);
    this._showPanel('inspector_panel');
  },
  
  showDocumentInspector: function() {
    this.selectInspector(WebDoc.PanelInspectorType.DOCUMENT);
    this._showPanel('document_inspector_panel');
  },
  
  //actually display the author panel... it's on bottom of the webdoc
  // showSocialPanel: function() {
  //   ddd("[RightBarController] showSocialPanel");
  //   this.selectInspector(WebDoc.PanelInspectorType.SOCIAL);
  //   var panel = jQuery('.sharing_panel');
  //   
  //   if(panel.hasClass(this.ACTIVE_CLASS)){
  //     panel.removeClass(this.ACTIVE_CLASS);
  //     jQuery('#social-inspector').hide();
  //   }
  //   else{
  //     panel.addClass(this.ACTIVE_CLASS);
  //     jQuery('#social-inspector').show();
  //   }
  //   //this.show();
  // },

  showDiscussionsPanel: function() {
    this.selectInspector(WebDoc.PanelInspectorType.DISCUSSIONS);
    this._showPanel('comments_panel');
  },
  
  showPagesPanel: function(){
    ddd('[RightBarController] showPagesPanel');
    this._showPanel('pages_panel');
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
        bothGhosts = outerGhost.add(innerGhost),
        scrollbar = jQuery('#webdoc_x_scrollbar, #webdoc_y_scrollbar');
    
    innerGhost.show();
    
    panel.animate({
      marginLeft: -this.panelWidth
    }, {
      step: function(val){
        bothGhosts.css({
          width: -val
        });
        scrollbar.css({
          right: -val + 6
        });
      },
      complete: function(){
        // Quick way of recalculating scrollbars
        jQuery(window).trigger('resize');
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
        bothGhosts = outerGhost.add(innerGhost),
        scrollbars = jQuery('#webdoc_x_scrollbar, #webdoc_y_scrollbar');

    
    panel.animate({
      marginLeft: margin || 0
    }, {
      step: function(val){
        bothGhosts.css({
          width: -val
        });
        scrollbars.css({
          right: -val + 6
        });
      },
      complete: function() {
        innerGhost.hide();
        
        // Quick way of recalculating scrollbars
        jQuery(window).trigger('resize');
      }
    });
    
    jQuery( this.PANEL_TOGGLE_SELECTOR ).removeClass( this.ACTIVE_CLASS );
    
    return false;
  },
  
  _preloadDragDropIcon: function(){
    this.libraryUtils = new LibraryUtils();
    // just to preload the icon (so that it'll be immediately available at the first drag)
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("video", ""));
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("image", ""));
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("apps", ""));
  }
  
});
