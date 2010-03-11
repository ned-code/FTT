MTools.Application = $.klass({

  initialize: function() {
    
    $.ajaxSetup({data:{authenticity_token : WebDoc.authData.authToken}});
    // change domain to be able to synch with apps
    var allDomainsParts = document.domain.split(".");
    if (allDomainsParts.length > 2) {
      document.domain = allDomainsParts[allDomainsParts.length - 2] + "." + allDomainsParts[allDomainsParts.length - 1];
    }
    this._getCurrentUser();
  },
  
  _getCurrentUser: function() {
    $.ajax({
      url: "/user",
      type: 'GET',
      dataType: 'json',              
      success: function(data, textStatus) {
        this.currentUser = data.user;
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("Error occured:" + textStatus);
      }
    });
  }
  
});

$.extend(MTools.Application, {
  // Take string of CSS and add to head
  createStyle: function( cssString ){
    jQuery('head').append('<style type="text/css">'+cssString+'</style>');
  }
});
