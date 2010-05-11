var gadgets = gadgets || {};

/**
 * Base implementation of GadgetService.
 * @constructor
 */
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
        '" frameborder="no" scrolling="no" ' +
        'height="' + (this.height ? this.height : '100%') +
        '" width="' + (this.width ? this.width : '100%') +
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
    this.inspectors = new Array();
    this.createInspectors();
  },
  
  render: function() {
    var content = this.getContent();
    
    $("#" + this.appDomId).hide();
    $("#" + this.appDomId).append(content);
    
    $.each(this.inspectors, function(index, inspector) {
      ddd("Rendering " + inspector.view + " inspector!");
      inspector.render();
    });
    
    // Show !
    $.each(this.inspectors, function(index, inspector) {
      $("#"+inspector.domId).show();
    });
    $("#" + this.appDomId).show();
  },
  
  createInspectors: function() {
    var requestData = {
      context: {},
      gadgets: [{
        url: this.specUrl,
        moduleId: this.id
      }]
    };
    
    $.ajax({
      url: '/gadgets/metadata?st=' + this.secureToken,
      type: 'POST',
      dataType: 'json',
      data: gadgets.json.stringify(requestData),
      success: function(data, textStatus) {
        $.each(data.gadgets[0].views, function(inspectorViewName, infos) {
          if(inspectorViewName.match(/^inspector-/) != null) {
            ddd("Creating " + inspectorViewName + " inspector...");
            this.inspectors.push(new WebDoc.AppInspector({
              specUrl:         this.specUrl,
              view:            inspectorViewName,
              appWrapperDomId: "app_wrapper_"+this.getIframeId(),
              appDomId:        this.appDomId,
              secureToken:     this.secureToken,
              id:              this.id,
              serverBase:      this.serverBase
            }));
          }
        }.pBind(this));
        this.render();
      }.pBind(this),
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        ddd("error", textStatus);
      }
    });
  }
});

WebDoc.AppInspector = $.klass(WebDoc.OpenSocialApp, {
  initialize: function($super, params) {
    $super(params);
    
    this.inspectorPaneView = null;
  },
  
  render: function() {
    var content = this.getContent();
    var title = this.view.replace('inspector-', '')
    title = title.charAt(0).toUpperCase() + title.substring(1);
    this.inspectorPaneView = new WebDoc.InspectorPaneView(title, content);
    
    // var inspectorDiv = null;
    // var boxDiv = null;
    //  
    // this.getContent(function(content) {
    //   var appIFrame = $("#"+this.appDomId+"-main").find('iframe');
    //   var appDiv = $("#"+this.appDomId+"-main");
    //   inspectorDiv = $('<div>').attr({ "id":this.domId }).addClass("app_inspector floating attached");//.css({ "position":"absolute", "top":""+ (appIFrame.height()) +"px", "left":""+ (appIFrame.width()) +"px" });
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

/**
 * Container that renders an app
 * @constructor
 */
WebDoc.AppsContainer = $.klass({
  initialize: function() {
    this.gadgets_              = {};
    this.parentUrl_            = 'http://' + document.location.host;
    this.country_              = 'ALL';
    this.language_             = 'ALL';
    this.nocache_              = 1;
    this.nextGadgetInstanceId_ = 0;
    this.maxheight_            = 0x7FFFFFFF;
    
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
  
  getGadgetKey_: function(instanceId) {
    return 'gadget_' + instanceId;
  },
  
  getGadget: function(instanceId) {
    return this.gadgets_[this.getGadgetKey_(instanceId)];
  },
  
  createApp: function(opt_params) {
    opt_params.id = this.getNextGadgetInstanceId();
    var newApp = new WebDoc.App(opt_params);
    this.addApp(newApp);
    return newApp;
  },
  
  addApp: function(gadget) {
    this.gadgets_[this.getGadgetKey_(gadget.id)] = gadget;
  },
  
  removeApp: function(gadget) {
    delete this.gadgets_[this.getGadgetKey_(gadget.id)];
  },
  
  purge: function(gadget) {
    this.gadgets_ = {};
  },
  
  addApps: function(gadgets) {
    for (var i = 0; i < gadgets.length; i++) {
      this.addApp(gadgets[i]);
    }
  },
  
  renderGadgets: function() {
    for (var key in this.gadgets_) {
      this.gadgets_[key].render();
    }
  },
  
  getNextGadgetInstanceId: function() {
    return this.nextGadgetInstanceId_++;
  },
  
  refreshGadgets: function() {
    for (var key in this.gadgets_) {
      this.gadgets_[key].refresh();
    }
  }
});

WebDoc.appsContainer = new WebDoc.AppsContainer();