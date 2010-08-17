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
    var inspectorNode = null;
    
    ddd("[InspectorController] updatePalette", inspectorId, inspectorNode );
    if (this._inspectorNodes[inspectorId] === undefined) {
      inspectorId = 'empty';
    }
    if (inspectorId !== this.currentInspectorId) {
      // Hide current inspector
      if (this.currentInspectorId !== undefined) {
        ddd("hide inspector", this.currentInspectorId);
        this._inspectorNodes[this.currentInspectorId].domNode.hide();
      }

      this.currentInspectorId = inspectorId;
      
      inspectorNode = this._inspectorNodes[this.currentInspectorId].domNode;
      inspectorNode.show();
      
      this._inspectorNodes[this.currentInspectorId].refresh();
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
    this.domNode = jQuery("#empty-inspector").hide();
  },
  
  refresh: function() {
    
  }
});

WebDoc.DrawingInspectorController = $.klass({
  initialize: function() {
    this.domNode = jQuery("#draw-inspector").hide();
  },
  
  refresh: function() {
    
  }
});
