
/**
 * @author julien
 */
//= require "tool"
WebDoc.HandTool = $.klass(WebDoc.Tool, 
{
    moving: false,
    originalMovingPos: null,
    initialize: function()
    {
    },
    
    mouseDown: function(e)
    {
        this.moving = true;
        this.originalMovingPos = 
        {
            x: e.screenX,
            y: e.screenY,
            firstMove: true
        };
		this.originalPos = 
		{
			x: $("#board-container").get(0).scrollLeft,
			y: $("#board-container").get(0).scrollTop
		}
    },
    
    mouseMove: function(e)
    {
        if (this.moving) 
        {
            var xMove = this.originalMovingPos.x - e.screenX;
            var yMove = this.originalMovingPos.y - e.screenY;
            $("#board-container").get(0).scrollTop = this.originalPos.y + yMove;
			$("#board-container").get(0).scrollLeft = this.originalPos.x + xMove;
            e.stopPropagation();
        }
    },
    
    mouseUp: function(e)
    {
        this.moving = false;
    }
    
});
