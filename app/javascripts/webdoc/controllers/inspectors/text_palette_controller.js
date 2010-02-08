/**
 * @author Julien Bachmann
 */
WebDoc.TextPaletteController = $.klass({
  initialize: function() {
    this.initGUI("palette_text");
  },
  
  initGUI: function(container){
    var containerObj = document.getElementById(container);
    
    $('#toolbar_panel_button_valign').bind('click', function(e){
      var pos = $("#toolbar_panel_button_valign").position();  
        $('#toolbar_panel_valign_block').stop().animate({height: 20}, 500);
        $('#toolbar_panel_valign_block').css('left',pos.left);
      $('#toolbar_panel_valign_block').css('top',pos.top+28);
    });
    
    $('#toolbar_panel_button_valignBottom').bind('click',   function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignBottom");$('#toolbar_panel_valign_block').hide()});
    $('#toolbar_panel_button_valignMiddle').bind('click',   function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignMiddle");$('#toolbar_panel_valign_block').hide()});
    $('#toolbar_panel_button_valignTop').bind('click',    function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignTop");$('#toolbar_panel_valign_block').hide()});
    
    
    $('#colorpickerHolder2').ColorPicker({
        flat: true,
        color: '#000000',
        onSubmit: function(hsb, hex, rgb) {
          $('#colorpickerHolder2').stop().animate({height: 0}, 500);
          $('#toolbar_panel_button_foreColor>div').css('backgroundColor', '#' + hex);
          WebDoc.application.textTool.delegate.editorExec('foreColor','#' + hex);
          
        },
        onHide: function (colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        onChange: function (hsb, hex, rgb) {
          $('#toolbar_panel_button_foreColor>div').css('backgroundColor', '#' + hex);
        }
      });
      $('#colorpickerHolder1').ColorPicker({
        flat: true,
        color: '#000000',
        onSubmit: function(hsb, hex, rgb) {     
          $('#colorpickerHolder1').stop().animate({height: 0}, 500);
          $('#toolbar_panel_button_hiliteColor').css('backgroundColor', '#' + hex);
          WebDoc.application.textTool.delegate.editorExec('hiliteColor','#' + hex); 
          
        },
        onHide: function (colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        onChange: function (hsb, hex, rgb) {
          $('#toolbar_panel_button_hiliteColor').css('backgroundColor', '#' + hex);
        } 
      });
      $('#colorpickerHolder1>div').css('position', 'absolute');
      $('#colorpickerHolder2>div').css('position', 'absolute');
  
      $('#toolbar_panel_button_foreColor_arrow').bind('click', function(e) {
        e.stopPropagation();
            e.cancelBubble = true; 
        var pos = $("#toolbar_panel_button_foreColor").position();  
        $('#colorpickerHolder2').css('left',0);
        $('#colorpickerHolder2').css('top',pos.top+28);
        $('#colorpickerHolder2').stop().animate({height:173}, 500);
        $('#colorpickerHolder1').stop().animate({height:0}, 500);
      });
      $('#toolbar_panel_button_hiliteColor_arrow').bind('click', function(e) {
        e.stopPropagation();
            e.cancelBubble = true; 
        var pos = $("#toolbar_panel_button_hiliteColor").position();  
        $('#colorpickerHolder1').css('left',0);
        $('#colorpickerHolder1').css('top',pos.top+28);
        $('#colorpickerHolder1').stop().animate({height:173}, 500);
        $('#colorpickerHolder2').stop().animate({height:0}, 500);
      });   
  },
  
  refresh: function() {

  }

});