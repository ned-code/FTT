
/**
 * @author julien
 */
WebDoc.WBMoveItemController = $.klass(
{
    moving: false,
    hasMoved: false,
    originalMovingPos: null,
    initialize: function(initialDrawing)
    {
    },
    
    move: function(e)
    {
        this.hasMoved = true;
        if (this.originalMovingPos.firstMove && this.selection.length) 
        {
            var selectionToUndo = this.selection[0];
            this._moveItem(selectionToUndo)
        }
        this.originalMovingPos.firstMove = false;
        var xDiff = (e.screenX - this.originalMovingPos.x) * (1 / this.currentZoom);
        var yDiff = (e.screenY - this.originalMovingPos.y) * (1 / this.currentZoom);
        var i = 0;
        for (; i < this.selection.length; i++) 
        {
            var objectToMove = this.selection[i];
            objectToMove.shift(xDiff, yDiff);
            
        }
        this.originalMovingPos = 
        {
            x: e.screenX,
            y: e.screenY
        };
    },
    
    endMove: function(e)
    {
        if (this.selection[0] && this.hasMoved) 
        {
            this.selection[0].endOfMove();
        }
        this.hasMoved = false;
    },

});
