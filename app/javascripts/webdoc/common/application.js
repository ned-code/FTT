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
          this.currentUser = new WebDoc.User(data);
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
  
  initializeSingletons: function(singletons, callBack) {
    this._singletons = singletons;
    this._singletonsInitMap = [];
    this._callBack = callBack;
    for (var i = 0; i < singletons.length; i++) {      
      if (singletons[i].init) {
        this._singletonsInitMap.push(false);
        singletons[i].init(function(initializedClass) {
          var index = jQuery.inArray(initializedClass, this._singletons);
          if (index !== -1) {
            this._singletonsInitMap[index] = true;
          }      
          if (jQuery.inArray(false, this._singletonsInitMap) === -1 && !this._callbackDone) {
            this._callbackDone = true;
            callBack.call(this);
          }
        }.pBind(this));
      }
      else {
        this._singletonsinitMap.push(true);
      }
    }
    if (jQuery.inArray(false, this._singletonsInitMap) === -1 && !this._callbackDone) {
      this._callbackDone = true;
      callBack.call(this);
    }
    else {
      setTimeout(WebDoc.Application._continue.pBind(this), 10000);
    }
  },
    
  getCurrentUser: function() {
    return this.currentUser;
  },
  
  _continue: function() {
    if (jQuery.inArray(false, this._singletonsInitMap) !== -1 && !this._callbackDone) {
      ddd("all singletons have not been initialized but we need to continue loading the app...");
      this._callbackDone = true;
      this._callBack.call(this);
    }
  }
});
