
/**
 * @author julien
 */
//= require "tool"

WebDoc.DrawingTool = $.klass(WebDoc.Tool,
{
    drawing: false,

    initialize: function($super, toolId) {
      $super(toolId);
    },
        
    mouseDown: function(e)
    {
      this.drawing = true;
      WebDoc.application.boardController.drawingController.beginDraw(e);
    },
    
    mouseMove: function(e)
    {
        if (this.drawing) 
        {
            WebDoc.application.boardController.drawingController.draw(e);
        }
    },
    
    mouseUp: function(e)
    {
		this.drawing = false;
		WebDoc.application.boardController.drawingController.endDraw(e);
    }
    
});
