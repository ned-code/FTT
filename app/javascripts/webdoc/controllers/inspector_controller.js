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
    
    // Get DOM tree
    this.domNode = $("#item_inspector");
    
    this.visible = true;
    this.widgetInspectorApi = new WebDoc.WidgetApi(null, true);
    
    var emptyPalette = $("#palette_empty").hide();
    var textPalette = $("#palette_text").hide();
    var penPelette = $("#palette_pen").hide();
    var imagePelette = $("#palette_image").hide();
    var htmlSnippetPalette = $("#html_inspector").hide();
    this.imagePaletteController = new WebDoc.ImagePaletteController();
    this.textPaletteController = new WebDoc.TextPaletteController();
    
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
    
    this.palettes = [emptyPalette, textPalette, penPelette, widgetPalette, imagePelette, htmlSnippetPalette];

    this.updatePalette(0);
    this.subInspectors = [];
    var propertiesInspectorController = new WebDoc.PropertiesInspectorController();
    this.subInspectors.push(propertiesInspectorController);   
    var innerHtmlController = new WebDoc.InnerHtmlController();
    this.subInspectors.push(innerHtmlController);            
    
    var paletteInspector = $("#palette_inspector");
    var propertiesInspector = $("#properties_inspector");
    var htmlInspector = $("#html_inspector"); 
    this.inspectors = [paletteInspector[0], propertiesInspector[0], htmlInspector[0]];
    this.lastInspectorId = 1;
    this.selectInspector(0);
    this.currentInspectorId = 0;
    WebDoc.application.boardController.addSelectionListener(this);
  }, 
  
  selectInspector: function(inspectorId) {
    $("#inspectors").accordion("activate", inspectorId);        
  },
  
  selectPalette: function(paletteId) {
      this.updatePalette(paletteId);
      this.selectInspector(0);
  },
  
  updatePalette: function(paletteId) {
    if (paletteId !== this.currentPaletteId) {
      if (this.currentPaletteId !== undefined) {
        ddd("hide palette", this.currentPaletteId);
        this.palettes[this.currentPaletteId].hide();
      }
      ddd("show palette", paletteId, this.palettes[paletteId]);
      if (typeof paletteId == 'string') {
        this.widgetInspectorApi.setWidgetItem(WebDoc.application.boardController.selection()[0].item);        
        if (this.palettes[3].attr("src") != paletteId) {
          this.palettes[3].attr("src", paletteId);
        }
        this.palettes[3].show();
        this.currentPaletteId = 3;
      }
      else {
        this.palettes[paletteId].show();
        this.currentPaletteId = paletteId;        
      }
    }
    if (paletteId === 4) {
      this.imagePaletteController.refresh();
    }
  },
  
  selectionChanged: function() {
    ddd("selected item ", WebDoc.application.boardController.selection());
    if (WebDoc.application.boardController.selection().length > 0) {             
      this.updatePalette(WebDoc.application.boardController.selection()[0].inspectorId());
    }
    else {
      this.updatePalette(0);
    }
    this.refreshSubInspectors();    
  },
  
  refreshSubInspectors: function() {
    for (var i=0; i < this.subInspectors.length; i++) {
      var subInspector = this.subInspectors[i];
      if (subInspector.refresh) {
        subInspector.refresh();
      }
    }
  },
  
  refreshWidgetPalette: function() {         
    ddd("refresh widget palette"); 
    if (this.palettes[3][0].contentWindow) {
      ddd("widow found");
      if (this.palettes[3][0].contentWindow.widget) {
        this.palettes[3][0].contentWindow.widget._onPreferencesChange();
      }
      else if (this.palettes[3][0].contentWindow.initialize) {
        ddd("call initialize");
        this.palettes[3][0].contentWindow.initialize();
      }
    }    
  }  
});