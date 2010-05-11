/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>

WebDoc.AppView = $.klass(WebDoc.ItemView, {
  initialize: function($super, item, pageView, afterItem) {
    var placeholder = $('<form/>', { 'class': 'item-placeholder stack' });
    var input       = $('<input/>', { type: 'text', title: 'Gadget xml url', name: 'input-iframe-src', value: '' });
    
    this.placeholderNode = placeholder.html('<div class="item-icon"></div><label>Enter a Gadet xml url:</label>').append(input);;
    this.inputNode       = input;
    
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div>");
    this.updateOverlay();
    
    this.domNode
    .addClass("item-app")
    .delegate('.item-placeholder', 'submit', this._makeSetGadgetUrlEventHandler());
    
    this.itemDomNode.css({
      padding: "15px"
    });
    
    this.inspectors
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
    if (window.gadgets) {
      if (this.item.getGadgetUrl()) {
        if (this.app) {
          WebDoc.appsContainer.removeApp(this.app);
          this.app = null;
        }
        
        this._getSecureToken(function(token) {
          this.app = WebDoc.appsContainer.createApp({
            specUrl:     this.item.getGadgetUrl(),
            appDomId:    this.appDomId(),
            secureToken: token,
            serverBase:  WebDoc.shindig.serverBase
          });
        }.pBind(this));
      }
    }
  },
  
  _makeSetGadgetUrlEventHandler: function() {
    return function(e){
      var value = this.inputNode.val();
      if (value) {
        this.item.setGadgetUrl(value);
        this.item.save();
      }
      e.preventDefault();
    }.pBind(this);
  },
  
  updateOverlay: function() {
    if (!WebDoc.application.disableHtml) {
      var src = this.item.getGadgetUrl();
      if (!src) {
        this.domNode.append( this.placeholderNode );
      }
      else {
        this.placeholderNode.remove();
      }
    }
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
  
  destroy: function($super) {
    $super();
    if (window.gadgets) {
      WebDoc.appsContainer.removeApp(this.app);
    }
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