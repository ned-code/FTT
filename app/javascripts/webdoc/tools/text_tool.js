/**
* @author zeno
*/

//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"

WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = "Double-click to edit";

WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, toolId, paletteId) {
    $super(toolId);
    this.paletteId = paletteId;

    this.textBox = null; //div containing the cleaned HTML

    this.EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'keypress', 'keydown', 'keyup'];
    this.COMMANDS = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent'];

    this.iframeCssPath = "/stylesheets/textbox.css";
   
    this.defaultTextboxCss = { // style used on both the textBox div & iframe
      // borderColor:"transparent",
      width:"400px",
      height:"200px",
      overflow:"hidden"
    };
    jQuery.extend(this.textboxCss = {}, this.defaultTextboxCss, {
      cursor:"default"
    }); 
    jQuery.extend(this.iframeCss = {}, this.defaultTextboxCss, {
      // borderColor:"red",
      width:"100%",
      height:"100%"
    });
    
    this.editMode = false;
    this.cleanHTML = $.fn.webdocHTML.clean;
    this.dirtifyHTML = $.fn.webdocHTML.dirty;
  },

  selectTool: function() {
    this.newTextBox();
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
  },
  
  newTextBox: function() {
    //Create model
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_TEXT;
    newItem.data.data.tag = "div";
    newItem.data.data['class'] = "textbox empty";
    newItem.data.data.innerHTML = WebDoc.NEW_TEXTBOX_CONTENT;
    newItem.data.data.css = this.textboxCss;
    newItem.recomputeInternalSizeAndPosition(); 
    //Create view
    WebDoc.application.boardController.insertItems([newItem]);   
    // Select view
    // WebDoc.application.boardController.selectItemViews([newItemView]);
    
    // newItem.save();
  },
    
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    //ddd("Text tool: entering edit mode");
    // Unselect existing selected text box (if necessary)
    if (this.textView && textView != this.textView)
      WebDoc.application.boardController.unselectItemViews([this.textView]);
    
    this.textView = textView;
    this.textBox = textView.domNode;
    

    
    //TODO: look if another text box is in edit mode and un... it?
    // Be sure we switch to text tool
    // WebDoc.application.boardController.setCurrentTool(this);
    
    // Create iframe element and wrap both the textBox and iframe in a div
    $(this.textBox).wrap('<div class="'+WebDoc.TEXTBOX_WRAP_CLASS+'"></div>');
    this.textboxEditor = $(this.textBox).closest('div.'+WebDoc.TEXTBOX_WRAP_CLASS)[0];
    $(this.textboxEditor).css({ //adjust textBox wrapper position and size to match those of the textBox
      position: "absolute",
      top: this.textBox.css("top"),
      left: this.textBox.css("left"),
      width: this.textBox.css("width"),
      height: this.textBox.css("height"),
      zIndex:1000010
    });
    
    var iframe = $('<iframe class="textbox_iframe" scrolling="no" />');
    iframe.css(this.iframeCss);
    iframe.get(0).showcaret = true;
    $(this.textBox).hide().before(iframe);
    this.editableFrame = $(this.textBox).prev('iframe')[0];
    
    // Activate palette
    this.bindPalette();
    
    // Setup iFrame for edition
    $(this.editableFrame).one('load', function() { // complete initialization once the iframe loads
      this.setupEditableFrame();
      
    }.pBind(this));
    if (MTools.Browser.WebKit) { // iframe onload never fires in webkit; this is a fallback
      setTimeout(function() {
        if (!this.editMode) { this.setupEditableFrame(); }
      }.pBind(this), 100);
    }
  },
  
  setupEditableFrame: function() {
    //ddd("setup iFrame for edition")
    this.editMode = true;

    //this.doc is the iframe's document object
    this.doc = this.editableFrame.contentDocument || this.editableFrame.contentWindow.document;
    if (this.editableFrame.contentDocument) {
      this.win = this.editableFrame.contentDocument.defaultView;
    }
    else if (this.editableFrame.contentWindow.document) {
      this.win = this.editableFrame.contentWindow;
    }
    this.doc.designMode = 'on';

    this.doc.execCommand("styleWithCSS", '', false);

    //inject global stylesheet into iframe's head
    var ss = $('<link rel="stylesheet" href="'+this.iframeCssPath+'" type="text/css" media="screen" />');
    $(this.doc).find('head').append(ss);

    // this.bindEvents();
    
    var iframeContent;
    if ($(this.textBox).hasClass("empty")) {
      iframeContent = "";
      $(this.textBox).removeClass("empty");
    }
    else {
      iframeContent = this.dirtifyHTML($(this.textBox).html());
    }
    $(this.doc.body).html(iframeContent);

    $(this.doc.body).css( {
      fontSize: $(this.textBox).css("fontSize"),
      fontFamily: $(this.textBox).css("fontFamily"),
      fontStyle: $(this.textBox).css("fontStyle"),      
      color: $(this.textBox).css("color"),
    });
    //$(this.doc.body).css();
    // Firefox starts "locked", so insert a character bogus character and undo
    if (MTools.Browser.Gecko) {
      this.doc.execCommand('undo', false, null);
    }
    
    var that = this;
    //focusing iframe
    
    setTimeout(function(){
      ddd(that.editableFrame);  
      that.editableFrame.focus();
    }, 100);
    
    // this.doc.focus();
  },

  exitEditMode: function() {
    // this.unbindEvents();
    this.unbindPalette();

    if (this.isHtmlBlank(this.doc.body.innerHTML)) {
      $(this.textBox).html(WebDoc.NEW_TEXTBOX_CONTENT);
      $(this.textBox).addClass("empty");
      this.textView.item.data.data.innerHTML = WebDoc.NEW_TEXTBOX_CONTENT;
    }
    else {
      // copy cleaned HTML to textBox and save updated item
      var cleanedHtml = this.cleanHTML(this.doc.body.innerHTML);
      $(this.textBox).html(cleanedHtml);
      this.textView.item.data.data.innerHTML = cleanedHtml;
      this.textView.item.data.data['class'] = "textbox"; //removing "empty" class
    }
    this.textView.item.save();
    
    
    $(this.editableFrame).remove();
    $(this.textBox).unwrap(".textbox_wrap");
    $(this.textBox).show();
    
    this.editMode = false;
  },
  
  isHtmlBlank: function(html) {
    // return $.string(html).strip().stripTags().gsub(/\&nbsp;/,'').gsub(/\s/,'').str === "";
    return $.string(html).strip().stripTags().gsub(/\&nbsp;/,'').blank();
  },
  

  // bindEvents: function() {
  //   var previousContent;
  // 
  //   $.each(this.EVENTS, function(index, eventName) {
  //     $(this.doc).bind(eventName, function(event) {
  //       if (this.editorHtmlContent() != previousContent) {
  //         $(this.textboxEditor).trigger('change.rte', [this.editor]);
  // 
  //         // ==========
  //         // auto-adjust height
  //         // $("iframe")[0].style.height = $("iframe")[0].contentWindow.document.body.offsetHeight + 'px';
  //         // ==========
  // 
  //         // This may be a performance issue
  //         $(this.textBox).html(htmlContent());
  // 
  //         previousContent = this.editor.htmlContent();
  //       }
  //     });
  //   });
  // },
  // 
  // unbindEvents: function() {
  //   $.each(this.EVENTS, function(index, eventName) {
  //     $(this.doc).unbind(eventName); //all bound events of type "eventName" are removed
  //   });
  // },
      
  bindPalette: function() { 
    this.paletteEl = $(this.paletteId);
    this.paletteOverlayEl = this.paletteEl.find(".palette_overlay");

    // events handler for palette clicks
    this.paletteEl.click(function(event) {
      var link = $(event.target).closest('a')[0];
      if (link) {
        event.preventDefault();
        // ddd("triggering "+link.className+'.click.rte')
        $(this.textboxEditor).trigger(link.className+'.click.rte');
      }
    }.pBind(this));

    this.paletteOverlayEl.hide(); 
    this.paletteEl.removeClass("disabled");

    // Binding palette buttons
    $.each(this.COMMANDS, function(index, command) {
      $(this.textboxEditor).bind(command+'.click.rte', function(event) {
        this.editorExec(command);
      }.pBind(this));
    }.pBind(this));
  },

  unbindPalette: function() { 
    this.paletteOverlayEl.show(); 
    this.paletteEl.addClass("disabled");

    // Unbinding palette buttons
    $.each(this.COMMANDS, function(index, command) {
      $(this.textboxEditor).unbind(command+'.click.rte');
    }.pBind(this));
  },

  editorExec: function(command, optional) {
    optional = optional || null;
    this.editableFrame.contentWindow.document.execCommand(command, false, optional);
  }

});
