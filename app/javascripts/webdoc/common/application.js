WebDoc.Application = $.klass({  
});

$.extend(WebDoc.Application, {
  _beforeMain: {},
  _afterMain: {},
  _mainFunction: undefined,
  // Take string of CSS and add to head
  createStyle: function(cssString) {
    jQuery('head').append('<style type="text/css">' + cssString + '</style>');
  },
  
  beforeMain: function(id, beforeFunction) {
    if (WebDoc.Application._beforeMain[id] === undefined) {
      WebDoc.Application._beforeMain[id] = beforeFunction;
    }
  },
  
  main: function(mainFunction) {    
    if (WebDoc.Application._mainFunction) {
      throw ("Main function already defined");
    }
    else {
      WebDoc.Application._mainFunction = mainFunction;
    }
  },
  
  afterMain: function(id, afterFunction) {
    if (WebDoc.Application._afterMain[id] === undefined) {
      WebDoc.Application._afterMain[id] = afterFunction;
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
          for (var beforeKey in WebDoc.Application._beforeMain) {
            WebDoc.Application._beforeMain[beforeKey].call(this);
          }
          if (WebDoc.Application._mainFunction) {
            WebDoc.Application._mainFunction.call(this);
          }      
          // execute before methods
          for (var afterKey in WebDoc.Application._afterMain) {
            WebDoc.Application._afterMain[afterKey].call(this);
          }          
        }.pBind(WebDoc.Application),
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
