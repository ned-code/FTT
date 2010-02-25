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
    
    // Get DOM node
    this.domNode = $("#item_inspector");
    
    this.visible = true;
    this.widgetInspectorApi = new WebDoc.WidgetApi(null, true);
    
    var emptyPalette = $("#empty-inspector").hide();
    var textPalette = $("#palette_text").hide();
    var penPelette = $("#draw-inspector").hide();
    var imagePelette = $("#image-inspector").hide();
    
    this.imagePaletteController = new WebDoc.ImagePaletteController( "#image-inspector" );
    this.textPaletteController = new WebDoc.TextPaletteController( "#text-inspector" );
    this.htmlInspectorController = new WebDoc.InnerHtmlController( "#html-inspector" );
    
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
      textPalette,
      penPelette,
      widgetPalette,
      imagePelette,
      this.htmlInspectorController.domNode
    ];

    this.updatePalette(0);
    this.subInspectors = [];
    //var propertiesInspectorController = new WebDoc.PropertiesInspectorController();
    //this.subInspectors.push(propertiesInspectorController);               
    
    var paletteInspector = $("#palette_inspector");
    var propertiesInspector = $("#properties_inspector");
    
    this.inspectors = [this.domNode, propertiesInspector[0], this.htmlInspectorController.domNode[0]];
    this.lastInspectorId = 1;
    this.selectInspector(0);
    this.currentInspectorId = 0;
    WebDoc.application.boardController.addSelectionListener(this);
  }, 
  
  selectInspector: function(inspectorId) {
    //$("#inspectors").accordion("activate", inspectorId);        
  },
  
  selectPalette: function(paletteId) {
      this.updatePalette(paletteId);
      this.selectInspector(0);
  },
  
  updatePalette: function(paletteId) {
    var footHeight;
    
    if (paletteId !== this.currentPaletteId) {
      if (this.currentPaletteId !== undefined) {
        ddd("hide palette", this.currentPaletteId);
        this._inspectorNodes[this.currentPaletteId].hide();
      }
      ddd("show palette", paletteId, this._inspectorNodes[paletteId]);
      if (typeof paletteId == 'string') {
        this._inspectorNodes[3].show();
        this.currentPaletteId = 3;
      }
      else {
        this._inspectorNodes[paletteId].show();
        
        footHeight = this._inspectorNodes[paletteId].find('.foot>div').height();
        
        this._inspectorNodes[paletteId].css({
            bottom: footHeight
        });
        
        this.currentPaletteId = paletteId;
      }
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
  
  refreshProperties: function() {
    //this.subInspectors[0];
    //subInspector.refresh();
  },
  
  
  refreshSubInspectors: function() {
    // refresh su inspector
    for (var i=0; i < this.subInspectors.length; i++) {
      var subInspector = this.subInspectors[i];
      if (subInspector.refresh) {
        subInspector.refresh();
      }
    }
    
    switch (this.currentPaletteId) {
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
        this.imagePaletteController.refresh();
        break;
      case 5:
        this.htmlInspectorController.refresh();
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