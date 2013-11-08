<?php
/********************************************************************
Product		: FlexicontactPlus
Date		: 28 September 2013
Copyright	: Les Arbres Design 2010-2013
Contact		: http://extensions.lesarbresdesign.info
Licence		: GNU General Public License
*********************************************************************/
defined('_JEXEC') or die('Restricted Access');

define("LAFC_COMPONENT",         "com_flexicontactplus");
define("LAFC_COMPONENT_NAME",    "FlexiContact Plus");
define("LAFC_COMPONENT_LINK",    "index.php?option=".LAFC_COMPONENT);
define("LAFC_ADMIN_ASSETS_URL",  JURI::root().'administrator/components/com_flexicontactplus/assets/');
define("LAFC_SITE_ASSETS_URL",   JURI::root().'components/com_flexicontactplus/assets/');
define("LAFC_SITE_IMAGES_PATH",  JPATH_ROOT.'/components/com_flexicontactplus/images');
define("LAFC_SITE_ASSETS_PATH",  JPATH_ROOT.'/components/com_flexicontactplus/assets');
define("LAFC_HELPER_PATH",       JPATH_ROOT.'/administrator/components/com_flexicontactplus/helpers');
define("LAFC_FRONT_CSS_NAME",    'fcp.css');
define("LAFC_FRONT_CSS_PATH",    LAFC_SITE_ASSETS_PATH.'/'.LAFC_FRONT_CSS_NAME);

// email merge variables

define("LAFC_T_FROM_NAME",     "%V_FROM_NAME%");
define("LAFC_T_FROM_EMAIL",    "%V_FROM_EMAIL%");
define("LAFC_T_SUBJECT",       "%V_SUBJECT%");
define("LAFC_T_ALL_DATA",      "%V_ALL_DATA%");
define("LAFC_T_OTHER_DATA",    "%V_OTHER_DATA%");
define("LAFC_T_FIELD_PROMPT",  "%V_FIELD_PROMPT_XX%");	// offset of XX is LAFC_T_OFFSET_P_XX
define("LAFC_T_FIELD_VALUE",   "%V_FIELD_VALUE_XX%");	// offset of XX is LAFC_T_OFFSET_V_XX
define("LAFC_T_BROWSER",       "%V_BROWSER%");
define("LAFC_T_IP_ADDRESS",    "%V_IP_ADDRESS%");
define("LAFC_T_SITE_NAME",     "%V_SITE_NAME%");
define("LAFC_T_SITE_URL",      "%V_SITE_URL%");
define("LAFC_T_URL_PATH",      "%V_URL_PATH%");
define("LAFC_T_PAGE_TITLE",    "%V_PAGE_TITLE%");
define("LAFC_T_OFFSET_P_XX", 16);
define("LAFC_T_OFFSET_V_XX", 15);

// copy me

define("LAFC_COPYME_NEVER", 0);				// never copy the user
define("LAFC_COPYME_CHECKBOX", 1);			// show the checkbox on the contact form
define("LAFC_COPYME_ALWAYS", 2);			// always copy the user

// field types

define("LAFC_FIELD_NONE", 0);
define("LAFC_FIELD_FROM_ADDRESS",1);
define("LAFC_FIELD_FROM_NAME",2);
define("LAFC_FIELD_SUBJECT",3);
define("LAFC_FIELD_TEXT",4);
define("LAFC_FIELD_TEXT_NUMERIC",5);
define("LAFC_FIELD_TEXTAREA",6);
define("LAFC_FIELD_LIST",7);
define("LAFC_FIELD_CHECKBOX_L",8);			// single checkbox to the left of the prompt
define("LAFC_FIELD_DATE",9);
define("LAFC_FIELD_FIXED_TEXT",10);
define("LAFC_FIELD_CHECKBOX_H",11);			// horizontal checkboxes on the same line (deprecated, replaced by LAFC_FIELD_CHECKBOX_M)
define("LAFC_FIELD_REGEX",12);				// user defined regular expression validation
define("LAFC_FIELD_RECIPIENT",13);			// recipient selector
define("LAFC_FIELD_CHECKBOX_R",14);			// single checkbox to the right of the prompt
define("LAFC_FIELD_FIELDSET_START",15);		// start of a <fieldset>
define("LAFC_FIELD_FIELDSET_END",16);		// end of a </fieldset>
define("LAFC_FIELD_RADIO_V",17);				// radio buttons, vertical
define("LAFC_FIELD_RADIO_H",18);				// radio buttons, horizontal
define("LAFC_FIELD_CHECKBOX_M",19);			// multiple horizontal checkboxes on the same line
define("LAFC_FIELD_PASSWORD",20);			// password field
define("LAFC_FIELD_MAXTYPE",20);				// equal to the highest currently used field type
define("LAFC_FIELD_ATTACHMENT",60);			// file attachment - to be implemented later so code is too high

define("LAFC_FIELD_WIDTH_MIN", 0);			// 0 means don't include a size attribute
define("LAFC_FIELD_HEIGHT_MIN", 1);
define("LAFC_FIELD_HEIGHT_MAX", 50);
define("LAFC_MAX_CONFIGS", 50);
define("LAFC_MAX_FIELDS", 100);
define("LAFC_MAX_PROMPT_LENGTH", 50);
define("LAFC_MAX_FILE_SIZE", 1024);			// Maximum attached file size in Kb


define("CAPTCHA_NONE", 0);
define("CAPTCHA_WORDS_EASY", 1);
define("CAPTCHA_WORDS_HARD", 2);
define("CAPTCHA_MATHS_EASY", 3);
define("CAPTCHA_MATHS_HARD", 4);

define("RECAPTCHA_NONE",       0);
define("RECAPTCHA_RED",        1);
define("RECAPTCHA_WHITE",      2);
define("RECAPTCHA_BLACKGLASS", 3);
define("RECAPTCHA_CLEAN",      4);

define("NOISE_NO", 0);
define("NOISE_1",    1);
define("NOISE_2",    2);
define("NOISE_3",    3);
define("NOISE_4",    4);
define("NOISE_5",    5);
define("NOISE_RAW", 999);

define("VALTYPE_ANY",    0);
define("VALTYPE_PAST",   1);
define("VALTYPE_FUTURE", 2);
define("VALTYPE_GREATER", 3);

// create the new class names used by Joomla 3 and above, if they don't already exist.
// (you can't define a class inside a method of a class, but you can include a file that does so)

if (!class_exists('JControllerLegacy'))
	{
	jimport('joomla.application.component.controller');
	class JControllerLegacy extends JController { };
	}
if (!class_exists('JModelLegacy'))
	{
	jimport('joomla.application.component.model');
	class JModelLegacy extends JModel { };
	}
if (!class_exists('JViewLegacy'))
	{
	jimport('joomla.application.component.view');
	class JViewLegacy extends JView { };
	}

class FCP_Common
{

//-------------------------------------------------------------------------------
// Make a pair of boolean radio buttons
// $name          : Field name
// $current_value : Current value (boolean)
//
static function make_radio($name,$current_value)
{
	$html = '';
	if ($current_value == 1)
		{
		$yes_checked = 'checked="checked" ';
		$no_checked = '';
		}
	else
		{
		$yes_checked = '';
		$no_checked = 'checked="checked" ';
		}
	$html .= ' <input type="radio" name="'.$name.'" value="1" '.$yes_checked.' /> '.JText::_('COM_FLEXICONTACT_V_YES')."\n";
	$html .= ' <input type="radio" name="'.$name.'" value="0" '.$no_checked.' /> '.JText::_('COM_FLEXICONTACT_V_NO')."\n";
	return $html;
}

//-------------------------------------------------------------------------------
// Make a select list
// $name          : Field name
// $current_value : Current value
// $list          : Array of ID => value items
// $first         : ID of first item to be placed in the list
// $extra         : Javascript or styling to be added to <select> tag
//
static function make_list($name, $current_value, &$items, $first = 0, $extra='')
{
	$html = "\n".'<select name="'.$name.'" id="'.$name.'" size="1" '.$extra.'>';
	if ($items == null)
		return '';
	foreach ($items as $key => $value)
		{
		if (strncmp($key,"OPTGROUP_START",14) == 0)
			{
			$html .= "\n".'<optgroup label="'.$value.'">';
			continue;
			}
		if (strncmp($key,"OPTGROUP_END",12) == 0)
			{
			$html .= "\n".'</optgroup>';
			continue;
			}
		if ($key < $first)					// skip unwanted entries
			{
			continue;
			}
		$selected = '';

		if ($current_value == $key)
			$selected = ' selected="selected"';

		$html .= "\n".'<option value="'.$key.'"'.$selected.'>'.$value.'</option>';
		}
	$html .= '</select>'."\n";

	return $html;
}

// -------------------------------------------------------------------------------
// Cleanup a string if we can, reject it if we can't
//
static function clean_string(&$str, $allow_blank=true)
{
$bad_chars = "&|%<>#";								// characters we don't allow

	$str = trim(str_replace('"',"'",$str));			// trim and replace double quotes with single quotes
	if (strpbrk($str, $bad_chars))
    	return false;								// reject if $str contains any $bad_chars
    	
    if (($str == '') and (!$allow_blank))
    	return false;								// reject blank and blank not allowed
    	
	return true;
}

// -------------------------------------------------------------------------------
// Strip all quotes from a string
//
static function strip_quotes(&$str, $all=true)
{
	if ($all)
		{
		$str = str_replace('"',"",$str);			// remove double quotes
		$str = str_replace("'","",$str);			// remove single quotes
		$str = str_replace("`","",$str);			// remove backticks
		$str = str_replace("‘","",$str);			// remove smart quote
		}
	else
		{
		$str = ltrim($str, '"');					// remove double quotes from 1st character only
		$str = ltrim($str, "'");					// remove single quotes from 1st character only
		$str = ltrim($str, "`");					// remove backticks from 1st character only
		$str = ltrim($str, "‘");					// remove smart quote from 1st character only
		$str = rtrim($str, '"');					// remove double quotes from last character only
		$str = rtrim($str, "'");					// remove single quotes from last character only
		$str = rtrim($str, "`");					// remove backticks from last character only
		$str = rtrim($str, "‘");					// remove smart quote from last character only
		}
}

//-------------------------------------------------------------------------------
// Return true if supplied argument is a positive integer, else false
// v6.04 fixed for > 2147483647
//
static function is_posint($arg, $allow_blank=true)
{
	if ($arg == '')
		{
		if ($allow_blank)
			return true;
		else
			return false;
		}
	if (!is_numeric($arg))
		return false;
	if (preg_match('/[^\d]/', $arg))
		return false;
	return true;
}

//---------------------------------------------------------------------------------------------
// Load our front end css and Javascript
// - if it exists in <current_template>/com_flexicontactplus/assets use that one
// - if not, use the default one in components/com_flexicontactplus/assets
//
static function load_assets($config_data)
{
	$template = JFactory::getApplication()->getTemplate();
	if (file_exists(JPATH_ROOT.'/templates/'.$template.'/'.LAFC_COMPONENT.'/assets/'.LAFC_FRONT_CSS_NAME))
		$css_path = 'templates/'.$template.'/'.LAFC_COMPONENT.'/assets/'.LAFC_FRONT_CSS_NAME;
	else
		$css_path = LAFC_SITE_ASSETS_URL.$config_data->css_file;

	FCP_trace::trace("Loading css: $css_path");
	$document = JFactory::getDocument();
	$document->addStyleSheet($css_path);
	
// load Javascript

	$js_config_object = "fcp_config = {site_root: '".JURI::root()."'};";
	$document->addScriptDeclaration($js_config_object);

	if (LAFC_JVERSION < 160)
		JHtml::_('behavior.mootools');			// load MooTools
	else
		JHtml::_('behavior.framework');			// load MooTools
		
	JHtml::_('behavior.tooltip');				// load MooTools tooltips
	
	if (FCP_trace::tracing())
		$document->addScript(LAFC_SITE_ASSETS_URL.'js/uncompressed-fcp_front.js?6');
	else
		$document->addScript(LAFC_SITE_ASSETS_URL.'js/fcp_front.js?6');

	if (LAFC_JVERSION < 160)
		$js = "\nwindow.addEvent('load', fcp_setup);\n";			// old versions of MooTools don't handle domready very well in IE
	else
		$js = "\nwindow.addEvent('domready', fcp_setup);\n";
	$document->addScriptDeclaration($js);
}

// -------------------------------------------------------------------------------
// Create an array of day names in the current language, starting at Sunday
// $length is the length of the names
//
static function &makeDayNames($length = 0)
{
	$days = array(JText::_('SUNDAY'),JText::_('MONDAY'),JText::_('TUESDAY'),JText::_('WEDNESDAY'),JText::_('THURSDAY'),JText::_('FRIDAY'),JText::_('SATURDAY'));
	for ($i = 0; $i < 7; $i++)
		{
		if ($length != 0)
			{
			if (function_exists('mb_substr'))
				$days[$i] = mb_substr($days[$i],0,$length,'UTF-8');	// use mb_substr if available
			else
				$days[$i] = substr($days[$i],0,$length);			// use this if no mbstring library
			}
		}
	return $days;
}

// -------------------------------------------------------------------------------
// split lists by two delimiters
// For example: Name1, email1@x.com; Name2, email2@y.com; Name3; Name4, email4@y.com;
//
// Returns:
// 		$array['LEFT'][0] = 'Name1', array['RIGHT'][0] = 'email1@x.com'
// 		$array['LEFT'][1] = 'Name2', array['RIGHT'][1] = 'email2@x.com'
// 		$array['LEFT'][2] = 'Name3', array['RIGHT'][2] = 'Name3'
// 		$array['LEFT'][3] = 'Name4', array['RIGHT'][3] = 'email4@x.com'
//
static function split_list($list_list, $delimiter1=';', $delimiter2='')
{
	$list_list = trim($list_list," \t\n\r\0;");					// trim off white space and ;
	$list_list = str_replace(array("\n","\r"),"",$list_list);	// remove any other CR's and LF's
	$list_array = explode($delimiter1,$list_list);				// split the list by semi-colon
	$return_array = array();
	$count = 0;
	foreach ($list_array as $list_item)
		{
		$a = array();
		if ($delimiter2 == '')									// no second split
			$a[0] = trim($list_item);							// so just take it as it is
		else
			$a = explode($delimiter2,$list_item);				// get an array of the two parts
		if (!isset($a[0]))										// skip any empty entries
			continue;
		if (!isset($a[1]))										// if second half is empty
			$a[1] = strip_tags($a[0]);							// .. copy the first half, without html tags
		$return_array['LEFT'][$count] = trim($a[0]);
		$return_array['RIGHT'][$count] = trim($a[1]);
		$return_array['RAW'][$count] = trim($list_item);
		$count ++;
		}
	return $return_array;
}

// -------------------------------------------------------------------------------
// Create a constant for the Joomla version
//
static function get_joomla_version()
{
	$version = new JVersion();
	$joomla_version = $version->RELEASE;
//	$joomla_level = $version->DEV_LEVEL;
	switch ($joomla_version)
		{
		case '1.5':
			define("LAFC_JVERSION", 150);
			break;
		case '1.6':
			define("LAFC_JVERSION", 160);
			break;
		case '1.7':
			define("LAFC_JVERSION", 170);
			break;
		case '2.5':
			define("LAFC_JVERSION", 250);
			break;
		case '3.0':
			define("LAFC_JVERSION", 300);
			break;
		default:							// some future version
			define("LAFC_JVERSION", 300);
			break;
		}
		
	return LAFC_JVERSION;
}

}

?>


