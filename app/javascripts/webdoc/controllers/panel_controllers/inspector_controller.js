/**
 * @author julien
 */

WebDoc.InspectorController = $.klass(WebDoc.RightBarInspectorController, {
  ITEM_INSPECTOR_BUTTON_SELECTOR: "a[href='#item-inspector']",
  
  initialize: function() {
    ddd('[InspectorController] initialize');    
    
    // Get DOM node
    this.domNode = $("#item_inspector");    
    this.visible = true;
    
    this._inspectorNodes = {};
    this.initPaneWithController('empty', new WebDoc.InspectorEmptyController());
    this.initPaneWithController('DrawingInspectorGroup', new WebDoc.DrawingInspectorController());    
    this.initPaneWithController('TextInspectorGroup', new WebDoc.TextPaletteController( "#text_inspector" ));
    this.initPaneWithController('TextboxInspectorGroup', new WebDoc.TextboxController( "#textbox_inspector" ));
    //this.initPaneWithController('HtmlInspectorGroup', new WebDoc.InnerHtmlController( "#html_inspector", true ));
    this.initPaneWithController('HtmlInspectorGroup', new WebDoc.HtmlInspectorController( "#html_inspector" ));
    
		// Quick hack - this has been moved from inside individual inspector controllers
    this.propertiesController = new WebDoc.PropertiesInspectorController('#item_inspector', false);
    
    this._updateInspector('empty');
    
    this.lastInspectorId = 'empty';
    this.currentInspectorId = 'empty';
    
    WebDoc.application.boardController.addSelectionListener(this);
  },
  
  buttonSelector: function() {
    return this.ITEM_INSPECTOR_BUTTON_SELECTOR;  
  },
  
  selectInspector: function(inspectorId) {
    this._updateInspector(inspectorId);
  },
  
  _updateInspector: function(inspectorId) {
    var inspector;
    
    ddd("[InspectorController] updatePalette", inspectorId );
    if ( this._inspectorNodes[inspectorId] === undefined ) {
      inspectorId = 'empty';
    }
    if (inspectorId !== this.currentInspectorId) {
      this.currentInspectorId = inspectorId;
      inspector = this._inspectorNodes[inspectorId];
      
      this.domNode.html( inspector.domNode );
      
      //WebDoc.application.panelsController.showItemInspector();
      
      inspector.refresh();
    }
  },
  
  initPaneWithController: function(inspectorGroupName, inspectorController) {
    this._inspectorNodes[inspectorGroupName] = inspectorController;
  },
  
  refresh: function() {
    this.selectionChanged();
    this._inspectorNodes[this.currentInspectorId].refresh();
  },
  
  selectionChanged: function() {
    var selection = WebDoc.application.boardController.selection();
    
    ddd( "selected item ", selection );
    
    //we show the inspector only if there is one item in the selection
    if ( selection.length === 1) {
    	ddd('[] selectionChanged', selection[0].inspectorGroupName());
      this._updateInspector( selection[0].inspectorGroupName() );
    }
    else {
      this._updateInspector( 'empty' );
    }
  }
});

WebDoc.InspectorEmptyController = $.klass({
  initialize: function() {
    var container = jQuery("#empty-inspector");
    this.domNode = container.children();
  	container.remove();
  },
  
  refresh: function() {
    
  }
});

WebDoc.DrawingInspectorController = $.klass({
  initialize: function() {
    var container = jQuery("#draw-inspector");
    this.domNode = container.children();
    container.remove();
  },
  
  refresh: function() {
    
  }
});
