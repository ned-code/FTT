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
    var imagePelette = $("#image-inspector").hide();
    var iframePelette = $("#iframe-inspector").hide();
    
    // Get DOM node
    this.domNode = $("#item_inspector");
    this.loadingWheel = $("#inspector-loading-wheel");
    this.visible = true;
    this.widgetInspectorApi = new WebDoc.WidgetApi(null, true);
    
    this.imageInspector = new WebDoc.ImagePaletteController( "#image-inspector" );
    this.textInspector = new WebDoc.TextPaletteController( "#text-inspector" );
    this.htmlInspector = new WebDoc.InnerHtmlController( "#html-inspector" );
    this.iframeInspector = new WebDoc.IframeController( "#iframe-inspector" );

    var widgetPalette = $("#widget-inspector").hide();
    var widgetPaletteContent = widgetPalette.find("iframe");
    widgetPaletteContent.bind("load", function() {
      ddd("must inject uniboard api in inspector");
      if (widgetPaletteContent[0].contentWindow && WebDoc.application.boardController.selection().length) {
        ddd("inject uniboard api in inspector");
        this.loadingWheel.hide();
        widgetPaletteContent[0].contentWindow.uniboard = this.widgetInspectorApi;
        if (widgetPaletteContent[0].contentWindow.widget) {
          var widgetObject = widgetPaletteContent[0].contentWindow.widget;
          widgetObject.lang = "en";
          widgetObject.uuid = WebDoc.application.boardController.selection()[0].item.uuid();
          widgetObject.mode = "Edit";
          // check if widget has the sdk_boot or the full sdk.
          if (widgetObject._loadCurrentSDK) {
            var path = document.location.protocol + '//' + document.location.host + '/sdk/sdk.js';
            widgetObject._loadCurrentSDK(path);
          }
          else {
            widgetObject._onLoad();  
          }
        }
        else if (widgetPaletteContent[0].contentWindow.initialize) {
          widgetPaletteContent[0].contentWindow.initialize();
        }
      }                      
    }.pBind(this));
        
    this._inspectorNodes = [
      emptyPalette,
      this.textInspector.domNode,
      penPelette,
      widgetPalette,
      this.imageInspector.domNode,
      this.htmlInspector.domNode,
      this.iframeInspector.domNode
    ];
    
    this._properties = new WebDoc.PropertiesInspectorController( '#properties' );
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
      
      // Inspector belongs to widget
      if (typeof paletteId == 'string') {
        this.currentInspectorId = 3;
      }
      // Inspector is native
      else {
        this.currentInspectorId = paletteId;
      }
      
      inspectorNode = this._inspectorNodes[this.currentInspectorId];
      inspectorNode.show();
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
  
  refreshProperties: function() {
    this._properties.refresh();
  },
  
  
  refreshSubInspectors: function() {
    this.refreshProperties();
    
    switch (this.currentInspectorId) {
      case 1:
        this.textInspector.refreshInnerHtml();
        break;
      case 3:
        this.widgetInspectorApi.setWidgetItem(WebDoc.application.boardController.selection()[0].item);    
        var widgetContent = this._inspectorNodes[3].find("iframe"); 
        if (widgetContent.attr("src") != WebDoc.application.boardController.selection()[0].inspectorId()) {
          this.loadingWheel.show();
          widgetContent[0].contentDocument.write("");
          widgetContent.attr("src", WebDoc.application.boardController.selection()[0].inspectorId());
        }      
        else {
          if (widgetContent[0].contentWindow && widgetContent[0].contentWindow.widget && widgetContent[0].contentWindow.widget._onLoad) {
            var widgetObject = widgetContent[0].contentWindow.widget;
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
      case 6:
        this.iframeInspector.refresh();
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