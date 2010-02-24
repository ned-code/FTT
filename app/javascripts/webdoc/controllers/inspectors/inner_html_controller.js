/**
 * @author Julien Bachmann
 */
WebDoc.InnerHtmlController = $.klass({
  initialize: function( selector ) {
    var domNode = $(selector);
    
    //this._htmlEditor.bind("blur", this.applyInnerHtml.pBind(this));
    this._noIframeBox = $("#no_iframe");
    this._noIframeBox.bind("change", this.updateNoIframe.pBind(this));
    
    // CodeMirror must be visible while it is being set up
    var editor = new CodeMirror( domNode.find('.content')[0] , {
        path: '/javascripts/codemirror/',
        parserfile: ['parsexml.js', 'parsecss.js', 'tokenizejavascript.js', 'parsejavascript.js', 'parsehtmlmixed.js'],
        stylesheet: ['/stylesheets/codemirror/xmlcolors.css', '/stylesheets/codemirror/jscolors.css', '/stylesheets/codemirror/csscolors.css'],
        lineNumbers: true,
        indentUnit: 4,
        height: '100%',
        initCallback: function( editor ) {
            // Hide it once this thread has finished
            setTimeout( function(){ domNode.hide(); }, 0 );
        }
    });
    
    this.domNode = domNode;
    this._editor = editor;
  },
  
  refresh: function() {
    if (WebDoc.application.boardController.selection().length) {
      
      var item = WebDoc.application.boardController.selection()[0].item;
      var html = item.getInnerHtml();
      
      this._editor.setCode( html || '' );
      
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
  
  applyInnerHtml: function(e) {
    e.preventDefault();
    var html = this._editor.getCode();
    if (html) {
      if (WebDoc.application.boardController.selection().length > 0) {
        WebDoc.application.boardController.selection()[0].item.setInnerHtml(html);
        this._editor.setCode( WebDoc.application.boardController.selection()[0].item.getInnerHtml() );
      }
    }
  }
});
