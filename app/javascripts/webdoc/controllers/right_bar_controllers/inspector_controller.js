/**
 * @author julien
 */
//= require <webdoc/model/image>
//= require <webdoc/model/video>
//= require <webdoc/controllers/inspectors/properties_inspector_controller>
//= require <webdoc/controllers/inspectors/inner_html_controller>
//= require <webdoc/controllers/inspectors/inner_iframe_controller>
//= require <webdoc/controllers/inspectors/image_palette_controller>
//= require <webdoc/controllers/inspectors/text_palette_controller>
//= require <webdoc/sdk/widget_api>

WebDoc.InspectorController = $.klass(WebDoc.RightBarInspectorController, {
  ITEM_INSPECTOR_BUTTON_SELECTOR: "a[href='#item-inspector']",
  
  initialize: function() {
    ddd('[InspectorController] initialize');    
    var emptyPalette = $("#empty-inspector").hide();
    var penPelette = $("#draw-inspector").hide();
    
    // Get DOM node
    this.domNode = $("#item_inspector");    
    this.visible = true;
    
    this.textInspector = new WebDoc.TextPaletteController( "#text-inspector" );
    this.htmlInspector = new WebDoc.InnerHtmlController( "#html-inspector" );

        
    this._inspectorNodes = [
      emptyPalette,
      this.textInspector.domNode,
      penPelette,
      this.htmlInspector.domNode
    ];
    
    this._updatePalette(0);
    
    this.lastInspectorId = 0;
    this.currentInspectorId = 0;
    
    WebDoc.application.boardController.addSelectionListener(this);
  },
  
  buttonSelector: function() {
    return this.ITEM_INSPECTOR_BUTTON_SELECTOR;  
  },
  
  selectPalette: function(paletteId) {
    this._updatePalette(paletteId);
  },
  
  _updatePalette: function(paletteId) {
    var inspectorNode = null;
    
    ddd("[InspectorController] updatePalette", paletteId, inspectorNode );
    
    if (paletteId !== this.currentInspectorId) {
      // Hide current inspector
      if (this.currentInspectorId !== undefined) {
        ddd("hide palette", this.currentInspectorId);
        this._inspectorNodes[this.currentInspectorId].hide();
      }

      this.currentInspectorId = paletteId;
      
      inspectorNode = this._inspectorNodes[this.currentInspectorId];
      inspectorNode.show();
      
      this.refreshSubInspectors();
    }
  },
  
  refresh: function() {
      this.selectionChanged();
  },
  
  selectionChanged: function() {
    ddd("selected item ", WebDoc.application.boardController.selection());
    if (this.domNode.is(':visible')) {
      if (WebDoc.application.boardController.selection().length > 0) {
        this._updatePalette(WebDoc.application.boardController.selection()[0].inspectorId());
      }
      else {
        this._updatePalette(0);
      }
    }
  },
  
  refreshSubInspectors: function() {
    
    switch (this.currentInspectorId) {
      case 1:
        this.textInspector.refreshInnerHtml();
        break;
      case 3:
        this.htmlInspector.refresh();
        break;
    }
  },
  
  refreshWidgetPalette: function() {         
    ddd("refresh widget palette"); 
    var widgetContent = this._inspectorNodes[3].find("iframe"); 
    if (widgetContent[0].contentWindow) {
      ddd("widow found");
      if (widgetContent[0].contentWindow.widget) {
        widgetContent[0].contentWindow.widget._onPreferencesChange();
      }
      else if (widgetContent[0].contentWindow.initialize) {
        ddd("call initialize");
        widgetContent[0].contentWindow.initialize();
      }
    }    
  }  
});