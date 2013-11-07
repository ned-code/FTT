<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 28 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewConfig_General extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_CONFIG_GENERAL_NAME', $this->config_data, $this->config_count);
	JToolBarHelper::apply();
	JToolBarHelper::save();
	JToolBarHelper::cancel();
	
// setup the three pre-populate options

	$options = array();
	$options['off'] = JText::_('COM_FLEXICONTACT_V_NO');
	$options['username'] = JText::_('COM_FLEXICONTACT_V_AUTOFILL_USERNAME');
	$options['name'] = JText::_('COM_FLEXICONTACT_NAME');
	$autofill_list = FCP_Common::make_list('autofill',$this->config_data->config_data->autofill, $options, 0, 'style="margin-bottom:0"');

// setup the "copy me" options

	$copy_options = array();
	$copy_options[LAFC_COPYME_NEVER]    = JText::_('COM_FLEXICONTACT_COPYME_NEVER');
	$copy_options[LAFC_COPYME_CHECKBOX] = JText::_('COM_FLEXICONTACT_COPYME_CHECKBOX');
	$copy_options[LAFC_COPYME_ALWAYS]   = JText::_('COM_FLEXICONTACT_COPYME_ALWAYS');
	
// setup the date format list

	$date_format_list = array();
	$date_format_list[1] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT1');	
	$date_format_list[2] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT2');	
	$date_format_list[3] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT3');	
	$date_format_list[4] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT4');	
	$date_format_list[5] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT5');
	$date_format_list[6] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT6');
	$date_format_list[7] = JText::_('COM_FLEXICONTACT_DATE_FORMAT_OPT7');
	
// setup the days list

	$days_list = FCP_Common::makeDayNames(0);
	
// setup the date picker list

	require_once(LAFC_HELPER_PATH.'/date_pickers.php');
	$date_picker_onchange = 'onchange="fcp_date_fields(this.value)"';
	$date_picker_list = FCP_date_picker::date_picker_list();

// make the Javascript that hides and enables the date format and start day when the date picker is HTML5
// it is called by the 'domready' function and the 'onchange' function of the date picker list selector

	$js = "function fcp_date_fields(picker_type) {
		if (picker_type == '001')
			{
			document.getElementById('date_format').selectedIndex = 0;
			document.getElementById('date_format').disabled=true;
			document.getElementById('start_day').disabled=true;
			document.getElementById('start_day').selectedIndex = 1;
			}
		else
			{
			document.getElementById('date_format').disabled=false;
			document.getElementById('start_day').disabled=false;
			}}";
			
	$document = JFactory::getDocument();
	$document->addScriptDeclaration($js);
	$dom_ready = "\nwindow.addEvent('domready', function() {fcp_date_fields(".$this->config_data->config_data->date_picker.");});\n";
	$document->addScriptDeclaration($dom_ready);
	
// setup the css files list

	$css_list = FCP_Admin::get_css_list();

	?>
	<form action="index.php" method="post" name="adminForm" id="adminForm" >
	<input type="hidden" name="option" value="<?php echo LAFC_COMPONENT; ?>" />
	<input type="hidden" name="controller" value="menu" />
	<input type="hidden" name="task" value="" />
	<input type="hidden" name="config_id" value="<?php echo $this->config_data->id; ?>" />
	<input type="hidden" name="config_base_view" value="<?php echo $this->config_base_view; ?>" />
	<input type="hidden" name="view" value="config_general" />
	<?php

	echo "\n".'<table class="fc_table">';

// css files selector

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_CSS_FILE').'</td>';
		
		if ($css_list == false)
			echo '<td>'.JText::_('COM_FLEXICONTACT_NO_CSS');
		else
			echo '<td>'.FCP_Common::make_list('css_file',$this->config_data->config_data->css_file, $css_list, 0, 'style="margin-bottom:0"');
			
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_CSS_FILE_DESC')).'</td>';
			
	echo "\n</tr>";

// email From (name)

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';
	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_FIELD_FROM_NAME').'</td>';
		echo '<td><input type="text" size="50" name="email_from_name" value="'.$this->config_data->config_data->email_from_name.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_EMAIL_FROM_NAME_DESC')).'</td>';
	echo "\n</tr>";

// email From (address)

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_FIELD_FROM_ADDRESS').'</td>';
		echo '<td><input type="text" size="50" name="email_from" value="'.$this->config_data->config_data->email_from.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_EMAIL_FROM_ADDRESS_DESC')).'</td>';
	echo "\n</tr>";

// email To

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_EMAIL_TO').'</td>';
		echo '<td><input type="text" size="50" name="email_to" value="'.$this->config_data->config_data->email_to.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_EMAIL_TO_ADDRESS_DESC')).'</td>';
	echo "\n</tr>";

// email CC

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_EMAIL_CC').'</td>';
		echo '<td><input type="text" size="50" name="email_cc" value="'.$this->config_data->config_data->email_cc.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_EMAIL_DESC')).'</td>';
	echo "\n</tr>";

// email Bcc

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_EMAIL_BCC').'</td>';
		echo '<td><input type="text" size="50" name="email_bcc" value="'.$this->config_data->config_data->email_bcc.'" />';
		echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_EMAIL_DESC')).'</td>';
	echo "\n</tr>";

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';

// Date picker

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_DATE_PICKER').'</td>';
		echo '<td>'.FCP_Common::make_list('date_picker', $this->config_data->config_data->date_picker, $date_picker_list, 0, 'style="margin-bottom:0"'.$date_picker_onchange).'</td>';
	echo "\n</tr>";

// Input date format

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_DATE_FORMAT').'</td>';
		echo '<td>'.FCP_Common::make_list('date_format', $this->config_data->config_data->date_format, $date_format_list, 0, 'style="margin-bottom:0"').'</td>';
	echo "\n</tr>";

// Start day of week

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_STARTDAY').'</td>';
		echo '<td>'.FCP_Common::make_list('start_day', $this->config_data->config_data->start_day, $days_list, 0, 'style="margin-bottom:0"').'</td>';
	echo "\n</tr>";

// logging

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_LOGGING').'</td>';
		echo '<td>'.FCP_Common::make_radio('logging',$this->config_data->config_data->logging).'</td>';
	echo "\n</tr>";
	
// send html, yes/no

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_HTML').'</td>';
		echo '<td>'.FCP_Common::make_radio('email_html',$this->config_data->config_data->email_html).'</td>';
	echo "\n</tr>";
	
// auto fill

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_V_AUTOFILL').'</td>';
		echo '<td>'.$autofill_list.' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_V_AUTOFILL_DESC')).'</td>';
	echo "\n</tr>";

		
// send a copy to the user choices	

	echo "\n<tr>";
		echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_CONFIG_USER_EMAIL_NAME').'</td>';
		echo '<td colspan="3">'.FCP_Common::make_list('show_copy',$this->config_data->config_data->show_copy, $copy_options, 0, 'style="margin-bottom:0"').'</td>';
	echo "\n</tr>";
	
// agreement required

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';
	echo "\n<tr>";
	echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_AGREEMENT_REQUIRED').'<br />'.JText::_('COM_FLEXICONTACT_V_PROMPT').'</td>';
	echo '<td><input type="text" size="40" name="agreement_prompt" value="'.$this->config_data->config_data->agreement_prompt.'" /></td>';
	echo "\n</tr>";
	echo "\n<tr>";
	echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_NAME').'</td>';
	echo '<td><input type="text" size="40" name="agreement_name" value="'.$this->config_data->config_data->agreement_name.'" /></td>';
	echo "\n</tr>";
	echo "\n<tr>";
	echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_LINK').'</td>';
	$info = FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_AGREEMENT_REQUIRED_DESC'));
	echo '<td><input type="text" size="60" name="agreement_link" value="'.$this->config_data->config_data->agreement_link.'" /> '.$info.'</td>';
	echo "\n</tr>";
		
/* THIS WHOLE SECTION IS FOR WHEN FILE ATTACHMENTS ARE IMPLEMENTED

// white list for attachment field type

	echo "\n".'<tr><td colspan="3"><hr /></td></tr>';
	echo "\n"."<tr>";
	echo ' <td class="prompt">'.JText::_('COM_FLEXICONTACT_ATTACHMENT_WHITE_LIST').'</td>';
	echo ' <td valign="top"><textarea rows="5" cols="49" name="white_list">'.$this->config_data->config_data->white_list.'</textarea>';
	echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_ATTACHMENT_WHITE_LIST_DESC')).'</td>';
//	echo "\n".'  <td valign="top">'.$info.'</td>';
	echo "\n"."</tr>";

// max file size for attachment field type

	echo "\n"."<tr>";
	echo '<td class="prompt">'.JText::_('COM_FLEXICONTACT_ATTACHMENT_MAX_SIZE').'</td>';
	echo '<td><input type="text" size="50" name="max_file_size" value="'.$this->config_data->config_data->max_file_size.'" />';
	echo ' '.FCP_Admin::make_info(JText::_('COM_FLEXICONTACT_ATTACHMENT_MAX_SIZE_DESC')).'</td>';
	echo "\n"."</tr>";
*/
	
	echo '</table></form>';
}



}