/**
 * @author Zeno Crivelli
 * Modified by David Matthey
**/

//= require <webdoc/model/widget>

WebDoc.AppsLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);

    // Setup my apps
    this.setupMyApps();
    // Setup details view
    this.setupDetailsView();

    // Observe app-rows clicks (with event delegation) for all current and future app-rows
    $("#"+libraryId+" .rows ul li a").live("click", function (event) {
      // properties are stored in the img/thumbnail element of the video row
      var properties = $(event.target).parent().find('img').data("properties");
      this.prepareDetailsView(properties);
      this.showDetailsView.click();
      event.preventDefault();
      
    }.pBind(this));

    // view transition finished (slide in/out)
    this.element.bind('pageAnimationEnd', function(event, info){
      this.loadMyApps(0);
    }.pBind(this));

    this.widgets = {};
  },
  setupMyApps: function() {
    this.myAppsId = "my_apps";
    
    this.myAppsPage = 1;
    this.myAppsContainer = $('#'+this.myAppsId);
    this.libraryUtils = new LibraryUtils();
    
    // Setup app rows drag n' drop
    this.myAppsContainer.find(".rows").bind("dragstart", this.prepareRowDrag.pBind(this));
    
    // Next/Previous page links
    this.paginationWrap = $("<div class='pagination' style='display:none'>");
    this.previousPageLink = $("<a>").attr({ href:"", 'class':"previous_page button" }).html("&larr; Previous");
    this.nextPageLink = $("<a>").attr({ href:"", 'class':"next_page button" }).html("Next &rarr;");
    this.previousPageLink.click(function(event){
      this.loadMyApps(-1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.nextPageLink.click(function(event){
      this.loadMyApps(+1);
      event.preventDefault();
    }.pBind(this)).appendTo(this.paginationWrap).hide();
    this.myAppsContainer.append(this.paginationWrap);
  },
  setupDetailsView: function() {
    
    this.detailsViewImg = this.detailsView.find('.single_app img');
    
    // Setup drag n' drop
    this.detailsView.find('.single_app')
    .attr({ draggable: "true" })
    .bind("dragstart", this.prepareAppDrag.pBind(this));

    // Handle title of Show app page action
    var showAppPageEl = $("#show_app_page_action");
    showAppPageEl.data("originalText", showAppPageEl.text());
    
    this.detailsAppContainer = this.detailsView.find('.single_app');
    
    // handle possible actions 
    $("#app_details .actions").click(function(event){
      event.preventDefault();
      
      var properties = this.detailsAppContainer.data("properties"); //properties of the currenlty displayed video are store in this element
      
      var link = $(event.target);
      var li = link.parent(); 
      var info = $("<span>").text("...");
    }.pBind(this));
  },
	prepareDetailsView: function($super, properties) { // type: youtube, vimeo
    $super(properties);
    
    // View title
    this.detailsView.attr({'class':"view details_view "+properties.type});
    
    // Store the current properties in detailsVideoContainer
    this.detailsAppContainer.data("properties", properties);
    
    // Image source (+ store the current properties in the img element)
    this.detailsViewImg.attr({'src':properties.icon_url}).data("properties", properties);

    // Title
    var title = "";
    if (properties.title) title = properties.title;
    this.detailsView.find('.app_title').text(title);
    
    // Version
    var versionEl = this.detailsView.find('.app_version');
    if (properties.version)
      versionEl.text(this.getVersionText(properties.version));
    else
      versionEl.text('');
    
    // Description
    var desc = properties.description || "";
    var descEl = this.detailsView.find('.app_description');
    descEl.text(desc);

    $("#app_details .actions li").show();
  },
  prepareRowDrag: function(event) {
    var target = $(event.target);
    if (target.closest('.app_row').length === 0 || target.find('img').length === 0) {
      event.preventDefault();
      return;
    }
    
    var properties = target.find('img').data("properties");
    this.dragStart(event, properties);
  },

  prepareAppDrag: function(event) {
    var properties = this.detailsAppContainer.data("properties");
    this.dragStart(event, properties);
  },
  didClickOnTab: function($super, tab) {
    $super(tab);
    if (tab === this.myAppsId) {
      this.loadMyApps(0);
    }
  },
  loadMyApps: function(pageIncrement) {
    var appsRowsWrap = this.myAppsContainer.find(".rows");
    
    this.myAppsPage += pageIncrement;
    if (this.myAppsPage < 1) this.myAppsPage = 1;
    
    if (pageIncrement !== 0 || !appsRowsWrap.data('loaded')) { //load only if we are paginating, or if the videos have never been loaded before
      appsRowsWrap.html('');
      
      this.showSpinner(appsRowsWrap);
      
      MTools.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
        if (data.length === 0) {
          var noApps = $("<span>").addClass('no_items').text('No Apps');
          appsRowsWrap.append(appsRowsWrap);
        }
        else {   
          var myAppsList = $("<ul>");
          for (var i = 0; i < data.length; i++) {
            myAppsList.append(this.buildAppRow(data[i].uuid(), data[i].data.properties));
            this.widgets[data[i].uuid()] = data[i];
          }
          
          appsRowsWrap.append(myAppsList);
        }
        appsRowsWrap.data('loaded', true);
        this.hideSpinner(appsRowsWrap);
      }.pBind(this), { ajaxParams: { page:this.myAppsPage }});
    }
  },
  buildAppRow: function(uuid, properties) {

    var icon = $("<img>").attr({
      //id: widget.uuid(),
      src : properties.icon_url,
      alt : ""
    })
    .data("properties", jQuery.extend({type:"my_app", uuid:uuid}, properties));
    
    var iconWrap = $("<span>").attr({'class':'wrap'});
    iconWrap.append(icon);
    
    var titleEl = $("<strong>").addClass("title").text(properties.title);
    var versionEl = $("<span>").addClass("version").text(this.getVersionText(properties.version));
    var descriptionEl = $("<p>").addClass("description").text(properties.description);
    
    var liWrap = $("<li>").addClass("app_row");
    var aWrap = $("<a href=\"\"></a>");
    
    aWrap.append(iconWrap).append(titleEl).append(versionEl).append(descriptionEl).append($("<span>").attr({'class':'spacer'}));
    liWrap.append(aWrap);
    return liWrap;
  },
  toggle: function() {
    this.domNode.slideToggle("slow");
  },
  
  dragStart: function(event, properties) {
    var dt = event.originalEvent.dataTransfer;
    dt.setData('application/ub-widget', $.toJSON(this.widgets[properties.uuid].getData()));
    
    // Drag "feedback"
    var mediaDragFeedbackEl = this.buildMediaDragFeedbackElement("app", properties.icon_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },
  getVersionText: function(version) {
    return version != undefined? "Version: "+version : ""
  }
});
