/**
 * @author julien
 */

//= require <webdoc/sdk/widget_api>

WebDoc.WidgetView = $.klass(WebDoc.ItemView, {

  DEFAULT_WIDGET_HTML: "<div>Enter the HTML you want in the inspector</div>",

  initialize: function($super, item, pageView, afterItem) {
    $super(item, pageView, afterItem);
    this.itemDomNode.css({ width:"100%", height:"100%"}); 
    this.api = new WebDoc.WidgetApi(item, false);  
  },
  
  createDomNode: function($super) {
    var widgetNode = $super();   
    if (this.item.data.data.tag == "iframe" && !WebDoc.application.pageEditor.disableHtml) {      
      var wait = $("<div/>")
                    .attr("id", "wait_" + this.item.uuid())
                    .css(this.item.data.data.css)
                    .addClass("load_item").addClass("layer")
                    .css("textAlign", "center");
      var imageTop = (parseFloat(this.item.data.data.css.height) / 2) - 16;
      var image = $("<img/>")
                      .attr("src", "/images/icons/waiting_wheel.gif")
                      .css({
                            verticalAlign: "middle",
                            position: "relative",
                            top: imageTop + "px"
                           });
      wait.append(image);
      this.pageView.itemDomNode.append(wait);
      widgetNode.bind('load', function() {
        ddd("widget loaded");
        this.initWidget();
      }.pBind(this));
      
    }
    else {
      this._displayDefaultContentIfNeeded(widgetNode);
    }
    return widgetNode;
  },
  
  inspectorId: function() {

    ddd("check if widget has an inspector url", this.item);
    if (this.item.data.data.properties && this.item.data.data.properties.inspector_url != null) {
      return this.item.data.data.properties.inspector_url;
    }      
    else if (this.item.media && this.item.media.data.properties.inspector_url != null) {
      return this.item.media.data.properties.inspector_url;
    }
    return 5;
  },
  
  innerHtmlChanged: function($super) {
    $super();
    this._displayDefaultContentIfNeeded(this.itemDomNode);
    // resize if inner html is iframe
    var innerIframe = this.itemDomNode.find("iframe");
    if (innerIframe.get(0)) {
      this._resizeTo({
        width: parseFloat(innerIframe.css("width").replace("px", "")),
        height: parseFloat(innerIframe.css("height").replace("px", ""))
      });
    }
  },
  
  canEdit: function() {
    return true;
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
    $("#wait_" + this.item.uuid()).remove();
    if (this.itemDomNode.get(0).contentWindow) {
      this.itemDomNode.get(0).contentWindow.uniboard = this.api;
      if (this.itemDomNode.get(0).contentWindow.widget) {
        var widgetObject = this.itemDomNode.get(0).contentWindow.widget;
        widgetObject.lang = "en";
        widgetObject.uuid = this.item.uuid();
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
      
      // init widget whout SDK
      else if (this.itemDomNode.get(0).contentWindow.initialize) {
        this.itemDomNode.get(0).contentWindow.initialize();
      }
      
      //$(this.domNode.get(0).contentDocument).find("body").css("overflow", "hidden");
      // inject innerHTML if exist
      /*
       if (this.item.data.data.innerHTML) {
       var doc = this.domNode.get(0).contentDocument;
       doc.open();
       doc.write("<html><head>" + this.item.data.data.innerHTML + "</head><body></body></html>");
       doc.close();
       }
       */
      /* if SVG layer don't catch event we need to catch events in the capture phase of the widget */
      /*
       this.domNode.get(0).contentDocument.body.addEventListener("mousedown", WebDoc.application.boardController.mouseDown.pBind(WebDoc.application.boardController), true);
       this.domNode.get(0).contentDocument.body.addEventListener("mousemove", WebDoc.application.boardController.mouseMove.pBind(WebDoc.application.boardController), true);
       this.domNode.get(0).contentDocument.body.addEventListener("mouseup", WebDoc.application.boardController.mouseUp.pBind(WebDoc.application.boardController), true);
       */
    }
  },

  _displayDefaultContentIfNeeded: function(parent) {
    if (this.item.data.data.tag !== "iframe"  && (!this.item.data.data.innerHTML || $.string().blank(this.item.data.data.innerHTML))) {
      parent.html(this.DEFAULT_WIDGET_HTML);
    }
  }
});
