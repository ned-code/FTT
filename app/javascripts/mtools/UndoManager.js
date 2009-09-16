/**
 * UndoManager stack
**/
com.mnemis.core.Provide("com/mnemis/core/UndoManager.js");

com.mnemis.core.UndoManager = $.inherit(
{
    __constructor: function()
    {
        this.undoStack = [];
        this.redoStack = [];
        this.isUndoing= false;
    },
    registerUndo: function(undoCommand)
    {
        if (this.isUndoing)
        {
            this.redoStack.push(undoCommand);
        }
        else
        {
            this.undoStack.push(undoCommand);
        }
    },

    clear : function(){
    //TODO empty undo and redo stack
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
            this.redoStack.pop().call(this);
        }
    }
});

