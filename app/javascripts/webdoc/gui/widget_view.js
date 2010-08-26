/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>
WebDoc.WIDGET_INSPECTOR_GROUP = "WidgetInspectorGroup";

WebDoc.WidgetView = $.klass(WebDoc.ItemView, {

  initialize: function($super, item, pageView, afterItem) {    
    $super(item, pageView, afterItem);
    this.itemDomNode.css({ width:"100%", height:"100%"}); 
    this.api = new WebDoc.WidgetApi(item, false);
    this.domNode.addClass('item-widget');   
  },
  
  inspectorGroupName: function() {
    return WebDoc.WIDGET_INSPECTOR_GROUP;  
  },
    
  inspectorControllersClasses: function() {
    return [/*WebDoc.WidgetInspectorController, WebDoc.WidgetPropertiesInspectorController*/];
  },
    
  fullInspectorControllerClass: function() {
    return WebDoc.WidgetInspectorController;  
  },
      
  createDomNode: function($super) {
    var widgetNode = $super();   
    if (this.item.data.data.tag == "iframe" && !WebDoc.application.disableHtml) {
      this.domNode.addClass('loading');
      this.itemLayerDomNode.show();
      this._widgetIsLoading = true;
      widgetNode.bind('load', function() {
        ddd("widget loaded");
        this.initWidget();
      }.pBind(this));
    }

    return widgetNode;
  },
  
  inspectorId: function() {
    return 0;
  },

  objectChanged: function($super, item, options) {
    $super(item, options);
    if (item._isAttributeModified(options, 'size')) {
      var widgetObject = this.getWidgetApiObject();
      if (widgetObject) {
        widgetObject.onResize();
      }
    }
  },

  edit: function($super){
    $super();
  },
  
  canEdit: function() {
    return true;
  },
  
  stopEditing: function($super) {
    $super();
  },
  
  widgetChanged: function() {
    ddd("update widget state");
    var widgetObject = this.getWidgetApiObject();
    if (widgetObject) {
      widgetObject._onPreferencesChange();
    }
    //
    else if (this.itemDomNode.get(0).contentWindow.initialize) {
      this.itemDomNode.get(0).contentWindow.initialize();
    }
  },  

  initWidget: function() {
    this.domNode.removeClass('loading');
    this._widgetIsLoading = false;
    if (this._editable) {
      this.itemLayerDomNode.show();
    }
    else {
      this.itemLayerDomNode.hide();
    }
    var widgetObject = this.getWidgetApiObject();
    if (widgetObject) {
      this.itemDomNode.get(0).contentWindow.uniboard = this.api;
      widgetObject.lang = "en";
      widgetObject.uuid = this.item.uuid();
      widgetObject.mode = this.pageView.isEditable()? "Edit": "View";
      // check if widget has the sdk_boot or the full sdk.
      if (widgetObject._loadCurrentSDK) {
        var path = document.location.protocol + '//' + document.location.host + '/sdk/sdk.js';
        widgetObject._loadCurrentSDK(path);
      }
      else {
        widgetObject._onLoad();
      }
    }
    // init widget whout SDK
    else if (this.itemDomNode.get(0).contentWindow.initialize) {
      this.itemDomNode.get(0).contentWindow.initialize();
    }
  },

  setEditable: function($super, editable) {
    $super(editable);
    var widgetObject = this.getWidgetApiObject();
    if (widgetObject) {
      widgetObject.mode = editable ? "Edit" : "Read";
      widgetObject._onModeChange();
    }
  },

  getWidgetApiObject: function() {
    var result = null;
    if (!this._widgetIsLoading && this.itemDomNode.get(0).contentWindow) {
      if (this.itemDomNode.get(0).contentWindow.widget) {
        result = this.itemDomNode.get(0).contentWindow.widget;
      }
    }
    return result;
  }
  
});
