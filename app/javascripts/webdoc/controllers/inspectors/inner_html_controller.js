/**
 * @author Julien Bachmann / Stephen Band
 */

WebDoc.InnerHtmlController = $.klass({
  initialize: function( selector, withProperties ) {

    var domNode = $(selector),
        self = this,
        
        // Initialise CodeMirror. CodeMirror must be visible
        // while it is being set up.
        editor = new CodeMirror( domNode.find('.content')[0] , {
          path: '/js/codemirror/',
          parserfile: ['parsexml.js', 'parsecss.js', 'tokenizejavascript.js', 'parsejavascript.js', 'parsehtmlmixed.js'],
          stylesheet: '/css/codemirror/codemirror.css',
          lineNumbers: true,
          indentUnit: 2,
          height: '100%',
          initCallback: function( editor ) {
            // Hide inspector once this thread has finished
            ddd("[CodeMirror] initCallback");
            setTimeout( function(){ domNode.hide(); }, 0 );
          },
          // Use one of these to react to key input. onChange is slower
          // but less taxing on the computer.
          onChange: this.applyInnerHtml.pBind(this)
          // cursorActivity: this.applyInnerHtml.pBind(this)
        });

    this.domNode = domNode;
    this._editor = editor;
    if (withProperties) {
      this.propertiesController = new WebDoc.PropertiesInspectorController('#html_properties', true);
    }
  },
  
  refresh: function() {
    ddd("refresh html inspector");
    if (this.propertiesController) {
      this.propertiesController.refresh();
    }
    if (WebDoc.application.boardController.selection().length) {
      
      var item = WebDoc.application.boardController.selection()[0].item;
      var html = item.getInnerHtml();
      
      // Fill the editor
      this._editor.setCode( html || '' );
      try {
        this._editor.reindent();
      }
      catch (exception) {
        ddd("cannot indent HTML");
      }
    }
    else {
      this._editor.setCode( '' );
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
