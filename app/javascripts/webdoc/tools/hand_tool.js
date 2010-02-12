
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
      this.scrollNode = $('#webdoc');
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
        x: this.scrollNode.scrollLeft(),
        y: this.scrollNode.scrollTop()
      };
    },
    
    mouseMove: function(e)
    {
      e.preventDefault();      
        if (this.moving) 
        {
          var xMove = this.originalMovingPos.x - e.screenX;
          var yMove = this.originalMovingPos.y - e.screenY;
          
          this.scrollNode
          .scrollTop( this.originalPos.y + yMove )
          .scrollLeft( this.originalPos.x + xMove );
          
          //e.stopPropagation();
        }
    },
    
    mouseUp: function(e)
    {
      e.preventDefault();      
      this.moving = false;
    }
});
