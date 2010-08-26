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

    this.BrowsewebController   = new WebDoc.BrowsewebController(this.BROWSEWEB_PANE_ID);
    this.collectionsController = new WebDoc.PackagesController(this.COLLECTIONS_PANE_ID);
		this.appsController        = new WebDoc.AppsController(this.APPS_PANE_ID);

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

  /**
   * Show a pane in the content panel
   * 
   * @param paneDomNode the dom node of the pane
   */
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
  },

  /**
   * Show the user's stuff
   */
  showYourstuffPane: function() {
    if(this.yourstuffController === undefined){
      this.yourstuffController = new WebDoc.YourstuffController(this.YOURSTUFF_PANE_ID, this);
    }
    this._showPane(this.yourstuffPaneDomNode);
  }
  
});