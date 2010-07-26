/**
 * @author Jonathan
**/

WebDoc.PackagesLibrary = $.klass(WebDoc.Library, {
  initialize: function($super, libraryId) {
    $super(libraryId);
    this._loadPackages();
    this.detailsView = $('#package-details');
    this.detailIframe = this.detailsView.find('iframe');
    this.createHandlers(this.element, 'click', {'packages-list': function(e){ WebDoc.application.mediaBrowserController.packagesLibrary.showList(); } });
  },

  showList: function(){
    this._hideAll();
    this.listView.show();
  },
  
  _showDetailsView: function(uuid){
    this.showSpinner(this.detailsView);
    this.detailIframe.attr('src', '');
    $.ajax({
      type: "GET",
      url: '/themes/' + uuid,
      success: function(data) {
        ddd(data.theme);
        this.detailIframe.attr('src', data.theme.elements_url);
      }.pBind(this),
      complete: function() {
        this.hideSpinner(this.detailsView);
      }.pBind(this)
    });
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

    $("#packages-list ul li").live("click", function (event) {
      event.preventDefault();
      var uuid;
      if($(event.target).is('li')){
        uuid = $(event.target).find('a').attr('href');
      }
      else if($(event.target).is('img')){
        uuid =  $(event.target).closest('a').attr('href');
      }else{
        uuid = $(event.target).attr('href');
      }
      this._showDetailsView(uuid);
    }.pBind(this));
  },
  
  _hideAll: function(){
    $('.packages-tab').hide();
  }
});