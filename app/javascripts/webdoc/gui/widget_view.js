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
      widgetNode.bind('load', function() {
        ddd("widget loaded");
        this.initWidget();
      }.pBind(this));
    }

    return widgetNode;
  },
  
  inspectorId: function() {

//    if (this.item.data.data.properties && this.item.data.data.properties.inspector_url) {
//      return this.item.data.data.properties.inspector_url;
//    }      
//    else if (this.item.media && this.item.media.data.properties.inspector_url) {
//      return this.item.media.data.properties.inspector_url;
//    }
    return 0;
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
    if (this.itemDomNode.get(0).contentWindow) {
      if (this.itemDomNode.get(0).contentWindow.widget) {
        this.itemDomNode.get(0).contentWindow.widget._onPreferencesChange();
      }
      // 
      else if (this.itemDomNode.get(0).contentWindow.initialize) {
        this.itemDomNode.get(0).contentWindow.initialize();
      }
    }
  },  

  initWidget: function() {
    this.domNode.removeClass('loading');
    if (this._editable) {
      this.itemLayerDomNode.show();
    }
    else {
      this.itemLayerDomNode.hide();
    }
    if (this.itemDomNode.get(0).contentWindow) {
      this.itemDomNode.get(0).contentWindow.uniboard = this.api;
      if (this.itemDomNode.get(0).contentWindow.widget) {
        var widgetObject = this.itemDomNode.get(0).contentWindow.widget;
        widgetObject.lang = "en";
        widgetObject.uuid = this.item.uuid();
        widgetObject.mode = this.pageView.isEditable? "Edit": "View";
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
    }
  },

  setEditable: function($super, editable) {
    $super(editable);
    if (this.itemDomNode.get(0).contentWindow) {
      if (this.itemDomNode.get(0).contentWindow.widget) {
        var widgetObject = this.itemDomNode.get(0).contentWindow.widget;
        widgetObject.mode = editable ? "Edit" : "Read";
        widgetObject._onModeChange();
      }
    }  
  } 
});
