/**
* @author zeno
*/

//= require "tool"
//= require "text_tool/html"
//= require "text_tool/selection"

WebDoc.TextTool= $.klass(WebDoc.Tool, {
 initialize: function($super, toolId, paletteId) {
   $super(toolId);
   this.delegate = new WebDoc.TextToolDelegate(paletteId? paletteId:"#palette_text", "/stylesheets/textbox.css");
   this.delegate.setEndEditionListener(this);
   this.textboxCss = {
     cursor:"default",
     width:"400px",
     height:"200px",
     overflow:"hidden"      
   };
 },
 
 selectTool: function() {
    WebDoc.application.boardController.unselectAll();  
    this.newTextBox();
    WebDoc.application.boardController.setCurrentTool(WebDoc.application.arrowTool);
    $("#inspector").accordion( 'activate',1);
  },
  
  newTextBox: function() {
    //Create model
    var newItem = new WebDoc.Item();
    newItem.data.media_type = WebDoc.ITEM_TYPE_TEXT;
    newItem.data.data.tag = "div";
    newItem.data.data['class'] = "textbox empty";
    newItem.data.data.innerHTML = "";
    newItem.data.data.css = this.textboxCss;
    newItem.recomputeInternalSizeAndPosition(); 
    //Create view
    WebDoc.application.boardController.insertItems([newItem]);   
    // Select view
    // WebDoc.application.boardController.selectItemViews([newItemView]);
    
    // newItem.save();
  },
  
  enterEditMode: function(textView) { //can be called on existing (selected) textView
    ddd("Text tool: entering edit mode");
    // Unselect existing selected text box (if necessary)
    if (this.textView && textView != this.textView) {
      WebDoc.application.boardController.unselectItemViews([this.textView]);
    }    
    this.textView = textView;
    this.delegate.enterEditMode(textView.domNode);
  },
  
  exitEditMode: function() {
    this.delegate.exitEditMode();
  },  
  
  _applyTextContent: function(content, classValue) {
    var previousContent = this.textView.item.data.data.innerHTML;
    var previousClass = this.textView.item.data.data['class'];
    this.textView.item.data.data.innerHTML = content;
    this.textView.item.data.data['class'] = classValue;
    this.textView.item.fireInnerHtmlChanged();
    this.textView.item.save();
    WebDoc.application.undoManager.registerUndo(function(){
      this._applyTextContent(previousContent, previousClass);
    }.pBind(this));
  }
});

WebDoc.TEXTBOX_WRAP_CLASS = "textbox_wrap";
WebDoc.NEW_TEXTBOX_CONTENT = "Empty content";

WebDoc.TextToolDelegate = $.klass({
  initialize: function(paletteId, css) {
    this.paletteId = paletteId;
    
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
	if(!$(this.textBox).closest('div.'+WebDoc.TEXTBOX_WRAP_CLASS)[0]) 
	{
		$(this.textBox).wrap('<div class="'+WebDoc.TEXTBOX_WRAP_CLASS+'"></div>');
		this.textboxEditor = $(this.textBox).closest('div.'+WebDoc.TEXTBOX_WRAP_CLASS)[0];
		$(this.textboxEditor).css({ //adjust textBox wrapper position and size to match those of the textBox
		  position: textView.css("position"),
		  top: this.textBox.css("top"),
		  left: this.textBox.css("left"),
		  width: this.textBox.css("width"),
		  height: this.textBox.css("height"),
		  zIndex:1000010
		});
		
		var iframe = $('<iframe class="textbox_iframe item_edited" scrolling="auto" />');
		iframe.css({width:"100%", height:"100%"});
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
	}
  },
  
  setupEditableFrame: function() {
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
    setTimeout(function(){
      this.editableFrame.contentWindow.focus();
    }.pBind(this), 100);
  },

  exitEditMode: function() {
    ddd("exit edit");
	
	var content;
	
	if (this.isHtmlBlank(this.doc.body.innerHTML)) {
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
    if($(this.textBox).closest('div.'+WebDoc.TEXTBOX_WRAP_CLASS)[0]) 
	{
		this.unbindPalette();
		
		$(this.editableFrame).remove();
		$(this.textBox).unwrap(".textbox_wrap");
		$(this.textBox).show();
		
		this.editMode = false;
	}
	return content;
  },
  
  _applyTextContent: function(content, classValue) {
    ddd("apply content",content, classValue);
    if (this.listener) {
      this.listener._applyTextContent(content, classValue);
    }
  },
  
  isHtmlBlank: function(html) {
    // return $.string(html).strip().stripTags().gsub(/\&nbsp;/,'').gsub(/\s/,'').str === "";
    return $.string(html).strip().stripTags().gsub(/\&nbsp;/,'').blank();
  },

  bindPalette: function() { 
    this.paletteEl = $(this.paletteId);
    this.paletteOverlayEl = this.paletteEl.find("#palette_overlay");

    // events handler for palette clicks
    this.paletteEl.bind("click", function(event) {
      var link = $(event.target).closest('a')[0];
      if (link) {
        event.preventDefault();
        // ddd("triggering "+link.className+'.click.rte')
        $(this.textboxEditor).trigger(link.className+'.click.rte');
      }
    }.pBind(this));
	
	// events handler for palette selects change
    this.paletteEl.bind("change", function(event) {
      var select = $(event.target).closest('select')[0];
      if (select&&($(select).val() != 'default')) {
        event.preventDefault();
        $(this.textboxEditor).trigger(select.className+'.click.rte');
		$(select).find('option:first').attr('selected', 'selected');
      }
    }.pBind(this));

    this.paletteOverlayEl.hide(); 
    this.paletteEl.removeClass("disabled");

    // Binding palette buttons
    $.each(this.COMMANDS, function(index, command) {
      $(this.textboxEditor).bind(command+'.click.rte', function(event) {
		optional = ($('.'+command).val())? $('.'+command).val() : null;
        this.editorExec(command, optional);
      }.pBind(this));
    }.pBind(this));
  },

  unbindPalette: function() { 
    this.paletteOverlayEl.show(); 
    this.paletteEl.addClass("disabled");
    this.paletteEl.unbind();

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
