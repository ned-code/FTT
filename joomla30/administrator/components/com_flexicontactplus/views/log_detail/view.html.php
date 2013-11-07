<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 23 February 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/

defined('_JEXEC') or die('Restricted Access');

class FlexicontactplusViewLog_Detail extends JViewLegacy
{
function display($tpl = null)
{
	FCP_Admin::make_title('COM_FLEXICONTACT_LOG');
	JToolBarHelper::back();
	
	echo '<input type="hidden" name="config_id" value="'.$this->config_id.'" />';
	echo '<input type="hidden" name="config_base_view" value="'.$this->config_base_view.'" />';
	echo '<table class="fc_table">';
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_DATE_TIME').'</strong></td><td>'.$this->log_data->datetime.'</td></tr>';

// config_name and config_lang  was only added to the log at version 7.03 so older logs have it blank - better not to show it
	if ($this->log_data->config_name != '')
		echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_CONFIG_NAME').'</strong></td><td>'.$this->log_data->config_name.'</td></tr>';
	if ($this->log_data->config_lang != '')
		echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_LANGUAGE').'</strong></td><td>'.$this->log_data->config_lang.'</td></tr>';

	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_NAME').'</strong></td><td>'.$this->log_data->name.'</td></tr>';
	
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_EMAIL').'</strong></td>';
	if ($this->log_data->email !='')
		{
		$email_link = 'mailto:'.$this->log_data->email.'?Subject='.$this->log_data->subject;
		echo '<td>'.JHTML::link($email_link, $this->log_data->email, 'target="_blank"').'</td></tr>';
		}
	else
		echo '<td>'.$this->log_data->email.'</td></tr>';
		
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_SUBJECT').'</strong></td><td>'.$this->log_data->subject.'</td></tr>';
	
// the main message

	echo "\n".'<tr><td class="prompt" valign="top"><strong>'.JText::_('COM_FLEXICONTACT_OTHER_DATA').'</strong></td>';
	$message = nl2br($this->log_data->message);
	if (substr($message, 0, 6) == '<br />')
    	$message = substr($message, 6);
	echo "\n".'<td style="white-space: normal;">'.$message.'</td></tr>';
	
// admin_email was only added to the log at version 7.02 so older logs have it blank - better not to show it

	if ($this->log_data->admin_email != '')
		echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_V_EMAIL_TO').'</strong></td><td>'.$this->log_data->admin_email.'</td></tr>';

	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_IP_ADDRESS').'</strong></td><td>'.$this->log_data->ip.'</td></tr>';
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_BROWSER').'</strong></td><td>'.$this->log_data->browser_string.'</td></tr>';
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_STATUS').'</strong></td><td>'.$this->_status($this->log_data->status_main).'</td></tr>';
	echo "\n".'<tr><td class="prompt"><strong>'.JText::_('COM_FLEXICONTACT_STATUS_COPY').'</strong></td><td>'.$this->_status($this->log_data->status_copy).'</td></tr>';
	if ($this->log_data->imported)
		echo "\n".'<tr><td colspan="2">'.JText::_('COM_FLEXICONTACT_IMPORTED').'</td><td></td></tr>';
	echo '</table>';
}

function _status($status)
{
	if ($status == '0')		// '0' status means no mail was sent
		return '';
	if ($status == '1')		// '1' means email was sent ok
		return '<img src="'.LAFC_ADMIN_ASSETS_URL.'tick.png" border="0" alt="" />';
	return $status;			// anything else was an error
}


}