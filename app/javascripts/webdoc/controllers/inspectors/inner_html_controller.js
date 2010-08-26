/**
 * @author Julien Bachmann / Stephen
 */

// CodeMirror needs some attention, it's causing things to fail at the moment...

WebDoc.InnerHtmlController = $.klass({
  initialize: function( selector, withProperties ) {
    var domNode = $(selector);
    
    ddd('[InnerHtmlController] initialize on', selector, domNode);
    
    // Initialise CodeMirror. CodeMirror must be visible
    // while it is being set up.
    
    this._editor = new CodeMirror( domNode[0], {
      path: '/codemirror/js/',
      parserfile: ['parsexml.js', 'parsecss.js', 'tokenizejavascript.js', 'parsejavascript.js', 'parsehtmlmixed.js'],
      stylesheet: '/css/codemirror/codemirror.css',
      // disable line number because it freeze
      // TODO need to fix that
      lineNumbers: false,
      indentUnit: 2,
      height: '100%',
      initCallback: function( editor ) {
        // Hide inspector once this thread has finished
        ddd("[CodeMirror] initCallback");
        //setTimeout( function(){ domNode.hide(); }, 0 );
      },
      // Use one of these to react to key input. onChange is slower
      // but less taxing on the computer.
      onChange: this.applyInnerHtml.pBind(this)
      // cursorActivity: this.applyInnerHtml.pBind(this)
    });
		
    this.domNode = domNode;
  },
  
  refresh: function() {
    ddd("[InnerHtmlController] refresh");
    
    if (WebDoc.application.boardController.selection().length) {
      var item = WebDoc.application.boardController.selection()[0].item;
      var html = item.getInnerHtml();

      // Fill the editor
      // check that editor has been initialized
      if (this._editor.editor) {
        this._editor.setCode( html || '' );
      }

      try {
        this._editor.reindent();
      }
      catch (exception) {
        ddd("cannot indent HTML");
      }
    }
     
  },
  
  applyInnerHtml: function() {
    var html = this._editor.getCode();

    if (html) {
      if (WebDoc.application.boardController.selection().length > 0) {
        WebDoc.application.boardController.selection()[0].item.setInnerHtml(html);
      }
    }
  }
});
