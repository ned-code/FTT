/**
 * @author Noé
 */


WebDoc.IframeView = $.klass(WebDoc.ItemView, {

  initialize: function($super, item, pageView, afterItem) {
    var that = this;
    var placeholder = $('<form/>', {'class': 'item-placeholder stack'});
    var input = $('<input/>', { type: 'text', title: 'Web page address', name: 'input-iframe-src', value: '' });
    
    placeholder
    .html('<div class="item-icon"></div><label>Enter a Web page url:</label>')
    .append( input );
    
    this.placeholderNode = placeholder;
    
    $super(item, pageView, afterItem);
    this.overlayDomNode = $("<div />");
    this.updateOverlay();
    
    this.domNode
    .addClass("item-iframe")
    .delegate('.item-placeholder', 'submit', this._makeSubmitEventHandler() )
    .delegate('.item-placeholder input:eq(0)', 'blur', this._makeSubmitEventHandler() );
  },
  
  _makeSubmitEventHandler: function(){
    var that = this;
    
    return function(e){
      var elem = $(this),
          // this can be the form or the input
          value = elem.is('input') ? elem.val() : elem.find('input').val() ;
      
      if ( value ) {
        that.item.setSrc( value );
      }
      else {
        ddd('[iframe_view] input doesnt have value')
      }
      e.preventDefault();
    };
  },
  
  domNodeChanged: function($super) {
    $super();
    this.updateOverlay();
  },

  updateOverlay: function() {
    ddd('update overlay');
    if (!WebDoc.application.pageEditor.disableHtml) {
      var src = this.item.getSrc();
      if (src === "" || src === undefined) {
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
    return 6;
  }

});
