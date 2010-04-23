MTools.Application = $.klass({  
});

$.extend(MTools.Application, {
  _beforeMain: {},
  _afterMain: {},
  _mainFunction: undefined,
  // Take string of CSS and add to head
  createStyle: function(cssString) {
    jQuery('head').append('<style type="text/css">' + cssString + '</style>');
  },
  
  beforeMain: function(id, beforeFunction) {
    if (MTools.Application._beforeMain[id] === undefined) {
      MTools.Application._beforeMain[id] = beforeFunction;
    }
  },
  
  main: function(mainFunction) {    
    if (MTools.Application._mainFunction) {
      throw ("Main function already defined");
    }
    else {
      MTools.Application._mainFunction = mainFunction
    }
  },
  
  afterMain: function(id, afterFunction) {
    if (MTools.Application._afterMain[id] === undefined) {
      MTools.Application._afterMain[id] = afterFunction;
    }
  },
  
  start: function() {
    $(function() {
      
      $.ajax({
        url: "/user",
        type: 'GET',
        dataType: 'json',
        success: function(data, textStatus) {
          if (window.WebDoc && WebDoc.authData) {
            $.ajaxSetup({
              data: {
                authenticity_token: WebDoc.authData.authToken
              }
            });
          }
          this.currentUser = data.user;
          // execute before methods
          for (var beforeKey in MTools.Application._beforeMain) {
            MTools.Application._beforeMain[beforeKey].call(this);
          }
          if (MTools.Application._mainFunction) {
            MTools.Application._mainFunction.call(this);
          }      
          // execute before methods
          for (var afterKey in MTools.Application._afterMain) {
            MTools.Application._afterMain[afterKey].call(this);
          }          
        }.pBind(MTools.Application),
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          ddd("Error occured:" + textStatus);
        }
      });      
    });
  },
  
  getCurrentUser: function() {
    return this.currentUser;
  }
});
