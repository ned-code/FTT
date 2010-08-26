/**
 * @author julien
 */

WebDoc.InspectorController = $.klass(WebDoc.RightBarInspectorController, {
  
  initialize: function() {
    ddd('[InspectorController] initialize');    
    
    // Get DOM node
    this.domNode = $("#item_inspector");    
    this.visible = true;
    
    // Quick hack - this has been moved from inside individual inspector controllers
    this.propertiesController = WebDoc.application.propertiesController = new WebDoc.PropertiesInspectorController('#item_inspector', false, this);
    
    this._inspectorNodes = {};
    // those 3 controllers are statically loaded here because they are always needed.
    // Other controllers will be loaded when an item view need it (see ItemView.fullInspectorClass).
    this.initPaneWithController('empty', new WebDoc.InspectorEmptyController());
    this.initPaneWithController('DrawingInspectorGroup', new WebDoc.DrawingInspectorController());    
    this.initPaneWithController('TextInspectorGroup', new WebDoc.TextPaletteController( "#text_inspector" ));
    //this.initPaneWithController('TextboxInspectorGroup', new WebDoc.TextboxController( "#textbox_inspector" ));
    //this.initPaneWithController('HtmlInspectorGroup', new WebDoc.InnerHtmlController( "#html_inspector", true ));
    //this.initPaneWithController('HtmlInspectorGroup', new WebDoc.HtmlInspectorController( "#html_inspector" ));
    
    WebDoc.application.boardController.addSelectionListener(this);
  },

  getTextInspector: function() {
    return this._inspectorNodes['TextInspectorGroup'];  
  },
  
  selectInspector: function(inspectorId) {
    this._updateInspector(inspectorId);
  },

  getCurrentInspectorController: function() {
    if (this.currentInspectorId) {
      return this._inspectorNodes[this.currentInspectorId];
    }
    else {
      return null;
    }
  },

  _updateInspector: function(inspectorId) {
    var inspector;
    
    ddd("[InspectorController] _updateInspector", inspectorId, this._inspectorNodes[inspectorId], typeof this._inspectorNodes[inspectorId]);
    
    if ( !this._inspectorNodes[inspectorId] ) {
      inspectorId = 'empty';
    }
    if (inspectorId !== this.currentInspectorId) {
      if (this.currentInspectorId) {
        this._inspectorNodes[this.currentInspectorId].domNode.removeTransitionClass('active');
      }
      this.currentInspectorId = inspectorId;
      if (this.currentInspectorId === 'empty') {
        this.domNode.css('display', 'none');
      }
      else {
        this.domNode.css('display', '');
        inspector = this._inspectorNodes[inspectorId];
        inspector.domNode.addTransitionClass('active');
  //      this.domNode.html( inspector.domNode );

        inspector.refresh();
      }
    }
  },
  
  initPaneWithController: function(inspectorGroupName, inspectorController) {
    // cannot register two controller for the same group.
    if (!this._inspectorNodes[inspectorGroupName]) {
      this._inspectorNodes[inspectorGroupName] = inspectorController;
      inspectorController.domNode.removeTransitionClass('active');
    }
    else {
      ddd("[InspectorController.initPaneWithController] group " + inspectorGroupName + "already have an inspector controller");
    }
  },
  
  refresh: function() {
    this.selectionChanged();
    this._inspectorNodes[this.currentInspectorId].refresh();
  },
  
  selectionChanged: function() {
    var selection = WebDoc.application.boardController.selection();
    
    ddd( "selected item ", selection );
    
    if ( selection.length === 1 ) {
    	ddd('[InspectorController] selectionChanged', selection[0].inspectorGroupName());
      this._updateInspector( selection[0].inspectorGroupName() );
    }
    else {
      this._updateInspector('empty');
    }
  }
});

WebDoc.InspectorEmptyController = $.klass({
  initialize: function() {
    this.domNode = jQuery("#empty_inspector");
  },
  
  refresh: function() {
    
  }
});

WebDoc.DrawingInspectorController = $.klass({
  initialize: function() {
    this.domNode = jQuery("#draw-inspector");
  },
  
  refresh: function() {
    
  }
});
