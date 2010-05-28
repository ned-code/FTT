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
  },
  
  _makeSetSrcEventHandler: function(){
    var that = this;
    
    return function(e){
      var value = that.inputNode.val();
      ddd('[IframeView] _makeSetSrcEventHandler')
      that.inputNode.validate({
        pass : function(){
          ddd('[IframeView] Pass');
          var value = that.inputNode.val();
          var pattern_has_protocole = /^(ftp|http|https):\/\//;
          var consolidateSrc = '';
          if (value.match(pattern_has_protocole)) {
    		    consolidateSrc = value;
          }
          else {
    		    consolidateSrc = "http://" + value;
          }
          that.domNode.addClass('loading');
          ddd(that.inputNode.val());
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

  canEdit: function() {
    return true;
  },

  inspectorId: function() {
    return 6;
  }

});
