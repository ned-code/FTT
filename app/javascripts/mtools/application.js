MTools.Application = $.klass({

  initialize: function() {
    
    $.ajaxSetup({data:{authenticity_token : WebDoc.authData.authToken}});
        
    // Add feature detected styles to head
    MTools.Application.createStyle('.push-scroll {'+
      'padding-right: '+ jQuery.support.scrollbarWidth +'px;'+
      'padding-bottom: '+ jQuery.support.scrollbarWidth +'px;'+
    '}');
    // Set up default panel behaviour (show screen, show footer etc.)
    jQuery(".panel").panel();
  }
});

$.extend(MTools.Application, {
  // Take string of CSS and add to head
  createStyle: function( cssString ){
    jQuery('head').append('<style type="text/css">'+cssString+'</style>');
  }
});
