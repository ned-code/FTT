/**
 * @author julien
 */
WebDoc.WidgetView = $.klass(WebDoc.ItemView, {

  createDomNode: function($super) {
    var widgetNode = $super();
    /* 
     setTimeout(function(){
     ddd(widgetNode.get(0).contentDocument.body);
     widgetNode.get(0).contentDocument.body.addEventListener("mousedown", WebDoc.application.boardController.mouseDown.pBind(WebDoc.application.boardController), true);
     widgetNode.get(0).contentDocument.body.addEventListener("mousemove", WebDoc.application.boardController.mouseMove.pBind(WebDoc.application.boardController), true);
     widgetNode.get(0).contentDocument.body.addEventListener("mouseup", WebDoc.application.boardController.mouseUp.pBind(WebDoc.application.boardController), true);
     }, 2000);
     */
    // try to resize to the correct size
    if (this.item.data.data.css.width == "0px") {
      var innerWidth = widgetNode.find(":first").width();
      var innerHeight = widgetNode.find(":first").height();
      ddd("inner size");
      ddd(innerWidth + " - " + innerHeight);
      ddd("--------------------");
      if (innerWidth && innerHeight) {
        this.item.resizeTo({
          width: innerWidth,
          height: innerHeight
        });
      }
      else {
        this.item.resizeTo({
          width: 150,
          height: 150
        });
      }
    }
    widgetNode.bind('load', function() {
      ddd("widget loaded");
      this.initWidget();
    }
.pBind(this));
    
    widgetNode.bind('resize', function() {
      ddd("widget resize");
    }
.pBind(this));
    
    return widgetNode;
  },
  
  innerHtmlChanged: function($super) {
    $super();
    // resize if inner html is iframe
    var innerIframe = this.domNode.find("iframe");
    if (innerIframe.get(0)) {
      this.resizeTo({
        width: parseFloat(innerIframe.css("width").replace("px", "")),
        height: parseFloat(innerIframe.css("height").replace("px", ""))
      });
    }
  },
  
  edit: function($super) {
    $super();
    WebDoc.application.boardController.unselectItemViews([this]);    
    WebDoc.application.boardController.editingItem = this;
    this.domNode.addClass("item_edited");
    this.domNode.css({
      zIndex: "1000005"
    });
  },
  
  stopEditing: function() {
    this.domNode.removeClass("item_edited");
    this.domNode.css({
      zIndex: "0"
    });
  },
  
  initWidget: function() {
    if (this.domNode.get(0).contentWindow) {
      this.domNode.get(0).contentWindow.uniboard = this.item;
      if (this.domNode.get(0).contentWindow.initialize) {
        this.domNode.get(0).contentWindow.initialize();
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
  }
});