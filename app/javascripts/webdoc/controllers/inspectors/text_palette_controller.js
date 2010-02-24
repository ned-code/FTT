/**
 * @author Julien Bachmann
 */
WebDoc.TextPaletteController = $.klass({
  initialize: function() {
    this.initGUI("palette_text");
    WebDoc.application.paletteController = {delegate: this};
  },
  initGUI: function(container){
    var thobj = this;
    var containerObj = document.getElementById(container);
    var toolbarContent = 
    '<div id="toolbar_panel">'+
        '<div id="colorpickerHolder1" style="position:absolute;z-index: 150000;top:50px;"></div>'+
          '<div id="colorpickerHolder2" style="position:absolute;z-index: 150000;top:50px;"></div>'+
        '<select id="toolbar_panel_button_format" onchange="WebDoc.application.textTool.delegate.editorExec(\'format\',this.value);">'+
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
          '<option value="3pt"> 3 pt</option>'+
          '<option value="4pt"> 4 pt</option>'+
          '<option value="5pt"> 5 pt</option>'+
          '<option value="6pt"> 6 pt</option>'+
          '<option value="7pt"> 7 pt</option>'+
          '<option value="8pt"> 8 pt</option>'+
          '<option value="9pt"> 9 pt</option>'+
          '<option value="10pt">  10 pt</option>'+
          '<option value="11pt">  11 pt</option>'+
          '<option value="12pt">  12 pt</option>'+
          '<option value="13pt">  13 pt</option>'+
          '<option value="14pt">  14 pt</option>'+
          '<option value="15pt">  15 pt</option>'+
          '<option value="16pt">  16 pt</option>'+
          '<option value="17pt">  17 pt</option>'+
          '<option value="18pt">  18 pt</option>'+
          '<option value="19pt">  19 pt</option>'+
          '<option value="20pt">  20 pt</option>'+
          '<option value="22pt">  22 pt</option>'+
          '<option value="24pt">  24 pt</option>'+
          '<option value="26pt">  26 pt</option>'+
          '<option value="28pt">  28 pt</option>'+
          '<option value="30pt">  30 pt</option>'+
          '<option value="32pt">  32 pt</option>'+
          '<option value="34pt">  34 pt</option>'+
          '<option value="36pt">  36 pt</option>'+
          '<option value="38pt">  38 pt</option>'+
          '<option value="40pt">  40 pt</option>'+          
          '<option value="42pt">  42 pt</option>'+
          '<option value="45pt">  45 pt</option>'+
          '<option value="48pt">  48 pt</option>'+
        '</select>'+ 
        
        '<a href="javascript:void(0);" title="Decrease font size" id="toolbar_panel_button_decreasefontsize"    onclick="WebDoc.application.textTool.delegate.editorExec(\'decreasefontsize\');">         <div class="icon_decreasefontsize"></div></a>'+
        '<a href="javascript:void(0);" title="Increase font size" id="toolbar_panel_button_increasefontsize"    onclick="WebDoc.application.textTool.delegate.editorExec(\'increasefontsize\');">         <div class="icon_increasefontsize"></div></a>'+
        
        
        '<a href="javascript:void(0);"  title="Bold"  id="toolbar_panel_button_bold"    onclick="WebDoc.application.textTool.delegate.editorExec(\'bold\');">         <div class="icon_bold"></div></a>'+
        '<a href="javascript:void(0);"  title="Italic" id="toolbar_panel_button_italic"       onclick="WebDoc.application.textTool.delegate.editorExec(\'italic\');">       <div class="icon_italic"></div></a>'+
        '<a href="javascript:void(0);"  title="Underline" id="toolbar_panel_button_underline"       onclick="WebDoc.application.textTool.delegate.editorExec(\'underline\');">      <div class="icon_underline"></div></a>'+      
        
        '<a href="javascript:void(0);"  title="Foreground font color" id="toolbar_panel_button_foreColor"       onclick="WebDoc.application.textTool.delegate.editorExec(\'foreColor\',this.firstChild.style.backgroundColor);" ><div class="icon_foreColor"></div></a>'+
        '<a href="javascript:void(0);"  id="toolbar_panel_button_foreColor_arrow"                                         ><div class="icon_color_arrow"></div></a>'+
        '<a href="javascript:void(0);"  title="Background font color" id="toolbar_panel_button_hiliteColor"     onclick="WebDoc.application.textTool.delegate.editorExec(\'hiliteColor\',this.style.backgroundColor);"><div class="icon_hiliteColor"></div></a>'+ 
        '<a href="javascript:void(0);"  title="" id="toolbar_panel_button_hiliteColor_arrow"                                          ><div class="icon_color_arrow"></div></a>'+
        
        '<a href="javascript:void(0);"  title="Insert Ordered List" id="toolbar_panel_button_insertOrderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertOrderedList\');">  <div class="icon_insertOrderedList"></div></a>'+
        '<a href="javascript:void(0);"  title="Insert Unordered List" id="toolbar_panel_button_insertUnorderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertUnorderedList\');">  <div class="icon_insertUnorderedList"></div></a>'+      
        '<a href="javascript:void(0);"  title="Indent" id="toolbar_panel_button_indent"         onclick="WebDoc.application.textTool.delegate.editorExec(\'indent\');">       <div class="icon_indent"></div></a>'+
        '<a href="javascript:void(0);"  title="Unindent" id="toolbar_panel_button_outdent"        onclick="WebDoc.application.textTool.delegate.editorExec(\'outdent\');">        <div class="icon_outdent"></div></a>'+      
        '<a href="javascript:void(0);"  title="Align Left" id="toolbar_panel_button_justifyLeft"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyLeft\');">      <div class="icon_justifyLeft"></div></a>'+
        '<a href="javascript:void(0);"  title="Align Center" id="toolbar_panel_button_justifyCenter"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyCenter\');">    <div class="icon_justifyCenter"></div></a>'+
        '<a href="javascript:void(0);"  title="Align Right" id="toolbar_panel_button_justifyRight"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyRight\');">     <div class="icon_justifyRight"></div></a>'+
        '<a href="javascript:void(0);"  title="Align Full" id="toolbar_panel_button_justifyFull"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyFull\');">      <div class="icon_justifyFull"></div></a>'+
        '<a href="javascript:void(0);"  title="Superscript" id="toolbar_panel_button_superScript"     onclick="WebDoc.application.textTool.delegate.editorExec(\'superScript\');">      <div class="icon_superScript"></div></a>'+
        '<a href="javascript:void(0);"  title="Subscript" id="toolbar_panel_button_subScript"       onclick="WebDoc.application.textTool.delegate.editorExec(\'subScript\');">      <div class="icon_subScript"></div></a>'+
        '<a href="javascript:void(0);"  title="Remove Format" id="toolbar_panel_button_removeFormat"      onclick="WebDoc.application.textTool.delegate.editorExec(\'removeformat\');"><div class="icon_removeFormat"></div></a>'+
        '<a href="javascript:void(0);"  title="Vertical align" id="toolbar_panel_button_valign"><div class="icon_valignTop"></div><div class="icon_valign_arrow"></div></a>'+
        '<div id="toolbar_panel_valign_block" >'+
        '<a href="javascript:void(0);"  title="Vertical align Top" id="toolbar_panel_button_valignTop"          onclick="WebDoc.application.textTool.delegate.editorExec(\'verticalAlign\',\'top\');">      <div class="icon_valignTop"></div></a>'+
        '<a href="javascript:void(0);"  title="Vertical align Middle" id="toolbar_panel_button_valignMiddle"    onclick="WebDoc.application.textTool.delegate.editorExec(\'verticalAlign\',\'middle\');">     <div class="icon_valignMiddle"></div></a>'+
        '<a href="javascript:void(0);"  title="Vertical align Bottom" id="toolbar_panel_button_valignBottom"    onclick="WebDoc.application.textTool.delegate.editorExec(\'verticalAlign\',\'bottom\');">     <div class="icon_valignBottom"></div></a>'+
        '</div>'+
        '<div style="clear: both;"></div>'+
    '</div>';
    //containerObj.innerHTML = toolbarContent;
    
    $('#toolbar_panel_button_valign').bind('click', function(e){
      var pos = $("#toolbar_panel_button_valign").position();  
        $('#toolbar_panel_valign_block').stop().animate({height: 20}, 500);
        $('#toolbar_panel_valign_block').css('left',pos.left);
      $('#toolbar_panel_valign_block').css('top',pos.top+28);
    });
    
    $('#toolbar_panel_button_valignBottom').bind('click',   function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignBottom");$('#toolbar_panel_valign_block').hide();});
    $('#toolbar_panel_button_valignMiddle').bind('click',   function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignMiddle");$('#toolbar_panel_valign_block').hide();});
    $('#toolbar_panel_button_valignTop').bind('click',    function(e){$('#toolbar_panel_button_valign').find(":first").attr("class","icon_valignTop");$('#toolbar_panel_valign_block').hide();});
    
    this.isHasParent = function(target,parentObj){
      if(target.parentNode && target.parentNode==parentObj){
      return true;
    } else {
      if(!target.parentNode){
        return false;
      } else {
          return this.isHasParent(target.parentNode,parentObj);
      }
      
    }
  }

    $(document).bind('click', function(e) {
        e.stopPropagation();
        e.cancelBubble = true;
        var foc = (e.target.parentNode && e.target.parentNode.parentNode)?e.target.parentNode.parentNode.getAttribute('class'):'';
    if($('#colorpickerHolder2').height() &&!thobj.isHasParent(e.target,document.getElementById('colorpickerHolder2')) || foc=='colorpicker_color'){
      $('#colorpickerHolder2').stop().animate({height: 0}, 500);
      $('#toolbar_panel_button_foreColor_arrow>div').attr('class','icon_color_arrow');
    }
    if($('#colorpickerHolder1').height() &&!thobj.isHasParent(e.target,document.getElementById('colorpickerHolder1')) || foc=='colorpicker_color'){
      $('#colorpickerHolder1').stop().animate({height: 0}, 500);
      $('#toolbar_panel_button_hiliteColor_arrow>div').attr('class','icon_color_arrow');
    }
      });   
    
    $('#colorpickerHolder2').ColorPicker({
        flat: true,
        color: '#000000',
        onSubmit: function(hsb, hex, rgb) {
          $('#colorpickerHolder2').stop().animate({height: 0}, 500);
          $('#toolbar_panel_button_foreColor>div').css('backgroundColor', '#' + hex);   
      $('#toolbar_panel_button_foreColor_arrow>div').attr('class','icon_color_arrow');
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
          $('#toolbar_panel_button_hiliteColor_arrow>div').attr('class','icon_color_arrow');
          WebDoc.application.textTool.delegate.editorExec('hiliteColor','#' + hex); 
          
        },
        onHide: function (colpkr) {
          $(colpkr).fadeOut(500);
          return false;
        },
        downSelector: function (colpkr) {
          alert('dfg');
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
        if($('#toolbar_panel_button_foreColor_arrow>div').attr('class')!='icon_color_arrow_top'){ 
      $('#toolbar_panel_button_foreColor_arrow>div').attr('class','icon_color_arrow_top');
          var pos = $("#toolbar_panel_button_foreColor").position();  
          $('#colorpickerHolder2').css('left',0);//pos.left
          $('#colorpickerHolder2').css('top',pos.top+28);
          $('#colorpickerHolder2').stop().animate({height:173}, 500);
          $('#colorpickerHolder1').stop().animate({height:0}, 500);
      } else {
        $('#toolbar_panel_button_foreColor_arrow>div').attr('class','icon_color_arrow');
        $('#colorpickerHolder2').stop().animate({height: 0}, 500);
    }
      });
      $('#toolbar_panel_button_hiliteColor_arrow').bind('click', function(e) {
        e.stopPropagation();
        e.cancelBubble = true; 
        if($('#toolbar_panel_button_hiliteColor_arrow>div').attr('class')!='icon_color_arrow_top'){ 
      $('#toolbar_panel_button_hiliteColor_arrow>div').attr('class','icon_color_arrow_top');
          var pos = $("#toolbar_panel_button_hiliteColor").position();  
          $('#colorpickerHolder1').css('left',0);//pos.left
          $('#colorpickerHolder1').css('top',pos.top+28);
          $('#colorpickerHolder1').stop().animate({height:173}, 500);
          $('#colorpickerHolder2').stop().animate({height:0}, 500);
      } else {
        $('#toolbar_panel_button_hiliteColor_arrow>div').attr('class','icon_color_arrow');
        $('#colorpickerHolder1').stop().animate({height: 0}, 500);
    }
      });   
  },
  
  refresh: function(toolbarHash) {
      this.setSelectBoxValue = function(selectBox, val){
            for (i = 0; i < selectBox.length; i++) {
                if (selectBox.options[i].value.toLowerCase().indexOf(val) === 0) {
                    selectBox.selectedIndex = i;
                }
            }
        };
        for (stp in toolbarHash) {
            if (toolbarHash[stp] === true) {
            
                if (stp.indexOf('valign') != -1) {
                    document.getElementById('toolbar_panel_button_valign').firstChild.className = 'icon_' + stp;
                } else {
                    document.getElementById('toolbar_panel_button_' + stp).className = 'active_button';
                }
            } else if (toolbarHash[stp] === false) {
        document.getElementById('toolbar_panel_button_' + stp).className = '';
      } else if (document.getElementById('toolbar_panel_button_' + stp).tagName.toLowerCase() == 'select') {
        this.setSelectBoxValue(document.getElementById('toolbar_panel_button_' + stp), toolbarHash[stp]);
      }
        }
  },
  
  hideColorPickers: function() {
    if($('#colorpickerHolder1').height()){
      $('#colorpickerHolder1').stop().animate({height: 0}, 500);
    $('#toolbar_panel_button_hiliteColor_arrow>div').attr('class','icon_color_arrow');
  }
    if($('#colorpickerHolder2').height()){
    $('#colorpickerHolder2').stop().animate({height: 0}, 500);
    $('#toolbar_panel_button_foreColor_arrow>div').attr('class','icon_color_arrow'); 
  }
  }

});