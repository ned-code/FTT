
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.Page = $.klass(MTools.Record, 
{
  initialize: function($super, json) {
    this.drawing = 
    {
      polylines: []
    };
    this.objects = [];
    this.items = [];
    $super(json);
  },
  
  className: function() {
    return "page";
  },
  
  rootUrl: function() {
    return "/documents/" + this.data.document_id;
  },
  
  refresh: function($super, json) {
    $super(json);
    var that = this;
    if (this.data.items && $.isArray(this.data.items)) {
      $.each(this.data.items, function() {
        that.createOrUpdateItem(
        {
          item: this
        });
      });
    }
  },
  
  to_json: function($super) {
    var result = $super();
    delete result['page[items]'];
    return result;
  },
  
  previousPageId: function() {
    return null;
  },
  
  nextPageId: function() {
    return null;
  },
  
  createOrUpdateItem: function(itemData) {
    var item = this.findItemWithUuid(itemData.uuid);
    if (!item) {
      this.createItem(itemData);
    }
    else {
      item.update(itemData);
    }
  },
  
  createItem: function(itemData) {
    var newItem = new WebDoc.Item(itemData);
    this.items.push(newItem);
    if (newItem.data.data.tag == 'polyline') {
      this.drawing.polylines.push(newItem);
    }
  },
  
  findItemWithUuid: function(pUuid) {
    var i = 0;
    for (; i < this.items.length; i++) {
      var anObject = this.items[i];
      if (anObject.uuid == pUuid) {
        return anObject;
      }
    }
    return null;
  },
  
  toggleBkg: function() {
    console.log("toggle");
    var previousColor = this.data.data.css.backgroundColor;
    var newColor = "white";
    if (previousColor == "white") {
      newColor = "black";
    }
    this.data.data.css.backgroundColor = newColor;
    this.fireObjectChanged();
  },
});
