/**
 * @author Jonathan
 * Modified by noe
**/

WebDoc.PackagesController = $.klass(WebDoc.Library, {
  initialize: function($super, domNodeId) {
    $super(domNodeId);
    this._loadPackages();
    this.detailsView = jQuery('#package-details');
    this.detailIframe = this.detailsView.find('iframe');
    jQuery('#package-detail-back').click(function(event){
      event.preventDefault();
      this.showList();
    }.pBind(this));
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
        this.listView = jQuery('#packages-list');
      }.pBind(this)
    });

    $("#packages-list ul li").live("click", function (event) {
      event.preventDefault();
      var uuid =  $(event.target).closest('li').attr('id');
      // if($(event.target).is('li')){
      //   uuid = $(event.target).find('a').attr('href');
      // }
      // else if($(event.target).is('img')){
      //   uuid 
      // }else{
      //   uuid = $(event.target).attr('href');
      // }
      this._showDetailsView(uuid);
    }.pBind(this));
  },
  
  _hideAll: function(){
    jQuery('.packages-tab').hide();
  }
});