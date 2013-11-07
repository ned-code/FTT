<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 19 March 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

class FlexicontactplusModelData extends JModelLegacy
{
var $_data;
var $_app = null;

function __construct()
{
	parent::__construct();
	$this->_app = JFactory::getApplication();
}

//--------------------------------------------------------------------------------
// Initialises data ONLY for the initial display of the form
// $this->data ends up being an Object
//
function init_data($config_data)
{
	$this->data = new stdClass();

// Get the user name and email defaults
//
	switch ($config_data->autofill)
		{
		case 'off':
			$user_name = '';
			$user_email = '';
			break;
		case 'username':
			$user = JFactory::getUser();
			$user_name = $user->username;
			$user_email = $user->email;
			break;
		case 'name':
			$user = JFactory::getUser();
			$user_name = $user->name;
			$user_email = $user->email;
			break;
		}	

// user defined fields

	$num_fields = count($config_data->all_fields);
	for ($field_index=0; $field_index < $num_fields; $field_index++) 
		{
		$field = &$config_data->all_fields[$field_index];
		$field_id = sprintf('field%03d',$field_index);
		$this->data->$field_id = '';					// most fields start with an empty string
		switch ($field->field_type)
			{
			case LAFC_FIELD_FROM_NAME:
				$this->data->$field_id = $user_name;
				break;
				
			case LAFC_FIELD_FROM_ADDRESS:
				$this->data->$field_id = $user_email;
				break;
				
			case LAFC_FIELD_SUBJECT:
				$this->data->$field_id = $field->default_value;
				break;
				
			case LAFC_FIELD_CHECKBOX_L:
			case LAFC_FIELD_CHECKBOX_H:
			case LAFC_FIELD_CHECKBOX_R:
			case LAFC_FIELD_CHECKBOX_M:
				$this->data->$field_id = '0';
				break;

			case LAFC_FIELD_RADIO_V:
			case LAFC_FIELD_RADIO_H:
				if (!FCP_Common::is_posint($field->default_button,false))
					$default_button = 0;
				else
					$default_button = $field->default_button - 1;
				$this->data->$field_id = $default_button;
				break;

			default:
				$this->data->$field_id = JRequest::getVar($field_id, $field->default_value);
			}
			
		// Now sort out the Post data default, if it exists
		$regex = "#%%(.*?)%%#s";
		$matches = array();
		if (preg_match($regex, $field->default_value, $matches) >0 )
			{
			$this->data->$field_id = htmlspecialchars(JRequest::getVar($matches[1], ''), ENT_COMPAT, 'UTF-8');			
			$value = $matches[1];
			FCP_trace::trace("Init_data: ".$field->prompt." = ".$value." = ".$this->data->$field_id);		
			}
		}
}

// -------------------------------------------------------------------------------
// Get the Get and Post data for a field validation request, or a form send request
// As of version 8.03.01 we double URL-encode all data.
// Joomla up to 2.5 automatically URL-decodes up to ten times but Joomla 3.x does not, so we do it here.
//
function get_data()
{
	$this->data = array_merge($_GET, $_POST);			// get both as a single array
	foreach ($this->data as &$item)
		$item = rawurldecode(rawurldecode($item));
}

// -------------------------------------------------------------------------------
// Validate the whole form
// $this->data has been set up by the controller as an associative array
// Returns true if all valid, false if not
// $response_array is an array of associative arrays where the keys can be:
// an element_id	=> text to be written to the element
// 'f_error'		=> an element id of an input field to add the error class
// 'f_valid'		=> an element id of an input field to remove the error class
// 'e_error'		=> an element id of an error message element to add the error class
// 'e_valid'		=> an element id of an error message element to remove error class and clear its contents
// 'button'			=> re-enable the send button
// 'redirect'		=> a url to redirect to
// 'reloadcaptcha'	=> to re-load recaptcha
//
function validate_all($config_data, &$response_array)
{
	FCP_trace::trace("validate_all");
	$valid = true;
	
// check the session token, but we don't want a redirect happening here so don't use JRequest::checkToken()

	if (LAFC_JVERSION < 300)
		$token = JUtility::getToken();					// get token from session
	else
		$token = JSession::getFormToken();				// get token from session
		
	if (!JRequest::getVar($token, '', 'get', 'alnum'))	// get token from form
		{
		FCP_trace::trace(" Token incorrect or session expired");
		$response = array();
		$response['fcp_wrapper'] = '<div style="padding:20px">'.JText::_('COM_FLEXICONTACT_SESSION').'</div>';
		$response_array = array();						// clear out any other responses
		$response_array[] = $response;
		return -1;										// tell the controller to kill the session
		} 
		
// Do we check the Captcha?

	$user = JFactory::getUser();	
	if ($config_data->show_captcha == 1)
		$check_captcha = true;
	else
		{
		if ($user->guest)
			$check_captcha = true;
		else
			$check_captcha = false;
		}
		
// for image captcha, validate that the correct image was chosen
// if the user gets it wrong more than 5 times, tell the controller to kill the session

	if (($check_captcha) and ($config_data->num_images > 0))
		{
		require_once(LAFC_HELPER_PATH.'/flexi_captcha.php');
		$pic_selected = JRequest::getVar('picselected','');
		$pic_selected = substr($pic_selected,2);	// strip off the i_
		$resp = Flexi_captcha::check($pic_selected);
		switch ($resp)
			{
			case 0:
				FCP_trace::trace(" validating image captcha [$pic_selected] => pass");
				$response = array();
				$response['e_valid'] = 'fcp_err_image';
				$response_array[] = $response;
				break;
			case 1:
				FCP_trace::trace(" validating image captcha [$pic_selected] => fail");
				$response = array();
				$response['fcp_image_outer'] = Flexi_captcha::show_image_captcha($config_data);
				$response['e_error'] = 'fcp_err_image';
				$response['fcp_err_image'] = $this->make_error(JText::_('COM_FLEXICONTACT_WRONG_PICTURE'));
				$response_array[] = $response;
				$valid = false;
				break;
			case 2:
				FCP_trace::trace(" validating image captcha failed more than 5 times");
				$response = array();
				$response['fcp_wrapper'] = '<div style="padding:20px">'.JText::_('COM_FLEXICONTACT_TOO_MANY').'</div>';
				$response_array = array();						// clear out any other responses
				$response_array[] = $response;
				return -1;										// tell the controller to kill the session
			}
		}
	
// if using SecureImage captcha, validate the entry
// if it passes, we will not re-validate in this session

	if (($check_captcha) and ($config_data->secure_captcha))
		{
		$app = JFactory::getApplication();
		$secure_captcha_passed = $app->getUserState(LAFC_COMPONENT."_secure_captcha_passed",'N');
		if ($secure_captcha_passed == 'N')
			{
			require_once(LAFC_HELPER_PATH.'/secure_captcha.php');
			$captcha_code = JRequest::getVar('fcp_captcha_code','');
			if (Secure_captcha::check($captcha_code))
				{
				FCP_trace::trace(" validating SecureImage [$captcha_code] => pass");
				$response = array();
				$response['e_valid'] = 'fcp_err_captcha';
				$response['f_valid'] = 'fcp_captcha_code';
				$response_array[] = $response;
				$app->setUserState(LAFC_COMPONENT."_secure_captcha_passed", "Y");
				}
			else
				{
				FCP_trace::trace(" validating SecureImage [$captcha_code] => fail");
				$response = array();
				$response['e_error'] = 'fcp_err_captcha';
				$response['f_error'] = 'fcp_captcha_code';
				$response['fcp_err_captcha'] = $this->make_error(JText::_('COM_FLEXICONTACT_CAPTCHA_INVALID'));
				$response_array[] = $response;
				$valid = false;
				}
			}
		}

// if using ReCaptcha, validate it
// if it passes, we will not re-validate in this session
// if it doesn't pass, tell the Javascript to re-load a different challenge because each challenge can only be used once

	if (($check_captcha) and ($config_data->recaptcha_theme > 0))
		{
		$app = JFactory::getApplication();
		$recaptcha_passed = $app->getUserState(LAFC_COMPONENT."_recaptcha_passed",'N');
		if ($recaptcha_passed == 'N')
			{
			require_once(LAFC_HELPER_PATH.'/recaptchalib.php');
			$recaptcha_challenge_field = JRequest::getVar('recaptcha_challenge_field','');
			$recaptcha_response_field = JRequest::getVar('recaptcha_response_field','');
			$remote_addr = $_SERVER["REMOTE_ADDR"];
			$resp = recaptcha_check_answer($config_data->recaptcha_private_key,
				$remote_addr, $recaptcha_challenge_field, $recaptcha_response_field);
			if ($resp->is_valid)
				{
				FCP_trace::trace(" validating ReCaptcha [$recaptcha_response_field] => pass");
				$response = array();
				$response['e_valid'] = 'fcp_err_recap';
				$response_array[] = $response;
				$app->setUserState(LAFC_COMPONENT."_recaptcha_passed", "Y");
				}
			else
				{
				FCP_trace::trace(" validating ReCaptcha [$recaptcha_response_field] => ".$resp->error);
				$response = array();
				$response['e_error'] = 'fcp_err_recap';
				$response['fcp_err_recap'] = $this->make_error(JText::_('COM_FLEXICONTACT_CAPTCHA_INVALID'));
				$response['reloadcaptcha'] = 'Yes';
				$response_array[] = $response;
				$valid = false;
				}
			}
		}
				
// if using magic word, validate the word

	if (($check_captcha) and ($config_data->magic_word != ''))
		{
		$magic_word = JRequest::getVar('fcp_magic','');
		if (strcasecmp($magic_word,$config_data->magic_word) == 0)
			{
			FCP_trace::trace(" validating magic word [$magic_word] vs [$config_data->magic_word] => pass");
			$response = array();
			$response['e_valid'] = 'fcp_err_magic';
			$response['f_valid'] = 'fcp_magic';
			$response_array[] = $response;
			}
		else
			{
			FCP_trace::trace(" validating magic word [$magic_word] vs [$config_data->magic_word] => fail");
			$response = array();
			$response['e_error'] = 'fcp_err_magic';
			$response['f_error'] = 'fcp_magic';
			$response['fcp_err_magic'] = $this->make_error(JText::_('COM_FLEXICONTACT_WRONG_MAGIC_WORD'));
			$response_array[] = $response;
			$valid = false;
			}
		}
	
// validate all the user defined fields

	$fields_valid = $this->validate_fields($config_data, $response_array);
	return ($valid and $fields_valid);		// if both valid return true, else false
}

// -------------------------------------------------------------------------------
// Validate one or more input fields
// $this->data has been set up by the controller as an associative array
// Returns true if all valid, false if not
// see validate_all() for the definition of the response_array
//
function validate_fields($config_data, &$response_array)
{
	$valid = true;
	foreach ($this->data as $field_id => $field_value)
		{
		if (substr($field_id,0,5) != 'field')					// we only look at user defined fields here
			continue;
		$field_index = intval(substr($field_id,5,3));			// field id's are 'fieldnnn' or 'fieldnnnmm' for multiple checkboxes
		$field = &$config_data->all_fields[$field_index];		// point to the field configuration
		$error_id = sprintf('fcp_err%03d',$field_index);
		FCP_trace::trace(" validating $field_id ($field->prompt) => [$field_value]");

// don't validate hidden fields

		if (!$field->visible)
			continue;
		
// valid unless found otherwise

		$response = array();
		$response['f_valid'] = $field_id;
		$response['e_valid'] = $error_id;
		
// if the field is mandatory and empty, that's the only error we will report for this field

		if (($field->mandatory) and (empty($field_value)))
			{
			$response = array();
			$response['f_error'] = $field_id;
			$response['e_error'] = $error_id;
			$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_REQUIRED'));
			$valid = false;
			$response_array[] = $response;
			continue;
			}
			
// if the field is mandatory and not empty, we must clear its error

		if (($field->mandatory) and (!empty($field_value)))
			$response_array[] = $response;
			
// if the field is not mandatory and is empty, we must not validate it and we must clear its error

		if ((!$field->mandatory) and (empty($field_value))) 
			{
			$response_array[] = $response;
			continue;
			}

// checkboxes and radio buttons don't need to be validated	

		if (in_array($field->field_type,array(LAFC_FIELD_CHECKBOX_L, LAFC_FIELD_CHECKBOX_H, LAFC_FIELD_CHECKBOX_R,
											LAFC_FIELD_CHECKBOX_M, LAFC_FIELD_RADIO_V, LAFC_FIELD_RADIO_H)))
			continue;

// now the field type specific validation

		switch ($field->field_type)
			{
			case LAFC_FIELD_FROM_ADDRESS:
				jimport('joomla.mail.helper');
				if (JMailHelper::isEmailAddress($field_value))
					break;
				$response = array();
				$response['f_error'] = $field_id;
				$response['e_error'] = $error_id;
				$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_BAD_EMAIL'));
				$valid = false;
				break;

			case LAFC_FIELD_TEXT_NUMERIC:
				if (FCP_Common::is_posint($field_value))
					break;
				$response = array();
				$response['f_error'] = $field_id;
				$response['e_error'] = $error_id;
				$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_INVALID'));
				$valid = false;
				break;

			case LAFC_FIELD_DATE:
				$yyyy_mm_dd = self::reformat_date($field_value, $config_data->date_format);
				if (!self::validate_date($yyyy_mm_dd))
					{
					$date_string = self::get_date_string($config_data->date_format);
					$response = array();
					$response['f_error'] = $field_id;
					$response['e_error'] = $error_id;
					$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_INVALID').' ('.$date_string.')');
					$valid = false;
					break;
					}
				switch ($field->validation_type)
					{
					case VALTYPE_PAST: 
						FCP_trace::trace("   must be in the past");
						$today = date('Y-m-d');
						if ($yyyy_mm_dd > $today)
							{
							$response = array();
							$response['f_error'] = $field_id;
							$response['e_error'] = $error_id;
							$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_DATE_PAST'));
							$valid = false;
							FCP_trace::trace("   - invalid, not in the past");
							}
						break;
					case VALTYPE_FUTURE: 
						FCP_trace::trace("   must be in the future");
						$today = date('Y-m-d');
						if ($yyyy_mm_dd < $today)
							{
							$response = array();
							$response['f_error'] = $field_id;
							$response['e_error'] = $error_id;
							$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_DATE_FUTURE'));
							$valid = false;
							FCP_trace::trace("   - invalid, not in the future");
							}
						break;
					case VALTYPE_GREATER: 
						FCP_trace::trace("   must be greater than the previous field");
						if ($field_index == 0)
							break;															// no previous field - forget it
						$previous_field_index = $field_index - 1;							// previous field index
						$previous_field_config = &$config_data->all_fields[$previous_field_index];
						if ($previous_field_config->field_type != LAFC_FIELD_DATE)
							break;															// not a date field - forget it
						$previous_field_id = sprintf('field%03d',($previous_field_index));	// form the ID of the previous field
						FCP_trace::trace("   previous field ID:".$previous_field_id);
						if (!isset($this->data[$previous_field_id]))
							break;															// no value - forget it
						$previous_field_value = $this->data[$previous_field_id];
						$previous_field_yyyy_mm_dd = self::reformat_date($previous_field_value, $config_data->date_format);
						$previous_field_prompt = $previous_field_config->prompt;
						FCP_trace::trace("   previous field [".$previous_field_prompt.'] value: '.$previous_field_value. ' (current field value: '.$yyyy_mm_dd.')');
						if ($yyyy_mm_dd <= $previous_field_yyyy_mm_dd)
							{
							$response = array();
							$response['f_error'] = $field_id;
							$response['e_error'] = $error_id;
							$response[$error_id] = $this->make_error(JText::sprintf('COM_FLEXICONTACT_DATE_GREATER',$previous_field_prompt));
							$valid = false;
							FCP_trace::trace("   - invalid, not greater than previous field");
							}
						break;
					}
				break;

			case LAFC_FIELD_REGEX:
				FCP_trace::trace("  validate regex: ".$field->regex);
				if (@preg_match($field->regex, $field_value) > 0)
					break;
				$response = array();
				$response['f_error'] = $field_id;
				$response['e_error'] = $error_id;
				if ($field->error_msg == '')
					$response[$error_id] = $this->make_error(JText::_('COM_FLEXICONTACT_INVALID'));
				else
					$response[$error_id] = $this->make_error($field->error_msg);
				$valid = false;
				break;
			} // end switch
		
		$response_array[] = $response;
		
		} // end foreach
		
	return $valid;
}

//-------------------------------------------------------------------------------
// Convert any of our date formats to YYYY-MM-DD
// 2 digit year formats are hard coded to 20xx
//
static function reformat_date($field_value, $date_format)
{
	switch ($date_format)
		{
		case 2:
		case 7:
			$yyyy_mm_dd = '20'.substr($field_value, 6, 2).'-'.substr($field_value, 3, 2).'-'.substr($field_value, 0, 2);
			break;
		case 3:
			$yyyy_mm_dd = '20'.substr($field_value, 6, 2).'-'.substr($field_value, 0, 2).'-'.substr($field_value, 3, 2);
			break;
		case 4:
		case 6:
			$yyyy_mm_dd = substr($field_value, 6, 4).'-'.substr($field_value, 3, 2).'-'.substr($field_value, 0, 2);
			break;
		case 5:
			$yyyy_mm_dd = substr($field_value, 6, 4).'-'.substr($field_value, 0, 2).'-'.substr($field_value, 3, 2);
			break;
		case 1:
		default:
			$yyyy_mm_dd = $field_value;
		}
	return $yyyy_mm_dd;
}

//-------------------------------------------------------------------------------
// Check that the input date is valid YYYY-MM-DD
// Returns true if valid, false if not
//
static function validate_date($yyyy_mm_dd)
{
	FCP_trace::trace("  validate_date($yyyy_mm_dd)");
	
	if (strlen($yyyy_mm_dd) != 10)
		return false;
	if (($yyyy_mm_dd{4} != '-') or ($yyyy_mm_dd{7} != '-'))
		return false;
	if (!is_numeric(substr($yyyy_mm_dd, 8,2)))
		return false;
	if (!is_numeric(substr($yyyy_mm_dd, 5,2)))
		return false;
	if (!is_numeric(substr($yyyy_mm_dd, 0, 4)))
		return false;
	return checkdate(substr($yyyy_mm_dd, 5, 2),		// month
				 substr($yyyy_mm_dd, 8, 2),			// day
				 substr($yyyy_mm_dd, 0, 4));		// year
}

//-------------------------------------------------------------------------------
// Returns a date format string (yyyy-mm-dd) for the relevant date format
//
static function get_date_string($date_format)
{
	switch ($date_format)
		{
		case 1:
			$date_string = 'yyyy-mm-dd';
			break;
		case 2:
			$date_string = 'dd-mm-yy';
			break;
		case 3:
			$date_string = 'mm-dd-yy';
			break;
		case 4:
			$date_string = 'dd-mm-yyyy';
			break;
		case 5:
			$date_string = 'mm-dd-yyyy';
			break;
		case 6:
			$date_string = 'dd.mm.yyyy';
			break;
		case 7:
			$date_string = 'dd.mm.yy';
			break;
		}
	
	return $date_string;

}

//-------------------------------------------------------------------------------
// Make an error message
//
function make_error($msg)
{
	return '<span class="hasTip" title="'.$msg.'"></span><span class="fcp_err">'.$msg.'</span>';
}


}
		
		