/**
* @author zeno
*/

//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"


WebDoc.TextTool = $.klass(WebDoc.Tool, {
  initialize: function($super, toolId, paletteId) {
    $super(toolId);
    this.paletteId = paletteId;

    this.EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'keypress', 'keydown', 'keyup'];
    this.COMMANDS = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent'];

    this.iframeCssPath = "/stylesheets/textbox.css"
    
    this.editMode = false;
    this.cleanify = $.fn.webdocHTML.clean;
    this.dirtify = $.fn.webdocHTML.dirty;
  },

  selectTool: function() {
    this.cleanedBox = $('<div class="text_box">Some Text</div>');
    $('#items').append(this.cleanedBox);
    // $('#wrap').append(this.cleanedBox);
    this.enterEditMode();
  },
  
  enterEditMode: function() { // build markup and setup vars
    // Create iframe element
    $(this.cleanedBox).wrap('<div class="textbox_wrap"></div>');
    this.textboxEditor = $(this.cleanedBox).closest('div.textbox_wrap')[0];
    $(this.cleanedBox).hide().before('<iframe class="rte_iframe" />');
    // $(this.cleanedBox).hide().before('<iframe class="rte_iframe" scrolling="no" />'); //iframe with no scrolling
    this.editableFrame = $(this.cleanedBox).prev('iframe')[0];
    
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
    ddd("setup iFrame for edition")
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

    // $(this.doc).find('body').html(dirty($(this.cleanedBox).text())); //.html() is better 'cause it works for non textareas
    $(this.doc).find('body').html(this.dirtify($(this.cleanedBox).html()));
    // $(this.textboxEditor).trigger('ready.rte');
    
  },

  exitEditMode: function() {
    // ddd("exiting edit mode")

    // this.unbindEvents();
    this.unbindPalette();

    $(this.cleanedBox).removeClass("selected");
    $(this.cleanedBox).show();
    $(this.editableFrame).remove();

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
  //         $(this.cleanedBox).html(htmlContent());
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
