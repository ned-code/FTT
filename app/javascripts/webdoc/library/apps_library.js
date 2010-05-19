/**
 * @author Zeno Crivelli
 * Modified by David Matthey
 * Modified by Stephen
**/

//= require <webdoc/model/widget>

WebDoc.AppsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    // Setup my apps
    this._setupMyApps();
    // Setup details view
    this._setupDetailsView();

    // Observe thumbnails clicks with event delegation
    $("#"+libraryId).delegate(".thumbnails li a", "click", function (e) {
      
      // widget data is stored on the thumbnail element
      var widgetData = $( e.currentTarget ).data("widget");
      
      this.prepareDetailsView( widgetData );
      this.showDetailsView.click();
      
      e.preventDefault();
    }.pBind(this));

    // view transition finished (slide in/out)
    this.element.bind('pageAnimationEnd', function(event, info){
      var currentViewId = this.currentViewId();
      if (currentViewId === this.element.attr("id")) { // #apps view did appear
        this._loadMyApps(0);
      }
    }.pBind(this));
  },
  
  didClickOnTab: function($super, tab) {
    $super(tab);
  },
  
  _setupMyApps: function() {
    this.myAppsId = "my_apps";
    
    this.myAppsPage = 1;
    this.myAppsContainer = $('#'+this.myAppsId);
    
    // Setup app thumbnails drag n' drop
    this.myAppsContainer
    .find(".thumbnails")
    .delegate("a", "dragstart", this._prepareThumbDrag.pBind(this));
    
    $(document.body).append(this.buildMediaDragFeedbackElement("apps", "")); // just to preload the icon (so that it'll be immediately available at the first drag)
    
    // Next/Previous page links
    this.paginationWrap = $("<div class='pagination' style='display:none'>");
    this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
    this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
    this.previousPageLink.click(function(event){
      this._loadMyApps(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.nextPageLink.click(function(event){
      this._loadMyApps(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.myAppsContainer.append(this.paginationWrap);
  },
  
  _setupDetailsView: function() {
    this.detailsViewImg = this.detailsView.find('.single_app img');
    
    // Setup drag n' drop
    this.detailsView.find('.single_app')
    .attr({ draggable: "true" })
    .bind("dragstart", this._prepareAppDrag.pBind(this));

    // Handle title of Show app page action
    var showAppPageEl = $("#show_app_page_action");
    showAppPageEl.data("originalText", showAppPageEl.text());
    
    this.detailsAppContainer = this.detailsView.find('.single_app');
    
    // handle possible actions 
    $("#app_details .actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsAppContainer.data("properties"); //properties of the currenlty displayed video are store in this element
      
      var link = $(event.target);
      
      switch (link.attr("id")) {
        case "add_app_to_page_action":
          ddd("add_app_to_page_action");
          var widgetData = this.detailsAppContainer.data("widget");
          WebDoc.application.boardController.insertWidget(widgetData);
          break;
      }
    }.pBind(this));
    
  },
  
  prepareDetailsView: function($super, widgetData) {
    $super(widgetData.properties);
    
    var properties = widgetData.properties;
    // View title
    this.detailsView.attr({'class':"view details_view "+properties.type});
    
    // Store the current properties in detailsAppContainer
    this.detailsAppContainer.data("widget", widgetData);
    
    // Image source (+ store the current data in the img element)
    this.detailsViewImg.attr({'src': widgetData.properties.icon_url}).data("widget", widgetData);

    // Title
    var title = "";
    if (widgetData.title) {
      title = widgetData.title;
      this.detailsView.find('.app_title').text(title);
    }
    
    // Version
    var versionEl = this.detailsView.find('.app_version');
    if (properties.version)
      versionEl.text( properties.version );
    else
      versionEl.text('');
    
    // Description
    var desc = widgetData.description || "";
    var descEl = this.detailsView.find('.app_description');
    descEl.text(desc);
  },

  _prepareThumbDrag: function(e) {
    var thumb = $( e.currentTarget );
    var widgetData = thumb.data("widget");
    this._dragStart(e, widgetData);
  },

  _prepareAppDrag: function(event) {
    var widgetData = this.detailsAppContainer.data("widget");
    this._dragStart(event, widgetData);
  },
  
  _loadMyApps: function(pageIncrement) {
    var appsThumbWrap = this.myAppsContainer.find(".thumbnails");
    
    this.myAppsPage += pageIncrement;
    if (this.myAppsPage < 1) this.myAppsPage = 1;
    
    if (pageIncrement !== 0 || !appsThumbWrap.data('loaded')) { //load only if we are paginating, or if the apps have never been loaded before
      appsThumbWrap.html('');
      
      this.showSpinner(appsThumbWrap);
      
      WebDoc.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
        var appsList, noApps;
        
        if (data.widgets.length === 0) {
          noApps = $("<span>").addClass('no_items').text('No Apps');
          appsThumbWrap.append(appsThumbWrap);
        }
        else {   
          appsList = $("<ul/>", {
            'class': 'apps-index thumbs index'
          });
          
          for (var i = 0; i < data.widgets.length; i++) {
            appsList.append( this._buildThumbnail(data.widgets[i])[0] );
          }
          
          // Build DOM tree
          appsThumbWrap.append(
            appsList
          )
          .find('.title')
          .truncate();
        }
        this._refreshMyAppsPagination(data.pagination);
        appsThumbWrap.data('loaded', true);
        this.hideSpinner(appsThumbWrap);
      }.pBind(this), { ajaxParams: { page:this.myAppsPage }});
    }
  },
  
  _buildThumbnail: function(widget) {
    var uuid = widget.uuid(),
        properties = widget.data.properties,
        thumb = $("<a/>", {
          href: "#"+widget.data.system_name,
          css: { backgroundImage: "url('" + properties.icon_url + "')" },
          title: widget.data.title + " ["+properties.version+"]"
        }),
        title = $("<span/>", { 'class': "title" }),
        version = $("<span/>", { 'class': "version" }),
        li = $("<li/>");
    
    thumb.data( "widget", widget.getData() );
    title.html( widget.data.title );
    version.html( "v"+properties.version );
    
    // Construct DOM tree and return it
    return li.html(
      thumb.html(
        title
        .add(version)
      )
    );
  },
  
  _refreshMyAppsPagination: function(pagination) {
    var hasPagination = pagination.total_pages > 1 ? true : false;
    if (hasPagination) {
      this.paginationWrap.show();
      if (pagination.previous_page > 0) this.previousPageLink.show();
      else this.previousPageLink.hide();
      if (pagination.next_page > 0) this.nextPageLink.show();
      else this.nextPageLink.hide();
    }
    else {
      this.paginationWrap.hide();
    }
  },
  _dragStart: function(event, widgetData) {
    var dt = event.originalEvent.dataTransfer;
    dt.setData('application/ub-widget', $.toJSON(widgetData));

    if(WebDoc.application.boardController.editingItem()) {
      WebDoc.application.boardController.stopEditing();
    }
    
    // Drag "feedback"
    var properties = widgetData.properties;
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("app", properties.icon_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  }
});