// Controller of panels or panel controllers

// define all panel types
WebDoc.PanelControllerType = {
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

WebDoc.PanelsController = $.klass({
  
  CURRENT_CLASS: "current",
  ACTIVE_CLASS: "active",
  PANEL_GHOST_SELECTOR: "#panel_ghost",
  
  _editPanelGroup: {
    item: true,
    page: true,
    document: true,
    discussions: true,
    my_content: true,
    apps: true,
    packages: true,
    browse_web: true
  },
  
  _viewPanelGroup: {
    discussions: true,
    my_content: true,
    apps: true,
    packages: true
  },
  
  initialize: function() {

    this._controllers = {};
    this._panelControllersClass = {
      item: WebDoc.InspectorController,
      page: WebDoc.PageInspectorController,
      document: WebDoc.DocumentInspectorController,
      discussions: WebDoc.DiscussionsPanelController,
      social: WebDoc.SocialPanelController,
      my_content: WebDoc.MyContentsController,
      apps: WebDoc.AppsLibrary,
      browse_web: WebDoc.WebSearchController,
      packages: WebDoc.PackagesLibrary,
      page_browser: WebDoc.PageBrowserController
    };

    // Some of these are lazily loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    var itemInspector = this.getInspector(WebDoc.PanelControllerType.ITEM);
    var myContentController = this.getInspector(WebDoc.PanelControllerType.MY_CONTENT);
    var webSearchController = this.getInspector(WebDoc.PanelControllerType.BROWSE_WEB);
    var pageBrowserController = this.getInspector(WebDoc.PanelControllerType.PAGE_BROWSER);

    WebDoc.application.inspectorController = itemInspector;
    WebDoc.application.myContentController = myContentController;
    WebDoc.application.webSearchController = webSearchController;
    WebDoc.application.pageBrowserController = pageBrowserController;
    
    this._currentInspectorType = null;      
    this._preloadDragDropIcon();
    
    this.panelGhostNode = jQuery( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    // This is a hack. Ultimately, we need a better way than this to be wrangling with show/hide
    $('#document-inspector').hide();
  },
  
  enableEditPanels: function() {
    this._panelGroup = this._editPanelGroup;
  },
  
  disableEditPanels: function() {
    this._panelGroup = this._viewPanelGroup;
    this.selectInspector( false );
  },
  
  getSelectedInspector: function() {
    return this._currentInspectorType;  
  },
  
  selectInspector: function( controllerType ) {
    ddd("[PanelsController] select inspector:", controllerType);
    
    this._showPanel( controllerType );
    
    if ( this._panelGroup[ controllerType ] ) {
      this._currentInspectorType = controllerType;
    }
  },
  
  deselectInspector: function(  ) {
    this._showPanel( false );
  },
  
  getInspector: function( controllerType ) {
    ddd("[PanelsController] getInspector", controllerType);
    
    var controller = this._controllers[ controllerType ];
    
    if (!controller) {
      controller = new this._panelControllersClass[ controllerType ]();
      this._controllers[ controllerType ] = controller;
    }
    
    return controller;
  },
  
  _showPanel: function( controllerType ){
    ddd('[PanelsController] _showPanel controllerType:', controllerType);
    
    if ( !controllerType ) {
      if ( this._currentInspectorType ) {
        this.getInspector( this._currentInspectorType ).domNode.removeTransitionClass( 'active' );
        this.panelGhostNode.removeTransitionClass( this.ACTIVE_CLASS );
      }
    }
    else if ( controllerType !== this._currentInspectorType ) {
      this.panelGhostNode.addTransitionClass( this.ACTIVE_CLASS );

      if ( this._currentInspectorType ) {
        this.getInspector( this._currentInspectorType ).domNode.removeTransitionClass( 'active' );
      }
      this.getInspector( controllerType ).domNode.addTransitionClass( 'active' );
    }
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
    this.selectInspector(WebDoc.PanelControllerType.MY_CONTENT);
    if(!this._controllers[WebDoc.PanelControllerType.MY_CONTENT].isMyImageLoaded()){
      this._controllers[WebDoc.PanelControllerType.MY_CONTENT].setup();
    }
  },
  
  showApps: function(){
    this.selectInspector(WebDoc.PanelControllerType.APPS);
  },
  
  showPackages: function(){
    this.selectInspector(WebDoc.PanelControllerType.PACKAGES);
  },
  
  showBrowseWeb: function(){
    this.selectInspector(WebDoc.PanelControllerType.BROWSE_WEB);
  },
  
  showPageInspector: function() {
    this.selectInspector(WebDoc.PanelControllerType.PAGE);
  },
  
  showItemInspector: function() {
    this.selectInspector(WebDoc.PanelControllerType.ITEM);
  },
  
  showDocumentInspector: function() {
    this.selectInspector(WebDoc.PanelControllerType.DOCUMENT);
  },
  
  showDiscussionsPanel: function() {
    this.selectInspector( WebDoc.PanelControllerType.DISCUSSIONS );
  },
  
  showPagesPanel: function(){
    this.selectInspector(WebDoc.PanelControllerType.PAGE_BROWSER);
  },
  
  //actually display the author panel... it's on bottom of the webdoc
  // showSocialPanel: function() {
  //   ddd("[PanelsController] showSocialPanel");
  //   this.selectInspector(WebDoc.PanelControllerType.SOCIAL);
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
  
  _changePanelContent: function(inspector) {
    ddd('[PanelsController] _changePanelContent(inspector)' + inspector);
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
  
  _preloadDragDropIcon: function(){
    this.libraryUtils = new LibraryUtils();
    // just to preload the icon (so that it'll be immediately available at the first drag)
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("video", ""));
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("image", ""));
    $(document.body).append(this.libraryUtils.buildMediaDragFeedbackElement("apps", ""));
  }
  
});
