/**
 * @author Zeno Crivelli
 * Modified by David Matthey
 * Modified by Stephen
 * Modified by jonathan
 * Modified by noe
**/


WebDoc.AppsController = $.klass(WebDoc.Library, {

  APPS_ID: "apps-list",

  initialize: function($super, domNodeId) {
    $super(domNodeId);

    this.domNode = jQuery('#'+domNodeId);
    this.detailsView = this.domNode.find('#app_details');
    this.appsContainerDomNode = this.domNode.find('#'+this.APPS_ID);
    this.detailsViewImg = this.detailsView.find('.single_app img');
    this.appsPage = 1;

    this.appsContainerDomNode
      .find(".thumbnails")
      .delegate("a", "dragstart", this._prepareThumbDrag.pBind(this));

    this._setupDetailsView();
    
    // Observe thumbnails clicks with event delegation
    this.domNode.delegate(".thumbnails li a", "click", function (e) {
      var widgetData = $( e.currentTarget ).data("widget");
      this.showDetailsView( widgetData );
      e.preventDefault();
    }.pBind(this));
    
    this._loadMyApps();	
  },
  
  _setupDetailsView: function() {
    // Setup drag n' drop
    this.detailsView.find('.single_app')
    .attr({ draggable: "true" })
    .bind("dragstart", this._prepareAppDrag.pBind(this));
    
    this.detailsAppContainer = this.detailsView.find('.single_app');
    
    $('#app-details-back').click(function(event){
      event.preventDefault();
      this.showList();
      }.pBind(this));
    
    // handle possible actions 
    this.detailsView.find(".actions").click(function(event){
      
      event.preventDefault();
      ddd(event.target);
      ddd(this.detailsAppContainer.data("widget"));
      var properties = this.detailsAppContainer.data("widget");
      var link = $(event.target);
      switch (link.attr("id")) {
        case "add_app_to_page_action":
          ddd('app_details .add_app_to_page_action');
          var widgetData = this.detailsAppContainer.data("widget");
          WebDoc.application.boardController.insertWidget(widgetData);
          break;
      }
    }.pBind(this));
  },
  
  showList: function(){
    this._hideAll();
    this.appsContainerDomNode.show();
  },
  
  showDetailsView: function(widgetData) {
    
    var properties = widgetData.properties;
    // View title
    this.detailsView.attr({'class':"view details_view app-tab "+properties.type});
    
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
    
    this._hideAll();
    this.detailsView.show();
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
    var appsThumbWrap = this.appsContainerDomNode.find(".thumbnails");
    
    appsThumbWrap.html('');
    this.showSpinner(appsThumbWrap);
    
    WebDoc.ServerManager.getRecords(WebDoc.Widget, null, function(data) {
      var appsList, noApps;
      
      if (data.widgets.length === 0) {
        noApps = $("<span>").addClass('no_items').text('No Apps');
        appsThumbWrap.append(noApps);
      }
      else {   
        appsList = $("<ul/>", {
          'class': 'horizontal med_thumbs_index apps_index index'
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
      
      //previous and next link
      if(data.pagination.previous_page){
        var previousElement= $("<a href='#'>Previous</a>;");
        var that = this;
        previousElement.click(function(e){
          e.preventDefault;
          that._previousPage();
        });
        appsThumbWrap.append(previousElement).append("&nbsp;");
      }
      if(data.pagination.next_page){
        var nextElement = $("<a href='#'>Next</a>");
        var that = this;
        nextElement.click(function(e){
          e.preventDefault;
          that._nextPage();
        });
        appsThumbWrap.append(nextElement);
      }
      
      appsThumbWrap.data('loaded', true);
      this.hideSpinner(appsThumbWrap);
    }.pBind(this), { ajaxParams: { page: this.appsPage }});
  },
  
  _nextPage: function(){
    this.appsContainerDomNode.find(".thumbnails").empty();
    this.appsPage += 1;
    this._loadMyApps();
  },
  
  _previousPage: function(){
    this.appsContainerDomNode.find(".thumbnails").empty();
    this.appsPage -= 1;
    this._loadMyApps();
  },
  
  _buildThumbnail: function(widget) {
    var uuid = widget.uuid(),
        properties = widget.data.properties,
        thumb = $("<a/>", {
          href: "#"+widget.data.system_name,
          css: { backgroundImage: "url('" + properties.icon_url + "')" },
          title: widget.data.title + " ["+properties.version+"]"
        }).addClass('med_thumb app_thumb thumb'),
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

  _dragStart: function(event, widgetData) {
    ddd('[AppsController] _dragStart');
    var dt = event.originalEvent.dataTransfer;
    dt.setData('application/wd-widget', $.toJSON(widgetData));

    if(WebDoc.application.boardController.editingItem()) {
      WebDoc.application.boardController.stopEditing();
    }
    
    // Drag "feedback"
    var properties = widgetData.properties;
    var mediaDragFeedbackEl = this.libraryUtils.buildMediaDragFeedbackElement("app", properties.icon_url);
    $(document.body).append(mediaDragFeedbackEl);
    dt.setDragImage( mediaDragFeedbackEl[0], 65, 45 );
  },

  _hideAll: function(){
    this.detailsView.addClass('hidden');
  }
});