/**
 * @author Jonathan
**/

WebDoc.PackagesLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
		this._loadPackages();
		this.detailsView = $('#package-details');
		this.createHandlers(this.element, 'click', {'packages-list': function(e){ WebDoc.application.mediaBrowserController.packagesLibrary.showList(); } });
  },

	showList: function(){
		this._hideAll();
		this.listView.show();
	},

	_setupDetailsView: function(){
		
	},
	
	_showDetailsView: function(){
		ddd('_showDetailsView');
		this._hideAll();
		this.detailsView.show();
	},
	
	_loadPackages: function(){
		$.ajax({
      type: "GET",
      url: "/themes.html",
      success: function(data) {
				this.element.prepend(data);
      }.pBind(this),
      complete: function() {
				this.listView = $('#packages-list');
      }.pBind(this)
    });

		$("#packages-list ul li a").live("click", function (event) {
			event.preventDefault();
      //var properties = $(event.target).parent().find('img').data("properties");
      this._showDetailsView();
    }.pBind(this));
	},
	
	_hideAll: function(){
		$('.packages-tab').hide();
	}
});