/**
 * author: stephen / matthieu
 */

WebDoc.TextboxController = $.klass({
  initialize: function( selector ) {
    var container = jQuery( selector );
    this.domNode = container.children();
    this.panelNode = WebDoc.application.propertiesController.domNode;
    
    container.remove();
    
    this.panelNode
    .delegate("input", "change", jQuery.proxy(this, "changeProperty"))
    .delegate("a[href=#property]", 'click', jQuery.proxy( this, 'clickProperty' ));
    
    
    // Quick hack
    //this.propertiesController = new WebDoc.PropertiesInspectorController('#textbox_properties', false);
  },
  
  changeProperty: function(e){
    var self = this;
    var field = jQuery(e.target);
    var property = field.attr('data-property');
    
    if (typeof property === 'undefined') return false;
    
    field.validate({
      pass: function(value){
        var item = WebDoc.application.boardController.selection()[0].item;
        
        item.setProperty("strokeWidth", value);
        item.save();
        
        self.refresh();
      },
      fail: function(value, message){
      	ddd('[propertiesInspector] changeProperty failed validation:', message);
      }
    });
  },
  
  clickProperty: function(e){
    var link = jQuery(e.currentTarget);
    var property = link.attr('data-property');
    var item, cssObj, l;
    
    if (typeof property === 'undefined') return null;
    
    e.preventDefault();
    
    item = WebDoc.application.boardController.selection()[0].item;
    cssObj = {};
    property = property.split(' ');
    l = property.length;
    
    // Loop over properties listed in data-property, getting
    // their css values from the style of this link
    while(l--){
      ddd(property[l]);
    	cssObj[ property[l] ] = link.css( property[l] );
    }
    
    item.changeCss( cssObj );
    this.refresh();
  },
  
  inspectorTitle: function() {
    return "Text Box";
  },
  
  refresh: function() {
    var selectedItem = WebDoc.application.boardController.selection()[0];
    
    WebDoc.application.inspectorController.propertiesController.refresh();    
    
    this.domNode.find("#property_svg_stroke_width").val(selectedItem.item.getProperty("strokeWidth"));
  }
});