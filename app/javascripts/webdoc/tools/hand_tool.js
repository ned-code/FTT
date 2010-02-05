
/**
 * @author julien
 */
//= require "tool"
WebDoc.HandTool = $.klass(WebDoc.Tool, 
{
    moving: false,
    originalMovingPos: null,
    initialize: function($super, selector, boardClass) {
      $super(selector, boardClass);
      this.boardScroller = WebDoc.application.boardController.scrollNode;
    },
    
    selectTool: function($super) {
      $super();
      WebDoc.application.boardController.unselectAll();      
    },
    
    //getCursor: function() {
    //  return "move";  
    //},
    
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
        x: this.boardScroller.scrollLeft(),
        y: this.boardScroller.scrollTop()
      };
    },
    
    mouseMove: function(e)
    {
      e.preventDefault();      
        if (this.moving) 
        {
            var xMove = this.originalMovingPos.x - e.screenX;
            var yMove = this.originalMovingPos.y - e.screenY;
            
            this.boardScroller
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
