/**
 * Uniboard tool bar widget
**/
com.mnemis.core.Provide("com/mnemis/core/UndoManager.js");

com.mnemis.core.UndoManager = function()
{

	this.undoStack = [];
	
	this.redoStack = [];
	
	this.isUndoing= false;
												                                                       
};


com.mnemis.core.UndoManager.prototype.registerUndo = function(undoCommand) 
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

com.mnemis.core.UndoManager.prototype.clear = function(){
	//TODO empty undo and redo stack	
},

com.mnemis.core.UndoManager.prototype.group = function(name)
{
	// TODO implement group
},

com.mnemis.core.UndoManager.prototype.endGroup = function(name)
{
	
},

com.mnemis.core.UndoManager.prototype.canUndo = function()
{
	return this.undoStack.length;
},

com.mnemis.core.UndoManager.prototype.canRedo = function()
{
	return this.redoStack.length;	
},

com.mnemis.core.UndoManager.prototype.undo = function()
{
	if (this.undoStack.length)
	{
    	this.isUndoing = true;
    	this.undoStack.pop().call(this);
    	this.isUndoing = false;
	}
},

com.mnemis.core.UndoManager.prototype.redo = function()
{
	if (this.redoStack.length)
	{
		this.redoStack.pop().call(this);
	}
}         