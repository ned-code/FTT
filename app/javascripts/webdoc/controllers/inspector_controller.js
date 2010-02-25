/**
 * @author julien
 */
//= require <webdoc/model/image>
//= require <webdoc/model/video>
//= require <webdoc/controllers/inspectors/properties_inspector_controller>
//= require <webdoc/controllers/inspectors/inner_html_controller>
//= require <webdoc/controllers/inspectors/image_palette_controller>
//= require <webdoc/controllers/inspectors/text_palette_controller>
//= require <webdoc/sdk/widget_api>

WebDoc.InspectorController = $.klass({
  initialize: function() {
    ddd('[InspectorController] initialize');
    
    var emptyPalette = $("#empty-inspector").hide();
    var penPelette = $("#draw-inspector").hide();
    var imagePelette = $("#image-inspector").hide();
    
    // Get DOM node
    this.domNode = $("#item_inspector");
    
    this.visible = true;
    this.widgetInspectorApi = new WebDoc.WidgetApi(null, true);
    
    this.imageInspector = new WebDoc.ImagePaletteController( "#image-inspector" );
    this.textInspector = new WebDoc.TextPaletteController( "#text-inspector" );
    this.htmlInspector = new WebDoc.InnerHtmlController( "#html-inspector" );
    
    var widgetPalette = $("#palette_widget").hide();
    widgetPalette.bind("load", function() {
      ddd("must inject uniboard api in inspector");
      if (widgetPalette[0].contentWindow) {
        ddd("inject uniboard api in inspector");
        widgetPalette[0].contentWindow.uniboard = this.widgetInspectorApi;
        if (widgetPalette[0].contentWindow.widget) {
          var widgetObject = widgetPalette[0].contentWindow.widget;
          widgetObject.lang = "en";
          widgetObject.uuid = WebDoc.application.boardController.selection()[0].item.uuid();
          widgetObject.mode = "Edit";
          widgetObject._onLoad();
        }
        else if (widgetPalette[0].contentWindow.initialize) {
          widgetPalette[0].contentWindow.initialize();
        }
      }                      
    }.pBind(this));
    
    this._inspectorNodes = [
      emptyPalette,
      this.textInspector.domNode,
      penPelette,
      widgetPalette,
      this.imageInspector.domNode,
      this.htmlInspector.domNode
    ];
    
    this._properties = new WebDoc.PropertiesInspectorController( '#properties' );
    this._updatePalette(0);
    
    this.lastInspectorId = 1;
    this.currentInspectorId = 0;
    WebDoc.application.boardController.addSelectionListener(this);
  },
  
  selectPalette: function(paletteId) {
    this._updatePalette(paletteId);
  },
  
  _updatePalette: function(paletteId) {
    var inspectorNode = this._inspectorNodes[paletteId];
    
    ddd("[InspectorController] updatePalette", paletteId, inspectorNode );
    
    if (paletteId !== this.currentInspectorId) {
      // Hide current inspector
      if (this.currentInspectorId !== undefined) {
        ddd("hide palette", this.currentInspectorId);
        this._inspectorNodes[this.currentInspectorId].hide();
      }
      
      // Inspector belongs to widget
      if (typeof paletteId == 'string') {
        this._inspectorNodes[3].show();
        this.currentInspectorId = 3;
      }
      
      // Inspector is native
      else {
        inspectorNode.show();
        this.currentInspectorId = paletteId;
      }
      
      // This is, admittedly, a bit of a hack. We get the properties
      // node and plonk it into this inspector. We may end up moving the
      // properties node, so lets leave it like this for the time being.
      inspectorNode
      .find('.foot')
      .html(this._properties.domNode);
      
      inspectorNode
      .css({
        bottom: this._properties.domNode.outerHeight()
      });
      
      this.refreshSubInspectors();
    }
  },
  
  selectionChanged: function() {
    ddd("selected item ", WebDoc.application.boardController.selection());
    
    if ( WebDoc.application.boardController.selection().length > 0 ) {             
      this._updatePalette( WebDoc.application.boardController.selection()[0].inspectorId() );
    }
    else {
      this._updatePalette(0);
    }
  },
  
  refreshProperties: function() {
    this._properties.refresh();
  },
  
  
  refreshSubInspectors: function() {
    this.refreshProperties();
    
    switch (this.currentInspectorId) {
      case 3:
        this.widgetInspectorApi.setWidgetItem(WebDoc.application.boardController.selection()[0].item);        
        if (this._inspectorNodes[3].attr("src") != WebDoc.application.boardController.selection()[0].inspectorId()) {
          this._inspectorNodes[3].attr("src", WebDoc.application.boardController.selection()[0].inspectorId());
        }      
        else {
          if (this._inspectorNodes[3][0].contentWindow && this._inspectorNodes[3][0].contentWindow.widget) {
            var widgetObject = this._inspectorNodes[3][0].contentWindow.widget;
            widgetObject.lang = "en";
            widgetObject.uuid = WebDoc.application.boardController.selection()[0].item.uuid();
            widgetObject.mode = "Edit";
            widgetObject._onLoad();
          }
        }
        break;
      case 4:
        this.imageInspector.refresh();
        break;
      case 5:
        this.htmlInspector.refresh();
        break;
    }
  },
  
  refreshWidgetPalette: function() {         
    ddd("refresh widget palette"); 
    if (this._inspectorNodes[3][0].contentWindow) {
      ddd("widow found");
      if (this._inspectorNodes[3][0].contentWindow.widget) {
        this._inspectorNodes[3][0].contentWindow.widget._onPreferencesChange();
      }
      else if (this._inspectorNodes[3][0].contentWindow.initialize) {
        ddd("call initialize");
        this._inspectorNodes[3][0].contentWindow.initialize();
      }
    }    
  }  
});