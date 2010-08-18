WebDoc.TextboxController = $.klass({
  initialize: function( selector ) {
    var container = jQuery( selector );
    this.domNode = container.children();
    container.remove();
    
    // Quick hack
    //this.propertiesController = new WebDoc.PropertiesInspectorController('#textbox_properties', false);
  },
  
  inspectorTitle: function() {
    return "Text Box";
  },
  
  refresh: function() {
    // Quick hack
    WebDoc.application.inspectorController.propertiesController.refresh();
    //this.propertiesController.refresh();
    
    var selectedItem = WebDoc.application.boardController.selection()[0];
  }
});