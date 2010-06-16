/**
 * @author Julien Bachmann
 */
WebDoc.TextPaletteController = jQuery.klass({
  initialize: function(id){
    this.domNode = jQuery(id).hide();
    this.initGUI("#text-inspector-content");
  },       
  initGUI: function(container){
    var thobj = this;
    var containerObj = jQuery(container);
    var toolbarContent = '<div id="toolbar_panel" style="height:100px" class="ui-widget">' +
    '<div id="hiliteColorpickerContainer" style="padding:0px;position:absolute;z-index: 150000;top:50px;display:none;"><div id="colorpickerHolder1"></div></div>' +
    '<div id="foreColorpickerContainer" style="padding:0px;position:absolute;z-index: 150000;top:50px;display:none;"><div id="colorpickerHolder2"></div></div>' +
    '<div id="toolbar_selectbox_container">' +
    '<select style="width:125px" id="toolbar_panel_button_format"></select>' +
    '<select style="width:90px" id="toolbar_panel_button_fontName"></select>' +
    '<select style="width:35px" id="toolbar_panel_button_fontSize"></select>' +
    '</div>' +
    '<div id="toolbar_panel_fontSize_slider_container">' +
      '<div id="toolbar_panel_fontSize_label">Font Size</div>'   +
      '<div id="toolbar_panel_fontSize_slider"></div>'   +
    '</div>'+             
    '<div style="clear: both;"></div>' +
    '<div id="toolbar_buttons_container">' +
    '<a href="javascript:void(0);" title="Decrease font size" id="toolbar_panel_button_decreasefontsize"    onclick="WebDoc.application.textTool.delegate.editorExec(\'decreasefontsize\');">         <div class="icon_decreasefontsize"></div></a>' +
    '<a href="javascript:void(0);" title="Increase font size" id="toolbar_panel_button_increasefontsize"    onclick="WebDoc.application.textTool.delegate.editorExec(\'increasefontsize\');">         <div class="icon_increasefontsize"></div></a>' +
    '<a href="javascript:void(0);"  title="Bold"  id="toolbar_panel_button_bold" onclick="WebDoc.application.textTool.delegate.editorExec(\'bold\');">         <div class="icon_bold"></div></a>' +
    '<a href="javascript:void(0);"  title="Italic" id="toolbar_panel_button_italic" onclick="WebDoc.application.textTool.delegate.editorExec(\'italic\');">       <div class="icon_italic"></div></a>' +
    '<a href="javascript:void(0);"  title="Underline" id="toolbar_panel_button_underline" onclick="WebDoc.application.textTool.delegate.editorExec(\'underline\');">      <div class="icon_underline"></div></a>' +
    
    '<a href="javascript:void(0);"  title="Foreground font color" id="toolbar_panel_button_foreColor" onclick="WebDoc.application.textTool.delegate.editorExec(\'foreColor\',this.firstChild.style.backgroundColor);" ><div class="icon_foreColor"></div></a>' +
    '<a href="javascript:void(0);"  id="toolbar_panel_button_foreColor_arrow" ><div class="icon_color_arrow"></div></a>' +
    '<a href="javascript:void(0);"  title="Background font color" id="toolbar_panel_button_hiliteColor" onclick="WebDoc.application.textTool.delegate.editorExec(\'hiliteColor\',this.firstChild.style.backgroundColor);"><div class="icon_hiliteColor"></div></a>' +
    '<a href="javascript:void(0);"  title="" id="toolbar_panel_button_hiliteColor_arrow"><div class="icon_color_arrow"></div></a>' +
    '<a href="javascript:void(0);"  title="Create link" id="toolbar_panel_button_createlink">  <div class="icon_createLink"></div></a>' +
    '<form id="toolbar_panel_createlink_block" class=" ui-menu  ui-widget-content ui-corner-all " onsubmit="return false;">' +
    '<div><label id="toolbar_panel_button_createlink_text_label">Text</label><input type="text" id="toolbar_panel_button_createlink_text" size="55" maxlength="2024" class="ui-corner-all"></div>' +
    '<div><label id="toolbar_panel_button_createlink_link_label">Link</label><input type="text" id="toolbar_panel_button_createlink_link" size="55" maxlength="2024" class="ui-corner-all" value="http://"></div>' +
    '<div>' +
    '<label>Type</label>' +
    '<input type="radio" name="toolbar_panel_button_createlink_type" id="toolbar_panel_button_createlink_type_web" checked="checked"><label class="inline_label">Web</label> ' +
    '<input type="radio" name="toolbar_panel_button_createlink_type" id="toolbar_panel_button_createlink_type_mail"><label class="inline_label">E-mail</label>' +
    '<input type="radio" name="toolbar_panel_button_createlink_type" id="toolbar_panel_button_createlink_type_webdoc"><label class="inline_label">WebDoc</label>' +
    '<button id="toolbar_panel_button_createlink_cancel" class="ui-button ui-widget ui-state-default ui-corner-all" style="width:55px">Cancel</button>' +
    '<button id="toolbar_panel_button_createlink_ok" class="ui-button ui-widget ui-state-default ui-corner-all" style="width:35px" >Ok</button>' +
    '</div>' +
    '</form>' +
    '<a href="javascript:void(0);"  title="Clear link" id="toolbar_panel_button_clearlink" onclick="WebDoc.application.textTool.delegate.editorExec(\'clearLink\');">  <div class="icon_clearLink"></div></a>' +
    '<a href="javascript:void(0);"  title="Superscript" id="toolbar_panel_button_superScript"     onclick="WebDoc.application.textTool.delegate.editorExec(\'superScript\');">      <div class="icon_superScript"></div></a>' +
    '<a href="javascript:void(0);"  title="Subscript" id="toolbar_panel_button_subScript"       onclick="WebDoc.application.textTool.delegate.editorExec(\'subScript\');">      <div class="icon_subScript"></div></a>' +
    '<div id="toolbar_buttons_container">' +
    '</div>' +
    '<a href="javascript:void(0);"  title="Insert Ordered List" id="toolbar_panel_button_insertOrderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertOrderedList\');">  <div class="icon_insertOrderedList"></div></a>' +
    '<a href="javascript:void(0);"  title="Insert Unordered List" id="toolbar_panel_button_insertUnorderedList"   onclick="WebDoc.application.textTool.delegate.editorExec(\'insertUnorderedList\');">  <div class="icon_insertUnorderedList"></div></a>' +
    '<a href="javascript:void(0);"  title="Indent" id="toolbar_panel_button_indent"         onclick="WebDoc.application.textTool.delegate.editorExec(\'indent\');">       <div class="icon_indent"></div></a>' +
    '<a href="javascript:void(0);"  title="Unindent" id="toolbar_panel_button_outdent"        onclick="WebDoc.application.textTool.delegate.editorExec(\'outdent\');">        <div class="icon_outdent"></div></a>' +
    '<a href="javascript:void(0);"  title="Align Left" id="toolbar_panel_button_justifyLeft"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyLeft\');">      <div class="icon_justifyLeft"></div></a>' +
    '<a href="javascript:void(0);"  title="Align Center" id="toolbar_panel_button_justifyCenter"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyCenter\');">    <div class="icon_justifyCenter"></div></a>' +
    '<a href="javascript:void(0);"  title="Align Right" id="toolbar_panel_button_justifyRight"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyRight\');">     <div class="icon_justifyRight"></div></a>' +
    '<a href="javascript:void(0);"  title="Align Full" id="toolbar_panel_button_justifyFull"      onclick="WebDoc.application.textTool.delegate.editorExec(\'justifyFull\');">      <div class="icon_justifyFull"></div></a>' +
    '<a href="javascript:void(0);"  title="Vertical align" id="toolbar_panel_button_valign"><div class="icon_valignTop"></div><div class="icon_valign_arrow"></div></a>' +
    '<div id="toolbar_panel_valign_block" class="ui-menu  ui-widget-content ui-corner-all ">' +
    '<a href="javascript:void(0);"  title="Vertical align Top" id="toolbar_panel_button_valignTop"><div class="icon_valignTop"></div></a>' +
    '<a href="javascript:void(0);"  title="Vertical align Middle" id="toolbar_panel_button_valignMiddle"><div class="icon_valignMiddle"></div></a>' +
    '<a href="javascript:void(0);"  title="Vertical align Bottom" id="toolbar_panel_button_valignBottom"><div class="icon_valignBottom"></div></a>' +
    '</div>' +
    '<a href="javascript:void(0);"  title="Remove Format" id="toolbar_panel_button_removeFormat"      onclick="WebDoc.application.textTool.delegate.editorExec(\'removeformat\');"><div class="icon_removeFormat"></div></a>' +
    '<a href="javascript:void(0);"  title="Edit HTML" id="toolbar_panel_button_editHTML"><div class="icon_editHTML"></div></a>' +
    '</div>' +
    '<div style="clear: both;"></div>' +
    '</div>' +

    '<div style="position:relative;height:100%;">' +
    '<div id="choose-edit-method" class="ui-widget content">' +
    '<!--div>' +
    '<button id="toolbar_panel_inline_edit">Inline edit</button>' +
    '<button id="toolbar_panel_html_edit">HTML edit</button>' +
    '</div-->' +
    '<div id="inner_text_html">' +
    '<div class="content" id="html-editor"/>' +
    '</div>' +
    '</div>' +
    '</div>';
    
    containerObj.html(toolbarContent);
    
    this.htmlInspector = new WebDoc.InnerHtmlController("#inner_text_html");
    jQuery('#toolbar_panel a').addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only');
    jQuery('#toolbar_panel_button_foreColor').addClass('ui-corner-left').removeClass('ui-corner-all').css('margin-right', '-1px');
    jQuery('#toolbar_panel_button_foreColor_arrow').addClass('ui-corner-right').removeClass('ui-corner-all');
    jQuery('#toolbar_panel_button_hiliteColor').addClass('ui-corner-left').removeClass('ui-corner-all').css('margin-right', '-1px');
    jQuery('#toolbar_panel_button_hiliteColor_arrow').addClass('ui-corner-right').removeClass('ui-corner-all');
    
    this.currentToolBarHash = false;
    this.timer1 = false;
    this.timer2 = false;
    
    this.HexLookup = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    
    this.RGB2Hex = function(rgb){
      var Hex = "";
      while (rgb > 0) {
        Hex = this.HexLookup[rgb % 16] + Hex;
        rgb -= (rgb % 16);
        rgb /= 16;
      }
      if (!Hex) {
        Hex = '00';
      }
      return Hex;
    };
    this.RGBcss2Hex = function(str){
      var vals = str.match(/\d+/g);
      var hex = "";
      for (var i = 0; i < vals.length; i++) {
        hex += this.RGB2Hex(vals[i]);
      }
      return hex;
    };
    
    jQuery.widget("ui.webdocPaletteControllerCombobox", {
      options: {
        values: "defaultValue",
        onChangeHandler: "defaultValue",
        isFontDropdown: false,
        isEditable: false
      },
      _create: function(){
        var self = this;
        var select = this.element.hide();
        
        var input = jQuery("<input>").insertAfter(select).addClass("ui-widget ui-widget-content ui-corner-left ui_custom_input").css('width', select.css('width'));
        
        self.input = input;
        if (!self.options.isEditable) {
          self.input.bind('keypress', function(){
            return false;
          });
          self.input.bind('keyup', function(){
            return false;
          });
          self.input.bind('keydown', function(){
            return false;
          });
        }
        else {
          self.input.focus(function(){
            this.select();
          });
          self.input.bind('keypress blur', function(event){
            if ((event.type == 'keypress' && event.keyCode == '13') || event.type == 'blur') {
              self.options.onChangeHandler(this.value.split('pt')[0].split(' ')[0] + 'pt');
            }
          });
        }
        var button = jQuery("<button>&nbsp;</button>").insertAfter(input).button({
          icons: {
            primary: "ui-icon-triangle-1-s"
          },
          text: false
        }).removeClass("ui-corner-all ui-button-icon-only ").addClass("toolbar-custom-combobox-button ui-corner-right ui-button-icon ui-button-icon-only ui_custom_button").position({
          my: "left center",
          at: "right center",
          of: input,
          offset: "0 0"
        }).css("top", "").mouseup(function(){
          var id = select.attr('id') + new Date().getTime();
          var dropdownConteiner = jQuery("<div class='ui_dropdown_container ui-widget'  id='" + id + "'><div>").appendTo('body').hide().css('min-width', select.css('width').split('px')[0] * 1 + button.css('width').split('px')[0] * 1).css('top', input.offset().top + 2).css('left', input.offset().left - 30).css('position', 'absolute');
          
          dropdownConteiner.append("<ul class=' ui-menu  ui-widget-content ui-corner-all toolbar-custom-combobox-ul'  role='menu' aria-activedescendant='ui-active-menuitem'></ul>");
          dropdownConteiner.bind('click', function(){
            self.dropdown.remove();
          });
          for (var i = 0; i < self.options.values.length; i++) {
            jQuery('#' + id + ' ul').append('<li class="ui-menu-item toolbar-custom-combobox-li" role="menuitem"><a class="ui-corner-all" ' + ((self.options.isFontDropdown) ? ("style='font-family:" + self.options.values[i][1] + "'") : '') + ' title="' + self.options.values[i][1] + '">' + self.options.values[i][0] + '</a></li>');
          }
          self.dropdown = jQuery('#' + id);
          dropdownConteiner.slideDown();
          jQuery('#' + id + ' li a').click(function(){
            self.dropdown.remove();
            self.options.onChangeHandler(this.getAttribute('title'));
          });
          jQuery('#' + id).mouseleave(function(){
            self.dropdown.remove();
          });
        });
      },
      setCurrent: function(val){
        var self = this;
        self.input.val(val.toString().replace('&lt;', '<').replace('&gt;', '>'));
      }
    });
    
    jQuery('#toolbar_panel_button_createlink_ok').bind('click', function(){
      var link = '';
      var target = '_blank';
      var text = jQuery('#toolbar_panel_button_createlink_text').val();
      switch (jQuery('#toolbar_panel_createlink_block input:radio:checked').attr('id')) {
        case 'toolbar_panel_button_createlink_type_mail':
          link = 'mailto:' + jQuery('#toolbar_panel_button_createlink_link').val();
          break;
        case 'toolbar_panel_button_createlink_type_web':
          if (jQuery('#toolbar_panel_button_createlink_link').val().indexOf('http://') == -1) {
            link = 'http://' + jQuery('#toolbar_panel_button_createlink_link').val();
          }
          else {
            link = jQuery('#toolbar_panel_button_createlink_link').val();
          }
          break;
        case 'toolbar_panel_button_createlink_type_webdoc':
          if (jQuery('#toolbar_panel_button_createlink_link').val().indexOf('#') == -1) {
            link = '#' + jQuery('#toolbar_panel_button_createlink_link').val();
          }
          else {
            link = jQuery('#toolbar_panel_button_createlink_link').val();
          }
          target = "_self";
          break;
      }
      var value = {
        'link': link,
        'target': target,
        'text': ((text == ' - Multiline text selected - ') ? '' : text)
      };
      jQuery('#toolbar_panel_createlink_block').hide();
      WebDoc.application.textTool.delegate.editorExec('createlink', value);
      WebDoc.application.textTool.delegate.focus();
    });
    
    jQuery('#toolbar_panel_button_createlink_cancel').bind('click', function(){
      jQuery('#toolbar_panel_createlink_block').hide();
      WebDoc.application.textTool.delegate.focus();
    });
    
    jQuery('#toolbar_panel_button_createlink_type_web,#toolbar_panel_button_createlink_type_mail,#toolbar_panel_button_createlink_type_webdoc').bind('click', function(){
      switch (jQuery('#toolbar_panel_createlink_block input:radio:checked').attr('id')) {
        case 'toolbar_panel_button_createlink_type_mail':
          jQuery('#toolbar_panel_button_createlink_link_label').html('Email');
          jQuery('#toolbar_panel_button_createlink_link').val('');
          break;
        case 'toolbar_panel_button_createlink_type_web':
          jQuery('#toolbar_panel_button_createlink_link_label').html('Link');
          jQuery('#toolbar_panel_button_createlink_link').val('http://');
          break;
        case 'toolbar_panel_button_createlink_type_webdoc':
          jQuery('#toolbar_panel_button_createlink_link_label').html('Webdoc');
          jQuery('#toolbar_panel_button_createlink_link').val('#');
          break;
      }
    });
    
    jQuery('#toolbar_panel_button_createlink').bind('click', function(e){
      var pos = jQuery("#toolbar_panel_button_createlink").position();
      jQuery('#toolbar_panel_createlink_block').appendTo('body').css('left', $('#toolbar_panel').offset().left + 3).css('top', $('#toolbar_panel').offset().top + 50).show();
      if (WebDoc.application.textTool.delegate.getSelectedText() !== false) {
        jQuery('#toolbar_panel_button_createlink_text').attr('disabled', false);
        jQuery('#toolbar_panel_button_createlink_text').css('fontStyle', 'normal');
        jQuery('#toolbar_panel_button_createlink_text').css('color', 'inherit');
        jQuery('#toolbar_panel_button_createlink_text').val(WebDoc.application.textTool.delegate.getSelectedText());
      }
      else {
        jQuery('#toolbar_panel_button_createlink_text').val(' - Multiline text selected - ');
        jQuery('#toolbar_panel_button_createlink_text').attr('disabled', true);
        jQuery('#toolbar_panel_button_createlink_text').css('fontStyle', 'italic');
        jQuery('#toolbar_panel_button_createlink_text').css('color', '#aaaaaa');
      }
      
      jQuery('#toolbar_panel_button_createlink_link').val();
    });
    
    jQuery('#toolbar_panel_button_valign').bind('click', function(e){
      var pos = jQuery("#toolbar_panel_button_valign").position();
      jQuery('#toolbar_panel_valign_block').show().css('zIndex', 50000).css('left', pos.left + 3).css('top', pos.top + 23);
    });
    
    
    jQuery('#toolbar_panel_button_valignBottom').bind('click', function(e){
      WebDoc.application.textTool.delegate.editorExec('verticalAlign', 'bottom');
      jQuery('#toolbar_panel_button_valign').find(":first").attr("class", "icon_valignBottom");
      jQuery('#toolbar_panel_valign_block').hide();
    });
    jQuery('#toolbar_panel_button_valignMiddle').bind('click', function(e){
      WebDoc.application.textTool.delegate.editorExec('verticalAlign', 'middle');
      jQuery('#toolbar_panel_button_valign').find(":first").attr("class", "icon_valignMiddle");
      jQuery('#toolbar_panel_valign_block').hide();
    });
    jQuery('#toolbar_panel_button_valignTop').bind('click', function(e){
      WebDoc.application.textTool.delegate.editorExec('verticalAlign', 'top');
      jQuery('#toolbar_panel_button_valign').find(":first").attr("class", "icon_valignTop");
      jQuery('#toolbar_panel_valign_block').hide();
    });
    
    jQuery('#toolbar_panel_inline_edit').bind('click', function(e){
      WebDoc.application.boardController.editItemView(WebDoc.application.boardController.selection()[0]);
    });
    
    this.htmlEdit = false;
    jQuery('#toolbar_panel_button_editHTML').bind('click', function(e){
      if (!this.htmlEdit) {
        this.htmlEdit = true;
        WebDoc.application.textTool.delegate.exitEditMode();
        jQuery("#inner_text_html").show();
        $('#toolbar_panel_button_editHTML').addClass('active_button');
        this.refreshInnerHtml();
      }
      else {
        this.htmlEdit = false;
        jQuery("#inner_text_html").hide();
        $('#toolbar_panel_button_editHTML').removeClass('active_button');
      }
    }
.pBind(this));
    
    this.isHasParent = function(target, parentObj){
      if (target.parentNode && target.parentNode == parentObj) {
        return true;
      }
      else {
        if (!target.parentNode) {
          return false;
        }
        else {
          return this.isHasParent(target.parentNode, parentObj);
        }
        
      }
    };
    
    this.hideForeColorpicker = function(){
      if (jQuery('#foreColorpickerContainer').css('display') == "block") {
        WebDoc.application.textTool.delegate.editorExec('foreColorCancel');
        jQuery('#foreColorpickerContainer').hide('slow');
        jQuery('#toolbar_panel_button_foreColor_arrow>div').attr('class', 'icon_color_arrow');
      }
    };
    
    this.hideHiliteColorpicker = function(){
      if (jQuery('#hiliteColorpickerContainer').css('display') == "block") {
        WebDoc.application.textTool.delegate.editorExec('hiliteColorCancel');
        jQuery('#hiliteColorpickerContainer').hide('slow');
        jQuery('#toolbar_panel_button_hiliteColor_arrow>div').attr('class', 'icon_color_arrow');
      }
    };
    
    this.showForeColorpicker = function(){
      WebDoc.application.textTool.delegate.editorExec('foreColorShow');
      jQuery('#toolbar_panel_button_foreColor_arrow>div').attr('class', 'icon_color_arrow_top');
      jQuery('#foreColorpickerContainer').appendTo('body').css('left', $('#toolbar_panel').offset().left - 3).css('top', $('#toolbar_panel').offset().top +46).css('height', '175px').slideDown('fast');
      jQuery('#hiliteColorpickerContainer').hide('slow');
      jQuery('#colorpickerHolder2 .colorpicker_current_color').css('backgroundColor', (thobj.currentToolBarHash.foreColor != 'different') ? thobj.currentToolBarHash.foreColor : 'transparent');
    };
    
    this.showHiliteColorpicker = function(){
      WebDoc.application.textTool.delegate.editorExec('hiliteColorShow');
      jQuery('#toolbar_panel_button_hiliteColor_arrow>div').attr('class', 'icon_color_arrow_top');
      jQuery('#hiliteColorpickerContainer').prependTo('body').css('left', $('#toolbar_panel').offset().left - 3).css('top', $('#toolbar_panel').offset().top +46).css('height', '175px').slideDown('fast');
      jQuery('#foreColorpickerContainer').hide('slow');
      jQuery('#colorpickerHolder1 .colorpicker_current_color').css('backgroundColor', (thobj.currentToolBarHash.hiliteColor != 'different') ? thobj.currentToolBarHash.hiliteColor : 'transparent');
    };
    
    
    
    jQuery('#colorpickerHolder2').ColorPicker({
      flat: true,
      color: '#000000',
      onSubmit: function(hsb, hex, rgb){
        jQuery('#foreColorpickerContainer').hide('slow');
        jQuery('#toolbar_panel_button_foreColor_arrow>div').attr('class', 'icon_color_arrow');
        WebDoc.application.textTool.delegate.editorExec('foreColor', '#' + hex);
        WebDoc.application.textTool.delegate.focus();
      },
      onChange: function(hsb, hex, rgb){
        jQuery('#toolbar_panel_button_foreColor>div').css('backgroundColor', '#' + hex);
        WebDoc.application.textTool.delegate.editorExec('foreColorTesting', '#' + hex);
        WebDoc.application.textTool.delegate.focus();
      }
    });
    
    
    jQuery('#colorpickerHolder1').ColorPicker({
      flat: true,
      color: '#000000',
      onSubmit: function(hsb, hex, rgb){
        jQuery('#hiliteColorpickerContainer').hide('slow');
        jQuery('#toolbar_panel_button_hiliteColor_arrow>div').attr('class', 'icon_color_arrow');
        WebDoc.application.textTool.delegate.editorExec('hiliteColor', '#' + hex);
        WebDoc.application.textTool.delegate.focus();
      },
      onChange: function(hsb, hex, rgb){
        jQuery('#toolbar_panel_button_hiliteColor>div').css('backgroundColor', '#' + hex);
        WebDoc.application.textTool.delegate.editorExec('hiliteColorTesting', '#' + hex);
        WebDoc.application.textTool.delegate.focus();
      }
    });
    
    
    jQuery('#colorpickerHolder1 .colorpicker_current_color').unbind('click').bind('click',function(){
      if($(this).css('backgroundColor')!="transparent"){
        $('#colorpickerHolder1').ColorPickerSetColor(thobj.RGBcss2Hex($(this).css('backgroundColor'))); 
      }
    });
    
    jQuery('#colorpickerHolder2 .colorpicker_current_color').unbind('click').bind('click',function(){
      if($(this).css('backgroundColor')!="transparent"){
        $('#colorpickerHolder2').ColorPickerSetColor(thobj.RGBcss2Hex($(this).css('backgroundColor'))); 
      }
    });
    
    
    jQuery('#toolbar_panel_button_foreColor_arrow').bind('click', function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      if (jQuery('#toolbar_panel_button_foreColor_arrow>div').attr('class') != 'icon_color_arrow_top') {
        thobj.showForeColorpicker();
      }
      else {
        thobj.hideForeColorpicker();
      }
      WebDoc.application.textTool.delegate.focus();
    });
    
    jQuery('#toolbar_panel_button_hiliteColor_arrow').bind('click', function(e){
      e.stopPropagation();
      e.cancelBubble = true;
      if (jQuery('#toolbar_panel_button_hiliteColor_arrow>div').attr('class') != 'icon_color_arrow_top') {
        thobj.showHiliteColorpicker();
      }
      else {
        thobj.hideHiliteColorpicker();
      }
      WebDoc.application.textTool.delegate.focus();
    });
    
    jQuery('#colorpickerHolder2').find('div.colorpicker_cancel').bind('click', function(){
      thobj.hideForeColorpicker();
    });
    
    jQuery('#colorpickerHolder1').find('div.colorpicker_cancel').bind('click', function(){
      thobj.hideHiliteColorpicker();
    });
    
    jQuery('#colorpickerHolder1').find('div.colorpicker_setdefault').bind('click', function(){
      thobj.hideHiliteColorpicker();
      WebDoc.application.textTool.delegate.editorExec('clearBackground');
    });
    jQuery('#colorpickerHolder2').find('div.colorpicker_setdefault').hide();
  },
  
  refresh: function(toolbarHash, parameters){
    this.currentToolBarHash = toolbarHash;
     if(!$("#toolbar_panel_fontSize_slider")[0].firstChild){
       $("#toolbar_panel_fontSize_slider").slider({
        value:1,
        min:  parameters.fontSliderRange.min,
        max: parameters.fontSliderRange.max,
        step: parameters.fontSliderRange.step,
        slide: function(event, ui) {
          WebDoc.application.textTool.delegate.editorExec('fontSizeTesting', ui.value+'pt');
        },
        start:function(event, ui) {
          WebDoc.application.textTool.delegate.editorExec('fontSizeTestingStart',ui.value+'pt');          
        },
        stop:function(event, ui) {
          WebDoc.application.textTool.delegate.editorExec('fontSize',ui.value+'pt');          
        }
      });
    }
    
    jQuery("#toolbar_panel_button_fontSize").webdocPaletteControllerCombobox({
      'values': parameters.fontSize,
      'onChangeHandler': function(val){
        WebDoc.application.textTool.delegate.editorExec('fontSize', val);
      },
      'isFontDropdown': false,
      'isEditable': true
    });
    jQuery("#toolbar_panel_button_fontName").webdocPaletteControllerCombobox({
      'values': parameters.fontName,
      'onChangeHandler': function(val){
        WebDoc.application.textTool.delegate.editorExec('fontName', val);
      },
      'isFontDropdown': true,
      'isEditable': false
    });
    jQuery("#toolbar_panel_button_format").webdocPaletteControllerCombobox({
      'values': parameters.format,
      'onChangeHandler': function(val){
        WebDoc.application.textTool.delegate.editorExec('format', val);
      },
      'isFontDropdown': false,
      'isEditable': false
    });
    this.setComboboxValue = function(id, val, parameters){
      var setted = false;
      for (i = 0; i < parameters[id].length; i++) {
        if (parameters[id][i][1].toLowerCase().split(',')[0].split(' ')[0] === val) {
          jQuery("#toolbar_panel_button_" + id).webdocPaletteControllerCombobox("setCurrent", [parameters[id][i][0]]);
          setted = true;
        }
        else {
        
        }
      }
      if (!setted) {
        jQuery("#toolbar_panel_button_" + id).webdocPaletteControllerCombobox("setCurrent", '');
      }
    };
    for (stp in toolbarHash) {
      if (document.getElementById('toolbar_panel_button_' + stp)) {
        if (document.getElementById('toolbar_panel_button_' + stp).tagName.toLowerCase() == 'select') {
          if (stp == 'fontSize') {
            jQuery("#toolbar_panel_button_fontSize").webdocPaletteControllerCombobox("setCurrent", (toolbarHash[stp] != 'different') ? toolbarHash[stp].split('pt')[0] + ' pt' : '');
            $("#toolbar_panel_fontSize_slider").slider("value", (toolbarHash[stp] != 'different') ? toolbarHash[stp].split('pt')[0] : 0);
          }
          else {
            this.setComboboxValue(stp, toolbarHash[stp], parameters);
          }
        }
        else if (toolbarHash[stp] === true) {
          if (stp.indexOf('valign') != -1) {
            document.getElementById('toolbar_panel_button_valign').firstChild.className = 'icon_' + stp;
          }
          else {
            jQuery('#toolbar_panel_button_' + stp).addClass('active_button');
          }
        }
        else if (toolbarHash[stp] === false || toolbarHash[stp] === 'different') {
          jQuery('#toolbar_panel_button_' + stp).removeClass('active_button');
        }
      }
    }
  },
  
  activate: function(bool, parameters){
    this.parameters = parameters;
    if (bool) {
      this.htmlEdit = false;
      jQuery("#inner_text_html").hide();
      $('#toolbar_panel_button_editHTML').removeClass('active_button');
    }
    else {
      this.refreshInnerHtml();
    }
  },
  
  refreshInnerHtml: function(){
    WebDoc.application.textTool.delegate.editorExec('styleRefresher');
    if (this.htmlEdit) {
      this.htmlInspector.refresh();
    }
  }
});
