/**
 * Content panel
 *
 * The content panel have many panes (sub-panel) and this class manage to show/hide this panes.
 *
 * @author Jonathan
 * Modified by noe
 */

WebDoc.ContentPanelController = $.klass(WebDoc.RightBarInspectorController, {

  /**
   * The selector of the dom node
   */
  CONTENT_PANEL_SELECTOR: "#content_panel",

  /**
   * All id names of the pane (sub-panel)
   */
  BROWSEWEB_PANE_ID:   "browseweb_pane",
  COLLECTIONS_PANE_ID: "collections_pane",
  APPS_PANE_ID:        "apps_pane",
  YOURSTUFF_PANE_ID:   "yourstuff_pane",

  /**
   * - set the dom node
   * - initialize panes
   * - bind tab's click
   */
  initialize: function() {

    this.domNode = jQuery(this.CONTENT_PANEL_SELECTOR);

    this.webSearchController = new WebDoc.WebSearchController(this.BROWSEWEB_PANE_ID);
    this.packagesLibrary = new WebDoc.PackagesLibrary(this.COLLECTIONS_PANE_ID);
		this.appsLibrary = new WebDoc.AppsLibrary(this.APPS_PANE_ID);

    // TODO don't work??
		// just to preload the icon (so that it'll be immediately available at the first drag)
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
		// jQuery(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("apps", ""));

    this.browsewebPaneDomNode   = this.domNode.find('#'+this.BROWSEWEB_PANE_ID);
    this.collectionsPaneDomNode = this.domNode.find('#'+this.COLLECTIONS_PANE_ID);
    this.appsPaneDomNode        = this.domNode.find('#'+this.APPS_PANE_ID);
    this.yourstuffPaneDomNode   = this.domNode.find('#'+this.YOURSTUFF_PANE_ID);

    this.allPanesDomNode = this.domNode.find('.pane');

    this.domNode.find('a[href=#show_'+this.BROWSEWEB_PANE_ID+']').bind('click', function(event){
      event.preventDefault();
      this.showBrowsewebPane();
    }.pBind(this));

    this.domNode.find('a[href=#show_'+this.COLLECTIONS_PANE_ID+']').bind('click', function(event){
      event.preventDefault();
      this.showCollectionsPane();
    }.pBind(this));

    this.domNode.find('a[href=#show_'+this.APPS_PANE_ID+']').bind('click', function(event){
      event.preventDefault();
      this.showAppsPane();
    }.pBind(this));

    this.domNode.find('a[href=#show_'+this.YOURSTUFF_PANE_ID+']').bind('click', function(event){
      event.preventDefault();
      this.showYourstuffPane();
    }.pBind(this));

    this.domNode.find(".tab_navigation").tabsHandler();
    
  	this.showBrowsewebPane();
  },

  /**
   * Hide all pane in the content panel
   */
  _hideAllPane: function(){
     this.allPanesDomNode.removeTransitionClass('active');
  },

  _showPane: function(paneDomNode){
    this._hideAllPane();
    paneDomNode.addTransitionClass('active');
  },

  /**
   * Show the browse web pane (to search photos and video on the Web)
   */
  showBrowsewebPane: function() {
    this._showPane(this.browsewebPaneDomNode);
  },

  /**
   * Show the collections pane
   */
  showCollectionsPane: function() {
    this._showPane(this.collectionsPaneDomNode);
  },

  /**
   * Show all applications
   */
  showAppsPane: function() {
    this._showPane(this.appsPaneDomNode);
    // if($('#media-browser-app-details-back').attr('href') == '#media-browser-home'){
  	// 	this.appsLibrary.setupBackButton(false);
  	// 	this.appsLibrary.showList();
  	// }
  },
  //
  // showAppDetails: function(widgetData){
  //   this._hideAll();
  //   this.showApps();
  //   this.appsLibrary.showDetailsView( widgetData, true );
  // }

  /**
   * Show the user's stuff
   */
  showYourstuffPane: function() {
    if(!WebDoc.application.contentPanelController.myContentsController){
      WebDoc.application.contentPanelController.myContentsController = new WebDoc.MyContentsController(this.YOURSTUFF_PANE_ID, this);
    }
    this._showPane(this.yourstuffPaneDomNode);
  }
  
});