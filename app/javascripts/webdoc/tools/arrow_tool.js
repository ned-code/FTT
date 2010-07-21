
/**
 * @author julien
 */
//= require "tool"

WebDoc.ArrowTool = jQuery.klass(WebDoc.Tool, {
  
  initialize: function($super, selector, boardClass) {
    $super( selector, boardClass );
    this.lastSelectedObject = {};
		this.selectedObject = [];
  },
  
  selectTool: function($super) {
    $super();
    WebDoc.application.boardController.activateEventCatcher(false);
  },
    
  select: function(e) {
    var objectToSelect = this._clickedObjectView(e);
    if (!WebDoc.application.boardController.isInteractionMode() && objectToSelect.type !== "discussion") {
      this.lastSelectedObject = {
        itemView: objectToSelect.object, // JBA: no more USED
        event: e
      };
      if (!(objectToSelect.object && WebDoc.application.boardController.editingItem() == objectToSelect.object)) {
        if (objectToSelect.object) {
          e.stopPropagation();
          WebDoc.application.boardController.unSelectDiscussionView();
          if(e.shiftKey) {
            WebDoc.application.boardController.addItemViewToSelection([objectToSelect.object]);
          }
          else {
            WebDoc.application.boardController.selectItemViews([objectToSelect.object]);
          }
        }
        else {
          WebDoc.application.boardController.unselectAll();
          this.selectedObject = [];
        }
        jQuery("a[href='#select']").focus();
      }
      this.lastSelectedObject.event = null;
    }
    else if(objectToSelect.type === 'discussion') {
      WebDoc.application.boardController.unselectAll();      
      WebDoc.application.boardController.selectDiscussionView(objectToSelect.object);
    } 
  },
  
  disableHilight: function() {
    this.disableHiLight = true;
  },
  
  enableHilight: function() {       
    this.disableHiLight = false;
    this.mouseOver({ target: this.lastTarget});
  },
  
  mouseDown: function(e) {
    var target = jQuery(e.target);
    ddd("mouse down on target", e.target);
    if (!target || target.length === 0 || !target.hasClass("drawing_handle")) {
      this.select(e);
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
      var objectToEdit = this._clickedObjectView(e);
      if (WebDoc.application.boardController.editItemView(objectToEdit.object) && !objectToEdit.type === 'discussion') {
        jQuery(e.target).closest(".item-layer").css("opacity",0);
        this.mouseOut(e);
      }
    }
  },
  
  mouseOver: function(e) {
    this.lastTarget = e.target;
    var target = jQuery(e.target);
    if (target.hasClass("item-layer") && !this.disableHiLight) {
      jQuery(".item-layer").not(target).css("opacity", 0);
      target.stop().animate({
        opacity: 0.8
      }, {
        duration: 40
      });
    }
  },

  mouseOut: function(e) {  
    var target = jQuery(e.target);
    this.lastTarget = null;
    if (target.hasClass("item-layer") && !this.disableHiLight) {
      target.stop().animate({ opacity: 0 }, { duration: 100});
    }
  },
        
  _clickedObjectView: function(e) {
    var clickedItemView = null,
        itemWrap,
        type,
        target = jQuery(e.target);

    if (target && target.get(0) && target.get(0).tagName == "polyline") {
      clickedItemView = target.data("itemView");
      type = 'polyline';
    }
    else if ( target && target.get(0) && target.get(0).className === "wd_discussion" ) {
      itemWrap = target.closest(".wd_discussion_wrap");
      clickedItemView = itemWrap.data("discussionView");
      type = 'discussion';
    }
    else {
      itemWrap = target.closest(".item_wrap");
      clickedItemView = itemWrap.data("itemView");
      type = 'item';
      // itemWrap.find('.item-placeholder input:eq(0)').focus();
    }
    return { type: type, object: clickedItemView };
  }
});
