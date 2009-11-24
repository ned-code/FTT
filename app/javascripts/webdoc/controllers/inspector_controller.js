/**
 * @author julien
 */
//= require <webdoc/model/image>
//= require <webdoc/controllers/inspectors/page_inspector_controller>
//= require <webdoc/controllers/inspectors/properties_inspector_controller>
//= require <webdoc/controllers/inspectors/inner_html_controller>
 
WebDoc.InspectorController = $.klass({
  initialize: function() {
    this.visible = true;
    this.domNode = $("#item_inspector");
    var emptyPalette = $("#palette_empty").hide();
    var textPalette = $("#palette_text").hide();
    var penPelette = $("#palette_pen").hide();
    this.palettes = [emptyPalette, textPalette, penPelette];
    this.updatePalette(0);
    this.subInspectors = [];
    var pageInspectorController = new WebDoc.PageInspectorController();
    this.subInspectors.push(pageInspectorController);
    var propertiesInspectorController = new WebDoc.PropertiesInspectorController();
    this.subInspectors.push(propertiesInspectorController);   
    var innerHtmlController = new WebDoc.InnerHtmlController();
    this.subInspectors.push(innerHtmlController);        
       
    var pageInspector = $("#page_inspector");
    var paletteInspector = $("#palette_inspector");
    var propertiesInspector = $("#properties_inspector");
    var htmlInspector = $("#html_inspector");
    this.inspectors = [pageInspector[0], paletteInspector[0], propertiesInspector[0], htmlInspector[0]];
    this.lastInspectorId = 1;
    this.selectInspector(0);
    this.currentInspectorId = 0;
    WebDoc.application.boardController.addSelectionListener(this);
    $("#inspectors").accordion({
      autoHeight: false,
      fillSpace: false,
      change: function(event, ui) {
        if (this.currentInspectorId > 0) {
          this.lastInspectorId = this.currentInspectorId;
        }
        this.currentInspectorId = $.inArray(ui.newContent.parent()[0], this.inspectors);
      }.pBind(this)
    });
  }, 
  
  selectInspector: function(inspectorId) {
    WebDoc.application.rightBarController.showInspectors(function() {
        ddd("select inspector " + inspectorId);
        $("#inspectors").accordion("activate", inspectorId);        
      });
  },
  
  selectPalette: function(paletteId) {
      this.updatePalette(paletteId);
      this.selectInspector(1);
  },
  
  updatePalette: function(paletteId) {
    if (this.currentPaletteId !== undefined) {
      ddd("hide palette", this.currentPaletteId);
      this.palettes[this.currentPaletteId].hide();
    }
    ddd("show palette", paletteId, this.palettes[paletteId]);
    this.palettes[paletteId].show();
    this.currentPaletteId = paletteId;
  },
  
  selectionChanged: function() {
    ddd("selected item ", WebDoc.application.boardController.selection);
    if (WebDoc.application.boardController.selection.length > 0) {

      if (this.currentInspectorId < 1) {
        this.selectInspector(this.lastInspectorId);
      }  
      else {
        WebDoc.application.rightBarController.showInspectors();
      }               
      this.updatePalette(WebDoc.application.boardController.selection[0].inspectorId());
    }
    else {
      this.updatePalette(0);
    }
    this.refreshSubInspectors();    
  },
 
  refreshSubInspectors: function() {
    for (var i=0; i < this.subInspectors.length; i++) {
      var subInspetor = this.subInspectors[i];
      if (subInspetor.refresh) {
        subInspetor.refresh();
      }
    }
  } 
});

$.extend(WebDoc.InspectorController, {});
