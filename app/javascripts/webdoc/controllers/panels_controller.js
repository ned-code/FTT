// Controller of panels or panel controllers

// define all panel types
WebDoc.PanelControllerType = {
  ITEM: 'item'
, PAGE: 'page'
, PAGE_BROWSER: 'page_browser'
, DOCUMENT: 'document'
, DISCUSSIONS: 'discussions'
, CONTENT: 'content'
};

WebDoc.PanelsController = $.klass({
  
  ACTIVE_CLASS: "active",
  PANEL_GHOST_SELECTOR: "#panel_ghost",
  
  _editRightPanelGroup: {
    item: true
  , page: true
  , document: true
  , discussions: true
  , content: true
  },

  _viewRightPanelGroup: {
    discussions: true
  , content: true
  },

  _bottomPanelGroup: {
    page_browser: true
  },
  
  initialize: function() {

    this._controllers = {};
    
    this._panelControllersClass = {
      item: WebDoc.InspectorController
    , page: WebDoc.PageInspectorController
    , document: WebDoc.DocumentInspectorController
    , discussions: WebDoc.DiscussionsPanelController
    , content: WebDoc.ContentPanelController
    , page_browser: WebDoc.PageBrowserController
    };

    // Some of these are lazily loaded, and some are not -
    // pageInspector does not work if you try loading it now.
    var itemInspector = this.getInspector(WebDoc.PanelControllerType.ITEM);
    var contentPanelController = this.getInspector(WebDoc.PanelControllerType.CONTENT);
    var pageBrowserController = this.getInspector(WebDoc.PanelControllerType.PAGE_BROWSER);

    WebDoc.application.inspectorController = itemInspector;
    WebDoc.application.contentPanelController = contentPanelController;
    WebDoc.application.pageBrowserController = pageBrowserController;
    
    this._currentRightPanelType = null;
    this._currentBottomPanelType = null;
    this._currentRightPanelGroup = this._viewRightPanelGroup;
    this._currentBottomPanelGroup = this._bottomPanelGroup;
    this._preloadDragDropIcon();

    // ghost panel is used to align webdoc content and inspector when webdoc is in full page.
    this.panelGhostNode = jQuery( this.PANEL_GHOST_SELECTOR );
    this.innerGhostNode = this.panelGhostNode.find('.panel-ghost');
    
    // This is a hack. Ultimately, we need a better way than this to be wrangling with show/hide
    $('#document-inspector').hide();
  },
  
  enableEditPanels: function() {
    this._currentRightPanelGroup = this._editRightPanelGroup;
  },
  
  disableEditPanels: function() {
    this._currentRightPanelGroup = this._viewRightPanelGroup;
    if (!this._viewRightPanelGroup[this._currentRightPanelType]) {
      this.deselectInspector();
    }        
  },
  
  selectInspector: function( controllerType ) {
    ddd("[PanelsController] select inspector:", controllerType);

    if (this._currentRightPanelGroup[ controllerType ] ) {
      this._showRightPanel( controllerType );
      this._currentRightPanelType = controllerType;
    }
    else if (this._currentBottomPanelGroup[controllerType]) {
      this._showBottomPanel(controllerType);
      this._currentBottomPanelType = controllerType;
    }
  },
  
  deselectInspector: function(  ) {
    this._showRightPanel( null );
    this._currentRightPanelType = null;
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
  
  _showRightPanel: function( controllerType ){
    ddd('[PanelsController] _showPanel controllerType:', controllerType);
    
    if ( !controllerType ) {
      ddd(1);
      if ( this._currentRightPanelType ) {
        this.getInspector( this._currentRightPanelType ).domNode.removeTransitionClass( 'active' );
        this.panelGhostNode.removeTransitionClass( this.ACTIVE_CLASS );
      }
    }
    else if ( controllerType !== this._currentRightPanelType ) {
      this.panelGhostNode.addTransitionClass( this.ACTIVE_CLASS );

      if ( this._currentRightPanelType ) {
        this.getInspector( this._currentRightPanelType ).domNode.removeTransitionClass( 'active' );
      }
      this.getInspector( controllerType ).domNode.addTransitionClass( 'active' );
    }
  },

  _showBottomPanel: function(controllerType) {
    if ( !controllerType || controllerType !== this._currentBottomPanelType ) {
      if ( this._currentBottomPanelType ) {
        this.getInspector( this._currentBottomPanelType ).domNode.removeTransitionClass( 'active' );
      }
      if (controllerType) {
        this.getInspector( controllerType ).domNode.addTransitionClass( 'active' );
      }
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
    this.selectInspector(WebDoc.PanelControllerType.CONTENT);
    if(!this._controllers[WebDoc.PanelControllerType.CONTENT].isMyImageLoaded()){
      this._controllers[WebDoc.PanelControllerType.CONTENT].setup();
    }
  },
  
  showApps: function(){
    this.selectInspector(WebDoc.PanelControllerType.CONTENT);
  },
  
  showPackages: function(){
    this.selectInspector(WebDoc.PanelControllerType.CONTENT);
  },
  
  showBrowseWeb: function(){
    this.selectInspector(WebDoc.PanelControllerType.CONTENT);
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
    // TODO currentlly only page browser exist in bottom panel so we do a toggle
    if (this._currentBottomPanelType === null) {
      this.selectInspector( WebDoc.PanelControllerType.PAGE_BROWSER );
    }
    else {
      this._showBottomPanel(null);
      this._currentBottomPanelType = null;
    }
  },
  
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
