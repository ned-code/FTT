
/**
 * @author julien
 */
//= require "tool"

WebDoc.ArrowTool = $.klass(WebDoc.Tool, {
  
  initialize: function($super, selector, boardClass) {
    $super( selector, boardClass );
    this.lastSelectedObject = {};
  },
  
  selectTool: function($super) {
    $super();
    WebDoc.application.boardController.activateEventCatcher(false);
  },
    
  select: function(e) {  
    var objectToSelect = this._clickedItemView(e);

    this.lastSelectedObject = {
      itemView: objectToSelect, // JBA: no more USED
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
    if (!WebDoc.application.boardController.isInteractionMode()) {
      ddd("dbl click", e.target);
      var objectToEdit = this._clickedItemView(e);
      if (WebDoc.application.boardController.editItemView(objectToEdit)) {
        $(e.target).closest(".item-layer").css("opacity",0);
        this.mouseOut(e);
      }
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
