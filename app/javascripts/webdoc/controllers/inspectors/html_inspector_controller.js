// Stephen

WebDoc.HtmlInspectorController = $.klass({
  initialize: function( selector ) {
    var domNode = jQuery( selector );
    
    ddd('[HtmlInspectorController] initialize on', selector);
    
    this.htmlController = new WebDoc.InnerHtmlController("#code");
    this.domNode = domNode;
  },
  
  refresh: function() {
    ddd("refresh html inspector");
    
    this.htmlController.refresh();
    
    //if (this.propertiesController) {
    // Quick hack
    WebDoc.application.inspectorController.propertiesController.refresh();
    //this.propertiesController.refresh();
    //}
  }
});