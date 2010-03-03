/**
 * @author Julien Bachmann / Stephen Band
 */

WebDoc.InnerHtmlController = $.klass({
  initialize: function( selector ) {
    var domNode = $(selector),
        self = this,
        
        // Initialise CodeMirror. CodeMirror must be visible
        // while it is being set up.
        editor = new CodeMirror( domNode.find('.content')[0] , {
          path: '/javascripts/codemirror/',
          parserfile: ['parsexml.js', 'parsecss.js', 'tokenizejavascript.js', 'parsejavascript.js', 'parsehtmlmixed.js'],
          stylesheet: '/stylesheets/style.codemirror.css',
          lineNumbers: true,
          indentUnit: 2,
          height: '100%',
          initCallback: function( editor ) {
            // Hide inspector once this thread has finished
            ddd("code mirror callback");
            setTimeout( function(){ domNode.hide();
            }, 0 );
          },
          // Use one of these to react to key input. onChange is slower
          // but less taxing on the computer.
          onChange: this.applyInnerHtml.pBind(this)
          // cursorActivity: this.applyInnerHtml.pBind(this)
        });

    this.domNode = domNode;
    this._editor = editor;
    this._noIframeBox = $("#no_iframe");
    this._noIframeBox.bind("change", this.updateNoIframe.pBind(this));
  },
  
  refresh: function() {
    ddd("refresh html inspector");
    if (WebDoc.application.boardController.selection().length) {
      
      var item = WebDoc.application.boardController.selection()[0].item;
      var html = item.getInnerHtml();
      
      // Fill the editor
      this._editor.setCode( html || '' );
      this._editor.reindent();
      
      var noIframe = false;
      if (item.data.data.properties) {
        noIframe = item.property("noIframe");
      }      
      this._noIframeBox.attr("checked", noIframe);
      this._noIframeBox.attr("disabled", "");
    }
    else {
      this._editor.setCode( '' );
      
      this._noIframeBox.attr("checked", false);
      this._noIframeBox.attr("disabled", "true");
    }
  },
  
  updateNoIframe: function(event) {
    ddd("update no iframe");
    var item = WebDoc.application.boardController.selection()[0].item;
    if (item) {
      ddd("update item", item);
      item.setProperty("noIframe", this._noIframeBox.attr("checked"));
      item.setInnerHtml(item.data.data.innerHTML, true);
      item.save();
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
