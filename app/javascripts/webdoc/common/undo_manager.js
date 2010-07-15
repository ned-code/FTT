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
    this.groupStack = [];
    this.groupCount = 0;
  },
  
  /**
   * register an undo command. If registerUndo is called during an undo, command is registered as a redo command.
   * @param {Object} undoCommand the command to register
   */
  registerUndo: function(undoCommand) {
    if(this.groupCount > 0){
      this.groupStack.push(undoCommand);
    }
    else if (this.isUndoing) {
      this.redoStack.push(undoCommand);
    }
    else {
      if (!this.isRedoing) {
        this.redoStack = [];
      }
      this.undoStack.push(undoCommand);
    }
    ddd(this.groupStack);
  },
  
  /**
   * clear the undo and redo stack
   */
  clear: function() {
    this.undoStack = [];
    this.redoStack = [];
    this.groupStack = [];
    this.groupCount = 0;
  },
  
  /**
   * begin a group of undo/redo command. All register will be grouped until the endGroup with the same name
   * @param {Object} name name of the group.
   */
  group: function() {
    this.groupCount += 1;
    ddd(this.groupCount);
  },
  
  /**
   * End of a group
   * @param {Object} name the name of the group to end.
   */
  endGroup: function() {
    this.groupCount -= 1;
    ddd(this.groupCount);
    if (this.groupCount == 0){
      this.registerUndo(this.groupStack);
      this.groupStack = [];
    }
  },
  
  /**
   * @return {boolean} true if there are some undo command in the stack
   */
  canUndo: function() {
    return (!this.groupCount && this.undoStack.length);
  },

  /**
   * @return {boolean} true if there are some redo command in the stack
   */  
  canRedo: function() {
    return !this.groupCount && this.redoStack.length;
  },
  
  /**
   * excecute an undo and remove it from the stack
   */
  undo: function() {
    if (this.canUndo()) {
      this.isUndoing = true;
      var undoCommand = this.undoStack.pop();
      if(jQuery.isArray(undoCommand)){
        ddd('undo group');
        this._callGroup(undoCommand);
      }
      else{
        undoCommand.call(this);
      }
      this.isUndoing = false;
    }
  },
  
  /**
   * excecute an redo and remove it from the stack
   */  
  redo: function() {
    if (this.canRedo()) {
      this.isRedoing = true;
      var redoCommand = this.redoStack.pop();
      if(jQuery.isArray(redoCommand)){
        this._callGroup(redoCommand);
      }
      else{
        redoCommand.call(this);
      }
      this.isRedoing = false;
    }
  },
  
  /**
   * call all methods that are stock in a group
   */
  _callGroup: function(group){
    for(var i = 0; i < group.length; i++){
      if(jQuery.isArray(group[i])){
        this._callGroup(group[i]);
      }
      else{
        group[i].call(this);
      }
    }
  }
});

