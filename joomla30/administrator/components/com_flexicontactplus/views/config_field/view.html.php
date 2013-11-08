<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 28 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_Field extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_FIELDS_NAME', $this->config_data, $this->config_count);
	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();

// make the Javascript that hides and enables the fcp_divs for the current field type
// it is called by the 'domready' function and the 'onchange' function of the field type list selector

	$js = self::javascript();
	$document = JFactory::getDocument();
	$document->addScriptDeclaration($js);
	$dom_ready = "\nwindow.addEvent('domready', function() {fcp_show_fields(".$this->field->field_type.");});\n";
	$document->addScriptDeclaration($dom_ready);

// make the field type list

	$field_types = FCP_Admin::make_field_type_list();
	$field_type_list = FCP_Common::make_list('field_type', $this->field->field_type, $field_types, 0, 'class="field_type" onchange="fcp_show_fields(this.value)"');
	
// make the validation type list

	require_once(LAFC_HELPER_PATH.'/date_pickers.php');
	$validation_types = FCP_date_picker::validation_type_list();
	$validation_type_list = FCP_Common::make_list('validation_type', $this->field->validation_type, $validation_types);
	
// setup the key panel

	$keypanel = FCP_Admin::make_key_panel($this->config_data->config_data);

// draw the form

	?>
	<div style="float:left">
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="field" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="view" value="config_field" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="field_index" value="<?php echo $this->field_index; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<?php

	if (!isset($this->new_flag))
		echo '<input type="hidden" name="new_flag" value="0" />';
	else
		echo '<input type="hidden" name="new_flag" value="'.$this->new_flag.'" />';
	
	echo "\n".'<table class="fc_table">';
	echo "\n". "<tr>";
	echo "\n".'  <td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_FIELD_TYPE').'</strong></td>';
	echo "\n".'  <td>'.$field_type_list;
	echo "\n".'<img src="'.LAFC_ADMIN_ASSETS_URL.'blank.gif" id="field_type_img" border="0" style="vertical-align:middle;padding:0 0 3px 15px;" alt="" />';
	echo "\n"."</td></tr>";
	echo "\n".'</table>';
	
// prompt
	
	echo "\n".'<div class="fcp_div" id="fcp_prompt">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_V_PROMPT').'</td>';
	echo "\n".'  <td><input type="text" size="40" name="prompt" value="'.$this->field->prompt.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// delimeter

	echo "\n".'<div class="fcp_div" id="fcp_delim">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td valign="top" class="prompt">'.JText::_('COM_FLEXICONTACT_DELIMITER').'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_DELIMITER_DESC'));
	echo "\n".'  <td><input type="text" size="2" name="delimiter" value="'.$this->field->delimiter.'" />&nbsp;&nbsp;'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

	
// width

	echo "\n".'<div class="fcp_div" id="fcp_width">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_V_WIDTH').'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_WIDTH_DESC'));
	echo "\n".'  <td><input type="text" size="6" name="width" value="'.$this->field->width.'" />&nbsp;&nbsp;'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// height			
	
	echo "\n".'<div class="fcp_div" id="fcp_height">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_V_HEIGHT').'</td>';
	echo "\n".'  <td><input type="text" size="6" name="height" value="'.$this->field->height.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// default value (text)

	echo "\n".'<div class="fcp_div" id="fcp_default">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_DEFAULT').'</td>';
	echo "\n".'  <td><input type="text" size="80" name="default_value" value="'.$this->field->default_value.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// validation type (date picker only)

	echo "\n".'<div class="fcp_div" id="fcp_validation">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_VALIDATION').'</td>';
	echo "\n".'  <td>'.$validation_type_list.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// default button (radio buttons only)

	echo "\n".'<div class="fcp_div" id="fcp_default_button">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_DEFAULT_BUTTON').'</td>';
	echo "\n".'  <td><input type="text" size="2" name="default_button" value="'.$this->field->default_button.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// fixed text	

	echo "\n".'<div class="fcp_div" id="fcp_fixed_text">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'. JText::_('COM_FLEXICONTACT_FIELD_FIXED_TEXT').'</td>';
	echo "\n".'  <td><input type="text" size="80" name="fixed_text" value="'.$this->field->default_value.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// list items

	echo "\n".'<div class="fcp_div" id="fcp_list">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td valign="top" class="prompt">'.JText::_('COM_FLEXICONTACT_V_LIST_ITEMS').'</td>';
	echo "\n".'  <td valign="top"><textarea rows="10" cols="80" name="list_list">'.$this->field->list_list.'</textarea>'.'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_LIST_ITEMS_DESC'));
	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
//	echo '<pre>'.htmlentities(print_r(FCP_Common::split_list($this->field->list_list, $this->field->delimiter),true)).'</pre>';
	echo "\n".'</div>';
	
// radio buttons	

	echo "\n".'<div class="fcp_div" id="fcp_radio">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td valign="top" class="prompt">'.JText::_('COM_FLEXICONTACT_BUTTON_TEXTS').'</td>';
	echo "\n".'  <td valign="top"><textarea rows="10" cols="80" name="radio_list">'.$this->field->list_list.'</textarea>'.'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_RADIO_LIST_DESC1').'  :: '.JText::_('COM_FLEXICONTACT_RADIO_LIST_DESC2').JText::_('COM_FLEXICONTACT_RADIO_LIST_DESC3'));
	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
//	echo '<pre>'.htmlentities(print_r(FCP_Common::split_list($this->field->list_list, ';', $this->field->delimiter),true)).'</pre>';
	echo "\n".'</div>';

// multiple checkboxes	

	echo "\n".'<div class="fcp_div" id="fcp_checkbox_m">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td valign="top" class="prompt">'.JText::_('COM_FLEXICONTACT_CHECKBOX_TEXTS').'</td>';
	echo "\n".'  <td valign="top"><textarea rows="10" cols="80" name="checkbox_list">'.$this->field->list_list.'</textarea>'.'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_CHECKBOX_LIST_DESC'));
	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
//	echo '<pre>'.htmlentities(print_r(FCP_Common::split_list($this->field->list_list, ';', $this->field->delimiter),true)).'</pre>';
	echo "\n".'</div>';

// recipient list	

	echo "\n".'<div class="fcp_div" id="fcp_recipient">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td valign="top" class="prompt">'.JText::_('COM_FLEXICONTACT_RECIPIENTS').'</td>';
	echo "\n".'  <td valign="top"><textarea rows="10" cols="80" name="recipient_list">'.$this->field->list_list.'</textarea>'.'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_RECIPIENTS_DESC')." :: Name1, email1@x.com;<br>Name2, email2@y.com;<br>Name3, email3@z.com");
	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
//	echo '<pre>'.htmlentities(print_r(FCP_Common::split_list($this->field->list_list, ';', $this->field->delimiter),true)).'</pre>';
	echo "\n".'</div>';

// mandatory

	echo "\n".'<div class="fcp_div" id="fcp_mandatory">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_V_MANDATORY').'</td>';
	echo "\n".'  <td>'.FCP_Common::make_radio('mandatory',$this->field->mandatory).'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// visible

	echo "\n".'<div class="fcp_div" id="fcp_visible">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_VISIBLE').'</td>';
	echo "\n".'  <td>'.FCP_Common::make_radio('visible',$this->field->visible).'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// regular expression

	echo "\n".'<div class="fcp_div" id="fcp_regex">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_REGEX').'</td>';
	echo "\n".'  <td><input type="text" size="80" name="regex" value="'.$this->field->regex.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';

// error message

	echo "\n".'<div class="fcp_div" id="fcp_errormsg">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_ERRORMSG').'</td>';
	echo "\n".'  <td><input type="text" size="80" name="error_msg" value="'.$this->field->error_msg.'" /></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// tooltip

	echo "\n".'<div class="fcp_div" id="fcp_tooltip">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_TOOLTIP').'</td>';
	echo "\n".'  <td><textarea rows="3" cols="80" name="tooltip">'.htmlspecialchars($this->field->tooltip).'</textarea></td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
// CSS Class

	echo "\n".'<div class="fcp_div" id="fcp_css_class">';
	echo "\n".'<table class="fc_table">';
	echo "\n"."<tr>";
	echo "\n".'  <td class="prompt">'.JText::_('COM_FLEXICONTACT_CSS_CLASS').'</td>';
	echo "\n".'  <td><input type="text" size="40" name="css_class" value="'.$this->field->css_class.'" /></td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_CSS_CLASS_INFO'));
	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";
	echo "\n".'</table>';
	echo "\n".'</div>';
	
	echo "\n".'</form>';
	echo "\n".'</div>';		// float:left

// Key Panel

	echo "\n".'<div class="fcp_div" id="fcp_keypanel_class" style="float:left">';
	echo $keypanel;
	echo "\n".'</div>';
}

//-----------------------------------------------------------------------------------------------
// make the Javascript for the field type selector
// - the for loop disables all the divs of class 'fcp_div'
// - the switch statement enables the ones that apply to the current field_type
//
static function javascript()
{
	$js = "
function fcp_show_fields(field_type)
{	
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++)
        if (divs[i].className == 'fcp_div')
           divs[i].style.display = 'none';
    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'blank.gif';
	switch(parseInt(field_type))
	{
	case ".LAFC_FIELD_SUBJECT.": 
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block';
		document.getElementById('fcp_default').style.display = 'block'; 
		document.getElementById('fcp_visible').style.display = 'block';
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
		document.getElementById('fcp_keypanel_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_text_16.gif';
		break;
	case ".LAFC_FIELD_FROM_ADDRESS.": 
	case ".LAFC_FIELD_FROM_NAME.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_text_16.gif';
		break;
	case ".LAFC_FIELD_TEXT.": 
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_default').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_text_16.gif';
		break;
	case ".LAFC_FIELD_PASSWORD.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_default').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_password_16.gif';
		break;
	case ".LAFC_FIELD_TEXT_NUMERIC.": 
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_default').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_num_16.gif';
		break;
	case ".LAFC_FIELD_TEXTAREA.": 
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_height').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_textarea_16.gif';
		break;
	case ".LAFC_FIELD_LIST.": 
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_list').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_delim').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_list_16.gif';
		break;
	case ".LAFC_FIELD_RADIO_H.":
	case ".LAFC_FIELD_RADIO_V.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_radio').style.display = 'block'; 
		document.getElementById('fcp_css_class').style.display = 'block';
		document.getElementById('fcp_delim').style.display = 'block';
		document.getElementById('fcp_default_button').style.display = 'block'; 
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_radio_16.gif';
		break;
	case ".LAFC_FIELD_CHECKBOX_L.":
	case ".LAFC_FIELD_CHECKBOX_H.":
	case ".LAFC_FIELD_CHECKBOX_R.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_check_16.gif';
		break;
	case ".LAFC_FIELD_CHECKBOX_M.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_delim').style.display = 'block';
		document.getElementById('fcp_checkbox_m').style.display = 'block'; 
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_checks_16.gif';
		break;
	case ".LAFC_FIELD_DATE.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_validation').style.display = 'block';
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_date_16.gif';
		break;
	case ".LAFC_FIELD_FIXED_TEXT.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_fixed_text').style.display = 'block'; 
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_fixed_16.gif';
		break;
	case ".LAFC_FIELD_REGEX.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_regex').style.display = 'block'; 
		document.getElementById('fcp_errormsg').style.display = 'block'; 
		document.getElementById('fcp_tooltip').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_regex_16.gif';
		break;
	case ".LAFC_FIELD_RECIPIENT.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_recipient').style.display = 'block'; 
		document.getElementById('fcp_mandatory').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_list_16.gif';
		break;
	case ".LAFC_FIELD_FIELDSET_START.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_width').style.display = 'block'; 
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_fieldset_16.gif';
		break;
	case ".LAFC_FIELD_FIELDSET_END.":
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_fieldset_end_16.gif';
		break;
	case ".LAFC_FIELD_ATTACHMENT.":
		document.getElementById('fcp_prompt').style.display = 'block';
		document.getElementById('fcp_css_class').style.display = 'block';
	    document.getElementById('field_type_img').src = '".LAFC_ADMIN_ASSETS_URL."'+'ft_upload_16.gif';
	}
}
";
	return $js;
}

}