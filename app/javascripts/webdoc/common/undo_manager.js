/**
 * UndoManager stack
 * 
 * @author Julien Bachmann
 **/
WebDoc.UndoManager = $.klass({
  
  initialize: function() {
    this.undoStack = [];
    this.redoStack = [];
    this.isUndoing = false;
    this.isRedoing = false;
  },
  
  /**
   * register an undo command. If registerUndo is called during an undo, command is registered as a redo command.
   * @param {Object} undoCommand the command to register
   */
  registerUndo: function(undoCommand) {
    if (this.isUndoing) {
      this.redoStack.push(undoCommand);
    }
    else {
      if (!this.isRedoing) {
        this.redoStack = [];
      }
      this.undoStack.push(undoCommand);
    }
  },
  
  /**
   * clear the undo and redo stack
   */
  clear: function() {
    this.undoStack = [];
    this.redoStack = [];
  },
  
  /**
   * begin a group of undo/redo command. All register will be grouped until the endGroup with the same name
   * @param {Object} name name of the group.
   */
  group: function(name) {
    // TODO implement group
  },
  
  /**
   * End of a group
   * @param {Object} name the name of the group to end.
   */
  endGroup: function(name) {
  
  },
  
  /**
   * @return {boolean} true if there are some undo command in the stack
   */
  canUndo: function() {
    return this.undoStack.length;
  },

  /**
   * @return {boolean} true if there are some redo command in the stack
   */  
  canRedo: function() {
    return this.redoStack.length;
  },
  
  /**
   * excecute an undo and remove it from the stack
   */
  undo: function() {
    if (this.undoStack.length) {
      this.isUndoing = true;
      this.undoStack.pop().call(this);
      this.isUndoing = false;
    }
  },
  
  /**
   * excecute an redo and remove it from the stack
   */  
  redo: function() {
    if (this.redoStack.length) {
      this.isRedoing = true;
      this.redoStack.pop().call(this);
      this.isRedoing = false;
    }
  }
});

