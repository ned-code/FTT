/**
* @author zeno
*/

//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"

WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";

WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, toolId, paletteId) {
    $super(toolId);
    this.paletteId = paletteId;

    this.textBox = null; //div containing the cleaned HTML

    this.EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'keypress', 'keydown', 'keyup'];
    this.COMMANDS = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent'];

    this.iframeCssPath = "/stylesheets/textbox.css";
    this.defaultTextBoxCss = { // style used on both the textBox div & iframe
      border:"solid 2px #eee",
      width:"400px",
      height:"200px",
      top: "10px",
      left: "10px" 
    };
    
    this.editMode = false;
    this.cleanify = $.fn.webdocHTML.clean;
    this.dirtify = $.fn.webdocHTML.dirty;
  },

  selectTool: function() {
    this.newSelectedTextBox();
  },
  
  newSelectedTextBox: function() {
    //Create model
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_TEXT;
    newItem.data.page_id = WebDoc.application.pageEditor.currentPage.uuid();
    newItem.data.data.tag = "div";
    newItem.data.data.innerHTML = "Some Text";
    newItem.data.data.css = jQuery.extend(this.defaultTextBoxCss, {
      cursor:"default",
      overflow:"hidden"
    });
    
    //Create view
    var newItemView = new WebDoc.TextView(newItem);
    // Select view
    WebDoc.application.boardController.selectItemViews([newItemView]);
    
    // newItem.save();
    // this.textBox = newItemView.domNode;
  },
  
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    // ddd("Text tool: entering edit mode");
    this.textBox = textView.domNode;
    
    // Be sure we switch to text tool
    WebDoc.application.boardController.setCurrentTool(this);
    // Unselect existing selected text box (if necessary)
    WebDoc.application.boardController.unselectItemViews([textView]);
    
    
    //TODO: look if another text box is in edit mode and un... it?
    
    

    // Create iframe element
    $(this.textBox).wrap('<div class="'+WebDoc.TEXTBOX_WRAP_CLASS+'"></div>');
    this.textboxEditor = $(this.textBox).closest('div.'+WebDoc.TEXTBOX_WRAP_CLASS)[0];
    var iframe = $('<iframe class="rte_iframe" />');
    iframe.css(this.defaultTextBoxCss);
    $(this.textBox).hide().before(iframe);
    // $(this.textBox).hide().before('<iframe class="rte_iframe" scrolling="no" />'); //iframe with no scrolling
    this.editableFrame = $(this.textBox).prev('iframe')[0]
    
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
    $(this.doc).find('head').append(ss)

    // this.bindEvents();

    // $(this.doc).find('body').html(dirty($(this.textBox).text())); //.html() is better 'cause it works for non textareas
    $(this.doc).find('body').html(this.dirtify($(this.textBox).html()));
    // $(this.textboxEditor).trigger('ready.rte');
  },

  exitEditMode: function() {
    // this.unbindEvents();
    this.unbindPalette();

    $(this.editableFrame).remove();
    $(this.textBox).unwrap(".textbox_wrap"); //TODO
    $(this.textBox).show();

    this.editMode = false;
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
    }.pBind(this))
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
