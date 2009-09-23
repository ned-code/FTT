/**
 * @author zeno
 */

//= require "tool"

WebDoc.TextTool = $.klass(WebDoc.Tool, 
{
    initialize: function($super, toolId) {
      $super(toolId);
    },
    selectTool: function() {
      //create empty Text Box
      var textBox = $('<div class="text_box">Some Text</div>');
      $('#items').append(textBox);
      textBox.toupee({});
    }
});


var $$ = function(param) {
  var node = jQuery(param)[0];
  var id = jQuery.data(node);
  jQuery.cache[id] = jQuery.cache[id] || {};
  jQuery.cache[id].node = node;
  return jQuery.cache[id];
};

(function($) {
  var createEditor = function(element, options) {
    return function(){
      
      // 'constants'
      var EVENTS = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout', 'keypress', 'keydown', 'keyup'];
      
      var COMMANDS = ['bold', 'italic', 'underline', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList', 'indent', 'outdent'];
      
      // private variables
      var editor, win, doc, textarea, toolbar, buttons, editableFrame, initialized, widget;
      
      // methods
      var bindEvents, unbindEvents, bindToolbar, unbindToolbar, buildWidget, buildButton, bind, exec, htmlContent, initialize, destroy, run, selection, range, clean, dirty, textContent;
      
      // init
      editor = {};
      
      textarea = element;
      buttons = [];
      initialized = false;
      options = options || {};
      clean = options['clean'] || $.fn.toupee.html.clean;
      dirty = options['dirty'] || $.fn.toupee.html.dirty;
      
      bindEvents = function() {
        var previousContent;
        
        $.each(EVENTS, function(index, eventName) {
          $(doc).bind(eventName, function(event) {
            if (htmlContent() != previousContent) {
              $(widget).trigger('change.toupee', [editor]);
              
              // ==========
              // auto-adjust height
              // $("iframe")[0].style.height = $("iframe")[0].contentWindow.document.body.offsetHeight + 'px';
              // ==========
              
              // This may be a performance issue
              $(textarea).html(htmlContent());
              
              previousContent = editor.htmlContent();
            }
          });
        });
        
        // //usage: $($$('textarea').editor.widget()).trigger('insert.toupee', ['<span>some html</span>']);
        // bind('insert.toupee', function(event, html) {
        //   // According to Mozilla's docs, IE does not support insertHTML
        //   exec('insertHTML', html);
        // });
      };
      
      unbindEvents = function() {
        $.each(EVENTS, function(index, eventName) {
          $(doc).unbind(eventName); //all bound events of type "eventName" are removed
        });
      };
      
      bindToolbar = function() { 
        toolbar = $("#text_palette")[0];
        
        // events handler for toolbar clicks
        $(toolbar).click(function(event) {
          event.preventDefault();
          var link = $(event.target).closest('a')[0];
          if (link) {
            $(widget).trigger(link.className+'.click.toupee');
            link.blur();
            // return false;
          }
        });
        
        $("#toolbar_overlay").hide(); 
        $(toolbar).removeClass("disabled");
        
        // Binding toolbar buttons
        $.each(COMMANDS, function(index, command) {
          $(widget).bind(command+'.click.toupee', function(event) {
            // ddd("clicked "+command+" tool")
            editor.exec(command);
          });
        });
      }
      
      unbindToolbar = function() { 
        $("#toolbar_overlay").show(); 
        $(toolbar).addClass("disabled");
        
        // Unbinding toolbar buttons
        $.each(COMMANDS, function(index, command) {
          $(widget).unbind(command+'.click.toupee');
        });
      }
      
      buildWidget = function() { // build markup and setup vars
        
        $(textarea).wrap('<div class="textbox_editor"></div>');
        widget = $(textarea).closest('div.textbox_editor')[0];
        
        // $(widget).prepend('<ul class="toupee-toolbar"></ul>');
        // toolbar = $(widget).children('ul.toupee-toolbar')[0];
        bindToolbar();
        
        $(textarea).hide().before('<iframe class="toupee_iframe" />');
        // $(textarea).hide().before('<iframe class="toupee_iframe" scrolling="no" />'); //iframe with no scrolling
        editableFrame = $(textarea).prev('iframe')[0];
        
        // complete initialization once the iframe loads
        $(editableFrame).one('load', function() {
          initialize();
        });
        // iframe onload never fires in webkit; this is a fallback
        if ($.fn.toupee.browser.webkit) {
          setTimeout(function() { if (!initialized) { initialize(); } }, 100);
        }
      };
      
      initialize = function() {
        ddd("initializing edit mode")
        initialized = true;
        
        doc = editableFrame.contentDocument || editableFrame.contentWindow.document;
        if (editableFrame.contentDocument) {
          win = editableFrame.contentDocument.defaultView;
        } else if (editableFrame.contentWindow.document) {
          win = editableFrame.contentWindow;
        }
        doc.designMode = 'on';
        
        doc.execCommand("styleWithCSS", '', false);
        
        //inject global stylesheet into iframe's head
        var ss = $('<link rel="stylesheet" href="example.css" type="text/css" media="screen" />');
        $(doc).find('head').append(ss)
        
        bindEvents();
        
        // $(doc).find('body').html(dirty($(textarea).text())); //.html() is better 'cause it works for non textareas
        $(doc).find('body').html(dirty($(textarea).html()));
        $(widget).trigger('ready.toupee');
      };
      
      // let's go
      buildWidget();
      
      buildButton = function(name, options) {
        options = options || {};
        var event = options.event || name;
        buttons.push({name: name, event: event});
        $(toolbar).append('<li><a href="#" class="' + name + '"><span>' + name + '</span></a></li>');
        return editor;
      };
      editor.buildButton = buildButton;
      
      bind = function(eventName, method) {
        $(widget).bind(eventName, method);
      };
      editor.bind = bind;
      
      exec = function(command, optional) {
        optional = optional || null;
        editableFrame.contentWindow.document.execCommand(command, false, optional);
      };
      editor.exec = exec;
      
      htmlContent = function() {
        return clean(doc.body.innerHTML);
      };
      editor.htmlContent = htmlContent;
      
      selection = function() {
        return win.getSelection ? win.getSelection() : doc.selection;
      };
      editor.selection = selection;
      
      range = function() {
      
      };
      editor.range = range;
      
      run = function() {
        $.each(arguments, function(index, method) {
          try {
            method.call(editor);
          } catch(e) {
            console.error('Invalid value passed to editor.run(): ', method);
          }
        });
      };
      editor.run = run;
      
      destroy = function() {
        // ddd("exiting edit mode")
        
        // initialized = false;
        unbindEvents();
        unbindToolbar();
        
        $(textarea).removeClass("selected");
        $(textarea).show();
        $(editableFrame).remove();
      };
      editor.destroy = destroy;
      
      editor.widget = function() { return widget; };
      editor.editableFrame = function() { return editableFrame; };
      
      return editor;
    }();
  };

  // initialize
  $.fn.toupee = function(options) {
    var args = arguments;
    this.each(function(index) {
      var editor = createEditor(this, options);
      $$(this).editor = editor;
    });
    return $$(this[0]).editor;
  };
})(jQuery);

//= require "text_tool/html"
//= require "text_tool/selection"
//= require "text_tool/browser"
