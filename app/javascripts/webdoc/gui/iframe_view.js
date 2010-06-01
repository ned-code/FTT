/**
 * @author Noé / Stephen
 */


WebDoc.IframeView = $.klass(WebDoc.ItemView, {
  initialize: function($super, item, pageView, afterItem) {
    var that = this;
    var placeholder = $('<form/>', {'class': 'item-placeholder stack'});
    var input = $('<input/>', { type: 'url', title: 'Web page address', name: 'input-iframe-src', value: '', 'data-type': 'webdoc_iframe_url' });
    
    placeholder
    .html('<div class="item-icon"></div><label>Enter a Web page url:</label>')
    .append( input );
    
    this.placeholderNode = placeholder;
    this.inputNode = input;
    
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div />");
    this.updateOverlay();
    
    this.domNode
    .addClass("item-iframe")
    .delegate('.item-placeholder', 'submit', this._makeSetSrcEventHandler() )
    .delegate('.item-placeholder input', 'blur', this._makeSetSrcEventHandler() );
    
    this.itemLayerDomNode.addClass("screen"); 
  },
  
  _makeSetSrcEventHandler: function(){
    var that = this;
    
    return function(e){
      ddd('[IframeView] _makeSetSrcEventHandler')
      that.inputNode.validate({
        pass : function(){
          consolidateSrc = WebDoc.UrlUtils.consolidateSrc(that.inputNode.val());
          that.domNode.addClass('loading');
          that.item.setSrc( consolidateSrc );
          e.preventDefault();
        },
        fail : function(){}
      });
    };
  },
  
  _makeLoadEventHandler: function(){
    var that = this;
    
    return function(e){
      that.domNode.removeClass('loading');
      e.preventDefault();
    };
  },
  
  domNodeChanged: function($super) {
    $super();
    this.itemDomNode.css('overflow', this.item.data.data.css.overflow);
    this.updateOverlay();
  },

  updateOverlay: function() {
    ddd('[iframe_view] updateOverlay()');
    if (!WebDoc.application.disableHtml) {
      var src = this.item.getSrc();
      if (src === "" || src === undefined) {
        this.domNode.append( this.placeholderNode );
        this.domNode.removeClass('loading');
      }
      else {
        this.placeholderNode.remove();
        this.itemDomNode
        .bind('load', this._makeLoadEventHandler() );
      }
    }
  },

  edit: function($super){
    $super();
    this.domNode.addClass("item-edited");
    this.itemLayerDomNode.hide();    
  },
  
  canEdit: function() {
    return true;
  },
  
  stopEditing: function($super) {
    $super();
    this.domNode.removeClass("item-edited");
    this.itemLayerDomNode.show();  
  },
  
  inspectorId: function() {
    return 6;
  }

});
