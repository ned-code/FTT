
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.ItemView = $.klass(
{
  item: null,
  pageView: null,
  initialize: function(item, pageView) {
  
    if (pageView) {
      this.pageView = pageView;
    }
    else {
      this.pageView = WebDoc.application.boardController.pageView;
    }
    this.item = item;
    console.log("create item view with item");
    console.log(item);
    if (this.item.data.media_type == "drawing") {
      var newLine = WebDoc.application.svgRenderer.createPolyline(item);
      this.domNode = $(newLine);
      this.pageView.drawingDomNode.append(newLine);
    }
    else {
      this.domNode = $("<" + item.data.data.tag + "/>");
      this.domNode.css(
      {
        position: "absolute"
      })
      for (var key in item.data.data) {
        if (key == 'css') {
          this.domNode.css(item.data.data.css);
        }
        else {
          if (key == 'uuid' || key == 'ubItemType') {
            // just ignore uuid
          }
          else {
            if (key == 'innerHtml') {
              this.domNode.html(item.data.data[key]);
            }
            else {
              if (key != 'tag') {
                this.domNode.attr(key, item.data.data[key]);
              }
            }
          }
        }
      }
      this.pageView.itemDomNode.append(this.domNode.get(0));
    }
    item.addListener(this);
  },
  
  objectChanged: function(item) {
    this.domNode.animate(item.data.data.css, 'fast');
    if (item.data.media_type == "drawing") {
      WebDoc.application.svgRenderer.updatePolyline(this.domNode.get(0), 
      {
        points: item.data.data.points
      });
    }
  },
  
  select: function() {
    this.domNode.addClass("wb-selected-object");
    if (!this.domNode.attr("ub:zIndex")) {
      this.domNode.attr("ub:zIndex", this.domNode.css("zIndex"));
    }
    console.log("type " + this.type());
    if (this.type() == "widget") {
      this.domNode.css(
      {
        zIndex: 2000000
      });
      if (this.domNode.attr("type") == "application/x-shockwave-flash") {
        console.log(this.domNode.id);
        var player = document.getElementById(this.domNode.id);
        player.sendEvent('PLAY');
      }
    }
  },
  
  unSelect: function() {
    this.domNode.removeClass("wb-selected-object");
    console.log("reset zindex");
    this.domNode.css("zIndex", this.domNode.attr("ub:zIndex"));
  }
  
});
