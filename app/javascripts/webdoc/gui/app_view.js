/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>

WebDoc.AppView = $.klass(WebDoc.ItemView, {
  initialize: function($super, item, pageView, afterItem) {
    var placeholder = $('<form/>', { 'class': 'item-placeholder stack' });
    var input       = $('<input/>', { type: 'text', title: 'App xml url', name: 'input-iframe-src', value: '' });
    
    this.placeholderNode = placeholder.html('<div class="item-icon"></div><label>Enter an App xml url:</label>').append(input);;
    this.inputNode       = input;
    
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div>");
    this.updateOverlay();
    
    this.domNode
    .addClass("item-app")
    .delegate('.item-placeholder', 'submit', this._makeSetGadgetUrlEventHandler());
    
    this.inspectorPanesManager = new WebDoc.InspectorPanesManager(this);
  },
  
  createDomNode: function($super) {
    var itemNode = $super();
    itemNode.id(this.appDomId());
    return itemNode;
  },
  
  domNodeChanged: function($super) {
    $super(); 
    this.updateOverlay();
    this.initApp();
  },
  
  initApp: function() {
    
    if (this.item.getAppUrl()) {
      this.removeAppAndPanes();
      
      this._getSecureToken(function(token) {
        this.app = WebDoc.appsContainer.createApp({
          specUrl:     this.item.getAppUrl(),
          appDomId:    this.appDomId(),
          secureToken: token,
          serverBase:  WebDoc.shindig.serverBase,
          appView:     this
        });
      }.pBind(this));
    }

  },
  
  _makeSetGadgetUrlEventHandler: function() {
    return function(e){
      var value = this.inputNode.val();
      if (value) {
        this.item.setAppUrl(value);
        this.item.save();
      }
      e.preventDefault();
    }.pBind(this);
  },
  
  updateOverlay: function() {
    if (!WebDoc.application.disableHtml) {
      var src = this.item.getAppUrl();
      if (!src) {
        this.domNode.append( this.placeholderNode );
      }
      else {
        this.placeholderNode.remove();
      }
    }
  },
  
  objectChanged: function($super, item, options) {
    $super(item, options);
    
    this.inspectorPanesManager.updateAttachedPanePosition();
  },
  
  adjustHeight: function(height) {
    //called from the app itself (via postmessaging)
    
    this.item.changeCss({ width:this.domNode.width()+'px', height:height+'px' });
    // this.item.resizeTo({ width:this.domNode.width()+'px', height:height+'px' });
  },
  
  removeAppAndPanes: function() {
    if (this.app) {
      WebDoc.appsContainer.removeApp(this.app);
      this.app = null;
      this.inspectorPanesManager.destroy();
    }
  },
  
  select: function($super) {
    $super();
    this.inspectorPanesManager.domNode.show();
    
    //avoid resizing at the moment....
    this.domNode.resizable( 'destroy' );
  },
  
  unSelect: function($super) {
    $super();
    this.inspectorPanesManager.domNode.hide();
  },
  
  canEdit: function() {
    return true;
  },
  
  inspectorId: function() {
    return 0;
  },
  
  viewDidLoad: function($super) {
    $super();
    this.initApp();
  },
  
  remove: function($super) {
    $super();
    this.removeAppAndPanes();
  },
  
  destroy: function($super) {
    $super();
    this.removeAppAndPanes();
  },
  
  appDomId: function() {
    return "app-" + this.item.uuid();
  },
  
  _getSecureToken: function(callBack) {
    var url = '/documents/' + this.item.page.document.uuid() + '/pages/' + this.item.page.uuid() + '/items/' + this.item.uuid() + '/secure_token';    
    WebDoc.ServerManager.request(url, function(data) {
      callBack.call(this, data['security_token']);
    }.pBind(this), "GET");
  }
});