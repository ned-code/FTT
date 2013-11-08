<?php
/********************************************************************
Product		: Flexicontact Plus
Date		: 28 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted access');

class FlexicontactplusModelConfig extends JModelLegacy
{
var $_data;
var $_app = null;
var $_pagination = null;

function __construct()
{
	parent::__construct();
	$this->_app = JFactory::getApplication();
}

//-------------------------------------------------------------------------------
// initialise the data
// USAGE: Back end only
//
function initData()	
{
	$this->_data = new stdClass();
	$this->_data->id = 0;
	$this->_data->published = 0;
	$this->_data->default_config = 0;				// the default config row has a 1 here
	$this->_data->name = '';
	$this->_data->language = 'en-GB';
	$this->_data->description = '';
	$this->_data->config_data = new stdClass();		// this is the object structure (not serialized)
	$this->defaultConfigData();						// set all defaults
	return $this->_data;
}

//-------------------------------------------------------------------------------
// Set defaults for all config properties
// USAGE: Back end only
//
function defaultConfigData()
{
	$config_data = &$this->_data->config_data;

// general
	
	if (!isset($config_data->email_from))
		$config_data->email_from = '';				// v7.01
	if (!isset($config_data->email_from_name))
		$config_data->email_from_name = '';			// v7.01
	if (!isset($config_data->email_to))
		$config_data->email_to = $this->_app->getCfg('mailfrom');
	if (!isset($config_data->email_cc))
		$config_data->email_cc = '';
	if (!isset($config_data->email_bcc))
		$config_data->email_bcc = '';

	if (empty($config_data->logging)) 
		$config_data->logging = 0;
	if (!isset($config_data->email_html))
		$config_data->email_html = 1;
	if (empty($config_data->autofill)) 
		$config_data->autofill = 'off';
	if (!isset($config_data->show_copy)) 
		$config_data->show_copy = LAFC_COPYME_CHECKBOX;

	if (!isset($config_data->agreement_prompt))
		$config_data->agreement_prompt = '';
	if (!isset($config_data->agreement_name))
		$config_data->agreement_name = '';
	if (!isset($config_data->agreement_link))
		$config_data->agreement_link = '';
		
	if (!isset($config_data->date_format))
		$config_data->date_format = '1';
	if (!isset($config_data->start_day))
		$config_data->start_day = '0';
	if (!isset($config_data->date_picker))
		$config_data->date_picker = '010';

	if (!isset($config_data->white_list))
		$config_data->white_list = "txt, csv, doc, docx";
	if (!isset($config_data->max_file_size))
		$config_data->max_file_size = LAFC_MAX_FILE_SIZE;
	
	if (!isset($config_data->css_file))
		$config_data->css_file = LAFC_FRONT_CSS_NAME;
	
// fields

	if (!isset($config_data->all_fields))
		$config_data->all_fields = array();		// each element is an object of stdClass
	else	
		{
		$num_fields = count($config_data->all_fields);
		for ($i=0; $i < $num_fields; $i++)
			{									// Add any new field properties here and in initField()
			$field = &$config_data->all_fields[$i];
			if (!isset($field->delimiter))
				$field->delimiter = ',';
			if (!isset($field->css_class))
				$field->css_class = '';
			if (!isset($field->error_msg))
				$field->error_msg = '';
			if (!isset($field->tooltip))
				$field->tooltip = '';
			if (!isset($field->default_button))
				$field->default_button = '';
			if (!isset($field->regex))
				$field->regex = '';
			if (!isset($field->validation_type))
				$field->validation_type = VALTYPE_ANY;
			}
		}
	
// confirmation page

	if (!isset($config_data->confirm_link))
		$config_data->confirm_link = '';
	if (!isset($config_data->confirm_text))
		$config_data->confirm_text = JText::_('COM_FLEXICONTACT_MESSAGE_SENT');
	
// templates

	if (!isset($config_data->user_template))
		$config_data->user_template = '%V_MESSAGE_DATA%<br />';
	if (!isset($config_data->admin_template))
		$config_data->admin_template = 'From %V_FROM_NAME% at %V_FROM_EMAIL%<br /><br />%V_MESSAGE_DATA%<br />';
	
// top and bottom text

	if (!isset($config_data->top_text))
		$config_data->top_text = '';
	if (!isset($config_data->bottom_text))
		$config_data->bottom_text = '';

// captcha

	if (!isset($config_data->show_captcha))
		$config_data->show_captcha = 1;
		
	if (!isset($config_data->magic_word))
		$config_data->magic_word = '';
	if (!isset($config_data->magic_word_prompt))
		$config_data->magic_word_prompt = JText::_('COM_FLEXICONTACT_V_MAGIC_WORD');

	if (!isset($config_data->num_images))
		$config_data->num_images = 0;
	if (!isset($config_data->num_images))
		$config_data->num_images = 0;
	if (!isset($config_data->image_height))
		$config_data->image_height = '';
	if (!isset($config_data->image_width))
		$config_data->image_width = '';
	if (empty($config_data->noise))
		$config_data->noise = 0;

	if (empty($config_data->secure_captcha))
		$config_data->secure_captcha = 0;
	if (!isset($config_data->secure_captcha_prompt))
		$config_data->secure_captcha_prompt = JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA_PROMPT');
	if (empty($config_data->captcha_height))
		$config_data->captcha_height = 50;
	if (empty($config_data->captcha_width))
		$config_data->captcha_width = 120;
	if (empty($config_data->captcha_colour_text))
		$config_data->captcha_colour_text = '707070';
	if (empty($config_data->captcha_colour_lines))
		$config_data->captcha_colour_lines = '707070';
	if (empty($config_data->captcha_colour_background))
		$config_data->captcha_colour_background = 'FFFFFF';

	if (!isset($config_data->recaptcha_theme))
		$config_data->recaptcha_theme = 0;
	if (!isset($config_data->recaptcha_public_key))
		$config_data->recaptcha_public_key = '';
	if (!isset($config_data->recaptcha_private_key))
		$config_data->recaptcha_private_key = '';
	if (!isset($config_data->recaptcha_language))
		$config_data->recaptcha_language = '';

}

//-------------------------------------------------------------------------------
// Initialise a new field
// USAGE: Back end only
//
function &initField($field_type=LAFC_FIELD_NONE)
{
	$field = new stdClass();
	$field->field_type = $field_type;
	$field->prompt = '';
	$field->width = '';
	$field->height = 4;
	$field->list_list = '';
	$field->mandatory = 0;
	$field->visible = 1;
	$field->default_value = '';
	$field->delimiter = ',';
	$field->css_class = '';
	$field->error_msg = '';
	$field->tooltip = '';
	$field->default_button = '';
	$field->regex = '';			// add any new field properties here and in defaultConfigData()
	$field->validation_type = VALTYPE_ANY;
	return $field;
}	

//-------------------------------------------------------------------------------
// Expand a config record to its object structure
// - set all defaults (in case we add new properties)
// - validate the field structure, just in case anything got screwed up
//
function _expand()
{
	$this->_data->config_data = unserialize($this->_data->config_data);
	$this->defaultConfigData();
	$num_fields = count($this->_data->config_data->all_fields);
	for ($i=($num_fields-1); $i >= 0; $i--)
		{
		$field = &$this->_data->config_data->all_fields[$i];
		if (!isset($field->field_type))
			$this->_data->config_data->all_fields[$i] = $this->initField(LAFC_FIELD_TEXT);
		if (($field->field_type < LAFC_FIELD_NONE) or ($field->field_type > LAFC_FIELD_MAXTYPE))
			$this->_data->config_data->all_fields[$i] = $this->initField(LAFC_FIELD_TEXT);
		}
}

//-------------------------------------------------------------------------------
// get a config using its name and language
// if $published is true, we only get published configs
// USAGE: Front end AND back end
//
function &getOne($name, $language, $published=true)
{
	if ($published)
		$and_published = " AND `published` = 1";
	else
		$and_published = "";
		
	$query = "SELECT * FROM `#__flexicontact_plus_config` 
				WHERE LOWER(`name`) = LOWER('$name') AND `language` = '$language'".$and_published;
	$this->_db->setQuery($query);
	
	$this->_data = $this->_db->loadObject();
	
	if ($this->_data)
		{
		$this->_expand();
		$this->_data->config_data->id = $this->_data->id;
		$this->_data->config_data->name = $this->_data->name;
		$this->_data->config_data->language = $this->_data->language;
		return $this->_data;
		}
	else
		{
		if ($this->_app->isAdmin())
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_CONFIG_NOT_FOUND').' '.$name.' '.$language, 'error');
		$ret = false;
		return $ret;
		}
}

//-------------------------------------------------------------------------------
// get a config by ID
// if the ID is zero, get the default config
// USAGE: Front end AND back end
//
function &getOneById($config_id)
{
	if ($config_id == 0)
		$query = "SELECT * FROM `#__flexicontact_plus_config` WHERE `default_config` = 1";
	else
		$query = "SELECT * FROM `#__flexicontact_plus_config` WHERE `id` = '$config_id'";
		
	$this->_db->setQuery($query);
	
	$this->_data = $this->_db->loadObject();
	
	if ($this->_data)
		{
		$this->_expand();
		$this->_data->config_data->id = $this->_data->id;
		$this->_data->config_data->name = $this->_data->name;
		$this->_data->config_data->language = $this->_data->language;
		return $this->_data;
		}
	else
		{
		if ($this->_app->isAdmin())
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_CONFIG_NOT_FOUND').' ('.$config_id.')', 'error');
		$ret = false;
		return $ret;
		}
}

//-------------------------------------------------------------------------------
// Get the config data for the front end
// USAGE: Front end only
//
function getConfigData($config_name)
{
	$langObj = JFactory::getLanguage();
	$language = $langObj->get('tag');			// get the current site language
	
// try to find the named configuration for the current site language

	FCP_trace::trace("Loading config [$config_name] for [$language]");
	$config_data = $this->getOne($config_name, $language, true);
	
// if we didn't find it, try to get the default configuration	

	if ($config_data === false)
		{
		FCP_trace::trace("No config [$config_name] for [$language], using default");
		$config_data = $this->getOneById(0);
		}
		
// if we still didn't find a configuration, something is very wrong and we can't continue		

	return $config_data->config_data;
}

//-------------------------------------------------------------------------------
// Get the post data and return it as an associative array
// USAGE: Back end only
//
function getPostData($view, $param1='')
{
	$this->_data->id = JRequest::getInt('config_id');
	switch ($view)
		{
		case 'config_general':
			$this->_data->config_data->email_from = JRequest::getVar('email_from');
			$this->_data->config_data->email_from_name = JRequest::getVar('email_from_name');
			$this->_data->config_data->email_to = JRequest::getVar('email_to');
			$this->_data->config_data->email_cc = JRequest::getVar('email_cc');
			$this->_data->config_data->email_bcc = JRequest::getVar('email_bcc');
			$this->_data->config_data->logging = JRequest::getVar('logging');							// radio button
			$this->_data->config_data->email_html = JRequest::getVar('email_html');					// radio button
			$this->_data->config_data->autofill = JRequest::getVar('autofill');
			$this->_data->config_data->show_copy = JRequest::getVar('show_copy');
			$this->_data->config_data->agreement_prompt = JRequest::getVar('agreement_prompt');
			$this->_data->config_data->agreement_name = JRequest::getVar('agreement_name');
			$this->_data->config_data->agreement_link = JRequest::getVar('agreement_link');
			$this->_data->config_data->date_format = JRequest::getVar('date_format');
			$this->_data->config_data->start_day = JRequest::getVar('start_day');
			$this->_data->config_data->date_picker = JRequest::getVar('date_picker');
			$this->_data->config_data->white_list = JRequest::getVar('white_list', '');
			$this->_data->config_data->max_file_size = JRequest::getVar('max_file_size', LAFC_MAX_FILE_SIZE);
			$this->_data->config_data->css_file = JRequest::getVar('css_file', LAFC_FRONT_CSS_NAME);
			break;
			
		case 'config_captcha':
			$this->_data->config_data->show_captcha = JRequest::getVar('show_captcha');				//radio button
			$this->_data->config_data->magic_word = JRequest::getVar('magic_word');
			$this->_data->config_data->magic_word_prompt = JRequest::getVar('magic_word_prompt');
			$this->_data->config_data->num_images = JRequest::getVar('num_images', 0);
			$this->_data->config_data->image_height = JRequest::getVar('image_height', 0);
			$this->_data->config_data->image_width = JRequest::getVar('image_width', 0);
			$this->_data->config_data->image_width = JRequest::getVar('image_width', 0);
			$this->_data->config_data->noise = JRequest::getVar('noise');								// radio button
			$this->_data->config_data->secure_captcha = JRequest::getVar('secure_captcha');			// list
			$this->_data->config_data->secure_captcha_prompt = JRequest::getVar('secure_captcha_prompt');
			$this->_data->config_data->captcha_height = JRequest::getVar('captcha_height');
			$this->_data->config_data->captcha_width = JRequest::getVar('captcha_width');
			$this->_data->config_data->captcha_colour_text = JRequest::getVar('captcha_colour_text');
			$this->_data->config_data->captcha_colour_lines = JRequest::getVar('captcha_colour_lines');
			$this->_data->config_data->captcha_colour_background = JRequest::getVar('captcha_colour_background');
			$this->_data->config_data->recaptcha_theme = JRequest::getVar('recaptcha_theme');
			$this->_data->config_data->recaptcha_public_key = JRequest::getVar('recaptcha_public_key');
			$this->_data->config_data->recaptcha_private_key = JRequest::getVar('recaptcha_private_key');
			$this->_data->config_data->recaptcha_language = JRequest::getVar('recaptcha_language');
			break;
			
		case 'config_template':
			if ($param1 == 'user_template')
				$this->_data->config_data->user_template = JRequest::getVar('user_template',"","","",JREQUEST_ALLOWRAW);
			if ($param1 == 'admin_template')
				$this->_data->config_data->admin_template = JRequest::getVar('admin_template',"","","",JREQUEST_ALLOWRAW);
			break;
			
		case 'config_field':
			$this->_data->new_flag = JRequest::getVar('new_flag',0);
			if ($this->_data->new_flag)								// if it's a new field ..
				{
				$field = $this->initField();						// .. create a new field object
				$this->_data->field_index = count($this->_data->config_data->all_fields);
				$this->_data->config_data->all_fields[$this->_data->field_index] = $field;		// .. and add it to the array
				}
			else
				$this->_data->field_index = JRequest::getVar('field_index',0);					// there should be a field_index
			$field = &$this->_data->config_data->all_fields[$this->_data->field_index];			// make a pointer to the current field
			
			$field->field_type = JRequest::getVar('field_type',LAFC_FIELD_NONE);
			$field->prompt = JRequest::getVar('prompt','');
				
			$field->width = JRequest::getVar('width',LAFC_FIELD_WIDTH_MIN);
			$field->height = JRequest::getVar('height',LAFC_FIELD_HEIGHT_MIN);
			$field->mandatory = JRequest::getVar('mandatory',0);
			$field->visible = JRequest::getVar('visible',0);
			if ($field->field_type == LAFC_FIELD_RECIPIENT)								// Recipient uses the list_list field
				$field->list_list = JRequest::getVar('recipient_list','');
			if (($field->field_type == LAFC_FIELD_RADIO_V) OR ($field->field_type == LAFC_FIELD_RADIO_H)) 
				$field->list_list = JRequest::getVar('radio_list',"","","",JREQUEST_ALLOWRAW); // Radio buttons can have HTML prompts
			if ($field->field_type == LAFC_FIELD_CHECKBOX_M)
				$field->list_list = JRequest::getVar('checkbox_list','');
			if ($field->field_type == LAFC_FIELD_LIST)
				$field->list_list = JRequest::getVar('list_list','');
			if ($field->field_type == LAFC_FIELD_FIXED_TEXT)							// Fixed text uses the default_value field
				$field->default_value = JRequest::getVar('fixed_text',"","","",JREQUEST_ALLOWRAW);		// allow raw from 8.02
			else
				$field->default_value = JRequest::getVar('default_value','');
			$field->delimiter = JRequest::getVar('delimiter', ',');
			$field->css_class = JRequest::getVar('css_class', '');
			$field->error_msg = JRequest::getVar('error_msg', '');
			$field->tooltip = JRequest::getVar('tooltip',"","","",JREQUEST_ALLOWRAW);		// allow raw from 8.01.06
			$field->default_button = JRequest::getVar('default_button','');
			$field->regex = JRequest::getVar('regex', '');
			$field->validation_type = JRequest::getVar('validation_type', VALTYPE_ANY);
			break;
			
		case 'config_confirm':
			$this->_data->config_data->confirm_link = JRequest::getVar('confirm_link');
			$this->_data->config_data->confirm_text = JRequest::getVar('confirm_text',"","","",JREQUEST_ALLOWRAW);
			break;

		case 'config_text':
			if ($param1 == 'top_text')
				$this->_data->config_data->top_text = JRequest::getVar('top_text',"","","",JREQUEST_ALLOWRAW);
			if ($param1 == 'bottom_text')
				$this->_data->config_data->bottom_text = JRequest::getVar('bottom_text',"","","",JREQUEST_ALLOWRAW);
			break;
			
		case 'config_edit':
			$this->_data->new_flag = JRequest::getVar('new_flag', 0);
			$this->_data->copy_flag = JRequest::getVar('copy_flag', 0);
			$this->_data->name = JRequest::getVar('name');
			$this->_data->language = JRequest::getVar('config_lang');
			$this->_data->description = JRequest::getVar('description');
			break;
		}
}

// ------------------------------------------------------------------------------------
// Validate all the configuration entries
// Return TRUE on success or FALSE if there is any invalid data
// USAGE: Back end only
//
function check($view)
{
 	$ret = true;
	switch ($view)
		{
		case 'config_confirm':
			if (($this->_data->config_data->confirm_link =='') AND ($this->_data->config_data->confirm_text == ''))
				{
				$msg = JText::_('COM_FLEXICONTACT_ALL_BLANK');
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
				
			break;		// case 'config_confirm'

		case 'config_text':
			
			if (stristr($this->_data->config_data->top_text, "{flexicontactplus") != false)
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' - {flexicontactplus...}';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
			if (stristr($this->_data->config_data->bottom_text, "{flexicontactplus") != false)
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' - {flexicontactplus...}';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
			
			break;		// case 'config_text'
		
			if (($this->_data->config_data->confirm_link =='') AND ($this->_data->config_data->confirm_text == ''))
				{
				$msg = JText::_('COM_FLEXICONTACT_ALL_BLANK');
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
				
			break;		// case 'config_text'
			
		case 'config_edit':
			FCP_Common::strip_quotes($this->_data->name);
			if (!FCP_Common::clean_string($this->_data->name, false))
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' ('.JText::_('COM_FLEXICONTACT_CONFIG_NAME').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
				
			if (strstr($this->_data->name, ' ') != false)
				{
				$msg = JText::_('COM_FLEXICONTACT_NO_SPACE').' ('.JText::_('COM_FLEXICONTACT_CONFIG_NAME').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
				
			if ($this->_exists($this->_data->name, $this->_data->language, $this->_data->id))
				{
				$msg = JText::_('COM_FLEXICONTACT_CONFIG_DUP');
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
			break;		// case 'config_edit'
			
 		case 'config_general':
 			$msg = JText::_('COM_FLEXICONTACT_INVALID');
 			
  			if (!FCP_Common::clean_string($this->_data->config_data->email_from))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_FIELD_FROM_ADDRESS').')';
				$ret = false;
				}
			else
				{
				$check_msg = FCP_Admin::validate_email_address($this->_data->config_data->email_from, true);
				if ($check_msg != '')
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_FIELD_FROM_ADDRESS').' '.$check_msg.')';
					$ret = false;
					}				
				}
			if (!FCP_Common::clean_string($this->_data->config_data->email_to))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_TO').')';
				$ret = false;
				}
			else
				{
				$check_msg = FCP_Admin::validate_email_address($this->_data->config_data->email_to, false);
				if ($check_msg !='')
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_TO').' '.$check_msg.')';
					$ret = false;
					}				
				}
				
 			if (!FCP_Common::clean_string($this->_data->config_data->email_cc))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_CC').')';
				$ret = false;
				}
			else
				{
				$check_msg = FCP_Admin::validate_email_list($this->_data->config_data->email_cc);
				if ($check_msg !='')
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_CC').' '.$check_msg.')';
					$ret = false;
					}
				}
				
  			if (!FCP_Common::clean_string($this->_data->config_data->email_bcc))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_BCC').')';
				$ret = false;
				}
			else
				{
				$check_msg = FCP_Admin::validate_email_list($this->_data->config_data->email_bcc);
				if ($check_msg !='')
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_EMAIL_BCC').' '.$check_msg.')';
					$ret = false;
					}
				}
				
  			if (!FCP_Common::clean_string($this->_data->config_data->email_from_name))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_FIELD_FROM_NAME').')';
				$ret = false;
				}				
			if (!FCP_Common::clean_string($this->_data->config_data->agreement_prompt))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_AGREEMENT_REQUIRED').' '.JText::_('COM_FLEXICONTACT_V_PROMPT').')';
				$ret = false;
				}				
 			if (!FCP_Common::clean_string($this->_data->config_data->agreement_name))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_AGREEMENT_REQUIRED').' '.JText::_('COM_FLEXICONTACT_NAME').')';
				$ret = false;
				}	
				
			if (!FCP_Common::clean_string($this->_data->config_data->white_list))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_ATTACHMENT_WHITE_LIST').' ('.$this->_data->config_data->white_list.')';
				$ret = false;
				}
			if ((!FCP_Common::is_posint($this->_data->config_data->max_file_size)) OR ($this->_data->config_data->max_file_size == 0))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_ATTACHMENT_MAX_SIZE').' ('.$this->_data->config_data->max_file_size.')';
				$ret = false;
				}
/*				
			$max_size = FCP_Admin::get_max_file_size();
			if ($this->_data->config_data->max_file_size > $max_size)
				{
				$msg .= ' ('.JText::sprintf('COM_FLEXICONTACT_MAX_SIZE_EXCEEDED', $max_size).' ('.$this->_data->config_data->max_file_size.')';
				$ret = false;
				}
*/
			if (!$ret)
				{
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
								
			break;		// case 'config_general'
			
		case 'config_captcha':
			$ret = true;
 			$check_string = JText::_('COM_FLEXICONTACT_INVALID');
 			$msg = $check_string;

  			if (!FCP_Common::clean_string($this->_data->config_data->magic_word))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_MAGIC_WORD').')';
				$ret = false;
				}			
				
   			if (!FCP_Common::clean_string($this->_data->config_data->magic_word_prompt))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_MAGIC_WORD_LABEL').')';
				$ret = false;
				}
				
			if (($this->_data->config_data->magic_word != '') and ($this->_data->config_data->magic_word_prompt == ''))
				{
				$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_REQUIRED').' ('.JText::_('COM_FLEXICONTACT_MAGIC_WORD_LABEL').')', 'error');
				$ret = false;
				}
				
  			if (!FCP_Common::is_posint($this->_data->config_data->num_images))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_CAPTCHA_NUMBER').')';
				$ret = false;
				}
				
  			if (!FCP_Common::is_posint($this->_data->config_data->image_height, true))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_HEIGHT').')';
				$ret = false;
				}
			elseif ($this->_data->config_data->image_height > 150)
				$this->_data->config_data->image_height = 150;
				
  			if (!FCP_Common::is_posint($this->_data->config_data->image_width, true))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_V_WIDTH').')';
				$ret = false;
				}
			elseif ($this->_data->config_data->image_width > 150)
				$this->_data->config_data->image_width = 150;
				
  			if (!FCP_Common::is_posint($this->_data->config_data->captcha_height, true))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA').' '.JText::_('COM_FLEXICONTACT_V_HEIGHT').')';
				$ret = false;
				}
				
  			if (!FCP_Common::is_posint($this->_data->config_data->captcha_width, true))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA').' '.JText::_('COM_FLEXICONTACT_V_WIDTH').')';
				$ret = false;
				}

			if (!FCP_Common::clean_string($this->_data->config_data->secure_captcha_prompt))
				{
				$msg .= ' ('.JText::_('COM_FLEXICONTACT_SECURE_CAPTCHA_LABEL').')';
				$ret = false;
				}
				
			if ($this->_data->config_data->recaptcha_theme != 0)
				{
				if (strlen($this->_data->config_data->recaptcha_public_key) != 40)
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_RECAPTCHA').' '.JText::_('COM_FLEXICONTACT_RECAPTCHA_PUBLIC_KEY').')';
					$ret = false;
					}
				if (strlen($this->_data->config_data->recaptcha_private_key) != 40)
					{
					$msg .= ' ('.JText::_('COM_FLEXICONTACT_RECAPTCHA').' '.JText::_('COM_FLEXICONTACT_RECAPTCHA_PRIVATE_KEY').')';
					$ret = false;
					}
				}
				
			if (!$ret)
				{
				if ($msg != $check_string)
					$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
			break;		// case 'config_captcha'
		
		case 'config_field':
			$field = &$this->_data->config_data->all_fields[$this->_data->field_index];
				
			if ($field->field_type == LAFC_FIELD_NONE)
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' ('.JText::_('COM_FLEXICONTACT_FIELD_TYPE').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
				
			if (!FCP_Common::clean_string($field->prompt))
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' ('.JText::_('COM_FLEXICONTACT_V_PROMPT').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}
			if (strlen($field->prompt) > LAFC_MAX_PROMPT_LENGTH)
				{
				$msg = JText::_('COM_FLEXICONTACT_MAX_LENGTH').' ('.JText::_('COM_FLEXICONTACT_V_PROMPT').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}

			if (!FCP_Common::clean_string($field->css_class))
				{
				$msg = JText::_('COM_FLEXICONTACT_INVALID').' ('.JText::_('COM_FLEXICONTACT_CSS_CLASS').')';
				$this->_app->enqueueMessage($msg, 'error');
				return false;
				}

					
		// Default value does not need to be verified at all since this allows for default to be a POST data variable
		// If the subject contains a variable, then the subject MUST be invisible.
			
			if ($field->field_type == LAFC_FIELD_SUBJECT)
				{
				$num_vars = substr_count(strtoupper($field->default_value), "%V_");
				$ret_title = true;
					
				// Visible?
				if (($num_vars >0 ) AND ($field->visible == 1))
					$ret_title = false;
					
				if (!$ret_title)
					{
					$msg = JText::_('COM_FLEXICONTACT_PAGE_TITLE_ERROR');
					$this->_app->enqueueMessage($msg, 'error');
					return false;
					}
				}
							
			if (($field->field_type == LAFC_FIELD_SUBJECT) 
			 or ($field->field_type == LAFC_FIELD_FROM_NAME) 
			 or ($field->field_type == LAFC_FIELD_FROM_ADDRESS)
			 or ($field->field_type == LAFC_FIELD_RECIPIENT))
				{
				$count = 0;
				foreach ($this->_data->config_data->all_fields as $one_field)
					if ($one_field->field_type == $field->field_type)
						$count ++;
				if ($count > 1)
					{
					switch ($field->field_type)
						{
						case LAFC_FIELD_SUBJECT:      $fieldname = JText::_('COM_FLEXICONTACT_FIELD_SUBJECT');      break;
						case LAFC_FIELD_FROM_NAME:    $fieldname = JText::_('COM_FLEXICONTACT_FIELD_FROM_NAME');    break;
						case LAFC_FIELD_FROM_ADDRESS: $fieldname = JText::_('COM_FLEXICONTACT_FIELD_FROM_ADDRESS'); break;
						case LAFC_FIELD_RECIPIENT:    $fieldname = JText::_('COM_FLEXICONTACT_FIELD_RECIPIENT');    break;
						default: $fieldname = '';
						}
					$msg = JText::sprintf('COM_FLEXICONTACT_ONLY_ONE_FIELD', $fieldname);
					$this->_app->enqueueMessage($msg, 'error');
					return false;
					}
				}
								
			if ($field->field_type == LAFC_FIELD_LIST)
				{
				if ($field->delimiter == '')
					$field->delimiter = ',';
				return true;
				}
				
			if ($field->field_type == LAFC_FIELD_RECIPIENT)
				{
				$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
				foreach ($list_array['RAW'] as $raw_string)
					if (substr_count($raw_string,',') != 1)
						{
						$msg = JText::_('COM_FLEXICONTACT_INVALID').': '.htmlentities($raw_string);
						$this->_app->enqueueMessage($msg, 'error');
						return false;									// must return here to avoid "Undefined offset" errors
						}
				foreach ($list_array['LEFT'] as $recipient_name)
					if (!FCP_Common::clean_string($recipient_name, false))
						{
						$msg = JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_NAME').': '.$recipient_name;
						$this->_app->enqueueMessage($msg, 'error');
						$ret = false;
						}
				foreach ($list_array['RIGHT'] as $email_address)
					{
					$check_msg = FCP_Admin::validate_email_address($email_address, false);
					if ($check_msg != '')
						{
						$msg = JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_EMAIL').': '.htmlentities($email_address);
						$this->_app->enqueueMessage($msg, 'error');
						$ret = false;
						}
					}
				if (!$ret)
					return false;
				}
				
			if (($field->field_type == LAFC_FIELD_RADIO_V) OR ($field->field_type == LAFC_FIELD_RADIO_H))
				{
				if ($field->delimiter == '')
					$field->delimiter = ',';
				$list_array = FCP_Common::split_list($field->list_list, ';', $field->delimiter);
				foreach ($list_array['RAW'] as $raw_string)
					if (substr_count($raw_string,$field->delimiter) > 1)
						{
						$msg = JText::_('COM_FLEXICONTACT_INVALID').': '.htmlentities($raw_string);
						$this->_app->enqueueMessage($msg, 'error');
						return false;									// must return here to avoid "Undefined offset" errors
						}
				foreach ($list_array['RIGHT'] as $description)
					if (!FCP_Common::clean_string($description))
						{
						$msg = JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_TEXT').': '.htmlentities($description);
						$this->_app->enqueueMessage($msg, 'error');
						$ret = false;
						}
				$num_buttons = count($list_array['LEFT']);
				if ((!FCP_Common::is_posint($field->default_button))
				or  ($field->default_button > $num_buttons))
					{
					$msg = JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_DEFAULT_BUTTON').' ('.$field->default_button.')';
					$this->_app->enqueueMessage($msg, 'error');
					$ret = false;
					}
				if (!$ret)
					return false;
				}
				
			if ($field->field_type == LAFC_FIELD_CHECKBOX_M)
				{
				if ($field->delimiter == '')
					$field->delimiter = ',';
				}
		
			if ($field->field_type == LAFC_FIELD_REGEX)
				{
				if (@preg_match($field->regex, 'x') === false)	// preg_match() returns false if the pattern is invalid
					{
					$msg = JText::_('COM_FLEXICONTACT_INVALID').' '.JText::_('COM_FLEXICONTACT_REGEX');
					$this->_app->enqueueMessage($msg, 'error');
					return false;
					}
				}
				
			// Visible property ONLY applies to the Subject field
			if ($field->field_type != LAFC_FIELD_SUBJECT)
				$field->visible = 1;
			
			if ($field->height < LAFC_FIELD_HEIGHT_MIN)
				$field->height = LAFC_FIELD_HEIGHT_MIN;
			if ($field->height > LAFC_FIELD_HEIGHT_MAX)
				$field->height = LAFC_FIELD_HEIGHT_MAX;
				
			// don't allow the tooltip field to include double quotes - change them to single quotes
			$field->tooltip = str_replace('"',"'",$field->tooltip);
			
			// don't allow the default_value field to include double quotes - change them to single quotes
			$field->default_value = str_replace('"',"'",$field->default_value);
				
			break;	//case 'config_field'
		}
		
	return true;
}

//---------------------------------------------------------------
// Validate and save a config
// Returns TRUE on success or FALSE if there is an error
// USAGE: Back end only
//
function store($view='')
{
	if (!$this->check($view))
		return false;
	$serialized_config_data = serialize($this->_data->config_data);

	if ($this->_data->id == 0)
		$query = "INSERT INTO `#__flexicontact_plus_config`	(`published`, `default_config`, `name`, `language`, `description`, `config_data`) VALUES (".
			$this->_data->published.','.
			'0,'.
			$this->_db->Quote($this->_data->name).','.
			$this->_db->Quote($this->_data->language).','.
			$this->_db->Quote($this->_data->description).','.
			$this->_db->Quote($serialized_config_data).')';
	else
		$query = "UPDATE `#__flexicontact_plus_config` SET 
					`published` = ".$this->_data->published.",
					`name` = ".$this->_db->Quote($this->_data->name).",
					`language` = ".$this->_db->Quote($this->_data->language).",
					`description` = ".$this->_db->Quote($this->_data->description).",
					`config_data` = ".$this->_db->Quote($serialized_config_data)."
					WHERE `id` = ".$this->_data->id;

	$this->_db->setQuery($query);
	$this->_db->query();
	if ($this->_db->getErrorNum())
		{
		$this->_app->enqueueMessage($this->_db->stderr(), 'error');	// this is only called in the back end
		return false;
		}

	if ($this->_data->id == 0)							// if this was an insert ...
		$this->_data->id = $this->_db->insertId();		// .. get the id of the new row

	return true;
}

//-------------------------------------------------------------------------------
// Check whether a config with the given name and language already exists
// - if an id is passed we only look for a config that is not this id
// USAGE: Back end only
//
function _exists($name, $language, $id=0)
{
	$query = "SELECT COUNT(*) FROM `#__flexicontact_plus_config`
				WHERE `name`='".$name."' AND `language`='".$language."'";

	if ($id != 0)
		$query .= ' AND `id`!='.$id; 
				
	$this->_db->setQuery($query);
	$count = $this->_db->loadResult();

	if ($this->_db->getErrorNum())
		return false;

	if ($count > 0)
		return true;
	else
		return false;

}

//-------------------------------------------------------------------------------
// get a list of all configs (optional by language)
// USAGE: Back end only
//
function &getList($lang='')
{
	if (LAFC_JVERSION == 150)
		$all_text = JText::_('ALL');
	else
		$all_text = JText::_('JALL');

	$query = "SELECT * FROM `#__flexicontact_plus_config`";
	if (($lang != '') AND ($lang != $all_text))
		$query .= " WHERE language='".$lang."'";
	$query .= " Order by name, language";

	$this->_db->setQuery($query);
	
	$results = $this->_db->loadObjectList();

	if ((!$results) OR empty($results))
		{
		$ret = false;
		return $ret;
		}

	foreach ($results as $result)
		{
		$result->config_data = unserialize($result->config_data);
		}
	
	return $results;
}

//-------------------------------------------------------------------------------
// Get a list of all config names
// USAGE: Back end only
//
function &getListNames()
{
	$query = "SELECT `id`, `name`, `language` FROM `#__flexicontact_plus_config` Order by name, language";
	
	$this->_db->setQuery($query);
	
	$results = $this->_db->loadObjectList();
	
	if ((!$results) OR empty($results))
		{
		if ($this->_app->isAdmin())
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_CONFIG_NOT_FOUND'), 'error');
		$ret = false;
		return $ret;
		}

	foreach ($results as $result)
		$names[$result->id] = $result->name.' ('.$result->language.')';

	return $names;
}

//-------------------------------------------------------------------------------
// Count how many configs exist
// USAGE: Back end only
//
function &countConfig($distinct=false)
{
	if ($distinct)
		$query = "SELECT count(distinct `name`) FROM `#__flexicontact_plus_config`";
	else
		$query = "SELECT count(*) FROM `#__flexicontact_plus_config`";
		
	$this->_db->setQuery($query);
	$count = $this->_db->loadResult();

	return $count;
}

//-------------------------------------------------------------------------------
// Delete fields from the config_data
// USAGE: Back end only
//
function delete_fields($config_id, $cids)
{
	if ($this->getOneById($config_id) === false)
		return;
	$num_fields = count($this->_data->config_data->all_fields);
	$reverse_cids = array_reverse($cids);
	foreach($cids as $field_index)
		if (isset($this->_data->config_data->all_fields[$field_index]))
			unset($this->_data->config_data->all_fields[$field_index]);
			
	$new_array = array();
	foreach($this->_data->config_data->all_fields as $key => $value)
		$new_array[] = $this->_data->config_data->all_fields[$key];
	$this->_data->config_data->all_fields = $new_array;
	$this->store();
}

//-------------------------------------------------------------------------------
// Move a field up or down in the array
// $direction is 1 for down or -1 for up
// USAGE: Back end only
//
function move_field($config_id, $field_index, $direction)
{
	if ($this->getOneById($config_id) === false)
		return;

	if ($direction == -1)					// move field up
		{
		if ($field_index == 0)				// if field is already at the top, do nothing
			return;
		$temp_field = $this->_data->config_data->all_fields[$field_index - 1];
		$this->_data->config_data->all_fields[$field_index - 1] = $this->_data->config_data->all_fields[$field_index];
		$this->_data->config_data->all_fields[$field_index] = $temp_field;
		}
		
	if ($direction == 1)					// move field down
		{
		$num_fields = count($this->_data->config_data->all_fields);
		if ($field_index == $num_fields)	// if field is already at the bottom, do nothing
			return;
		$temp_field = $this->_data->config_data->all_fields[$field_index + 1];
		$this->_data->config_data->all_fields[$field_index + 1] = $this->_data->config_data->all_fields[$field_index];
		$this->_data->config_data->all_fields[$field_index] = $temp_field;
		}

	$this->store();
}

//-------------------------------------------------------------------------------
// Save a whole new field order
// USAGE: Back end only
//
function save_field_order($config_id, $order)
{
	if ($this->getOneById($config_id) === false)
		return;

	asort($order);

	$new_array = array();
	
	foreach($order as $key => $value)
		$new_array[] = $this->_data->config_data->all_fields[$key];
		
	$this->_data->config_data->all_fields = $new_array;

	$this->store();
}

//-------------------------------------------------------------------------------
// add the default fields 
//
function add_default_fields($config_id)
{
	if ($this->getOneById($config_id) === false)
		return;

	$got_from_address = false;		
	foreach ($this->_data->config_data->all_fields as $field)		
		if ($field->field_type == LAFC_FIELD_FROM_ADDRESS)
			$got_from_address = true;

	$got_from_name = false;		
	foreach ($this->_data->config_data->all_fields as $field)		
		if ($field->field_type == LAFC_FIELD_FROM_NAME)
			$got_from_name = true;

	$got_subject = false;		
	foreach ($this->_data->config_data->all_fields as $field)		
		if ($field->field_type == LAFC_FIELD_SUBJECT)
			$got_subject = true;

	$got_message = false;		
	foreach ($this->_data->config_data->all_fields as $field)		
		if ($field->field_type == LAFC_FIELD_TEXTAREA)
			$got_message = true;
			
	if (!$got_from_name)
		{
		$field = $this->initField(LAFC_FIELD_FROM_NAME);
		$field->prompt = 'Your name';
		$field->mandatory = 1;
		$this->_data->config_data->all_fields[] = $field;
		}

	if (!$got_from_address)
		{
		$field = $this->initField(LAFC_FIELD_FROM_ADDRESS);
		$field->prompt = 'Your E-mail address';
		$field->mandatory = 1;
		$this->_data->config_data->all_fields[] = $field;
		}
		
	if (!$got_subject)
		{
		$field = $this->initField(LAFC_FIELD_SUBJECT);
		$field->prompt = 'Subject';
		$field->width = '';
		$field->mandatory = 1;
		$this->_data->config_data->all_fields[] = $field;
		}
		
	if (!$got_message)
		{
		$field = $this->initField(LAFC_FIELD_TEXTAREA);
		$field->prompt = 'Message';
		$field->width = '';
		$field->height = 5;
		$field->mandatory = 1;
		$this->_data->config_data->all_fields[] = $field;
		}
	$this->store();
}

//-------------------------------------------------------------------------------
// Publish or unpublish items
// Don't unpublish the default configuration
// USAGE: Back end only
//
function publish_config($p)
{
	$cids = JRequest::getVar('cid', array(0), 'post', 'array');
	
	$default_config = $this->getOneById(0);
	$count = 0;
	
	foreach ($cids as $cid)
		{
		if (($cid == $default_config->id) AND ($p == 0))
			{
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_UNPUBLISH_DEFAULT'), 'error');
			continue;
			}
		else
			{
			$query = "UPDATE `#__flexicontact_plus_config` SET `published` = ".$p." WHERE `id` = ".$cid;
			$this->_db->setQuery($query);
			$this->_db->query();
			if ($this->_db->getErrorNum())
				{
				$this->_app->enqueueMessage($this->_db->stderr(), 'error');	// this is only called in the back end
				return false;
				}
			if ($cid != $default_config->id)
				$count ++;
			}
		}
		
	if ($count > 0)
		{
		if ($p == 0)
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_UNPUBLISHED_ITEM'));
		else
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_PUBLISH_ITEM'));
		}

	return;	
}

//-------------------------------------------------------------------------------
// Delete an entire config record
// Don't delete the default configuration
// USAGE: Back end only
//
function delete_config()
{
	$cids = JRequest::getVar('cid', array(0), 'post', 'array');
	
	$default_config = $this->getOneById(0);
	$count = 0;
	
	foreach ($cids as $cid)
		{
		if ($cid == $default_config->id)
			{
			$this->_app->enqueueMessage(JText::_('COM_FLEXICONTACT_DELETE_DEFAULT'), 'error');
			continue;
			}
		else
			{
			$query = "DELETE FROM `#__flexicontact_plus_config` WHERE `id` = ".$cid;
			$this->_db->setQuery($query);
			$this->_db->query();
			if ($this->_db->getErrorNum())
				{
				$this->_app->enqueueMessage($this->_db->stderr(), 'error');	// this is only called in the back end
				return false;
				}
			else
				$count ++;
			}
		}
		
	if ($count > 0)	
		$this->_app->enQueueMessage(JText::_('COM_FLEXICONTACT_DELETED'));
	return true;
	
}

}
		
		