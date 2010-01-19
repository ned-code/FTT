
/**
 * @author julien
 */
//= require "tool"
WebDoc.HandTool = $.klass(WebDoc.Tool, 
{
    moving: false,
    originalMovingPos: null,
    initialize: function($super, toolId) {
      $super(toolId);
      this.boardContainer = $("#board_container");
    },
    
    selectTool: function($super) {
      $super();
      WebDoc.application.boardController.unselectAll();      
    },
    
    getCursor: function() {
      return "move";  
    },
    
    mouseDown: function(e)
    {
      e.preventDefault();      
      this.moving = true;
      this.originalMovingPos = 
      {
          x: e.screenX,
          y: e.screenY,
          firstMove: true
      }; 
     
      this.originalPos = 
      {
        x: this.boardContainer.find(".show-scroll").scrollLeft(),
        y: this.boardContainer.find(".show-scroll").scrollTop()
      };
    },
    
    mouseMove: function(e)
    {
      e.preventDefault();      
        if (this.moving) 
        {
            var xMove = this.originalMovingPos.x - e.screenX;
            var yMove = this.originalMovingPos.y - e.screenY;
            
            this.boardContainer.find(".show-scroll")
            .scrollTop( this.originalPos.y + yMove )
            .scrollLeft( this.originalPos.x + xMove );
            
            e.stopPropagation();
        }
    },
    
    mouseUp: function(e)
    {
      e.preventDefault();      
        this.moving = false;
    }
    
});
