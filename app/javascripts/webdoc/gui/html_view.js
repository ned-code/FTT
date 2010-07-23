/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>
WebDoc.HTML_INSPECTOR_GROUP = "HtmlInspectorGroup";

WebDoc.HtmlView = $.klass(WebDoc.ItemView, {

  DEFAULT_WIDGET_HTML: '<div class="item-placeholder"><div class="item-icon"></div>Double-click to edit, and enter HTML in the inspector</div>',

  initialize: function($super, item, pageView, afterItem) {
    var placeholderContent = item.getInnerHtmlPlaceholder() || this.DEFAULT_WIDGET_HTML; 
    this.placeholderNode = jQuery(placeholderContent);    
    $super(item, pageView, afterItem);
    this.itemDomNode.css({ width:"100%", height:"100%"}); 
    this._displayDefaultContentIfNeeded( this.itemDomNode );
    this.domNode.addClass('item-widget');   
  },
  
  inspectorGroupName: function() {
    return WebDoc.HTML_INSPECTOR_GROUP;  
  },
    
  inspectorControllersClasses: function() {
    return [/*WebDoc.HtmlPropertiesInspectorController*/];
  },
    
  createDomNode: function($super) {
    var widgetNode = $super();   
    if (this.item.data.data.tag == "iframe" && !WebDoc.application.disableHtml) {
      this.domNode.addClass('loading');
      this.itemLayerDomNode.show();
      widgetNode.bind('load', function() {
        this.initIFrameHtml();
      }.pBind(this));
    }

    return widgetNode;
  },
  
  inspectorId: function() {
    return 3;
  },
  
  innerHtmlChanged: function($super) {
    if (this.item.data.data.tag !== 'iframe' && !WebDoc.application.disableHtml) {
      this.itemDomNode.html($.string().stripScripts(this.item.getInnerHtml()));
    }
    this._displayDefaultContentIfNeeded(this.itemDomNode);
    // Highlight code blocks in the html -
    // nodes that have class "code"
    this.itemDomNode.find('code, .code').each( function(i){
      var node = jQuery(this),
          clone = node.clone().empty(),
          numbers = jQuery('<div/>');
      
      var lineNo = 1,
          output = clone[0],
          lastChild;
    
      function addLine(line) {
        numbers.append(document.createTextNode(String(lineNo++)));
        numbers.append(document.createElement("BR"));
        for (var i = 0; i < line.length; i++) {
          output.appendChild(line[i]);
        }
        output.appendChild(document.createElement("BR"));
      }
      
      // This is global - it comes from codemirror,
      // but it would be good to find a way of packaging it
      highlightText( node.html(), output ); //addLine);
      
      // Hack to remove br tag from last line -
      // it gets in the way in inline code elements
      lastChild = clone.children().eq(-1);
      if (lastChild.is('br')) {
        lastChild.remove();
      }
      
      node.replaceWith( clone );
    });
  },
  
  edit: function($super){
    $super();
    this.placeholderNode.remove();
  },
  
  canEdit: function() {
    return true;
  },
  
  stopEditing: function($super) {
    $super();    
    this._displayDefaultContentIfNeeded(this.itemDomNode);  
  },
    
  initIFrameHtml: function() {
    this.domNode.removeClass('loading');
    if (this._editable) {
      this.itemLayerDomNode.show();
    }
    else {
      this.itemLayerDomNode.hide();
    }
  },

  setEditable: function($super, editable) {
    $super(editable);
  },
  
  _displayDefaultContentIfNeeded: function(parent) {
    if (!this.domNode.hasClass("item-edited")) {
      if (this.item.data.data.tag !== "iframe" && (!this.item.getInnerHtml() || $.string().blank(this.item.getInnerHtml()))) {
        parent.append(this.placeholderNode);
      }
      else if (this.placeholderNode) {
        this.placeholderNode.remove();
      }
    }
  }
});
