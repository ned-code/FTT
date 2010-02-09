/**
 * @author Zeno Crivelli
 * Modified by David Matthey
**/

//= require <webdoc/model/widget>

WebDoc.AppsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    // Setup my apps
    this._setupMyApps();
    // Setup details view
    this._setupDetailsView();

    // Observe thumbnails clicks (with event delegation) for all current and future app thumbnails
    $("#"+libraryId+" .thumbnails ul li a").live("click", function (event) {
      // widget data are stored in the img element of the app thumbnail
      var widgetData = $(event.target).parent().find('img').data("data");
      this.prepareDetailsView(widgetData);
      this.showDetailsView.click();
      event.preventDefault();
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
    this.myAppsContainer.find(".thumbnails").bind("dragstart", this._prepareThumbDrag.pBind(this));
    $(document.body).append(this.buildMediaDragFeedbackElement("apps", "")); // just to preload the icon (so that it'll be immediatley available at the first drag)
    
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
  },
  prepareDetailsView: function($super, widgetData) {
    $super(widgetData.properties);
    
    var properties = widgetData.properties;
    // View title
    this.detailsView.attr({'class':"view details_view "+properties.type});
    
    // Store the current properties in detailsAppContainer
    this.detailsAppContainer.data("data", widgetData);
    
    // Image source (+ store the current data in the img element)
    this.detailsViewImg.attr({'src':widgetData.properties.icon_url}).data("data", widgetData);

    // Title
    var title = "";
    if (properties.title) title = widgetData.title;
    this.detailsView.find('.app_title').text(title);
    
    // Version
    var versionEl = this.detailsView.find('.app_version');
    if (properties.version)
      versionEl.text(this._getVersionText(properties.version));
    else
      versionEl.text('');
    
    // Description
    var desc = widgetData.description || "";
    var descEl = this.detailsView.find('.app_description');
    descEl.text(desc);
  },
  _prepareThumbDrag: function(event) {
    // we take parent and then search down the img because safari and firefox have not the same target.
    // on firefox target is the a tag but in safari target is the img.
    var draggingItem = $(event.target).parent().find('img');
    var widgetData = draggingItem.data("data");
    this._dragStart(event, widgetData);
  },
  _prepareAppDrag: function(event) {
    var widgetData = this.detailsAppContainer.data("data");
    this._dragStart(event, widgetData);
  },
  _loadMyApps: function(pageIncrement) {
    var appsThumbWrap = this.myAppsContainer.find(".thumbnails");
    
    this.myAppsPage += pageIncrement;
    if (this.myAppsPage < 1) this.myAppsPage = 1;
    
    if (pageIncrement !== 0 || !appsThumbWrap.data('loaded')) { //load only if we are paginating, or if the apps have never been loaded before
      appsThumbWrap.html('');
      
      this.showSpinner(appsThumbWrap);
      
      MTools.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
        if (data.widgets.length === 0) {
          var noApps = $("<span>").addClass('no_items').text('No Apps');
          appsThumbWrap.append(appsThumbWrap);
        }
        else {   
          var myAppsList = $("<ul>");
          for (var i = 0; i < data.widgets.length; i++) {
            myAppsList.append(this._buildThumbnail(data.widgets[i]));
          }
          
          appsThumbWrap.append(myAppsList);
        }
        this._refreshMyAppsPagination(data.pagination);
        appsThumbWrap.data('loaded', true);
        this.hideSpinner(appsThumbWrap);
      }.pBind(this), { ajaxParams: { page:this.myAppsPage }});
    }
  },
  _buildThumbnail: function(widget) {
    var uuid = widget.uuid();
    var properties = widget.data.properties;
    var thumb = $("<img>").attr({
      src : properties.icon_url,
      alt : ""
    })
    .data("data", widget.getData());
    
    var titleEl = $("<strong>").addClass("title").text(widget.data.title);
    var versionEl = $("<p>").addClass("version").text(this._getVersionText(properties.version));
    
    var divWrap = $("<div>");
    var liWrap = $("<li>");
    var aWrap = $("<a href='' title=''></a>");
    divWrap.append(thumb);
    divWrap.append(titleEl);
    divWrap.append(versionEl);
    
    aWrap.append(divWrap);
    liWrap.append(aWrap);

    return liWrap;
  },
  _refreshMyAppsPagination: function(pagination) {
    this.hasPagination = pagination.total_pages > 1 ? true : false;
    if (this.hasPagination) {
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
    
    // Drag "feedback"
    var properties = widgetData.properties;
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("app", properties.icon_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },
  _getVersionText: function(version) {
    return version != undefined? "Version: "+version : ""
  }
});
