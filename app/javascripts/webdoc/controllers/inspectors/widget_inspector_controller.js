/**
 * @author Noé
 */

WebDoc.WidgetInspectorController = $.klass({
  initialize: function( ) {
    this.domNode = $("#widget-inspector");
    this.widgetInspectorApi = new WebDoc.WidgetApi(null, true);

    var widgetPaletteContent = this.domNode.find("iframe");
    widgetPaletteContent.bind("load", function() {
      ddd("must inject uniboard api in inspector");
      if (widgetPaletteContent[0].contentWindow && WebDoc.application.boardController.selection().length) {
        ddd("inject uniboard api in inspector");
        this.domNode.removeTransitionClass('loading');
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
      this._newInspectorLoading = false;
    }.pBind(this));
    
    // Quick hack
    //this.propertiesController = new WebDoc.PropertiesInspectorController('#widget_properties', false);
  },

  inspectorTitle: function() {
    return "app";  
  },
  
  width: function() {
    return '300px';  
  },
  
  refresh: function() {
    // Quick hack
    WebDoc.application.inspectorController.propertiesController.refresh();
    //this.propertiesController.refresh();
    
    var selectedItem = WebDoc.application.boardController.selection()[0];
    this.widgetInspectorApi.setWidgetItem(selectedItem.item);    
    var widgetContent = this.domNode.find("iframe"); 
    if (widgetContent.attr("src") != selectedItem.item.getInspectorUrl()) {
      this.domNode.addTransitionClass('loading');
      widgetContent[0].contentDocument.write("");
      this._newInspectorLoading = true;
      widgetContent.attr("src", selectedItem.item.getInspectorUrl());
    }      
    else if (!this._newInspectorLoading){
      if (widgetContent[0].contentWindow && widgetContent[0].contentWindow.widget && widgetContent[0].contentWindow.widget._onLoad) {
        var widgetObject = widgetContent[0].contentWindow.widget;
        widgetObject.lang = "en";
        widgetObject.uuid = selectedItem.item.uuid();
        widgetObject.mode = "Edit";
        widgetObject._onLoad();
      }
    }
  }
  
});
