
WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = "Empty content";

WebDoc.TextToolView = $.klass({
  initialize: function(css) {
  
    this.textBox = null; //div containing the cleaned HTML
    this.COMMANDS = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent', 'FontSize', 'ForeColor', 'FontName'];
    this.iframeCssPath = css;
    
    this.editMode = false;
    this.cleanHTML = $.fn.webdocHTML.clean;
    this.dirtifyHTML = $.fn.webdocHTML.dirty;
  },
  
  setEndEditionListener: function(listener) {
    this.listener = listener;
  },
  
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    ddd("Text tool: entering edit mode");
    
    this.textBox = textView;
    
    //TODO: look if another text box is in edit mode and un... it?
    // Be sure we switch to text tool
    // WebDoc.application.boardController.setCurrentTool(this);
    
    // Create iframe element and wrap both the textBox and iframe in a div, if not exist
    if (!$(this.textBox).closest('div.' + WebDoc.TEXTBOX_WRAP_CLASS)[0]) {
      $(this.textBox).wrap('<div class="' + WebDoc.TEXTBOX_WRAP_CLASS + '"></div>');
      this.textboxEditor = $(this.textBox).closest('div.' + WebDoc.TEXTBOX_WRAP_CLASS)[0];
      $(this.textboxEditor).css({ //adjust textBox wrapper position and size to match those of the textBox
        position: textView.css("position"),
        top: this.textBox.css("top"),
        left: this.textBox.css("left"),
        width: this.textBox.css("width"),
        height: this.textBox.css("height"),
        zIndex: 1000010
      });
      
      var iframe = $('<iframe class="textbox_iframe item_edited" scrolling="auto" />');
      iframe.css({
        width: "100%",
        height: "100%"
      });
      iframe.get(0).showcaret = true;
      $(this.textBox).hide().before(iframe);
      this.editableFrame = $(this.textBox).prev('iframe')[0];
      
      // Setup iFrame for edition
      $(this.editableFrame).one('load', function() { // complete initialization once the iframe loads
        this._setupEditableFrame();
        
      }.pBind(this));
      if (MTools.Browser.WebKit) { // iframe onload never fires in webkit; this is a fallback
        setTimeout(function() {
          if (!this.editMode) {
            this._setupEditableFrame();
          }
        }.pBind(this), 100);
      }
    }
  },
  
  exitEditMode: function() {
    ddd("exit edit");
    
    var content;
    
    if (this._isHtmlBlank(this.doc.body.innerHTML)) {
      $(this.textBox).html(WebDoc.NEW_TEXTBOX_CONTENT);
      $(this.textBox).addClass("empty");
      content = "";
    }
    else {
      // copy cleaned HTML to textBox and save updated item
      content = this.cleanHTML(this.doc.body.innerHTML);
      $(this.textBox).html(content);
    }
    this._applyTextContent(content, $(this.textBox).attr("class")); // save and register undo
    // check is edit mode on
    if ($(this.textBox).closest('div.' + WebDoc.TEXTBOX_WRAP_CLASS)[0]) {
      
      $(this.editableFrame).remove();
      $(this.textBox).unwrap(".textbox_wrap");
      $(this.textBox).show();
      
      this.editMode = false;
    }
    return content;
  },
  
  editorExec: function(command, optional) {
    optional = optional || null;
    this.editableFrame.contentWindow.document.execCommand(command, false, optional);
  },
  
  
  _setupEditableFrame: function() {
    //ddd("setup iFrame for edition")
    this.editMode = true;
    
    //this.doc is the iframe's document object
    this.doc = this.editableFrame.contentDocument || this.editableFrame.contentWindow.document;
    this.doc.designMode = 'on';
    
    this.doc.execCommand("styleWithCSS", '', false);
    
    //inject global stylesheet into iframe's head
    if (this.iframeCssPath) {
      var ss = $('<link rel="stylesheet" href="' + this.iframeCssPath + '" type="text/css" media="screen" />');
    }
    $(this.doc).find('head').append(ss);
    
    var iframeContent;
    if ($(this.textBox).hasClass("empty")) {
      $(this.textBox).removeClass("empty");
      iframeContent = "";
    }
    else {
      iframeContent = this.dirtifyHTML($(this.textBox).html());
    }
    $(this.doc.body).html(iframeContent);
    
    $(this.doc.body).css({
      fontSize: $(this.textBox).css("fontSize"),
      fontFamily: $(this.textBox).css("fontFamily"),
      fontStyle: $(this.textBox).css("fontStyle"),
      color: $(this.textBox).css("color")
    });
    
    //$(this.doc.body).css();
    // Firefox starts "locked", so insert a character bogus character and undo
    if (MTools.Browser.Gecko) {
      this.doc.execCommand('undo', false, null);
    }
    
    //focusing iframe
    setTimeout(function() {
      this.editableFrame.contentWindow.focus();
    }.pBind(this), 100);
  },
    
  _applyTextContent: function(content, classValue) {
    ddd("apply content", content, classValue);
    if (this.listener) {
      this.listener.applyTextContent(content, classValue);
    }
  },
  
  _isHtmlBlank: function(html) {
    // return $.string(html).strip().stripTags().gsub(/\&nbsp;/,'').gsub(/\s/,'').str === "";
    return $.string(html).strip().stripTags().gsub(/\&nbsp;/, '').blank();
  }
  
});
