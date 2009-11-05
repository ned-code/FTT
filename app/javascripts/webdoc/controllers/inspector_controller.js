/**
 * @author julien
 */
//= require <webdoc/model/image>
//= require <webdoc/controllers/inspectors/page_inspector_controller>
//= require <webdoc/controllers/inspectors/properties_inspector_controller>
 
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
    var pageInspector = new WebDoc.PageInspectorController();
    this.subInspectors.push(pageInspector);
    var propertiesInspector = new WebDoc.PropertiesInspectorController();
    this.subInspectors.push(propertiesInspector);    
    
    $("#selected_item_html_editor").bind("blur", this.applyInnerHtml);   
    
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
      change: function(event, ui) {
        if (this.currentInspectorId > 0) {
          this.lastInspectorId = this.currentInspectorId;
        }
        this.currentInspectorId = $.inArray(ui.newContent.parent()[0], this.inspectors);
      }.pBind(this)
    });
  },
  
  showLib: function() {
    if (!this.visible) {
      this.toggleInspector(this.showLib.pBind(this));
    }
    else {
      $("#inspectors").slideUp("fast");
      $("#libraries").slideDown("fast");
    }
  },  
  
  toggleInspector: function(callBack) {
    if (this.visible) {
      $("#right_bar").animate({
        width: "0px"
      }, callBack);
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginRight: "0px"
        });
      }    
    }
    else {
      $("#right_bar").animate({
        width: "300px"
      }, callBack);
      if (!MTools.Browser.WebKit) {
        $("#board_container").animate({
          marginRight: "305px"
        });
      }
    }
    this.visible = !this.visible;
  },
  
  selectInspector: function(inspectorId) {
    if ($("#inspectors").css("display") == "none") {
      $("#libraries").slideUp("fast");
      $("#inspectors").slideDown("fast", function() {
        ddd("select inspector " + inspectorId);
        $("#inspectors").accordion("activate", inspectorId);        
      });
    }
    else {
      ddd("select inspector " + inspectorId);
      $("#inspectors").accordion("activate", inspectorId);
    }

  },
  
  selectPalette: function(paletteId) {
      this.updatePalette(paletteId);
      this.selectInspector(1);
  },
  
  updatePalette: function(paletteId) {
    if (this.currentPaletteId != undefined) {
      this.palettes[this.currentPaletteId].hide();
    }
    this.palettes[paletteId].show();
    this.currentPaletteId = paletteId;
  },
  
  selectionChanged: function() {
    ddd("selected item ", WebDoc.application.boardController.selection);
    if (WebDoc.application.boardController.selection.length > 0) {
      if ($("#inspectors").css("display") == "none") {
        $("#libraries").slideToggle("fast");
        $("#inspectors").slideToggle("fast", function() {
          if (this.currentInspectorId < 1) {
            this.selectInspector(this.lastInspectorId);
          }      
        }.pBind(this));        
      }
      else {
        if (this.currentInspectorId < 1) {
          this.selectInspector(this.lastInspectorId);
        }
      }
      $("#selected_item_html_editor").attr("disabled", "");
      var html = WebDoc.application.boardController.selection[0].item.data.data.innerHTML;
      if (html) {
        $("#selected_item_html_editor").get(0).value = html;
      }
      else {
        $("#selected_item_html_editor").get(0).value = "";
      }
      this.updatePalette(WebDoc.application.boardController.selection[0].inspectorId());
    }
    else {
      this.updatePalette(0);
      $("#selected_item_html_editor").get(0).value = "";
      $("#selected_item_html_editor").attr("disabled", "true");
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
  },
  
  applyInnerHtml: function(e) {
    e.preventDefault();
    var html = $("#selected_item_html_editor").get(0).value
    if (html) {
      if (WebDoc.application.boardController.selection.length > 0) {
        WebDoc.application.boardController.selection[0].item.setInnerHtml(html);
      }
    }
  },  
});

$.extend(WebDoc.InspectorController, {});
