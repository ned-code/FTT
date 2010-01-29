MTools.Application = $.klass({

  initialize: function() {
    
    $.ajaxSetup({data:{authenticity_token : WebDoc.authData.authToken}});
 
  }
});

$.extend(MTools.Application, {
  // Take string of CSS and add to head
  createStyle: function( cssString ){
    jQuery('head').append('<style type="text/css">'+cssString+'</style>');
  }
});
