var widgetIframe;

$(document).ready(function() {
    
    $('.title.editable').editable('http://www.example.com/save.php', { 
        type      : 'autogrow',
        cancel    : '<button class="cancel"><span>Cancel</span></button>',
        submit    : '<button class="ok"><span>OK</span></button>',
        indicator : 'Saving...',
        tooltip   : 'Click to edit...',
        onblur    : 'ignore',
        onreset   : function(){
          removeEditingClass($(this));
        },
        onsubmit  : function(){
          removeEditingClass($(this));
        },
        autogrow  : { lineHeight : 30 }
    });
    
    $('.answer.editable').editable('http://www.example.com/save.php', { 
        type      : 'autogrow',
        cancel    : '<button class="cancel"><span>Cancel</span></button>',
        submit    : '<button class="ok"><span>OK</span></button>',
        indicator : 'Saving...',
        tooltip   : 'Click to edit...',
        onblur    : 'ignore',
        onreset   : function(){
          removeEditingClass($(this));
        },
        onsubmit  : function(){
          removeEditingClass($(this));
        },
        autogrow  : { lineHeight : 22 }
    });
    
    $('.editable').click(function(event){
      $(this).addClass('editing');
      $(this).parent('.entry').find('.actions').hide();
    });
    
    $('.actions a.delete').click(function(event){
      $(this).closest('.entry').remove();
      event.preventDefault();
    });
    
    $('.actions a.add').click(function(event){
      event.preventDefault();
    });
    
    // setInterval(heightResize, 100);
    // widgetIframe = $(parent.document).find("#widget");
});

function heightResize(){
  var widgetHeight = $('.widget').height();
  var widgetIframeHeight = widgetIframe.height();
  widgetIframe.removeAttr("height").css({ height: widgetHeight+20 });
}

function removeEditingClass(element){
  element.closest('.editing').removeClass('editing');
  element.closest('.entry').find('.actions').show();
}