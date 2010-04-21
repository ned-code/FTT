/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>

WebDoc.OsGadgetView = $.klass(WebDoc.ItemView, {

  initialize: function($super, item, pageView, afterItem) {
    var that = this;
    var placeholder = $('<form/>', {'class': 'item-placeholder stack'});
    var input = $('<input/>', { type: 'text', title: 'Gadget xml url', name: 'input-iframe-src', value: '' });
    
    placeholder
    .html('<div class="item-icon"></div><label>Enter a Gadet xml url:</label>')
    .append( input );
    
    this.placeholderNode = placeholder;
    this.inputNode = input;
    
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div />");
    this.updateOverlay();
    
    this.domNode
    .addClass("item-os-gadget")
    .delegate('.item-placeholder', 'submit', this._makeSetGadgetUrlEventHandler() );
  },
  
  createDomNode: function($super) {
    var itemNode = $super();
    itemNode.id("gadget-" + this.item.uuid());
    return itemNode;
  },
  
  domNodeChanged: function($super) {
    $super(); 
    this.updateOverlay();   
    this.initGadget();
  },
  
  initGadget: function() {
    ddd("init gadget");
    if (this.item.getGadgetUrl()) {  
      gadgets.container.setView("home");
      if (this.gadget) {
        gadgets.container.removeGadget(this.gadget);
        this.gadget = null;
      }
      this.gadget = gadgets.container.createGadget({specUrl: this.item.getGadgetUrl()});
      gadgets.container.addGadget(this.gadget);
      gadgets.container.layoutManager.addGadgetChromeId(this.gadget.id, "gadget-" + this.item.uuid());

      this._getSecureToken(function(token) {
       this.gadget.secureToken = token;
       this.gadget.setServerBase('/gadgets/');
       gadgets.container.renderGadget(this.gadget);
       
      }.pBind(this));
      
    }    
  },
  
  _makeSetGadgetUrlEventHandler: function(){
    var that = this;
    
    return function(e){
      var value = that.inputNode.val();
      if ( value ) {
        that.item.setGadgetUrl(value);
        that.item.save();
      }
      e.preventDefault();
    };
  },

  updateOverlay: function() {
    if (!WebDoc.application.pageEditor.disableHtml) {
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
    this.initGadget();    
  },
  
  destroy: function($super) {
    $super();
    gadgets.container.removeGadget(this.gadget);
  },
  
  _getSecureToken: function(callBack) {
    ddd("generate secure token");
    WebDoc.application.pageEditor.getCreator(function(creator) {
      ddd("receive creator");
      var token = creator.uuid + ":" + MTools.Application.getCurrentUser().uuid + ":" + this.item.uuid() + ":cont:url:0:home";
      callBack.call(this, token);
    }.pBind(this));
  }
});
