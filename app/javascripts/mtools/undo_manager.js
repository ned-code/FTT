/**
 * UndoManager stack
**/
MTools.UndoManager = $.klass(
{
    initialize: function()
    {
        this.undoStack = [];
        this.redoStack = [];
        this.isUndoing= false;
		this.isRedoing = false;
    },
    registerUndo: function(undoCommand)
    {
        if (this.isUndoing)
        {
            this.redoStack.push(undoCommand);
        }
        else
        {
			if (!this.isRedoing) 
			{
				this.redoStack = [];
			}
            this.undoStack.push(undoCommand);
        }
    },

    clear : function(){
		this.undoStack = [];
		this.redoStack = [];
    },

    group : function(name)
    {
    // TODO implement group
    },

    endGroup : function(name)
    {

    },

    canUndo : function()
    {
        return this.undoStack.length;
    },

    canRedo : function()
    {
        return this.redoStack.length;
    },

    undo : function()
    {
        if (this.undoStack.length)
        {
            this.isUndoing = true;
            this.undoStack.pop().call(this);
            this.isUndoing = false;
        }
    },

    redo : function()
    {
        if (this.redoStack.length)
        {
			this.isRedoing = true;
            this.redoStack.pop().call(this);
			this.isRedoing = false;
        }
    }
});

