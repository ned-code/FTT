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
    this.textInspector = new WebDoc.TextPaletteController( "#text-inspector" );
    
    this._inspectorNodes = {};
    this.initPaneWithController('empty', new WebDoc.InspectorEmptyController());
    this.initPaneWithController('DrawingInspectorGroup', new WebDoc.DrawingInspectorController());    
    this.initPaneWithController('TextInspectorGroup', this.textInspector);
    this.initPaneWithController('TextboxInspectorGroup', new WebDoc.TextboxController( "#textbox_inspector" ));
    this.initPaneWithController('HtmlInspectorGroup', new WebDoc.InnerHtmlController( "#html-inspector", true ));
    
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
    if (this._inspectorNodes[inspectorId] === undefined) {
      inspectorId = 'empty';
    }
    if (inspectorId !== this.currentInspectorId) {
      this.currentInspectorId = inspectorId;
      inspector = this._inspectorNodes[inspectorId];
      
      this.domNode.html( inspector.domNode );
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
    ddd("selected item ", WebDoc.application.boardController.selection());
    if (this.domNode.is(':visible')) {
      if (WebDoc.application.boardController.selection().length == 1) { //we show the inspector only if there is one item in the selection
        this._updateInspector(WebDoc.application.boardController.selection()[0].inspectorGroupName());
      }
      else {
        this._updateInspector('empty');
      }
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
