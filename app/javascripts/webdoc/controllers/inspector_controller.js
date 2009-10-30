/**
 * @author julien
 */
//= require <webdoc/model/image>
//= require <webdoc/controllers/inspectors/page_inspector_controller>
 
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
    
    
    $("#selected_item_html_editor").bind("blur", this.applyInnerHtml);
    
    $("#default_properties").hide();
    $("#property_top").blur(this.updateProperties.pBind(this));
    $("#property_left").blur(this.updateProperties.pBind(this));
    $("#property_width").blur(this.updateProperties.pBind(this));
    $("#property_height").blur(this.updateProperties.pBind(this));
    $("#property_src").blur(this.updateSrc.pBind(this));
    
    var pageInspector = $("#page_inspector");
    var paletteInspector = $("#palette_inspector");
    var propertiesInspector = $("#properties_inspector");
    var htmlInspector = $("#html_inspector");
    this.inspectors = [pageInspector[0], paletteInspector[0], propertiesInspector[0], htmlInspector[0]];
    this.lastInspectorId = 1;
    this.selectInspector(0);
    this.currentInspectorId = 0;
    WebDoc.application.boardController.addSelectionListener(this);
    $("#inspector").accordion({
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
      $("#inspector").slideUp("fast");
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
    if ($("#inspector").css("display") == "none") {
      $("#libraries").slideUp("fast");
      $("#inspector").slideDown("fast", function() {
        ddd("select inspector " + inspectorId);
        $("#inspector").accordion("activate", inspectorId);        
      });
    }
    else {
      ddd("select inspector " + inspectorId);
      $("#inspector").accordion("activate", inspectorId);
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
      if ($("#inspector").css("display") == "none") {
        $("#libraries").slideToggle("fast");
        $("#inspector").slideToggle("fast", function() {
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
      $("#empty_properties").hide();
      $("#default_properties").show();
      this.refreshProperties();
    }
    else {
      this.updatePalette(0);
      $("#selected_item_html_editor").get(0).value = "";
      $("#selected_item_html_editor").attr("disabled", "true");
      $("#default_properties").hide();
      $("#empty_properties").show();
    }
  },
  
  refreshProperties: function() {
    if (WebDoc.application.boardController.selection.length) {
      var selectedItem = WebDoc.application.boardController.selection[0];
      $("#property_top")[0].value = selectedItem.item.position.top;
      $("#property_left")[0].value = selectedItem.item.position.left;
      $("#property_width")[0].value = selectedItem.item.size.width;
      $("#property_height")[0].value = selectedItem.item.size.height;
      if (selectedItem.item.data.media_type == WebDoc.ITEM_TYPE_IMAGE) {
        $("#image_properties").css("display", "");
        $("#property_src")[0].value = selectedItem.item.data.data.src;
      }
      else {
        $("#image_properties").css("display", "none");
      }
    }
  },
  
  updateSrc: function(event) {
    var item = WebDoc.application.boardController.selection[0].item;
    item.data.data.src =  $("#property_src")[0].value;       
    item.save(function() {
      item.fireDomNodeChanged();
    });
  },
  
  updateProperties: function(event) {
    var changedProperty = event.target.id;
    var item = WebDoc.application.boardController.selection[0].item;
    if (changedProperty == "property_left" || changedProperty == "property_top") {
      var previousPosition = {
        top: item.position.top,
        left: item.position.left
      };
      var newPosition = {
        top: $("#property_top")[0].value,
        left: $("#property_left")[0].value
      };
      if (newPosition.left != previousPosition.left || newPosition.top != previousPosition.top) {
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restorePosition(item, previousPosition);
        }.pBind(this));
        item.moveTo(newPosition);
        item.save();
      }
    }
    else {
      var previousSize = {
        width: item.size.width,
        height: item.size.height
      }; 
      var newSize = {
        width: $("#property_width")[0].value,
        height: $("#property_height")[0].value
      };
      if (newSize.width != previousSize.width || newSize.height != previousSize.height) {
        WebDoc.application.undoManager.registerUndo(function() {
          WebDoc.ItemView._restoreSize(item, previousSize);
        }.pBind(this));
        item.resizeTo(newSize);
        item.save();
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
