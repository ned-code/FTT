
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
    },
    
    selectTool: function($super) {
      $super();
      WebDoc.application.boardController.unselectAll();      
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
			x: $("#board_container").get(0).scrollLeft,
			y: $("#board_container").get(0).scrollTop
		}
    },
    
    mouseMove: function(e)
    {
      e.preventDefault();      
        if (this.moving) 
        {
            var xMove = this.originalMovingPos.x - e.screenX;
            var yMove = this.originalMovingPos.y - e.screenY;
            $("#board_container").get(0).scrollTop = this.originalPos.y + yMove;
			$("#board_container").get(0).scrollLeft = this.originalPos.x + xMove;
            e.stopPropagation();
        }
    },
    
    mouseUp: function(e)
    {
      e.preventDefault();      
        this.moving = false;
    }
    
});
