<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 3 July 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

// Themes - If you update this list, make sure that you update the make_theme_list function in this file

define("THEME_ALL", 'all');
define("THEME_STANDARD", 'standard');
define("THEME_TOYS", 'toys');
define("THEME_NEON", 'neon');
define("THEME_WHITE", 'white');
define("THEME_BLACK", 'black');

// log date filters

define("LAFC_LOG_ALL", 0);					// report filters
define("LAFC_LOG_LAST_7_DAYS", 1);
define("LAFC_LOG_LAST_28_DAYS", 2);
define("LAFC_LOG_LAST_12_MONTHS", 3);

define("PLOTALOT_LINK", "http://www.lesarbresdesign.info/extensions/plotalot");

class FCP_Admin
{

//-------------------------------------------------------------------------------
// Validate single email address
// if invalid, returns an error message
// 
static function validate_email_address(&$address, $allow_blank=true)
{
	$email_list = str_replace(' ', '', $address);				// remove spaces
		
	if ($address == '')
		{
		if ($allow_blank)
			{
			$ret = '';
			return $ret;
			}
		else
			{
			$ret = JText::_('COM_FLEXICONTACT_REQUIRED');
			return $ret;
			}
		}
	
	jimport('joomla.mail.helper');

	if (!JMailHelper::isEmailAddress($address))
		return '('.$address.')';
			
	return '';
}

//-------------------------------------------------------------------------------
// Validate multiple email addresses
// if any are invalid, returns an error message
// if all are valid, returns an empty string
// NOTE: $email_list is altered so that each email address only occurs once 
// 
static function validate_email_list(&$email_list, $allow_blank=true)
{
	$email_list = str_replace(' ', '', $email_list);				// remove spaces
	trim($email_list,',');										// trim off any spare commas
		
	if ($email_list == '')
		{
		if ($allow_blank)
			{
			$ret = '';
			return $ret;
			}
		else
			{
			$ret = JText::_('COM_FLEXICONTACT_REQUIRED');
			return $ret;
			}
		}

	$email_list = strtolower($email_list);					// make all lower case for array_unique() call
	$email_addresses = explode(',', $email_list);				// make it an array
	$email_addresses = array_unique($email_addresses);	// remove any duplicates
	$email_list = implode(',', $email_addresses);				// recreate the original email list to return
	
	jimport('joomla.mail.helper');

	foreach ($email_addresses as $address)
		if (!JMailHelper::isEmailAddress($address))
			return '('.$address.')';
			
	return '';
}

//-------------------------------------------------------------------------------
// Get installed languages
//
static function make_lang_list($extra='')
{
	$langs = JFactory::getLanguage('JPATH_SITE');
	if ($extra != '')
		$result[$extra] = $extra;
	foreach ($langs->getKnownLanguages() as $lang)
		$result[$lang['tag']] = $lang['name'];
		
	return $result;

}

//-------------------------------------------------------------------------------
// Make the title for the back end
//
static function make_title($title, $config_data=null, $config_count=0)
{
	if (($config_data == null) or ($config_count <= 1))
		JToolBarHelper::title(LAFC_COMPONENT_NAME.': <small><small>'.JText::_($title).'</small></small>', 'flexicontactplus.png');
	else
		JToolBarHelper::title(LAFC_COMPONENT_NAME.': <small><small>'.
			'<span class="fcp_config_title">'.
			$config_data->name.' ['.$config_data->language.']</span>'.
			JText::_($title).
			'</small></small>','flexicontactplus.png');
}

// -------------------------------------------------------------------------------
// Draw the top menu and make the current item active
//
static function addSubMenu($submenu = '')
{
	$config_id = JRequest::getInt('config_id', 0);
	$config_base_view = JRequest::getInt('config_base_view', 0);
	JSubMenuHelper::addEntry(JText::_('COM_FLEXICONTACT_CONFIGURATION'), 'index.php?option='.LAFC_COMPONENT.'&controller=menu&task=display&config_id='.$config_id.'&config_base_view='.$config_base_view, $submenu == 'config');
	JSubMenuHelper::addEntry(JText::_('COM_FLEXICONTACT_TOOLBAR_IMAGES'), 'index.php?option='.LAFC_COMPONENT.'&controller=menu&view=config_images&config_base_view='.$config_base_view, $submenu == 'images');
	JSubMenuHelper::addEntry(JText::_('COM_FLEXICONTACT_CONFIG_CSS_NAME'), 'index.php?option='.LAFC_COMPONENT.'&controller=menu&view=config_css&config_base_view='.$config_base_view, $submenu == 'css');
	JSubMenuHelper::addEntry(JText::_('COM_FLEXICONTACT_LOG'), 'index.php?option='.LAFC_COMPONENT.'&controller=log&task=display&config_id='.$config_id.'&config_base_view='.$config_base_view, $submenu == 'log');
	JSubMenuHelper::addEntry(JText::_('COM_FLEXICONTACT_HELP_AND_SUPPORT'), 'index.php?option='.LAFC_COMPONENT.'&controller=menu&task=help&config_id='.$config_id.'&config_base_view='.$config_base_view, $submenu == 'help');
}
  
// -------------------------------------------------------------------------------
// Draw the key panel for the template editing screens
//
static function make_key_panel($config_data)
{
	if (LAFC_JVERSION == 150)
		$all = ucfirst(JText::_('ALL'));
	else
		$all = ucfirst(JText::_('JALL'));

	$keypanel = '<fieldset fieldset class="fc_panel">';
	$keypanel .= '<legend>'.JText::_('COM_FLEXICONTACT_VARIABLES').'</legend>';
	$keypanel .= '<table class="key_panel">';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_FROM_NAME.'</td><td>'.self::get_icon_image(LAFC_FIELD_FROM_NAME).'</td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_NAME').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_FROM_EMAIL.'</td><td>'.self::get_icon_image(LAFC_FIELD_FROM_ADDRESS).'</td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_EMAIL').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_SUBJECT.'</td><td>'.self::get_icon_image(LAFC_FIELD_SUBJECT).'</td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_SUBJECT').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_OTHER_DATA.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_OTHER_DATA').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_ALL_DATA.'</td><td></td><td nowrap="nowrap">'.$all.' '.JText::_('COM_FLEXICONTACT_DATA').'</td></tr>';
	
	foreach($config_data->all_fields as $field_index => $field)
		{
		if ($field->field_type == LAFC_FIELD_FROM_ADDRESS or $field->field_type == LAFC_FIELD_FROM_NAME or $field->field_type == LAFC_FIELD_SUBJECT)
			continue;	// these fields have special variable names
		if ($field->field_type == LAFC_FIELD_FIXED_TEXT or $field->field_type == LAFC_FIELD_FIELDSET_START or $field->field_type == LAFC_FIELD_FIELDSET_END)
			continue;	// these fields don't have any user input data
		$field_id = sprintf('%02d',$field_index + 1);
		$variable = str_replace('XX',$field_id,LAFC_T_FIELD_PROMPT);
		$value = $field->prompt;
		$keypanel .= '<tr><td nowrap="nowrap">'.$variable.'</td><td></td><td nowrap="nowrap">"'.$value.'"</td></tr>';
		$variable = str_replace('XX',$field_id,LAFC_T_FIELD_VALUE);
	//	$value = $field->prompt;
		if ($field->field_type == LAFC_FIELD_ATTACHMENT)
			$keypanel .= '<tr><td nowrap="nowrap">'.$variable.'</td><td>'.self::get_icon_image($field->field_type).'</td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_FILE_NAME').'</td></tr>';
		else
			$keypanel .= '<tr><td nowrap="nowrap">'.$variable.'</td><td>'.self::get_icon_image($field->field_type).'</td><td nowrap="nowrap">'.$value.' '.JText::_('COM_FLEXICONTACT_CONTENTS').'</td></tr>';
		}

	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_BROWSER.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_BROWSER').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_IP_ADDRESS.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_IP_ADDRESS').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_SITE_NAME.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_SITE_NAME').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_SITE_URL.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_SITE_URL').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_URL_PATH.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_URL_PATH').'</td></tr>';
	$keypanel .= '<tr><td nowrap="nowrap">'.LAFC_T_PAGE_TITLE.'</td><td></td><td nowrap="nowrap">'.JText::_('COM_FLEXICONTACT_V_PAGE_TITLE').'</td></tr>';

	$keypanel .= '</table>';
	$keypanel .= '</fieldset>';
	return $keypanel;
}

//-------------------------------------------------------------------------------
// Return the icon image tag for a field type
//
static function get_icon_image($field_type)
{
	return '<img src="'.LAFC_ADMIN_ASSETS_URL.self::get_icon_name($field_type).'" style="vertical-align: bottom; border:none;" alt="" />';
}

//-------------------------------------------------------------------------------
// Return the icon name for a field type
//
static function get_icon_name($field_type)
{
	switch ($field_type)
		{
		case LAFC_FIELD_FROM_ADDRESS:
			return 'ft_email_16.gif';
		case LAFC_FIELD_FROM_NAME:
		case LAFC_FIELD_TEXT:
		case LAFC_FIELD_SUBJECT:
			return 'ft_text_16.gif';
		case LAFC_FIELD_TEXT_NUMERIC:
			return 'ft_num_16.gif';
		case LAFC_FIELD_TEXTAREA:
			return 'ft_textarea_16.gif';
		case LAFC_FIELD_PASSWORD:
			return 'ft_password_16.gif';
		case LAFC_FIELD_LIST:
		case LAFC_FIELD_RECIPIENT:
			return 'ft_list_16.gif';
		case LAFC_FIELD_CHECKBOX_L:
		case LAFC_FIELD_CHECKBOX_R:
		case LAFC_FIELD_CHECKBOX_H:
			return 'ft_check_16.gif';
		case LAFC_FIELD_CHECKBOX_M:
			return 'ft_checks_16.gif';
		case LAFC_FIELD_DATE:
			return 'ft_date_16.gif';
		case LAFC_FIELD_FIXED_TEXT:
			return 'ft_fixed_16.gif';
		case LAFC_FIELD_REGEX:
			return 'ft_regex_16.gif';
		case LAFC_FIELD_FIELDSET_START:
			return 'ft_fieldset_16.gif';
		case LAFC_FIELD_FIELDSET_END:
			return 'ft_fieldset_end_16.gif';
		case LAFC_FIELD_RADIO_V:
		case LAFC_FIELD_RADIO_H:
			return 'ft_radio_16.gif';
		case LAFC_FIELD_ATTACHMENT:
			return 'ft_upload_16.gif';
		}
	return 'blank.gif';
}

//-------------------------------------------------------------------------------
// Make an info button
//
static function make_info($title, $link='')
{
	JHTML::_('behavior.tooltip');
	if ($link == '')
		{
		$icon_name = 'info-16.png';
		$html = '';
		}
	else
		{
		$icon_name = 'link-16.png';
		$html = '<a href="'.$link.'" target="_blank">';
		}

	$icon = JHTML::_('image', LAFC_ADMIN_ASSETS_URL.$icon_name,'', array('style' => 'vertical-align:text-bottom;'));
	$html .= '<span class="hasTip" title="'.htmlspecialchars($title, ENT_COMPAT, 'UTF-8').'">'.$icon.'</span>';
		
	if ($link != '')
		$html .= '</a>';
		
	return $html;
}

//-------------------------------------------------------------------------------
// Makes the list of all (currently) possible themes
//
static function make_theme_list()
{
	if (LAFC_JVERSION == 150)
		$result[THEME_ALL] = ucfirst(JText::_('ALL'));
	else
		$result[THEME_ALL] = ucfirst(JText::_('JALL'));

	$result[THEME_STANDARD] = 'Standard';
	$result[THEME_TOYS] = 'Toys';
	$result[THEME_NEON] = 'Neon';
	$result[THEME_WHITE] = 'White Tiles';
	$result[THEME_BLACK] = 'Black Tiles';
		
	return $result;
}

//-------------------------------------------------------------------------------
// Make the list of all field types
//
static function make_field_type_list()
{
	$field_types = array();
	if (LAFC_JVERSION == 150)
		$field_types[LAFC_FIELD_NONE] = ucfirst(JText::_('NONE'));
	else
		$field_types[LAFC_FIELD_NONE] = ucfirst(JText::_('JNONE'));
	$field_types["OPTGROUP_START_1"]      = JText::_('COM_FLEXICONTACT_FIELD_GROUP_EMAIL');
	$field_types[LAFC_FIELD_FROM_ADDRESS] = JText::_('COM_FLEXICONTACT_FIELD_FROM_ADDRESS');
	$field_types[LAFC_FIELD_FROM_NAME]    = JText::_('COM_FLEXICONTACT_FIELD_FROM_NAME');
	$field_types[LAFC_FIELD_SUBJECT]      = JText::_('COM_FLEXICONTACT_FIELD_SUBJECT');
	$field_types[LAFC_FIELD_RECIPIENT]    = JText::_('COM_FLEXICONTACT_FIELD_RECIPIENT');
	$field_types["OPTGROUP_END_1"]          = '';
	$field_types["OPTGROUP_START_2"]      = JText::_('COM_FLEXICONTACT_FIELD_GROUP_INPUT');
	$field_types[LAFC_FIELD_TEXT]         = JText::_('COM_FLEXICONTACT_FIELD_TEXT');
	$field_types[LAFC_FIELD_TEXT_NUMERIC] = JText::_('COM_FLEXICONTACT_FIELD_TEXT_NUMERIC');
	$field_types[LAFC_FIELD_TEXTAREA]     = JText::_('COM_FLEXICONTACT_FIELD_TEXTAREA');
	$field_types[LAFC_FIELD_PASSWORD]     = JText::_('COM_FLEXICONTACT_FIELD_PASSWORD');
	$field_types[LAFC_FIELD_REGEX]        = JText::_('COM_FLEXICONTACT_FIELD_REGEX');
	$field_types["OPTGROUP_END_2"]          = '';
	$field_types["OPTGROUP_START_3"]      = JText::_('COM_FLEXICONTACT_FIELD_GROUP_SELECT');
	$field_types[LAFC_FIELD_DATE]         = JText::_('COM_FLEXICONTACT_FIELD_DATE');
	$field_types[LAFC_FIELD_LIST]         = JText::_('COM_FLEXICONTACT_FIELD_LIST');
	$field_types[LAFC_FIELD_CHECKBOX_L]   = JText::_('COM_FLEXICONTACT_FIELD_CHECKBOX');
	$field_types[LAFC_FIELD_CHECKBOX_R]   = JText::_('COM_FLEXICONTACT_FIELD_CHECKBOX_R');
	$field_types[LAFC_FIELD_CHECKBOX_M]   = JText::_('COM_FLEXICONTACT_FIELD_CHECKBOX_M');
	$field_types[LAFC_FIELD_CHECKBOX_H]   = JText::_('COM_FLEXICONTACT_FIELD_CHECKBOX_H');
	$field_types[LAFC_FIELD_RADIO_V]      = JText::_('COM_FLEXICONTACT_FIELD_RADIO_V');
	$field_types[LAFC_FIELD_RADIO_H]      = JText::_('COM_FLEXICONTACT_FIELD_RADIO_H');
//	$field_types[LAFC_FIELD_ATTACHMENT]   = JText::_('COM_FLEXICONTACT_FIELD_ATTACHMENT');
	$field_types["OPTGROUP_END_3"]          = '';
	$field_types["OPTGROUP_START_4"]      = JText::_('COM_FLEXICONTACT_FIELD_GROUP_NON_INPUT');
	$field_types[LAFC_FIELD_FIXED_TEXT]   = JText::_('COM_FLEXICONTACT_FIELD_FIXED_TEXT');
	$field_types[LAFC_FIELD_FIELDSET_START] = JText::_('COM_FLEXICONTACT_FIELD_FIELDSET_START');
	$field_types[LAFC_FIELD_FIELDSET_END]   = JText::_('COM_FLEXICONTACT_FIELD_FIELDSET_END');
	$field_types["OPTGROUP_END_4"]          = '';
	return $field_types;
}

// -------------------------------------------------------------------------------
// Get the Max upload file size as set in PHP.ini and return as Kb
//
static function get_max_file_size()
{
	$ini_setting = ini_get('upload_max_filesize');

	// Setting in Mb?
	$pos = stripos($ini_setting, "M");
	if ($pos !== false)
		{
		$ret = substr($ini_setting, 0, $pos);
		$ret = round($ret * 1024);
		return $ret;
		}
	
	// Setting in Kb?
	$pos = stripos($ini_setting, "K");
	if ($pos !== false)
		{
		$ret = substr($ini_setting, 0, $pos);
		return $ret;
		}
		
	// Setting in bytes?
	$ret = round($ini_setting / 1024);
	return $ret;
}

// -------------------------------------------------------------------------------
// Get the list of CSS files
// Return as an array of name and description
//
static function get_css_list()
{
	$files = glob(LAFC_SITE_ASSETS_PATH.'/*.css');
	
	if (empty($files))
		{
		FCP_trace::trace("get_css_list(): No CSS files found");
		return false;
		}		
		
	$css_files = array();
	
	foreach ($files as $file)
		{
		// Get the first line for the description
		$handle = fopen($file, 'r');
		$line = fgets($handle);
		fclose($handle);
		
		// Only keep the file name and drop the path
		$file = str_replace(LAFC_SITE_ASSETS_PATH.'/', '', $file);
		
		if (strpos($line, '/*') !== false)
			{
			$line = str_replace('/*', '', $line);
			$line = str_replace('*/', '', $line);
			$line = " [".trim($line)."]";
			}
		else
			$line = '';
			
		$css_files[$file] = str_replace(LAFC_SITE_ASSETS_PATH.'/', '', $file).$line;
		}
	
	return $css_files;
}

// -------------------------------------------------------------------------------
// Check for various Joomla environmental issues that might cause trouble and generate warnings
//
static function environment_check()
{
	$app = JFactory::getApplication();
	
// if this is Joomla 3.x and Magic Quotes is on, that will cause trouble

	if ( (LAFC_JVERSION >= 300) 
	and (function_exists('get_magic_quotes_gpc'))
	and (get_magic_quotes_gpc()) ) 
		$app->enqueueMessage(JText::_('COM_FLEXICONTACT_ENV_MQ'), 'error');

// if caching is enabled, that can cause trouble

	$caching = $app->getCfg('caching');	
	if ($caching != 0)
		$app->enqueueMessage(JText::_('COM_FLEXICONTACT_ENV_CACHE1'), 'notice');
		
	jimport('joomla.plugin.plugin');
	if (JPluginHelper::isEnabled('system', 'cache'))
		$app->enqueueMessage(JText::_('COM_FLEXICONTACT_ENV_CACHE2'), 'notice');
}

}

?>


