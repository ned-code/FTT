MTools.Application = $.klass({

  initialize: function() {
  
    if (WebDoc && WebDoc.authData)
    $.ajaxSetup({
      data: {
        authenticity_token: WebDoc.authData.authToken
      }
    });
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
      }
.pBind(this)      ,
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("Error occured:" + textStatus);
      }
    });
  }
  
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
  
  aftereMain: function(id, afterFunction) {
    if (MTools.Application._afterMain[id] === undefined) {
      MTools.Application._afterMain[id] = afterFunction;
    }
  },
  
  start: function() {
    $(function() {
      var flash = $('#flash');
      
      // TODO: put this somewhere more sensible
      flash.delay(3000).animate({
        opacity: 0,
        marginTop: -flash.height()
      }, {
        duration: 3000,
        easing: 'easeInCubic'
      });
      
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
    });
  }
});
