
/**
 * @author julien
 */
//= require "tool"

WebDoc.ArrowTool = $.klass(WebDoc.Tool, {
  moving: false,
  hasMoved: false,
  originalMovingPos: null,
  
  initialize: function($super, toolId) {
    $super(toolId);
    this.lastSelectedObject = {};
  },
  
  select: function(e) {  
    var objectToSelect = this._clickedItemView(e);

    this.lastSelectedObject = {
      itemView: objectToSelect,
      event: e
    };      

    if (!(objectToSelect && WebDoc.application.boardController.editingItem == objectToSelect)) {
      if (objectToSelect) {
        WebDoc.application.boardController.selectItemViews([objectToSelect], e);
      }
      else {
        WebDoc.application.boardController.unselectAll();
      }
    }
    this.lastSelectedObject.event = null;
  },
  
  mouseDown: function(e) {
    if (!WebDoc.application.boardController.isInteraction) {
      var target = $(e.target);
      ddd("mouse down on target", e.target);
      this.select(e);
      this.originalMovingPos = {
        x: e.screenX,
        y: e.screenY,
        firstMove: true
      };
    }
  },
  
  mouseMove: function(e) {
  },
  
  mouseUp: function(e) {
  },
  
  mouseClick: function(e) {
    
  },
  
  mouseDblClick: function(e) {
    ddd("dbl click", e.target);
    var objectToEdit = this._clickedItemView(e);
    WebDoc.application.boardController.editItemView(objectToEdit);
  },
  
  mouseOver: function(e) {
    var target = $(e.target);
    if (target.hasClass("item_layer")) {
      target.animate({ opacity: 0.8});
    }
  },

  mouseOut: function(e) {  
    var target = $(e.target);
    if (target.hasClass("item_layer")) {
      target.animate({ opacity: 0});
    }
  },
        
  _clickedItemView: function(e) {   
    var clickedItemView = null;
    var target = $(e.target);
    if (target && target.get(0) && target.get(0).tagName == "polyline") {
      clickedItemView = target.data("itemView");
    }
    else {
      clickedItemView = target.parent().data("itemView");
    }
    return clickedItemView;
  }
});
