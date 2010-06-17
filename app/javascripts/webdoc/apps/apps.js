var gadgets = gadgets || {};

// Was  GadgetService NOT USED AT THE MOMENT?
WebDoc.AppService = $.klass({
  initialize: function () {
    // gadgets.rpc namespace defined in "shindig/features/src/main/javascript/features/rpc/rpc.js"
    // do not rename it
    gadgets.rpc.register('resize_iframe', this.setHeight);
    gadgets.rpc.register('set_pref', this.setUserPref);
    gadgets.rpc.register('set_title', this.setTitle);
    gadgets.rpc.register('requestNavigateTo', this.requestNavigateTo);
    gadgets.rpc.register('requestSendMessage', this.requestSendMessage);
  },
  
  setHeight: function(height) {
    if (height > WebDoc.appsContainer.maxheight_) height = WebDoc.appsContainer.maxheight_;
    var element = $("#"+this.f);
    if (element) element.height(height);
  },
  
  setTitle: function(title) {
    var element = $("#"+this.f+"_title");
    if (element) element.html(title.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
  },
  
  /**
   * Requests the container to send a specific message to the specified users.
   * @param {Array.<String>, String} recipients An ID, array of IDs, or a group reference;
   * the supported keys are VIEWER, OWNER, VIEWER_FRIENDS, OWNER_FRIENDS, or a
   * single ID within one of those groups
   * @param {opensocial.Message} message The message to send to the specified users
   * @param {Function} opt_callback The function to call once the request has been
   * processed; either this callback will be called or the gadget will be reloaded
   * from scratch
   * @param {opensocial.NavigationParameters} opt_params The optional parameters
   * indicating where to send a user when a request is made, or when a request
   * is accepted; options are of type  NavigationParameters.DestinationType
   */
  requestSendMessage: function(recipients, message, opt_callback, opt_params) {
    if (opt_callback) {
      window.setTimeout(function() {
        opt_callback(new opensocial.ResponseItem(
            null, null, opensocial.ResponseItem.Error.NOT_IMPLEMENTED, null));
      }, 0);
    }
  }
});


WebDoc.OpenSocialApp = $.klass({
  initialize: function(params) {
    
    if (params) {
      for (var name in params) {
        //this will set (among other thing) the app.id
        if (params.hasOwnProperty(name)) this[name] = params[name];
      }
    }
    
    this.domId = this.appDomId + "-" + this.view;
    if (!this.secureToken) {
      this.secureToken = 'john.doe:john.doe:appid:cont:url:0:default';
    }
    
    this.GADGET_IFRAME_PREFIX_                  = 'app_iframe_';
    this.CONTAINER                              = 'default';
    this.cssClassGadgetUserPrefsDialog          = 'apps-app-user-prefs-dialog';
    this.cssClassGadgetUserPrefsDialogActionBar = 'apps-app-user-prefs-dialog-action-bar';
    this.rpcToken                               = (0x7FFFFFFF * Math.random()) | 0;
    this.rpcRelay                               = 'files/container/rpc_relay.html';
  },
  
  // getContent: function(continuation) {
  //   // gadgets.callAsyncAndJoin([this.getMainContent], function(results) {
  //   //   continuation(results.join(''));
  //   // }, this);
  //   var pending = functions.length;
  //   var results = [];
  //     // we need a wrapper here because i changes and we need one index
  //     // variable per closure
  //     var wrapper = function(index) {
  //       functions[index].call(opt_this, function(result) {
  //         results[index] = result;
  //         if (--pending === 0) {
  //           continuation(results);
  //         }
  //       });
  //     };
  //     wrapper(i);
  // },
  
  getContent: function(continuation) {
    var iframeId = this.getIframeId();
    
    gadgets.rpc.setRelayUrl(iframeId, this.serverBase + this.rpcRelay);
    gadgets.rpc.setAuthToken(iframeId, this.rpcToken);
    
    return '<iframe id="' + iframeId + '" name="' + iframeId + '" style="" class="" src="'+ this.getIframeUrl() +
        '" frameborder="no" scrolling="no' +
        '" width="' + (this.width ? this.width : '100%') +
        '" height="' + (this.height ? this.height : '100%') +
        '" allowtransparency="true"></iframe>';
  },
  
  getIframeId: function() {
    return this.GADGET_IFRAME_PREFIX_ + this.id;
  },
  
  getIframeUrl: function() {
    return this.serverBase + 'ifr?' +
        'container=' + this.CONTAINER +
        '&mid=' +  this.id +
        '&nocache=' + WebDoc.appsContainer.nocache_ +
        '&country=' + WebDoc.appsContainer.country_ +
        '&lang=' + WebDoc.appsContainer.language_ +
        '&view=' + this.view +
        (this.specVersion ? '&v=' + this.specVersion : '') +
        (WebDoc.appsContainer.parentUrl_ ? '&parent=' + encodeURIComponent(WebDoc.appsContainer.parentUrl_) : '') +
        (this.debug ? '&debug=1' : '') +
        (this.secureToken ? '&st=' + this.secureToken : '') +
        '&url=' + encodeURIComponent(this.specUrl) +
        '#rpctoken=' + this.rpcToken +
        (this.viewParams ?
            '&view-params=' +  encodeURIComponent(gadgets.json.stringify(this.viewParams)) : '') +
        (this.hashData ? '&' + this.hashData : '');
  },
  
  refresh: function() {
    $(this.getIframeId()).src = this.getIframeUrl();
  }
});


WebDoc.App = $.klass(WebDoc.OpenSocialApp, {
  initialize: function($super, params) {
    $super(params);
    this.view = "home";
    
    this.inspectorPanes = [];
    this.render();
  },
  
  render: function() {
    var content = this.getContent();
    
    $("#"+this.appDomId).hide();
    $("#"+this.appDomId).append(content);
    
    WebDoc.appsMessagingController.sendInitMessage(this.id, this.getIframeId());
    
    $("#"+this.appDomId).show();
  },
  
  createInspectorPanes: function(panes) {
    
    $.each(panes, function(index, paneViewName) {
      
      var appPane = new WebDoc.AppPane({
        specUrl:         this.specUrl,
        view:            paneViewName,
        appWrapperDomId: "app_wrapper_"+this.getIframeId(),
        appDomId:        this.appDomId,
        secureToken:     this.secureToken,
        id:              this.id,
        serverBase:      this.serverBase,
        appView:         this.appView
      });
      this.inspectorPanes.push(appPane);
      
    }.pBind(this));
    
    this.appView.inspectorPanesManager.createOpenFloatingInspectorButton(this.appView);
  }

});

WebDoc.AppPane = $.klass(WebDoc.OpenSocialApp, {
  initialize: function($super, params) {
    $super(params);
    
    this.inspectorPaneView = null;
    
    this.render();
  },
  
  paneTitle: function() { // "some_title" => "Some Title"
    
    var titleComponents = this.view.split('_');
    
    $.each(titleComponents, function(index, component) {
      titleComponents[index] = component.charAt(0).toUpperCase() + component.substring(1);
    });
    
    return titleComponents.join(' ');
  },
  
  render: function() {
    this.height = "10px"; // to avoid setting height="100%" for this iframe (see getContent()) which would cause WebKit to bug
    var content = this.getContent();
    var title = this.paneTitle();
    
    // Instantiate the inspector pane view object (it'll handle the pane gernic UI and and behavior)
    this.appView.inspectorPanesManager.initNewPane(title, content, this);
    
    // Note that "this.id" is the main app id while this.getIframeId() the appPANE iframe id...
    WebDoc.appsMessagingController.sendInitMessage(this.id, this.getIframeId()); 
    
    // var inspectorDiv = null;
    // var boxDiv = null;
    //  
    // this.getContent(function(content) {
    //   var appIFrame = $("#"+this.appDomId+"-main").find('iframe');
    //   var appDiv = $("#"+this.appDomId+"-main");
    //   inspectorDiv = $('<div>').attr({ "id":this.domId }).addClass("inspector_pane floating attached");//.css({ "position":"absolute", "top":""+ (appIFrame.height()) +"px", "left":""+ (appIFrame.width()) +"px" });
    //   inspectorDiv.hide();
    //   boxDiv = $('<div>').addClass('box').html(content);
    //   $("#" + this.appDomId).parent().parent().append(inspectorDiv.html(boxDiv));
    //   // var doc = $(inspectorDiv).find('iframe')[0].document;
    //   
    //   // $(doc).load(function(){
    //   //   ddd(doc);
    //   //   doc.open("text/html","replace");
    //   //   doc.writeln('<link rel="stylesheet" href="' + location.protocol + '//' + location.hostname + ':' + (location.port || "80") + '/stylesheets/style.editor.apps.inspector.css" type="text/css" media="screen" />');
    //   //   doc.close();
    //   // });
    //   
    //   // var doc = document.getElementById(this.domId);
    //   // var iframe = doc.getElementsByTagName('iframe')[0];
    //   // ddd(iframe.contentDocument.getElementsByTagName('head')[0].innerHTML);
    //   // iframe.contentDocument.getElementsByTagName('head')[0].innerHTML += '<link rel="stylesheet" href="' + location.protocol + '//' + location.hostname + ':' + (location.port || "80") + '/ststyle.editor.apps.inspector.css" type="text/css" media="screen" />';
    //   
    //   // var iframe = $(inspectorDiv).find('iframe')[0];
    //   // $(iframe).load(function(e) {
    //   //   // ddd(iframe);
    //   //   // ddd(iframe.contentWindow.document);
    //   //   var head = $('head', iframe);
    //   //   iframe.innerHTML += '<link rel="stylesheet" href="' + location.protocol + '//' + location.hostname + ':' + (location.port || "80") + '/stylesheets/style.editor.apps.inspector.css" type="text/css" media="screen" />';
    //   // });
    //   
    // }.pBind(this));
    // 
    // return inspectorDiv;
  },
  
  getIframeId: function($super) {
    return $super() + "_" + this.view;
  }

});

// Container that renders an app
WebDoc.AppsContainer = $.klass({
  initialize: function() {
    this.apps = {}; // a hash olding all the instanciated apps in the form of { appId:appInstace, ... }, 
                     // where appId is
                     // and appInstance is of type WebDoc.App
    
    this.parentUrl_ = 'http://' + document.location.host;
    this.country_ = 'ALL';
    this.language_ = 'ALL';
    this.nocache_ = 1;
    this.nextAppInstanceId_ = 0;
    this.maxheight_ = 0x7FFFFFFF;
    this.appKeyPrefix = "app_";
    
    // this.gadgetService = new WebDoc.AppService();
  },
  
  setParentUrl: function(url) {
    if (!url.match(/^http[s]?:\/\//)) {
      url = document.location.href.match(/^[^?#]+\//)[0] + url;
    }
    this.parentUrl_ = url;
  },
  
  setCountry: function(country) {
    this.country_ = country;
  },
  
  setNoCache: function(nocache) {
    this.nocache_ = nocache;
  },
  
  setLanguage: function(language) {
    this.language_ = language;
  },
  
  setMaxHeight: function(maxheight) {
    this.maxheight_ = maxheight;
  },
  
  getAppKey_: function(instanceId) {
    return this.appKeyPrefix + instanceId;
  },
  
  getApp: function(instanceId) {
    return this.apps[this.getAppKey_(instanceId)];
  },
  
  createApp: function(opt_params) {
    opt_params.id = this.getNextAppInstanceId(); //autoincrement integer
    var newApp = new WebDoc.App(opt_params);
    this.addApp(newApp);
    return newApp;
  },
  
  addApp: function(app) {
    this.apps[this.getAppKey_(app.id)] = app;
  },
  
  removeApp: function(app) {
    delete this.apps[this.getAppKey_(app.id)];
  },
  
  renderApps: function() {
    for (var key in this.apps) {
      this.apps[key].render();
    }
  },
  
  getNextAppInstanceId: function() {
    return this.nextAppInstanceId_++;
  },
  
  refreshApps: function() {
    for (var key in this.apps) {
      this.apps[key].refresh();
    }
  }
});

WebDoc.appsContainer = new WebDoc.AppsContainer();
WebDoc.appsMessagingController = new WebDoc.AppsMessagingController();
