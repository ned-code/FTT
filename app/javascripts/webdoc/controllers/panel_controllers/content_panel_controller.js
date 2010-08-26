/**
 * @author Jonathan
 * Modified by noe
 */

WebDoc.ContentPanelController = $.klass(WebDoc.RightBarInspectorController, {
  
  CONTENT_PANEL_SELECTOR: "#content_panel",

  BROWSEWEB_PANE_ID:   "browseweb_pane",
  COLLECTIONS_PANE_ID: "collections_pane",
  APPS_PANE_ID:        "apps_pane",
  YOURSTUFF_PANE_ID:   "yourstuff_pane",
  
  initialize: function() {

    this.webSearchController = new WebDoc.WebSearchController("media-browser-web");
		this.appsLibrary = new WebDoc.AppsLibrary("media-browser-apps");
		//this.themeElementsLibrary = new WebDoc.ThemeElementsLibrary("theme_elements");
		this.packagesLibrary = new WebDoc.PackagesLibrary("media-browser-packages");
		
		this._loadMostUsedApps();

		// just to preload the icon (so that it'll be immediately available at the first drag)
		// $(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("video", ""));
		// $(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("image", ""));
		// $(document.body).append(this.webSearchController.buildMediaDragFeedbackElement("apps", ""));

    this.domNode = jQuery(this.CONTENT_PANEL_SELECTOR);

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
    
  	// this.showBrowsewebPane();
  },

  showBrowsewebPane: function() {
    this._hideAll();
    this.browsewebPaneDomNode.addTransitionClass('active');
  },

  showCollectionsPane: function() {
    this._hideAll();
    this.collectionsPaneDomNode.addTransitionClass('active');
  },

  showAppsPane: function() {
    this._hideAll();
    this.appsPaneDomNode.addTransitionClass('active');
    // if($('#media-browser-app-details-back').attr('href') == '#media-browser-home'){
  	// 	this.appsLibrary.setupBackButton(false);
  	// 	this.appsLibrary.showList();
  	// }
  },

  showYourstuffPane: function() {
    this._hideAll();
    this.yourstuffPaneDomNode.addTransitionClass('active');
  },
  
  showMyContent: function(){
    if(WebDoc.application.contentPanelController.myContentsController){
      this.showTab('#media-browser-my-content');
    }
    else{
      WebDoc.application.contentPanelController.myContentsController = new WebDoc.MyContentsController('media-browser-my-content', this);
      this.showTab('#media-browser-my-content');
    }
  },
  	
  showAppDetails: function(widgetData){
    this._hideAll();
    this.showApps();
    this.appsLibrary.showDetailsView( widgetData, true );
  },
  
  showTab: function(tab_id){
    this._hideAll();
    jQuery(tab_id).show();
  },
  
  _hideAll: function(){
     this.allPanesDomNode.removeTransitionClass('active');
  },
  
  _loadMostUsedApps: function(pageIncrement) {
    var appsThumbWrap = $('#most_used_apps');
    
    appsThumbWrap.html('');
    this.appsLibrary.showSpinner(appsThumbWrap);
    
    WebDoc.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
      var appsList, noApps;
      
      if (data.widgets.length === 0) {
        noApps = $("<span>").addClass('no_items').text('No Apps');
        appsThumbWrap.append(noApps);
      }
      else {   
        appsList = $("<ul/>", {
          'class': 'apps-index thumbs index'
        });
        
        for (var i = 0; i < data.widgets.length; i++) {
          appsList.append( this.appsLibrary._buildThumbnail(data.widgets[i])[0] );
        }
        
        // Build DOM tree
        appsThumbWrap.append(
          appsList
        )
        .find('.title')
        .truncate();
      }
     
 			appsThumbWrap.data('loaded', true);
      this.appsLibrary.hideSpinner(appsThumbWrap);
    }.pBind(this), { ajaxParams: { favorites: 1 }});
		
		//listen to click
		$("#most_used_apps").delegate("li a", "click", function (e) {
      var widgetData = $( e.currentTarget ).data("widget");
      this.showAppDetails(widgetData);
      e.preventDefault();
    }.pBind(this));

		//Drag and drop
		appsThumbWrap.delegate("a", "dragstart", this.appsLibrary._prepareThumbDrag.pBind(this.appsLibrary));
  }
});