/**
 * @author Jonathan
**/

WebDoc.PackagesLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
		
		
		this._loadPackages();
  },

	_setupDetailsView: function(){
		
	},
	
	_showDetailsView: function(){
		
	},
	
	_loadPackages: function(){
		ddd('[PackageLibrary] _loadPackages');
		// $.ajax({
		//       type: "GET",
		//       url: "/themes/",
		// 			dataType: 'html',
		//       success: function(data) {
		// 				this.element.append(data);
		//       }.pBind(this),
		//       complete: function() {
		// 				ddd('load Packages complete !');
		//       }.pBind(this)
		//     });
	}
});