<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 11 August 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

class FlexicontactplusModelEmail extends JModelLegacy
{
var $_data;
var $_app = null;

function __construct()
{
	parent::__construct();
	$this->_app = JFactory::getApplication();
}

//--------------------------------------------------------------------------------
// Initialise data for merging with the email templates
// - we setup some extra variables that supplement the field data
//
function init_data($config_data)
{
	$this->data = new stdClass();
//
// Get the Get and Post data
// As of version 8.03.01 we double URL-encode all data.
// Joomla up to 2.5 automatically URL-decodes up to ten times but Joomla 3.x does not, so we do it here.
//
	$data = array_merge($_GET, $_POST);			// get both as a single array
	foreach ($data as $key => $value)			// create objects for each field
		{
	    $this->data->$key = rawurldecode(rawurldecode($value));
	    if ((substr($key,0,5) == 'field') and (strlen($key) > 8))	// multiple checkboxes come in as 'fieldnnnmmm'
	    	{
	    	$parent_field_name = substr($key,0,8);					// 'fieldnnn'
	    	$this->data->$parent_field_name = '1';					// create a dummy entry for the parent field
	    	}
	    }

// we now have all the form data in $this->data
// build a few more data items

	$this->data->all_data   = '';				// all data as a single string
	$this->data->other_data = '';				// all data except name, address and subject
	
	foreach ($config_data->all_fields as $field_index => $field)
		{
		$field_id = sprintf('field%03d',$field_index);
		switch ($field->field_type)
			{
			case LAFC_FIELD_FROM_NAME:
				$this->data->from_name = $this->data->$field_id;
				$this->data->all_data .= '['.$field->prompt.'] '.$this->data->from_name.'<br />';
				break;
				
			case LAFC_FIELD_FROM_ADDRESS:
				$this->data->from_email = $this->data->$field_id;
				$this->data->all_data  .= '['.$field->prompt.'] '.$this->data->from_email.'<br />';
				break;
				
			case LAFC_FIELD_SUBJECT:
				$raw_subject = $this->data->$field_id;
				$this->data->subject   = $this->email_merge($raw_subject, $config_data);
				$this->data->all_data .= '['.$field->prompt.'] '.$this->data->subject.'<br />';
				break;

			case LAFC_FIELD_RECIPIENT:
				$list_index = $this->data->$field_id;							// get the selection index
				if (!FCP_Common::is_posint($list_index,false))					// should be an integer
					break;
				$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
				$this->data->recipient_email = $list_array['RIGHT'][$list_index];
				$this->data->recipient_name =  $list_array['LEFT'][$list_index];
				FCP_trace::trace("Overriding recipient from ".$config_data->email_to." to ".$this->data->recipient_email);
				$config_data->email_to = $this->data->recipient_email;			// override the "email_to" in general configuration
				$this->data->all_data   .= '['.$field->prompt.'] '.$this->data->recipient_name.' ('.$this->data->recipient_email.')<br />';
				break;
				
			case LAFC_FIELD_CHECKBOX_M:
				if (isset($this->data->$field_id))		// the parent field has its dummy entry set
					{									// we need to collect up all the child checkbox names
					$text = '';
					$comma = '';
					$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
					foreach ($list_array['LEFT'] as $key => $value)
						{
						$child_field_id = $field_id.$key;
						if (isset($this->data->$child_field_id) and ($this->data->$child_field_id == '1'))
							{
							$text .= $comma.$value;
							$comma = ', ';
							}
						}
					$this->data->$field_id = $text;
					}
				$this->data->all_data   .= '['.$field->prompt.'] '.$text.'<br />';
				$this->data->other_data .= '['.$field->prompt.'] '.$text.'<br />';
				break;
			
			case LAFC_FIELD_FIELDSET_START:
			case LAFC_FIELD_FIELDSET_END:
			case LAFC_FIELD_FIXED_TEXT:
				break;						// we don't want these in all_data or other_data
				
			default:
				$this->data->all_data   .= '['.$field->prompt.'] '.$this->get_field_value($config_data, $field_index).'<br />';
				$this->data->other_data .= '['.$field->prompt.'] '.$this->get_field_value($config_data, $field_index).'<br />';
				break;
			}
		}
		
// get the value of the show_copy checkbox, if any

	$this->data->show_copy = JRequest::getVar('show_copy','');

// user info

	$this->data->ip = $this->getIPaddress();
	$this->data->browser_id = $this->getBrowser($this->data->browser_string);
	$this->data->site_url = JURI::root();
	$this->data->site_name = $this->_app->getCfg('sitename');
	
	FCP_trace::trace("Email model data: ".print_r($this->data,true));
}

//-------------------------------------------------------------------------------
// Get a field value for a user defined field
// - for most types we can just return the raw post data
// - for a few types we need to do some special processing
//
function get_field_value($config_data, $field_index)
{
	$field_id = sprintf('field%03d',$field_index);					// form the post data field name
	
	if (!isset($config_data->all_fields[$field_index]))
		return '';
		
	$field = $config_data->all_fields[$field_index];				// point to the field configuration
	
	if (LAFC_JVERSION == 150)
		{
		$yes_text = JText::_('COM_FLEXICONTACT_YES');
		$no_text = JText::_('COM_FLEXICONTACT_NO');
		}
	else
		{
		$yes_text = JText::_('JYES');
		$no_text = JText::_('JNO');
		}

	switch ($field->field_type)
		{
		case LAFC_FIELD_CHECKBOX_L:
		case LAFC_FIELD_CHECKBOX_R:
		case LAFC_FIELD_CHECKBOX_H:									// CHECKBOX_M has already been built by init_data()
			if ($this->data->$field_id == '1')
				return $yes_text;
			else
				return $no_text;
			break;
			
		case LAFC_FIELD_LIST:
			$list_index = $this->data->$field_id;					// get the selection from the input data
			if (!FCP_Common::is_posint($list_index,false))			// should be an integer
				break;
			$list_array = FCP_Common::split_list($field->list_list, $field->delimiter);
			return $list_array['LEFT'][$list_index];				// only one string for list boxes
			break;

		case LAFC_FIELD_RADIO_V:
		case LAFC_FIELD_RADIO_H:
			$list_index = $this->data->$field_id;					// get the selection from the input data
			if (!FCP_Common::is_posint($list_index,false))
				return '';
			$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
			return $list_array['RIGHT'][$list_index];				// return the right hand string
			break;

		case LAFC_FIELD_RECIPIENT:
			return $this->data->recipient_name;
			break;
			
		case LAFC_FIELD_TEXTAREA:
			return nl2br($this->data->$field_id);			
			
		default:
			return $this->data->$field_id;
		}
}

//-------------------------------------------------------------------------------
// Resolve a single email variable
//
function email_resolve($config_data, $variable)
{
// field prompts

	if (strncmp($variable, LAFC_T_FIELD_PROMPT, LAFC_T_OFFSET_P_XX) == 0)	// e.g: %V_FIELD_PROMPT_03%
		{
		$field_number = substr($variable, LAFC_T_OFFSET_P_XX, 2);			// 1-based field number
		if (!FCP_Common::is_posint($field_number,false))
			return '';
		$field_index = $field_number - 1;									// 0-based array index
		if (!isset($config_data->all_fields[$field_index]->prompt))
			return '';
		return $config_data->all_fields[$field_index]->prompt;				// get the prompt from the config data
		}

// field values

	if (strncmp($variable, LAFC_T_FIELD_VALUE, LAFC_T_OFFSET_V_XX) == 0)	// e.g: %V_FIELD_VALUE_03%
		{
		$field_number = substr($variable, LAFC_T_OFFSET_V_XX, 2);			// 1-based field number
		if (!FCP_Common::is_posint($field_number,false))
			return '';
		$field_index = $field_number - 1;									// 0-based array index
		return $this->get_field_value($config_data, $field_index);
		}

// other variables

	switch ($variable)
		{
		case LAFC_T_FROM_NAME:
			if (isset($this->data->from_name))
				return $this->data->from_name;
			else
				return '';
			
		case LAFC_T_FROM_EMAIL:
			if (isset($this->data->from_email))
				return $this->data->from_email;
			else
				return '';
			
		case LAFC_T_SUBJECT:
			return $this->data->subject;
			
		case LAFC_T_ALL_DATA:
			return $this->data->all_data;
			
		case LAFC_T_OTHER_DATA:
			return $this->data->other_data;
			
		case LAFC_T_BROWSER:
			return $this->data->browser_string;
			
		case LAFC_T_IP_ADDRESS:
			return $this->data->ip;
			
		case LAFC_T_URL_PATH:
			$app = JFactory::getApplication();
			return $app->getUserState(LAFC_COMPONENT."_url_path",'');		// we stored it earlier
			
		case LAFC_T_SITE_URL:
			return $this->data->site_url;
			
		case LAFC_T_SITE_NAME:
			return $this->data->site_name;
			
		case LAFC_T_PAGE_TITLE:
			$app = JFactory::getApplication();
			return $app->getUserState(LAFC_COMPONENT."_page_title",'');		// we stored it earlier
			
		default:
			return '';
		}
}

//-------------------------------------------------------------------------------
// Merge an email template with post data
//
function email_merge($template_text, $config_data)
{
	$text = $template_text;
	$variable_regex = "#%V_*(.*?)%#s";

	preg_match_all($variable_regex, $text, $variable_matches, PREG_SET_ORDER);

	foreach ($variable_matches as $match)
		{
		$resolved_text = $this->email_resolve($config_data, $match[0]);
		$text = str_replace($match[0], $resolved_text, $text);
		}
	return $text;
}

// -------------------------------------------------------------------------------
// Send the email
// Returns blank if ok, or an error message on failure
//
function sendEmail($config_data)
{
	if (FCP_trace::tracing())
		{
		FCP_trace::trace("=====> Send Email() - Config Data: ".print_r($config_data,true));
		FCP_trace::trace("=====> Send Email() - Email Model Data: ".print_r($this->data,true));
		}
		
// If the Subject field is invisible, then load it from the config

	foreach ($config_data->all_fields as $field)
		{
		if ($field->field_type != LAFC_FIELD_SUBJECT)		// Only interested in the Subject field
			continue;

		if (!$field->visible)
			{
			$this->data->subject = $field->default_value;
			FCP_trace::trace(" Setting subject from config to [$field->default_value]");
			break;
			}
		else
			{
			FCP_trace::trace(" Subject field visible therefore left at current value");
			break;
			}
		}
		
// build the message to be sent to the site admin

	$body = $this->email_merge($config_data->admin_template, $config_data);
	$this->data->subject = $this->email_merge($this->data->subject, $config_data);
	jimport('joomla.mail.helper');
	$clean_body = JMailHelper::cleanBody($body);
	$clean_subject = JMailHelper::cleanSubject($this->data->subject);

// build the Joomla mail object

	$mail = JFactory::getMailer();

	if ($config_data->email_html)
		$mail->IsHTML(true);
	else
		$clean_body = $this->html2text($clean_body);
		
	if ($config_data->email_from == '')						// v7.01
		$email_from = $this->data->from_email;				// use form data
	else
		$email_from = $config_data->email_from;				// use FlexiContact Global Configuration
		
	if ($config_data->email_from_name == '')				// v7.01
		$email_from_name = $this->data->from_name;			// use form data
	else
		$email_from_name = $config_data->email_from_name;	// use FlexiContact Global Configuration

// 8.00: don't try to send an email with a blank from name or address
// this could happen if those fields are non-mandatory on the email form

	$app = JFactory::getApplication();
	if (empty($email_from))
		$email_from = $app->getCfg('mailfrom');				// use Joomla Global Configuration
	if (empty($email_from_name))
		$email_from_name = $app->getCfg('fromname'); 		// use Joomla Global Configuration

	$mail->setSender(array($email_from, $email_from_name));
	$mail->addRecipient($config_data->email_to);
	$this->data->admin_email = $config_data->email_to;		// store it for the log model
	if (!empty($config_data->email_cc))
		{
		$addresses = explode(',', $config_data->email_cc);
		foreach ($addresses as $address)
			$mail->addCC($address);
		}
	if (!empty($config_data->email_bcc))
		{
		$addresses = explode(',', $config_data->email_bcc);
		foreach ($addresses as $address)
			$mail->addBCC($address);
		}
	if (!empty($this->data->from_email))
		$mail->addReplyTo(array($this->data->from_email, $this->data->from_name));
	$mail->setSubject($clean_subject);
	$mail->setBody($clean_body);
	
	if (FCP_trace::tracing())
		FCP_trace::trace("=====> Sending admin email: ".print_r($mail,true));
	
	if (defined('LAFC_DEMO_MODE'))
		$ret_main = true;
	else
		$ret_main = $mail->Send();

	if ($ret_main === true)
		{
		$this->data->status_main = '1';
		FCP_trace::trace("=====> Admin email sent ok");
		}
	else
		{
		$this->data->status_main = $mail->ErrorInfo;
		FCP_trace::trace("=====> Admin email send failed: ".$mail->ErrorInfo);
		}
	
// if we should send the user a copy, send it separately
// don't even attempt it if the from_email address is blank

	if ((!empty($this->data->from_email)) and (($config_data->show_copy == LAFC_COPYME_ALWAYS) or ($this->data->show_copy == 1)))
		{
		$body = $this->email_merge($config_data->user_template, $config_data);
		$clean_body = JMailHelper::cleanBody($body);
		$mail = JFactory::getMailer();
		if ($config_data->email_html)
			$mail->IsHTML(true);
		else
			$clean_body = $this->html2text($clean_body);
			
		if ($config_data->email_from == '')						// v7.01
			$email_from = $app->getCfg('mailfrom');				// use Joomla Global Configuration
		else
			$email_from = $config_data->email_from;				// use FlexiContact Global Configuration

		if ($config_data->email_from_name == '')				// v7.01
			$email_from_name = $app->getCfg('fromname'); 		// use Joomla Global Configuration
		else
			$email_from_name = $config_data->email_from_name;	// use FlexiContact Global Configuration
			
		$mail->setSender(array($email_from, $email_from_name));
		$mail->addRecipient($this->data->from_email);
		$mail->setSubject($clean_subject);
		$mail->setBody($clean_body);

		if (FCP_trace::tracing())
			FCP_trace::trace("=====> Sending user email: ".print_r($mail,true));
			
		if (defined('LAFC_DEMO_MODE'))
			$ret_copy = true;
		else
			$ret_copy = $mail->Send();
			
		if ($ret_copy === true)
			{
			$this->data->status_copy = '1';
			FCP_trace::trace("=====> User email sent ok");
			}
		else
			{
			$this->data->status_copy = $mail->ErrorInfo;
			FCP_trace::trace("=====> User email send failed: ".$mail->ErrorInfo);
			}
		}
	else
		$this->data->status_copy = '0';		// copy not requested or no email address provided
		
	FCP_trace::trace("=====> SendEmail function returning: ".$this->data->status_main);
	return $this->data->status_main;		// both statuses are logged, but the main status decides what happens next
}

// -------------------------------------------------------------------------------
// Found at http://sb2.info/php-script-html-plain-text-convert/
//
function html2text($html)
{
    $tags = array (
    0 => '~<h[123][^>]+>~si',
    1 => '~<h[456][^>]+>~si',
    2 => '~<table[^>]+>~si',
    3 => '~<tr[^>]+>~si',
    4 => '~<li[^>]+>~si',
    5 => '~<br[^>]+>~si',
    6 => '~<p[^>]+>~si',
    7 => '~<div[^>]+>~si',
    );
    $html = preg_replace($tags,"\n",$html);
    $html = preg_replace('~</t(d|h)>\s*<t(d|h)[^>]+>~si',' - ',$html);
    $html = preg_replace('~<[^>]+>~s','',$html);
    // reducing spaces
    $html = preg_replace('~ +~s',' ',$html);
    $html = preg_replace('~^\s+~m','',$html);
    $html = preg_replace('~\s+$~m','',$html);
    // reducing newlines
    $html = preg_replace('~\n+~s',"\n",$html);
    return $html;
}

//-----------------------------------------
// Get client's IP address
//
function getIPaddress()
{
	if (isset($_SERVER["REMOTE_ADDR"]))
		return $_SERVER["REMOTE_ADDR"];
	if (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
		return $_SERVER["HTTP_X_FORWARDED_FOR"];
	if (isset($_SERVER["HTTP_CLIENT_IP"]))
		return $_SERVER["HTTP_CLIENT_IP"];
	return "unknown";
} 

//-------------------------------------------------------------------------------
// Get client's browser
// Returns 99 for unknown, 0 for msie, 1 for firefix, etc
//
function getBrowser(&$browser_string)
{ 
    $u_agent = $_SERVER['HTTP_USER_AGENT']; 
    $browser_string = 'Unknown';

    if (strstr($u_agent, 'MSIE') && !strstr($u_agent, 'Opera')) 
    	{ 
        $browser_string = 'MSIE'; 
        return 0; 
    	} 
    if (strstr($u_agent, 'Firefox')) 
    	{ 
        $browser_string = 'Firefox'; 
        return 1; 
    	} 
    if (strstr($u_agent, 'Chrome')) 	 // must test for Chrome before Safari!
    	{ 
        $browser_string = 'Chrome'; 
        return 3; 
    	} 
    if (strstr($u_agent, 'Safari')) 
    	{ 
        $browser_string = 'Safari'; 
        return 2; 
    	} 
    if (strstr($u_agent, 'Opera')) 
    	{ 
        $browser_string = 'Opera'; 
        return 4; 
    	} 
    if (strstr($u_agent, 'Netscape')) 
    	{ 
        $browser_string = 'Netscape'; 
        return 5; 
    	} 
    if (strstr($u_agent, 'Konqueror')) 
    	{ 
        $browser_string = 'Konqueror'; 
        return 6; 
    	} 
} 

}
		
		