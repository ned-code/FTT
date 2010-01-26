
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
    if (!(objectToSelect && WebDoc.application.boardController.editingItem() == objectToSelect)) {
      if (objectToSelect) {
        WebDoc.application.boardController.selectItemViews([objectToSelect]);
      }
      else {
        WebDoc.application.boardController.unselectAll();
      }
    }
    this.lastSelectedObject.event = null;
  },
  
  disableHilight: function() {
    this.disableHiLight = true;
  },
  
  enableHilight: function() {       
    this.disableHiLight = false;
    this.mouseOver({ target: this.lastTarget});
  },
  
  mouseDown: function(e) {
    if (!WebDoc.application.boardController.isInteractionMode()) {
      var target = $(e.target);
      ddd("mouse down on target", e.target);
      if (!target || target.length === 0 || !target.hasClass("drawing_handle")) {
        this.select(e);
        this.originalMovingPos = {
          x: e.screenX,
          y: e.screenY,
          firstMove: true
        };
      }
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
    if (WebDoc.application.boardController.editItemView(objectToEdit)) {
      this.mouseOut(e);
    }
  },
  
  mouseOver: function(e) {
    this.lastTarget = e.target;
    var target = $(e.target);
    if (target.hasClass("item-layer") && !this.disableHiLight) {
      $(".item-layer").not(target).css("opacity", 0);
      target.stop().animate({
        opacity: 0.8
      }, {
        duration: 100
      });
    }
  },

  mouseOut: function(e) {  
    var target = $(e.target);
    this.lastTarget = null;
    if (target.hasClass("item-layer") && !this.disableHiLight) {
      target.stop().animate({ opacity: 0 }, { duration: 100});
    }
  },
        
  _clickedItemView: function(e) {   
    var clickedItemView = null;
    var target = $(e.target);
    if (target && target.get(0) && target.get(0).tagName == "polyline") {
      clickedItemView = target.data("itemView");
    }
    else {
      clickedItemView = target.closest(".item_wrap").data("itemView");
    }
    return clickedItemView;
  }
});
