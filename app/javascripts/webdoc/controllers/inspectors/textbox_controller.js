WebDoc.TextboxController = $.klass({
  initialize: function( selector ) {
    var container = jQuery( selector );
    this.domNode = container.children();
    container.remove();
    this.propertiesController = new WebDoc.PropertiesInspectorController('#textbox_properties', false);
  },
  
  inspectorTitle: function() {
    return "Text Box";
  },
  
  refresh: function() {
    this.propertiesController.refresh();
    var selectedItem = WebDoc.application.boardController.selection()[0];
  }
});