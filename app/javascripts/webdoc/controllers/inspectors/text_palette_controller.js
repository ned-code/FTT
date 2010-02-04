/**
 * @author Julien Bachmann
 */
WebDoc.TextPaletteController = $.klass({
  initialize: function() {
    this.initGUI("palette_text");
  },
  
  initGUI: function(container){
    var containerObj = document.getElementById(container);
    var toolbarContent = 
    '<div id="toolbar_panel">'+
        '<div id="toolbar_panel_cover"></div>'+
        '<div id="colorpickerHolder1" style="position:absolute;z-index: 150000;top:50px;"></div>'+
          '<div id="colorpickerHolder2" style="position:absolute;z-index: 150000;top:50px;"></div>'+
        '<select id="toolbar_panel_button_format" onchange="EditorToolbar.editorExec(\'format\',this.value);">'+
          '<option value="p">Normal</option>'+
          '<option value="h1">Heading 1</option>'+
          '<option value="h2">Heading 2</option>'+
          '<option value="h3">Heading 3</option>'+
          '<option value="h4">Heading 4</option>'+
          '<option value="h5">Heading 5</option>'+
          '<option value="h6">Heading 6</option>'+
        '</select>'+      
        '<select id="toolbar_panel_button_fontName" onchange="WebDoc.application.textTool.delegate.editorExec(\'fontName\',this.value);">'+
          '<option value="Times New Roman">Times New Roman</option>'+
          '<option value="Arial">Arial</option>'+
          '<option value="Tahoma">Tahoma</option>'+
          '<option value="Comic Sans MS">Comic Sans MS</option>'+
          '<option value="Courier New">Courier New</option>'+
          '<option value="Trebuchet MS">Trebuchet MS</option>'+
          '<option value="Verdana">Verdana</option>'+
          '<option value="serif">Serif</option>'+
        '</select>'+
        '<select id="toolbar_panel_button_fontSize" onchange="WebDoc.application.textTool.delegate.editorExec(\'fontSize\',this.value);">'+
          '<option value="8pt"> 8 pt</option>'+
          '<option value="10pt">  10 pt</option>'+
          '<option value="12pt">  12 pt</option>'+
          '<option value="14pt">  14 pt</option>'+
          '<option value="18pt">  18 pt</option>'+
          '<option value="24pt">  24 pt</option>'+
          '<option value="36pt">  36 pt</option>'+
          '<option value="50pt">  50 pt</option>'+
        '</select>'+ 
        '<a href="javascript:void(0);" title="Bold" id="toolbar_panel_button_bold"    onclick="WebDoc.application.textTool.delegate.editorExec(\'bold\');">          <div class="icon_bold"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_italic"        onclick="WebDoc.application.textTool.delegate.editorExec(\'italic\');">        <div class="icon_italic"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_underline"       onclick="WebDoc.application.textTool.delegate.editorExec(\'underline\');">     <div class="icon_underline"></div></a>'+      
        
        '<a href="javascript:void(0);"  id="toolbar_panel_button_foreColor"       onclick="WebDoc.application.textTool.delegate.editorExec(\'foreColor\',this.firstChild.style.backgroundColor);"  ><div class="icon_foreColor"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_foreColor_arrow"                                         ><div class="icon_foreColor_arrow"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_hiliteColor"     onclick="WebDoc.application.textTool.delegate.editorExec(\'hiliteColor\',this.style.backgroundColor);"><div class="icon_hiliteColor"></div></a>'+ 
        '<a href="javascript:void(0);"  id="toolbar_panel_button_hiliteColor_arrow"                                         ><div class="icon_hiliteColor_arrow"></div></a>'+
        
        '<a href="javascript:void(0);"  id="toolbar_panel_button_insertOrderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertOrderedList\');"> <div class="icon_insertOrderedList"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_insertUnorderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertUnorderedList\');"> <div class="icon_insertUnorderedList"></div></a>'+      
        '<a href="javascript:void(0);"  id="toolbar_panel_button_indent"          onclick="WebDoc.application.textTool.delegate.editorExec(\'indent\');">        <div class="icon_indent"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_outdent"       onclick="WebDoc.application.textTool.delegate.editorExec(\'outdent\');">       <div class="icon_outdent"></div></a>'+      
        '<a href="javascript:void(0);"  id="toolbar_panel_button_justifyLeft"     onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyLeft\');">     <div class="icon_justifyLeft"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_justifyCenter"     onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyCenter\');">   <div class="icon_justifyCenter"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_justifyRight"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyRight\');">      <div class="icon_justifyRight"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_justifyFull"     onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyFull\');">     <div class="icon_justifyFull"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_superScript"     onclick="WebDoc.application.textTool.delegate.editorExec(\'superScript\');">     <div class="icon_superScript"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_subScript"       onclick="WebDoc.application.textTool.delegate.editorExec(\'subScript\');">     <div class="icon_subScript"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_removeFormat"      onclick="WebDoc.application.textTool.delegate.editorExec(\'removeformat\');">      <div class="icon_removeFormat"></div></a>'+
        '<div style="clear: both;"></div>'+
    '</div>';
    containerObj.innerHTML = toolbarContent;
    $('#colorpickerHolder2').ColorPicker({
        flat: true,
        color: '#000000',
        onSubmit: function(hsb, hex, rgb) {
          $('#toolbar_panel_button_foreColor>div').css('backgroundColor', '#' + hex);
          WebDoc.application.textTool.delegate.editorExec('foreColor','#' + hex);
          $('#colorpickerHolder2').stop().animate({height: 0}, 500);
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
          $('#toolbar_panel_button_hiliteColor').css('backgroundColor', '#' + hex);
          WebDoc.application.textTool.delegate.editorExec('hiliteColor','#' + hex);
          $('#colorpickerHolder1').stop().animate({height: 0}, 500);
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
        $('#colorpickerHolder2').css('left',pos.left);
        $('#colorpickerHolder2').css('top',pos.top+28);
        $('#colorpickerHolder2').stop().animate({height:173}, 500);
        $('#colorpickerHolder1').stop().animate({height:0}, 500);
      });
      $('#toolbar_panel_button_hiliteColor_arrow').bind('click', function(e) {
        e.stopPropagation();
            e.cancelBubble = true; 
        var pos = $("#toolbar_panel_button_hiliteColor").position();  
        $('#colorpickerHolder1').css('left',pos.left);
        $('#colorpickerHolder1').css('top',pos.top+28);
        $('#colorpickerHolder1').stop().animate({height:173}, 500);
        $('#colorpickerHolder2').stop().animate({height:0}, 500);
      });             
  },
  
  refresh: function() {

  }

});